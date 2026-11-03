'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';

export function PageArrival({children}:{children:ReactNode}){
 const pathname=usePathname();const reduced=useReducedMotion();
 return <motion.div key={pathname} className="page-arrival" initial={{opacity:reduced?1:.96}} animate={{opacity:1}} transition={{duration:.22,ease:'easeOut'}}>{children}</motion.div>;
}
