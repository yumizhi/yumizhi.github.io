import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import postcss from 'postcss';

const root=fileURLToPath(new URL('../',import.meta.url));

export async function generateCV(page,origin='http://127.0.0.1:3000') {
 const output=path.join(root,'output/cv');
 await fs.mkdir(output,{recursive:true});
 const css=(await fs.readFile(path.join(root,'src/app/cv/cv.css'),'utf8')).replace("@import './asu-template.css';",'');
 const templateCSS=await fs.readFile(path.join(root,'src/app/cv/asu-template.css'),'utf8');
 const printStyles=[];
 postcss.parse(css).walkAtRules('media',rule=>{
  if(rule.params==='print')rule.walkRules(style=>{if(style.selector.includes('.asu-resume'))printStyles.push(style.toString());});
 });
 const license=await fs.readFile(path.join(root,'scripts/vendor/asu-resume/LICENSE'),'utf8');
 await page.goto(`${origin}/cv/`,{waitUntil:'networkidle'});
 for(const language of ['en','zh']) {
  await page.evaluate(lang=>{localStorage.setItem('homepage-language',lang);localStorage.setItem('theme','light');},language);
  await page.reload({waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.emulateMedia({media:'print',reducedMotion:'reduce'});
  const name=`yihan-meng-cv${language==='zh'?'-zh':''}`;
  await page.pdf({path:path.join(root,`public/files/${name}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true});
  let content=await page.locator('.resume-document').evaluate((el,lang)=>{
   const clone=el.cloneNode(true);
   clone.classList.add('sheet');
   clone.querySelectorAll(`[data-language]:not([data-language="${lang}"])`).forEach(node=>node.remove());
   return clone.outerHTML;
  },language);
  content=content.replace(/^<article /,'<main contenteditable="true" ').replace(/<\/article>$/,'</main>');
  content=content.replaceAll('href="/research/','href="https://yumizhi.github.io/research/').replaceAll('href="/files/','href="https://yumizhi.github.io/files/');
  for(const [file,type] of [['guodian.webp','image/webp'],['nju-seal.svg','image/svg+xml']]) {
   const logo=await fs.readFile(path.join(root,'public/images',file));
   content=content.replaceAll(`/images/${file}`,`data:${type};base64,${logo.toString('base64')}`);
  }
  const reset='h1,h2,h3,p,ul{margin:0}a{color:inherit;text-decoration:none}.asu-resume svg{display:inline;vertical-align:middle}.asu-resume .cv-contact svg{flex:none}';
  const standalone=`@media screen{${printStyles.join('\n')}body main.sheet.asu-resume{width:210mm!important;max-width:210mm!important;margin:0 auto!important;padding:10mm 12mm!important}.asu-resume .resume-sheet+.resume-sheet{margin-top:20mm}}`;
  const shell=`<!doctype html>\n<!-- ASu template: ${license} -->\n<html lang="${language}" data-site-language="${language}">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <base href="../">\n  <title>${language==='zh'?'蒙一涵':'Yihan Meng'} — CV</title>\n  <link rel="stylesheet" href="frame/asu/base.css">\n<style>${reset}\n${templateCSS}\n${css}\n${standalone}</style>\n</head>\n<body data-page-mode="paged">\n  <!-- @ASU_TOOLBAR -->\n${content}\n  <!-- @ASU_EDITOR -->\n</body>\n</html>`;
  const shellPath=path.join(output,`${name}.shell.html`);
  await fs.writeFile(shellPath,shell);
  execFileSync(process.execPath,[path.join(root,'scripts/vendor/asu-resume/scripts/build-asu-resume.mjs'),shellPath,path.join(output,`${name}.html`)]);
  await fs.unlink(shellPath);
 }
 await page.emulateMedia({media:'screen',reducedMotion:'no-preference'});
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1000,height:1200}});
 await generateCV(page,process.env.CV_ORIGIN??'http://127.0.0.1:3000');
 await browser.close();
 console.log('Created English and Chinese CV PDFs and editable ASu HTML.');
}
