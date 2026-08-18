import mysql from 'mysql2/promise';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WP_DB_CONFIG, MAPPINGS } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let isDbSetup = false;

/**
 * Automates setting up the MySQL Docker container and importing the SQL dump.
 */
export async function setupDatabase() {
  if (isDbSetup) return;

  console.log('🐳 Checking Docker state and orchestrating local MySQL container...');

  // 1. Check if Docker is available
  try {
    execSync('docker --version', { stdio: 'ignore' });
  } catch (err) {
    throw new Error('Docker is not installed or not available on system PATH. Please launch Docker Desktop.');
  }

  // 2. Check if the autopavilion_mysql container exists
  let containerExists = false;
  let containerRunning = false;

  try {
    const listAll = execSync('docker ps -a --filter name=autopavilion_mysql --format "{{.Names}}"', { encoding: 'utf-8' }).trim();
    containerExists = listAll.includes('autopavilion_mysql');
    
    if (containerExists) {
      const listRunning = execSync('docker ps --filter name=autopavilion_mysql --format "{{.Names}}"', { encoding: 'utf-8' }).trim();
      containerRunning = listRunning.includes('autopavilion_mysql');
    }
  } catch (err) {
    throw new Error(`Failed to query Docker container status: ${err.message}`);
  }

  // 3. Start or run the MySQL container
  if (!containerExists) {
    console.log('   📦 MySQL container does not exist. Creating and starting autopavilion_mysql (MySQL 8.0)...');
    try {
      execSync('docker run -d --name autopavilion_mysql -p 3306:3306 -e MYSQL_DATABASE=autopavilion_migration -e MYSQL_ALLOW_EMPTY_PASSWORD=yes mysql:8.0', { stdio: 'ignore' });
      containerRunning = true;
    } catch (err) {
      throw new Error(`Failed to create and run MySQL Docker container: ${err.message}`);
    }
  } else if (!containerRunning) {
    console.log('   ▶️ MySQL container is stopped. Starting autopavilion_mysql...');
    try {
      execSync('docker start autopavilion_mysql', { stdio: 'ignore' });
      containerRunning = true;
    } catch (err) {
      throw new Error(`Failed to start stopped MySQL Docker container: ${err.message}`);
    }
  } else {
    console.log('   🟢 MySQL container is already running.');
  }

  // 4. Poll and wait for MySQL connection to be ready
  console.log('   ⏳ Waiting for MySQL service to start accepting connections...');
  let connected = false;
  const startTime = Date.now();
  
  for (let i = 0; i < 40; i++) {
    try {
      // Try to connect to MySQL root directly without selecting database first
      const conn = await mysql.createConnection({
        host: WP_DB_CONFIG.host,
        port: WP_DB_CONFIG.port,
        user: WP_DB_CONFIG.user,
        password: WP_DB_CONFIG.password
      });
      await conn.ping();
      await conn.end();
      connected = true;
      break;
    } catch (err) {
      // Wait 1 second and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!connected) {
    throw new Error('MySQL service inside Docker failed to become ready within 40 seconds.');
  }
  
  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ✅ MySQL database service ready in ${elapsedSec}s.`);

  // 5. Verify database and check if tables are imported
  const tempPool = mysql.createPool({ ...WP_DB_CONFIG, connectionLimit: 1 });
  let tablesExist = false;
  
  try {
    const [rows] = await tempPool.query("SHOW TABLES LIKE 'wp_posts'");
    tablesExist = rows.length > 0;
  } catch (err) {
    console.warn(`   ⚠️ Error checking tables (will attempt import): ${err.message}`);
  } finally {
    await tempPool.end();
  }

  // 6. Import SQL dump if tables do not exist
  if (!tablesExist) {
    const sqlDumpName = 'ans_a57_mytemp_website_1774688871.sql';
    const sqlDumpPath = path.resolve(__dirname, `../../${sqlDumpName}`);
    
    if (!fs.existsSync(sqlDumpPath)) {
      throw new Error(`WordPress SQL dump file not found at: ${sqlDumpPath}`);
    }
    
    console.log(`   📥 Database tables missing. Importing SQL dump: ${sqlDumpName} (this may take 10-15s)...`);
    const importStartTime = Date.now();
    try {
      // Use execSync with shell piping redirection to import file
      execSync(`docker exec -i autopavilion_mysql mysql -uroot autopavilion_migration < "${sqlDumpPath}"`);
      const importDuration = ((Date.now() - importStartTime) / 1000).toFixed(1);
      console.log(`   ✅ SQL dump successfully imported in ${importDuration}s.`);
    } catch (err) {
      throw new Error(`Failed to import SQL dump into MySQL container: ${err.message}`);
    }
  } else {
    console.log('   💾 Database tables already populated. Skipping import.');
  }

  isDbSetup = true;
  console.log('🐳 Local database setup complete!\n');
}

// Get or initialize MySQL connection pool
async function getPool() {
  await setupDatabase();
  if (!pool) {
    pool = mysql.createPool(WP_DB_CONFIG);
  }
  return pool;
}

// Close MySQL connection pool
export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Fetch all vehicle posts from the local WordPress database copy.
 */
export async function fetchWordPressListings() {
  const db = await getPool();
  const postType = MAPPINGS.post_type || 'car';
  
  // Fetch posts. In WordPress, Vehica listings might have custom post_types
  // We check for 'car' or standard statuses.
  const query = `
    SELECT ID, post_title, post_content, post_status, post_date, post_modified
    FROM wp_posts
    WHERE post_type = ? AND post_status IN ('publish', 'draft', 'pending', 'private')
    ORDER BY post_date DESC
  `;
  
  const [rows] = await db.query(query, [postType]);
  return rows;
}

/**
 * Fetch all metadata key-values for a list of post IDs.
 */
export async function fetchMetadataForPosts(postIds) {
  if (!postIds || postIds.length === 0) return {};
  
  const db = await getPool();
  const query = `
    SELECT post_id, meta_key, meta_value
    FROM wp_postmeta
    WHERE post_id IN (?)
  `;
  
  const [rows] = await db.query(query, [postIds]);
  
  // Group by post_id
  const metaGroup = {};
  for (const row of rows) {
    const pid = row.post_id;
    if (!metaGroup[pid]) metaGroup[pid] = {};
    metaGroup[pid][row.meta_key] = row.meta_value;
  }
  
  return metaGroup;
}

/**
 * Fetch taxonomy terms (e.g. brand, features, category) for a list of post IDs.
 */
export async function fetchTaxonomiesForPosts(postIds) {
  if (!postIds || postIds.length === 0) return {};
  
  const db = await getPool();
  const query = `
    SELECT tr.object_id AS post_id, t.name, t.slug, tt.taxonomy
    FROM wp_term_relationships tr
    INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
    INNER JOIN wp_terms t ON tt.term_id = t.term_id
    WHERE tr.object_id IN (?)
  `;
  
  const [rows] = await db.query(query, [postIds]);
  
  // Group terms by post_id
  const termGroup = {};
  for (const row of rows) {
    const pid = row.post_id;
    if (!termGroup[pid]) termGroup[pid] = [];
    termGroup[pid].push({
      name: row.name,
      slug: row.slug,
      taxonomy: row.taxonomy
    });
  }
  
  return termGroup;
}

/**
 * Resolve attachment file paths for a list of attachment IDs.
 */
export async function fetchAttachmentPaths(attachmentIds) {
  if (!attachmentIds || attachmentIds.length === 0) return {};
  
  const db = await getPool();
  const query = `
    SELECT post_id, meta_value
    FROM wp_postmeta
    WHERE post_id IN (?) AND meta_key = '_wp_attached_file'
  `;
  
  const [rows] = await db.query(query, [attachmentIds]);
  
  // Create mapping of attachment_id -> file_path
  const paths = {};
  for (const row of rows) {
    paths[row.post_id] = row.meta_value;
  }
  
  return paths;
}
