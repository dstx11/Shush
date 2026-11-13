import {gzipSync} from 'node:zlib';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const manifest=JSON.parse(readFileSync(join(dist,'.vite/manifest.json'),'utf8'));
const entry=manifest['index.html']??manifest['src/main.tsx'];
const campaign=manifest['src/components/seasonal/ChristmasLanding.tsx'];
if(!entry?.css?.length||!campaign?.css?.length)throw new Error('Missing core or seasonal CSS manifest entries');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const all=walk(dist).filter(path=>/\.(js|css)$/.test(path));
const compressed=path=>gzipSync(readFileSync(path)).length;
const sum=paths=>paths.reduce((total,path)=>total+compressed(path),0);
const js=sum(all.filter(path=>path.endsWith('.js')));
const css=sum(all.filter(path=>path.endsWith('.css')));
const coreCss=sum(entry.css.map(path=>join(dist,path)));
const christmasCss=sum(campaign.css.map(path=>join(dist,path)));
const kb=n=>(n/1024).toFixed(2);
console.log('Build budget (gzipped): all JS '+kb(js)+' kB; base CSS '+kb(coreCss)+' kB; Christmas-only CSS '+kb(christmasCss)+' kB; all CSS '+kb(css)+' kB');
const failures=[];
if(js>135*1024) failures.push('All JS exceeds 135 kB gzip');
// The public startup budget remains separate from LAB, a lazy on-demand experiment chunk.
if(coreCss>15.5*1024)failures.push('Base stylesheet exceeds 15.5 kB gzip');
// Christmas includes the original interactive tree; its CSS is never in the base transfer.
if(christmasCss>10.5*1024)failures.push('Lazy Christmas stylesheet exceeds 10.5 kB gzip');
// Route splitting repeats compression dictionaries but removes unrelated CSS from each visit.
// Guard both the smaller entry and the complete distribution, including deferred routes.
// Combined route-lazy CSS includes SHUSH LAB and Home-only worldbuilding scenes; startup remains independently capped.
if(css>42*1024)failures.push('Combined CSS exceeds 42 kB gzip');
for (const name of ['RosterPage', 'PremierPage', 'ContentPage', 'DropPage', 'AboutPage']) {
  const route = manifest['src/pages/'+name+'.tsx'];
  const size = sum((route?.css ?? []).map(path => join(dist,path)));
  if(size>3*1024)failures.push(name+' CSS exceeds 3 kB gzip');
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('PASS: initial and on-demand seasonal styles meet separate budgets.');
