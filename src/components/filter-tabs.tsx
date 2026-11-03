'use client';
import {useId,type ReactNode} from 'react';
import {ToggleGroup} from 'radix-ui';
import {LayoutGroup,motion,useReducedMotion} from 'motion/react';
import {motionTokens} from '@/lib/motion';

export function FilterTabs({value,onChange,options,label,className=''}:{value:string;onChange:(value:string)=>void;options:{value:string;label:ReactNode}[];label:string;className?:string}){
 const id=useId(),reduced=useReducedMotion();
 return <LayoutGroup id={id}><ToggleGroup.Root type="single" value={value} onValueChange={next=>{if(next)onChange(next);}} className={`filter-pills motion-filters ${className}`} aria-label={label}>{options.map(option=><ToggleGroup.Item key={option.value} value={option.value}>{value===option.value&&<motion.span className="filter-active" layoutId="filter" transition={reduced?{duration:0}:motionTokens.navigation}/>}<span className="filter-label">{option.label}</span></ToggleGroup.Item>)}</ToggleGroup.Root></LayoutGroup>;
}
