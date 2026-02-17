// app/utils/phoneUtils.js

/**
 * Format phone number to Cambodian local style
 * Examples:
 *  +85512345678  -> 012345678
 *  85512345678   -> 012345678
 *  +855 12 345 678 -> 012345678
 *  012345678     -> 012345678
 *
 * If phone is missing -> "No phone"
 */
export function formatPhoneNumber(phone) {
    if (!phone) return "No phone";
  
    // remove spaces, dashes, parentheses
    let p = String(phone).trim().replace(/[\s\-()]/g, "");
  
    // if starts with +855 -> local 0
    if (p.startsWith("+855")) return "0" + p.slice(4);
  
    // if starts with 855 -> local 0
    if (p.startsWith("855")) return "0" + p.slice(3);
  
    // already local
    if (p.startsWith("0")) return p;
  
    return p; // fallback
  }
  