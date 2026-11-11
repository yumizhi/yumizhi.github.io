import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { papers } from '@/lib/content';
import { asset, absoluteURL } from '@/lib/paths';
import { TideArticle } from '@/components/tide/article';
import { SasboArticle } from '@/components/sasbo/article';
import { SamArticle } from '@/components/sam/article';
export function generateStaticParams(){return papers.map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=papers.find(p=>p.slug===slug);return {title:p?.title,description:p?.summary,alternates:{canonical:absoluteURL(`/research/${slug}/`)},other:{citation_title:p?.title??'',citation_author:p?.authors??[],citation_publication_date:String(p?.year??''),citation_conference_title:p?.venue??'',...(p?.paper.startsWith('/')?{citation_pdf_url:absoluteURL(p.paper)}:{})},openGraph:{type:'article',title:p?.title,description:p?.summary,url:absoluteURL(`/research/${slug}/`),images:[slug==='tide'?{url:asset('/images/og-tide.png'),width:1200,height:630,alt:'TIDE: fifty denoising steps of one sampling run, with the watermark written at step 35.'}:asset(p?.image??'/images/og.png')]}};}
export default async function PaperDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const paper=papers.find(item=>item.slug===slug);
  if(!paper)notFound();
  if(paper.slug==='tide')return <TideArticle paper={paper}/>;
  if(paper.slug==='sasbo')return <SasboArticle paper={paper}/>;
  return <SamArticle paper={paper}/>;
}
