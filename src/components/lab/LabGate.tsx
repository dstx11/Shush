import {lazy,Suspense,useEffect,useState} from 'react';

const ShushLab=lazy(()=>import('./ShushLab'));

export function LabGate(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  let count=0;
  let previous=0;
  const keyboard=(event:KeyboardEvent)=>{
   if(!event.altKey||!event.shiftKey||event.ctrlKey||event.metaKey||event.code!=='KeyS'||event.repeat)return;
   if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
   event.preventDefault();
   setOpen(value=>!value);
  };
  const logo=(event:MouseEvent)=>{
   if(!(event.target instanceof Element)||!event.target.closest('a.brand-mark'))return;
   const now=performance.now();
   count=now-previous<850?count+1:1;
   previous=now;
   if(count>=5){count=0;setOpen(true);}
  };
  document.addEventListener('keydown',keyboard);
  document.addEventListener('click',logo);
  return ()=>{document.removeEventListener('keydown',keyboard);document.removeEventListener('click',logo);};
 },[]);
 if(!open)return null;
 return <Suspense fallback={null}><ShushLab onClose={()=>setOpen(false)}/></Suspense>;
}
