import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { papers } from '@/lib/content';
import { asset, absoluteURL } from '@/lib/paths';
import { SparsePaper } from '@/components/sparse-paper';
import { TidePaper } from '@/components/tide/paper';
export function generateStaticParams(){return papers.map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=papers.find(p=>p.slug===slug);return {title:p?.title,description:p?.summary,alternates:{canonical:absoluteURL(`/research/${slug}/`)},other:{citation_title:p?.title??'',citation_author:p?.authors??[],citation_publication_date:String(p?.year??''),citation_conference_title:p?.venue??'',...(p?.paper.startsWith('/')?{citation_pdf_url:absoluteURL(p.paper)}:{})},openGraph:{title:p?.title,description:p?.summary,images:[asset(p?.image??'/images/og.png')]}};}
export default async function PaperDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const paper=papers.find(item=>item.slug===slug);
  if(!paper)notFound();
  return paper.slug==='tide'?<TidePaper paper={paper}/>:<SparsePaper paper={paper}/>;
}
