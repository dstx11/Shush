import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {seasonForDate,type SeasonId} from './calendar.mjs';
import {themes} from './themes';
const Context=createContext<SeasonId>('base');
export function SeasonProvider({children}:{children:ReactNode}){
 const [id,setId]=useState<SeasonId>(()=>seasonForDate());
 useEffect(()=>{
  const refresh=()=>setId(previous=>{const next=seasonForDate();return next===previous?previous:next;});
  const timer=window.setInterval(refresh,60_000);
  const resume=()=>{if(!document.hidden)refresh();};
  document.addEventListener('visibilitychange',resume);
  return ()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',resume);};
 },[]);
 return <Context.Provider value={id}>{children}</Context.Provider>;
}
export function useSeason(){const id=useContext(Context);return {id,theme:themes[id]};}
