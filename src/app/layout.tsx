import type { Metadata,Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-sc';
import './globals.css';
import './site-motion.css';
import './home-composition.css';
import './site-navigation.css';
import { Providers } from '@/components/providers';
import { Header,Footer } from '@/components/header';
import { site } from '@/lib/content';
import {asset,absoluteURL} from '@/lib/paths';
import { coreSearch } from '@/lib/search';
import { getWritingEntries } from '@/lib/posts';
import Script from 'next/script';
export const metadata:Metadata={
 metadataBase:new URL(site.url),alternates:{canonical:absoluteURL('/')},title:{default:'Yihan Meng — Nanjing University',template:'%s — Yihan Meng'},description:site.description,
 authors:[{name:site.name,url:site.url}],creator:site.name,
 openGraph:{type:'website',locale:'en_US',siteName:'Yihan Meng',title:'Yihan Meng — Nanjing University',description:site.description,url:absoluteURL('/'),images:[{url:asset('/images/og.png'),width:1200,height:630,alt:'Yihan Meng — research at Nanjing University'}]},
 twitter:{card:'summary_large_image'},robots:{index:true,follow:true},icons:{icon:asset('/images/nju-seal.svg')},
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: light)',color:'#ffffff'},{media:'(prefers-color-scheme: dark)',color:'#09090b'}]};
export default function RootLayout({children}:{children:React.ReactNode}){
 const index=[...coreSearch,...getWritingEntries().map(p=>({title:p.title,kind:'Writing',href:p.href,external:p.external,keywords:`${p.category} ${p.description}`}))];
 return <html lang="en" data-site-language="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"(function(){var l=localStorage.getItem('homepage-language')==='zh'?'zh':'en';document.documentElement.lang=l;document.documentElement.dataset.siteLanguage=l;})();"}}/></head><body><Providers><a className="skip-link" href="#main-content">Skip to content</a><Header index={index}/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></Providers><Script id="analytics" strategy="afterInteractive">{`if(location.hostname==='yumizhi.github.io'){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.analytics}');var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${site.analytics}';document.head.appendChild(s);}`}</Script><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Person',name:site.name,alternateName:site.chineseName,url:site.url,jobTitle:'Ph.D. Candidate',affiliation:{'@type':'CollegeOrUniversity',name:'Nanjing University'},sameAs:[site.github,site.scholar]})}}/></body></html>;
}
