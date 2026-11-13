import type {Player} from '../../data/players';

/** Distinct abstract signatures, not invented player statistics or abilities. */
const marks:Record<string,string[]>={
 dstx:['M100 310L295 95L510 310L295 525Z','M165 310H445','M295 180V440'],
 more:['M100 165H490V455H100Z','M170 95V525','M240 115V505','M310 115V505'],
 th0maz7:['M300 85L500 300L300 515L100 300Z','M185 300H415','M300 180V420'],
 lyel:['M65 185Q195 85 305 185T535 185','M65 285Q195 185 305 285T535 285','M65 385Q195 285 305 385T535 385'],
 tz:['M300 70V530','M70 300H530','M145 145L455 455','M455 145L145 455'],
 levi:['M300 72L538 490H62Z','M300 175L437 418H163Z','M300 280V470'],
 catty:['M300 100A200 200 0 1 1 299 100','M300 180A120 120 0 1 1 299 180','M150 300H450']
};
export function PlayerSignature({player,index}:{player:Player;index:number}){
 const strokes=marks[player.id]??marks.dstx;
 return <div className="character-signature-scene" aria-hidden="true">
  <div className="character-backlight"/>
  <svg className="character-geometry" viewBox="0 0 600 600" fill="none" focusable="false">
   <circle className="character-geometry-orbit" cx="300" cy="300" r="258" strokeDasharray="3 18"/>
   <circle className="character-geometry-inner" cx="300" cy="300" r="205"/>
   <g className="character-geometry-mark">{strokes.map((d,i)=><path d={d} key={i}/>)}</g>
   <path className="character-geometry-cross" d="M300 15V72 M300 528V585 M15 300H72 M528 300H585"/>
  </svg>
  <div className="character-scene-shards"><i/><i/><i/><i/></div>
  <span className="character-scene-serial">SHUSH / IDENTITY {String(index+1).padStart(2,'0')}</span>
  <span className="character-scene-foot">PLAYER FILE // #{player.number}</span>
  <span className="character-scene-grid"/>
  <span className="character-scene-vignette"/>
 </div>;
}
