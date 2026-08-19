import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { WP_DB_CONFIG, MAPPINGS } from './config.js';
import { mapWordPressToSupabase } from './mapper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  const reportData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './migration_report.json'), 'utf-8'));
  const missingDetails = reportData.missingMetaDetails || [];

  // Group missing fields
  const grouped = {};
  for (const d of missingDetails) {
    if (!grouped[d.fieldName]) {
      grouped[d.fieldName] = [];
    }
    grouped[d.fieldName].push(d);
  }

  // Connect to WordPress DB
  const db = await mysql.createConnection(WP_DB_CONFIG);

  const finalOutput = [];
  finalOutput.push('# Detailed Warning Report\n');
  finalOutput.push('This report details all vehicles with warnings (missing optional fields) during the dry-run validation.\n');

  for (const [field, listings] of Object.entries(grouped)) {
    finalOutput.push(`## Missing ${field.toUpperCase()}: ${listings.length} vehicles\n`);
    
    // Select up to 4 examples for each missing optional field
    const examples = listings.slice(0, 4);
    for (const ex of examples) {
      const wpId = ex.wpId;
      
      // Fetch WordPress listing post
      const [posts] = await db.query('SELECT * FROM wp_posts WHERE ID = ?', [wpId]);
      if (posts.length === 0) continue;
      const post = posts[0];
      
      // Fetch listing metadata
      const [metaRows] = await db.query('SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?', [wpId]);
      const meta = {};
      metaRows.forEach(r => meta[r.meta_key] = r.meta_value);
      
      // Fetch taxonomy terms
      const [termRows] = await db.query(`
        SELECT t.name, tt.taxonomy 
        FROM wp_term_relationships tr
        INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        INNER JOIN wp_terms t ON tt.term_id = t.term_id
        WHERE tr.object_id = ?
      `, [wpId]);
      const terms = termRows.map(r => ({ name: r.name, taxonomy: r.taxonomy }));

      // Map to Supabase layout
      const mapped = mapWordPressToSupabase(post, meta, terms, {});

      let rawValue = '(not set)';
      let parsedValue = '(not set)';
      let source = 'not found';

      if (field === 'price') {
        rawValue = meta['vehica_currency_6656_2316'] !== undefined ? meta['vehica_currency_6656_2316'] : '(not set)';
        parsedValue = mapped.price;
        source = 'postmeta (vehica_currency_6656_2316)';
      } else if (field === 'video') {
        rawValue = meta['vehica_6674'] || '(not set)';
        parsedValue = mapped.video || 'null';
        source = 'postmeta (vehica_6674)';
      } else if (field === 'description') {
        rawValue = post.post_content ? post.post_content.slice(0, 80).replace(/\r?\n|\r/g, ' ') + '...' : '(not set)';
        parsedValue = mapped.description ? 'Parsed HTML Description' : 'null';
        source = 'wp_posts.post_content';
      } else if (field === 'owners') {
        const ownersTerm = terms.find(t => t.taxonomy === 'vehica_12974');
        rawValue = ownersTerm ? ownersTerm.name : '(not set)';
        parsedValue = mapped.owners;
        source = 'taxonomy/terms (vehica_12974)';
      } else if (field === 'color') {
        const colorTerm = terms.find(t => t.taxonomy === 'vehica_6666');
        rawValue = colorTerm ? colorTerm.name : (meta['vehica_23461'] || '(not set)');
        parsedValue = mapped.color;
        source = colorTerm ? 'taxonomy/terms (vehica_6666)' : 'postmeta (vehica_23461)';
      } else if (field === 'registration_type') {
        const regTerm = terms.find(t => t.taxonomy === 'vehica_6657');
        rawValue = regTerm ? regTerm.name : '(not set)';
        parsedValue = mapped.registration_type;
        source = 'taxonomy/terms (vehica_6657)';
      } else if (field === 'registration_month') {
        const monthTerm = terms.find(t => t.taxonomy === 'vehica_23462');
        rawValue = monthTerm ? monthTerm.name : '(not set)';
        parsedValue = mapped.registration_month;
        source = 'taxonomy/terms (vehica_23462)';
      } else if (field === 'location') {
        rawValue = meta['vehica_16721'] || '(not set)';
        parsedValue = mapped.location;
        source = 'postmeta (vehica_16721)';
      }

      finalOutput.push(`*   **WordPress ID:** ${wpId}`);
      finalOutput.push(`    **Vehicle Title:** ${ex.name}`);
      finalOutput.push(`    **Raw WordPress Value:** \`${rawValue}\``);
      finalOutput.push(`    **Parsed Value:** \`${parsedValue}\``);
      finalOutput.push(`    **Source:** ${source}\n`);
    }
  }

  await db.end();

  const reportPath = path.resolve(__dirname, './warning_report.md');
  fs.writeFileSync(reportPath, finalOutput.join('\n'), 'utf-8');
  console.log(`Report generated successfully at: ${reportPath}`);
}

generate();
