export type SeasonId = 'base'|'christmas'|'newyear'|'carnival'|'valentines'|'easter'|'summer'|'halloween';
export function lisbonDate(date?:Date):{year:number;month:number;day:number};
export function isoDate(d:{year:number;month:number;day:number}):string;
export function shiftDate(iso:string,days:number):string;
export function easterSunday(year:number):string;
export function carnivalTuesday(year:number):string;
export function seasonWindows(year:number):{id:SeasonId;from:string;to:string}[];
export function seasonForDate(date?:Date):SeasonId;
