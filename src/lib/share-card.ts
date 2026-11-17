import {within,loadCanvasImage} from './canvas-resources';
import type {CardSubject} from '../components/studio/CanvasStudio';
import {getCompetitiveProfile} from '../data/competitive-profiles';

export async function drawShareCard(canvas:HTMLCanvasElement,subject:CardSubject,height:1080|1350){
 await Promise.allSettled([within(document.fonts.load('700 120px Manrope'),2500)]);
 const image=await loadCanvasImage(subject.kind==='player'?subject.player.avatar??'':'/assets/jersey/backjersey.webp');
 canvas.width=1080;canvas.height=height;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas indisponível.');
 ctx.fillStyle='#15131a';ctx.fillRect(0,0,1080,height);
 const text=(value:string,x:number,y:number,size:number,color='#f3eef4',max=936)=>{
  ctx.fillStyle=color;do{ctx.font=`700 ${size--}px Manrope,sans-serif`;}while(ctx.measureText(value).width>max&&size>12);ctx.fillText(value,x,y);
 };
 if(subject.kind==='player'){
  const photoHeight=height-330,scale=Math.max(1080/image.naturalWidth,photoHeight/image.naturalHeight);
  const width=1080/scale,crop=photoHeight/scale;
  ctx.drawImage(image,(image.naturalWidth-width)/2,(image.naturalHeight-crop)*.25,width,crop,0,0,1080,photoHeight);
  const shade=ctx.createLinearGradient(0,photoHeight*.48,0,photoHeight+40);shade.addColorStop(0,'#15131a00');shade.addColorStop(1,'#15131a');ctx.fillStyle=shade;ctx.fillRect(0,0,1080,photoHeight+40);
  text(subject.player.displayName,64,photoHeight-35,155);
  text(`#${subject.player.number}`,800,100,54,'#c4afe9',220);
  text(subject.player.roles.join(' / '),72,height-235,32,'#c4afe9');
  text(getCompetitiveProfile(subject.player.id)?.riotId??'SHUSH / VALORANT',72,height-170,30);
 }else{
  const config=subject.config,side=height-280,x=(1080-side)/2,y=110;
  ctx.drawImage(image,x,y,side,side);
  ctx.textAlign='center';text(config.nick||'SHUSH',540,y+side*.18,side*.06,'#f3eef4',side*.55);text(config.number||'00',540,y+side*.35,side*.17);
  if(config.phrase)text(config.phrase,540,y+side*.39,side*.015,'#f3eef4',side*.46);
  ctx.textAlign='left';text(`${config.nick||'SHUSH'} / ${config.number||'00'}`,72,height-200,60);text(`DROP 01 / TAMANHO ${config.size}`,72,height-145,25,'#c4afe9');
 }
 ctx.strokeStyle='#6b5b7c';ctx.lineWidth=2;ctx.strokeRect(32,32,1016,height-64);ctx.beginPath();ctx.moveTo(72,height-110);ctx.lineTo(1008,height-110);ctx.stroke();
 text('SEM BARULHO. SÓ ROUNDS.',72,height-60,20,'#c4afe9');text('SHUSH.PT',830,height-60,22,'#c4afe9',180);
}
