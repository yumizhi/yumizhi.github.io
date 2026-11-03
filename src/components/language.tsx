'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Language='en'|'zh';
const LanguageContext=createContext({language:'en' as Language,setLanguage:(_language:Language)=>{}});
export function LanguageProvider({children}:{children:ReactNode}){
 const [language,setCurrent]=useState<Language>('en');
 useEffect(()=>{const saved=localStorage.getItem('homepage-language')==='zh'?'zh':'en';setCurrent(saved);document.documentElement.lang=saved;document.documentElement.dataset.siteLanguage=saved;},[]);
 function setLanguage(next:Language){setCurrent(next);localStorage.setItem('homepage-language',next);document.documentElement.lang=next;document.documentElement.dataset.siteLanguage=next;}
 return <LanguageContext.Provider value={{language,setLanguage}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){return useContext(LanguageContext);}
export function Localized({en,zh}:{en:ReactNode;zh:ReactNode}){return <><span data-language="en" lang="en">{en}</span><span data-language="zh" lang="zh">{zh}</span></>;}
