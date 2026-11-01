import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import {ArrowRight,ChevronRight} from 'lucide-react';
import {getPosts,slugify} from '@/lib/posts';
import {prefixMdxAssets} from '@/lib/mdx';
import {ArticleReader} from '@/components/article-reader';
import {TransitionLink} from '@/components/providers';
import {asset,absoluteURL} from '@/lib/paths';
export function generateStaticParams(){return getPosts().map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=getPosts().find(p=>p.slug===slug);return{title:p?.title,description:p?.description,alternates:{canonical:absoluteURL(`/writing/${slug}/`)},openGraph:{type:'article',title:p?.title,description:p?.description,publishedTime:p?.date}};}
export default async function Article({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const posts=getPosts();const p=posts.find(p=>p.slug===slug);if(!p)notFound();const other=posts.find(x=>x.slug!==slug);return <div className="shell"><div className="breadcrumb"><TransitionLink href="/writing/">Writing</TransitionLink><ChevronRight size={13}/><span>{p.category}</span></div><header className="article-header"><p className="eyebrow">{p.category}</p><h1>{p.title}</h1><p className="standfirst">{p.description}</p><div className="article-meta"><span>{p.author}</span><time dateTime={p.date}>{p.date}</time><span>{p.minutes} min read</span></div></header><ArticleReader toc={p.toc}><MDXRemote source={p.content} options={{mdxOptions:{remarkPlugins:[prefixMdxAssets,remarkGfm,remarkMath],rehypePlugins:[rehypeKatex,[rehypePrettyCode,{theme:{light:'github-light',dark:'github-dark'},keepBackground:true}]]}}} components={{h2:({children,...props})=><h2 id={slugify(String(children))} {...props}>{children}</h2>,img:({src,alt,...props})=><img src={typeof src==='string'?asset(src):src} alt={alt??''} loading="lazy" {...props}/>}}/>{other&&<section className="related"><h2>Keep reading</h2><TransitionLink href={`/writing/${other.slug}/`}>{other.title}<ArrowRight size={20}/></TransitionLink></section>}</ArticleReader></div>;}
