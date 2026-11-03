import fs from 'node:fs/promises';
import postcss from 'postcss';

const original=new URL('./vendor/asu-resume/assets/frame/asu/base.css',import.meta.url);
const css=postcss.parse(await fs.readFile(original,'utf8'));
css.walkAtRules('import',rule=>rule.remove());
css.walkAtRules('media',rule=>{if(rule.params==='screen')rule.remove();});
css.walkRules(rule=>{
 if(rule.selectors.some(selector=>selector.includes('body[data-page-mode')||selector.includes('toolbar'))){rule.remove();return;}
 rule.selectors=rule.selectors.map(selector=>/^(?:html|body|:root|\.sheet)(?=$|[\s\[:.>])/.test(selector)
  ?selector.replace(/^(?:html|body|:root|\.sheet)/,'.asu-resume')
  :`.asu-resume ${selector}`);
});
await fs.writeFile(new URL('../src/app/cv/asu-template.css',import.meta.url),'/* Scoped from ASu-skills/assets/frame/asu/base.css. MIT; license in scripts/vendor/asu-resume/LICENSE. */\n'+css.toString());
