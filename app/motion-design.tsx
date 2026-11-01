'use client';
import {useEffect} from 'react';
export default function MotionDesign({path}:{path:string}){useEffect(()=>{if(['/checkout','/cart','/admin','/order'].includes(path))return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let disposed=false;const stops:(()=>void)[]=[];import('motion').then(({animate,inView})=>{if(disposed)return;document.querySelectorAll('main .section-heading,main .story-copy,main .craft-steps>div,main .mission-grid>div,main .product-card').forEach(el=>{stops.push(inView(el,()=>{const a=animate(el,{opacity:[0,1],y:[22,0]},{duration:.8,ease:[.22,1,.36,1]});stops.push(()=>a.stop())},{margin:'0px 0px -35px 0px'}))})});return()=>{disposed=true;stops.forEach(stop=>stop())}},[path]);return null}

