'use client';
import {motion,useReducedMotion} from 'motion/react';
import {motionTokens} from '@/lib/motion';
import { education, experience } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Localized } from './language';

export function HomeBackground(){
 const reduced=useReducedMotion(),arrival={initial:{opacity:reduced?1:.6,y:reduced?0:14},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.35},transition:{duration:reduced?0:.6,ease:motionTokens.ease}};
 return <div className="background-records"><motion.div {...arrival} className="education-record"><div className="academic-institution"><img src={asset('/images/nju-seal.svg')} width="43" height="54" alt="Nanjing University seal" loading="lazy"/><div><h3><Localized en="Nanjing University" zh="南京大学"/></h3><p><Localized en="Computer Science and Technology" zh="计算机科学与技术"/></p></div></div><div className="academic-periods">{[education[1],education[0]].map((entry,i)=><div className="academic-period" key={entry.period}><time><Localized en={entry.period} zh={i===0?'2019 — 2023':'2023 — 至今'}/></time><h4><Localized en={entry.degree} zh={i===0?'本科':'博士研究生'}/></h4>{i===1&&<p><Localized en={<>Advisor: <a href="https://cs.nju.edu.cn/shanglin/index.htm" target="_blank" rel="noreferrer">Lin Shang</a></>} zh={<>导师：<a href="https://cs.nju.edu.cn/shanglin/index.htm" target="_blank" rel="noreferrer">商琳</a></>}/></p>}</div>)}</div></motion.div><motion.section {...arrival} className="experience-record"><img className="company-logo" src={asset('/images/guodian.webp')} width="43" height="43" alt="Guodian Nanjing Automation" loading="lazy"/><div className="experience-details"><h3><Localized en={experience[0].institution} zh="国电南京自动化股份有限公司"/></h3><div className="experience-heading"><p><Localized en={experience[0].title} zh="研究实习生"/></p><time><Localized en={experience[0].dates} zh="2025 年 7 月 — 至今"/></time></div></div></motion.section></div>;
}
