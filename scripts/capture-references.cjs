const {chromium}=require('playwright');
const fs=require('fs');
const urls=[
['original','https://yumizhi.github.io/'],
['apple-article','https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/'],
['apple-index','https://www.apple.com/newsroom/'],
['apple-motion','https://developer.apple.com/design/human-interface-guidelines/motion'],
['meta-article','https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/'],
['meta-research','https://ai.meta.com/research/'],
['meta-publications','https://ai.meta.com/results/?content_types%5B0%5D=publication'],
['google-article','https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/'],
['google-index','https://blog.google/innovation-and-ai/models-and-research/'],
['deepmind-index','https://deepmind.google/blog/'],
['mobbin-home','https://mobbin.com/'],['mobbin-sites','https://mobbin.com/explore/sites'],
['mobbin-web','https://mobbin.com/explore/web'],['mobbin-changelog','https://mobbin.com/changelog'],
['shadcn-command','https://ui.shadcn.com/docs/components/command'],
];
(async()=>{
fs.mkdirSync('docs/design/reference-captures',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/root/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell',headless:true,proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--no-sandbox']});
const results=[];
for(const [name,url] of urls){
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage();
try{
const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
await page.waitForTimeout(900);
const title=await page.title(); const content=(await page.locator('body').innerText()).slice(0,900);
await page.screenshot({path:`docs/design/reference-captures/${name}-desktop.jpg`,type:'jpeg',quality:75});
let observation=await page.evaluate(()=>({headings:[...document.querySelectorAll('h1,h2')].slice(0,5).map(e=>({text:e.textContent,size:getComputedStyle(e).fontSize,width:e.getBoundingClientRect().width})),loadedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth>0).length,images:document.images.length}));
const visibleLink=page.locator('main a').filter({has:page.locator('img')}).first();
if(await visibleLink.count()) {await visibleLink.hover({timeout:1000}).catch(()=>{});await page.waitForTimeout(300);await page.screenshot({path:`docs/design/reference-captures/${name}-hover.jpg`,type:'jpeg',quality:70});}
await page.setViewportSize({width:390,height:844});await page.screenshot({path:`docs/design/reference-captures/${name}-mobile.jpg`,type:'jpeg',quality:75});
results.push({name,url,finalURL:page.url(),status:res?.status(),title,content,observation});
}catch(e){results.push({name,url,error:String(e)});}
await context.close();fs.writeFileSync('docs/design/reference-captures/observations.json',JSON.stringify(results,null,2));
console.log(name,results.at(-1).status||results.at(-1).error);
}
await browser.close();
})();
