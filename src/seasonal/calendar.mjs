/** Pure Gregorian scheduling, resolved in the Portuguese timezone. */
const format = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit'});
const pad = n => String(n).padStart(2,'0');
export function lisbonDate(date=new Date()) {
  const p=Object.fromEntries(format.formatToParts(date).filter(x=>x.type!=='literal').map(x=>[x.type,+x.value]));
  return {year:p.year,month:p.month,day:p.day};
}
export const isoDate = d => d.year+'-'+pad(d.month)+'-'+pad(d.day);
export function shiftDate(iso,n) {
  const [y,m,d]=iso.split('-').map(Number);
  return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10);
}
export function easterSunday(y) {
  if(!Number.isInteger(y)||y<1583||y>4099) throw new RangeError('Invalid Gregorian year');
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
  const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k+700)%7,m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;
  return isoDate({year:y,month,day});
}
export const carnivalTuesday=y=>shiftDate(easterSunday(y),-47);
export function seasonWindows(y) {
 const carnival=carnivalTuesday(y),easter=easterSunday(y);
 return [
  {id:'newyear',from:y+'-01-01',to:y+'-01-03'},
  {id:'carnival',from:shiftDate(carnival,-4),to:shiftDate(carnival,1)},
  {id:'valentines',from:y+'-02-11',to:y+'-02-15'},
  {id:'easter',from:shiftDate(easter,-6),to:shiftDate(easter,1)},
  {id:'summer',from:y+'-07-01',to:y+'-08-31'},
  {id:'halloween',from:y+'-10-24',to:y+'-11-01'},
  {id:'christmas',from:y+'-12-01',to:y+'-12-26'},
  {id:'newyear',from:y+'-12-27',to:y+'-12-31'}
 ];
}
export function seasonForDate(date=new Date()) {
 const d=lisbonDate(date),today=isoDate(d);
 // The 14th belongs to Valentine's Day; Carnival wins the remaining overlaps.
 if(d.month===2&&d.day===14) return 'valentines';
 const active=seasonWindows(d.year).filter(s=>today>=s.from&&today<=s.to);
 return active.find(s=>s.id==='carnival')?.id??active.find(s=>s.id==='valentines')?.id??active[0]?.id??'base';
}
