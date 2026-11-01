'use client';
import {useRef,type ReactNode} from 'react';
import {motion,useScroll} from 'motion/react';
export function ArticleReader({toc,children}:{toc:{id:string;title:string}[];children:ReactNode}){const ref=useRef<HTMLElement>(null);const{scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});return <><motion.div className="reading-progress" aria-hidden style={{scaleX:scrollYProgress}}/><div className="article-layout"><nav className="article-toc" aria-label="Table of contents"><p>On this page</p>{toc.map(item=><a key={item.id} href={`#${item.id}`}>{item.title}</a>)}</nav><article className="prose" ref={ref}>{children}</article></div></>;}
