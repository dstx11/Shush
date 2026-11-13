import {useCallback,useEffect,useRef,type PointerEvent} from 'react';

/** One animation frame for each pointer update, without rerendering React. */
export function useCinematicPointer<T extends HTMLElement>(){
 const ref=useRef<T>(null);
 const frame=useRef(0);
 const clear=useCallback(()=>{
  if(typeof window==='undefined')return;
  window.cancelAnimationFrame(frame.current);
  const node=ref.current;
  for(const key of ['--lens-x','--lens-y','--portrait-x','--portrait-y'])node?.style.removeProperty(key);
 },[]);
 const onPointerMove=useCallback((event:PointerEvent<T>)=>{
  if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches||
     document.documentElement.dataset.motion==='reduce')return;
  const node=ref.current;
  if(!node)return;
  const rect=node.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  const x=Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2));
  const y=Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2));
  window.cancelAnimationFrame(frame.current);
  frame.current=window.requestAnimationFrame(()=>{
   node.style.setProperty('--lens-x',`${(x*15).toFixed(1)}px`);
   node.style.setProperty('--lens-y',`${(y*12).toFixed(1)}px`);
   node.style.setProperty('--portrait-x',`${(-x*8).toFixed(1)}px`);
   node.style.setProperty('--portrait-y',`${(-y*6).toFixed(1)}px`);
  });
 },[]);
 useEffect(()=>{
  const onHide=()=>{if(document.hidden)clear();};
  document.addEventListener('visibilitychange',onHide);
  return()=>{clear();document.removeEventListener('visibilitychange',onHide);};
 },[clear]);
 return {ref,onPointerMove,onPointerLeave:clear};
}
