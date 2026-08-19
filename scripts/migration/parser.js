/**
 * Native JavaScript implementation to parse PHP serialized data structures.
 * This handles basic types like strings, integers, floats, booleans, arrays, and null.
 */
export function deserialize(str) {
  if (!str || typeof str !== 'string') return null;
  
  let offset = 0;

  function parse() {
    if (offset >= str.length) return null;

    const type = str[offset];
    offset += 2; // skip type and ':'

    switch (type) {
      case 'N': { // Null: N;
        offset++; // skip ';'
        return null;
      }
      case 'b': { // Boolean: b:1;
        const end = str.indexOf(';', offset);
        const val = str.slice(offset, end) === '1';
        offset = end + 1;
        return val;
      }
      case 'i': { // Integer: i:123;
        const end = str.indexOf(';', offset);
        const val = parseInt(str.slice(offset, end), 10);
        offset = end + 1;
        return val;
      }
      case 'd': { // Double/Float: d:12.34;
        const end = str.indexOf(';', offset);
        const val = parseFloat(str.slice(offset, end));
        offset = end + 1;
        return val;
      }
      case 's': { // String: s:5:"apple";
        const lenEnd = str.indexOf(':', offset);
        const len = parseInt(str.slice(offset, lenEnd), 10);
        offset = lenEnd + 2; // skip length and ':"'
        const val = str.slice(offset, offset + len);
        offset += len + 2; // skip string content and '";'
        return val;
      }
      case 'a': { // Array: a:2:{i:0;s:5:"apple";i:1;s:6:"orange";}
        const lenEnd = str.indexOf(':', offset);
        const size = parseInt(str.slice(offset, lenEnd), 10);
        offset = lenEnd + 2; // skip size and ':{'
        
        const arr = [];
        const obj = {};
        let isList = true;

        for (let i = 0; i < size; i++) {
          const key = parse();
          const val = parse();
          
          if (key !== i) {
            isList = false;
          }
          arr.push(val);
          obj[key] = val;
        }
        
        // Skip closing bracket '}'
        if (str[offset] === '}') {
          offset++;
        }
        
        return isList ? arr : obj;
      }
      default:
        return null;
    }
  }

  try {
    return parse();
  } catch (err) {
    console.error('⚠️ [Parser] Failed to parse PHP serialized string:', str.slice(0, 100), err.message);
    return null;
  }
}

/**
 * Safely parse a value which could be a serialized PHP array, a JSON string,
 * a comma-separated list of IDs, or a single value.
 */
export function parseGalleryIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  
  const str = String(value).trim();
  if (!str) return [];

  // PHP serialized array
  if (str.startsWith('a:')) {
    const parsed = deserialize(str);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') {
      return Object.values(parsed);
    }
  }

  // JSON string
  if (str.startsWith('[') || str.startsWith('{')) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') {
        return Object.values(parsed);
      }
    } catch (e) {
      // fallback to plain string parsing
    }
  }

  // Comma-separated list
  if (str.includes(',')) {
    return str.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const num = Number(s);
        return isNaN(num) ? s : num;
      });
  }

  // Single ID
  const num = Number(str);
  return [isNaN(num) ? str : num];
}
