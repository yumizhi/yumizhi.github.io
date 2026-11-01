import type {MetadataRoute} from 'next';
import {site,papers,projects} from '@/lib/content';
import {getPosts} from '@/lib/posts';
import {basePath} from '@/lib/paths';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return ['','research/','projects/','writing/','resources/','cv/',...papers.map(p=>`research/${p.slug}/`),...projects.map(p=>`projects/${p.slug}/`),...getPosts().map(p=>`writing/${p.slug}/`)].map(path=>({url:`${site.url}${basePath}/${path}`}));}
