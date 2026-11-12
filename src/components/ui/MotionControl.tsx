import {useEffect,useState} from 'react';

const STORAGE_KEY = 'shush:motion:v1';
const readPreference=()=>{
  try{return localStorage.getItem(STORAGE_KEY)==='reduce';}catch{return false;}
};
/** Explicit motion control is supplementary to the OS-level reduced-motion setting. */
export function MotionControl(){
 const [manual,setManual]=useState(readPreference);
 const [system,setSystem]=useState(()=>typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
   const query=window.matchMedia('(prefers-reduced-motion: reduce)');
   const sync=()=>setSystem(query.matches);
   query.addEventListener('change',sync);
   return()=>query.removeEventListener('change',sync);
 },[]);
 useEffect(()=>{
   document.documentElement.dataset.motion=manual?'reduce':'system';
   return()=>{delete document.documentElement.dataset.motion;};
 },[manual]);
 const change=()=>{
   const next=!manual;
   try{localStorage.setItem(STORAGE_KEY,next?'reduce':'system');}catch{/* visual setting still works */}
   setManual(next);
   if(next)document.dispatchEvent(new Event('shush:reduce-motion'));
 };
 return <button className="shush-motion-toggle" type="button" aria-pressed={manual||system}
   aria-label={system?'Movimento reduzido pelo sistema':'Reduzir animações'}
   disabled={system} onClick={change}>
   <span className="motion-toggle-indicator" aria-hidden="true"><span/></span>
   <span>{system?'Movimento reduzido pelo sistema':manual?'Animações reduzidas':'Reduzir animações'}</span>
 </button>;
}
