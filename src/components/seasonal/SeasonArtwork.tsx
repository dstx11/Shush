import type {SeasonId} from '../../seasonal/calendar.mjs';

/** Single composited SVG per hero; geometric references to each campaign. */
export function SeasonArtwork({id}:{id:SeasonId}){
 const motif=(()=>{
  switch(id){
   case 'valentines': return <g className="season-art-motif"><circle cx="170" cy="240" r="90"/><circle cx="350" cy="240" r="90"/><path d="M170 150 C240 115 280 365 350 330 M170 330 C240 365 280 115 350 150"/><circle cx="260" cy="240" r="9" className="season-art-dot"/></g>;
   case 'carnival': return <g className="season-art-motif"><path d="M99 163 Q183 99 262 170 Q348 99 421 163 L392 336 L260 386 L127 336Z"/><path d="M145 229 Q191 190 246 246 Q197 283 145 229Z M274 246 Q331 190 379 229 Q323 283 274 246Z"/><path d="M260 178V345 M131 311L260 369L390 311"/></g>;
   case 'easter': return <g className="season-art-motif"><ellipse cx="260" cy="242" rx="122" ry="174"/><path d="M143 211 Q197 248 260 211 T378 211 M144 278 Q203 244 260 278 T376 278 M195 124 Q260 157 325 124"/><circle cx="260" cy="350" r="9" className="season-art-dot"/></g>;
   case 'summer': return <g className="season-art-motif"><circle cx="260" cy="225" r="123"/><path d="M61 312H459 M85 334H435 M113 356H407 M145 378H375 M260 34V78 M103 95L139 132 M418 95L381 132"/></g>;
   case 'halloween': return <g className="season-art-motif"><path d="M260 59L399 142L418 301L260 423L102 301L121 142Z"/><path d="M187 188L224 237L187 257 M332 188L294 237L332 257 M206 316Q260 284 314 316"/><circle cx="260" cy="239" r="136" strokeDasharray="5 18"/></g>;
   case 'newyear': return <g className="season-art-motif"><circle cx="260" cy="240" r="165"/><path d="M260 72V408 M91 240H429 M144 124L378 358 M377 123L144 358"/><text x="260" y="277" textAnchor="middle" className="season-art-number">01</text></g>;
   default: return <g className="season-art-motif"><circle cx="260" cy="240" r="164"/><circle cx="260" cy="240" r="118"/><circle cx="260" cy="240" r="69"/><path d="M260 35V110 M260 371V446 M55 240H128 M392 240H465"/><circle cx="260" cy="222" r="10" className="season-art-dot"/><path d="M261 246Q291 270 262 304" strokeWidth="8" strokeLinecap="round"/></g>;
  }
 })();
 return <svg className={'season-art season-art-'+id} viewBox="0 0 520 480" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false"><path className="season-art-grid" d="M20 80H500 M20 240H500 M20 400H500 M100 20V460 M260 20V460 M420 20V460"/><circle className="season-art-outline" cx="260" cy="240" r="205" strokeDasharray="3 11"/>{motif}<path className="season-art-corner" d="M20 65V20H65 M455 20H500V65 M20 415V460H65 M455 460H500V415"/></svg>;
}
