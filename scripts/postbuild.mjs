import fs from 'node:fs';
const prefix=process.env.NEXT_PUBLIC_BASE_PATH??'';
fs.writeFileSync('out/.nojekyll','');
// Old root fragments remain meaningful after the migration.
let html=fs.readFileSync('out/index.html','utf8');
const legacy=`<script>(function(){var h=location.hash;if(h.indexOf('#/')===0){var r=h.slice(1);if(/^\\/(research|projects|writing|resources|cv)(\\/|$)/.test(r)){location.replace(${JSON.stringify(prefix)}+r);}}else{var m={'#-about-me':'#about-me','#-publications':'#publications','#-education':'${prefix}/cv/','#-projects':'#open-source','#education':'${prefix}/cv/'};if(m[h]){if(m[h][0]==='#')location.hash=m[h];else location.replace(m[h]);}}})();</script>`;
html=html.replace('</body>',legacy+'</body>');fs.writeFileSync('out/index.html',html);
fs.copyFileSync('out/about/index.html','out/about.html');
// Preserve original public asset addresses still linked from old profile pages.
fs.mkdirSync('out/images',{recursive:true});
for(const [old,current] of [['nju_sign.svg','nju-seal.svg'],['pakdd2024.png','sasbo-original.png'],['avatar.PNG','avatar.png']])fs.copyFileSync(`public/images/${current}`,`out/images/${old}`);
