import {useCallback,useEffect,useRef,useState} from 'react';

/** A short original UI feedback tone; silent by default and never autoplayed. */
export function useSelectCue(){
 const [enabled,setEnabled]=useState(false);
 const audio=useRef<AudioContext|null>(null);
 const play=useCallback(()=>{
  if(!enabled||document.hidden)return;
  try{
   const context=audio.current??new AudioContext();
   audio.current=context;
   if(context.state==='suspended')void context.resume();
   const now=context.currentTime;
   const oscillator=context.createOscillator();
   const gain=context.createGain();
   oscillator.type='sine';
   oscillator.frequency.setValueAtTime(510,now);
   oscillator.frequency.exponentialRampToValueAtTime(340,now+.085);
   gain.gain.setValueAtTime(.0001,now);
   gain.gain.exponentialRampToValueAtTime(.025,now+.007);
   gain.gain.exponentialRampToValueAtTime(.0001,now+.105);
   oscillator.connect(gain).connect(context.destination);
   oscillator.start(now);oscillator.stop(now+.11);
   oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }catch{/* sound is strictly optional */}
 },[enabled]);
 useEffect(()=>()=>{if(audio.current)void audio.current.close();},[]);
 return {enabled,setEnabled,play};
}
