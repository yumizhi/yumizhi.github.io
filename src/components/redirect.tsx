'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
export function Redirect({href}:{href:string}){const router=useRouter();useEffect(()=>{router.replace(href);},[href,router]);return <div className="shell page-heading"><h1>Page moved</h1><p><Link href={href}>Continue to the current page →</Link></p></div>;}
