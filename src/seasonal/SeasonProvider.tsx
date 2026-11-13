import {createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {seasonForDate,type SeasonId} from './calendar.mjs';
import {themes} from './themes';

export const SEASON_STORAGE_KEY='shush:season:v1';
export type SeasonChoice=SeasonId|'auto';
const validSeasons=new Set<SeasonId>(Object.keys(themes) as SeasonId[]);
export function isSeasonId(value:unknown):value is SeasonId {
 return typeof value==='string'&&validSeasons.has(value as SeasonId);
}
function storedChoice():SeasonChoice {
 if(typeof window==='undefined')return 'auto';
 try {
  const value=localStorage.getItem(SEASON_STORAGE_KEY);
  return isSeasonId(value)?value:'auto';
 } catch {return 'auto';}
}
type SeasonContextValue={
 id:SeasonId;
 theme:(typeof themes)[SeasonId];
 automatic:SeasonId;
 override:SeasonChoice;
 preview:SeasonId|null;
 previewSeason:(id:SeasonId|null)=>void;
 commitSeason:(choice:SeasonChoice)=>void;
};
const Context=createContext<SeasonContextValue|null>(null);
export function SeasonProvider({children}:{children:ReactNode}){
 const [automatic,setAutomatic]=useState<SeasonId>(()=>seasonForDate());
 const [override,setOverride]=useState<SeasonChoice>(storedChoice);
 const [preview,setPreview]=useState<SeasonId|null>(null);
 const refresh=useCallback(()=>setAutomatic(previous=>{
  const next=seasonForDate();return previous===next?previous:next;
 }),[]);
 useEffect(()=>{
  const timer=window.setInterval(refresh,60_000);
  const resume=()=>{if(!document.hidden)refresh();};
  document.addEventListener('visibilitychange',resume);
  const sync=(event:StorageEvent)=>{
   if(event.key===SEASON_STORAGE_KEY||event.key===null){
    setOverride(storedChoice());setPreview(null);
   }
  };
  window.addEventListener('storage',sync);
  return ()=>{
   window.clearInterval(timer);
   document.removeEventListener('visibilitychange',resume);
   window.removeEventListener('storage',sync);
  };
 },[refresh]);
 const commitSeason=useCallback((choice:SeasonChoice)=>{
  const next=choice==='auto'||isSeasonId(choice)?choice:'auto';
  try {
   if(next==='auto')localStorage.removeItem(SEASON_STORAGE_KEY);
   else localStorage.setItem(SEASON_STORAGE_KEY,next);
  } catch {/* Optional storage: keep this tab usable. */}
  setOverride(next);setPreview(null);
 },[]);
 const id=preview??(override==='auto'?automatic:override);
 useEffect(()=>{if(id==='christmas')void import('../styles/winter.css');},[id]);
 const value=useMemo(()=>({
  id,theme:themes[id],automatic,override,preview,
  previewSeason:setPreview,commitSeason
 }),[id,automatic,override,preview,commitSeason]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSeason(){
 const value=useContext(Context);
 if(!value)throw new Error('useSeason requires SeasonProvider');
 return value;
}
