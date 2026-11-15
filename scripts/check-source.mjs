import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'src');
const allowed = ['.tsx', '.ts', '.css', '.json', '.mjs'];
let checked = 0;
let errors = 0;
function visit(folder) {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    const current = path.join(folder, item.name);
    if (item.isDirectory()) { visit(current); continue; }
    if (!allowed.some(ext => current.endsWith(ext))) continue;
    checked++;
    const contents = fs.readFileSync(current, 'utf8');
    if (contents.startsWith('\n') || contents.startsWith('\r\n')) { console.error(`Faylın əvvəlində boş sətir var: ${current}`); errors++; }
    const pattern = /(?:from\s*|import\s*)['"](\.{1,2}\/[^'"]+)['"]/g;
    for (const match of contents.matchAll(pattern)) {
      const base = path.resolve(path.dirname(current), match[1]);
      const alternatives = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, `${base}.css`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
      if (!alternatives.some(file => fs.existsSync(file))) { console.error(`Import tapılmadı: ${current} → ${match[1]}`); errors++; }
    }
  }
}
visit(root);
console.log(`${checked} source faylı yoxlanıldı. ${errors} struktur xətası.`);
if (errors) process.exit(1);
