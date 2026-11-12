import assert from 'node:assert/strict';
import {easterSunday,carnivalTuesday,seasonForDate,seasonWindows} from '../src/seasonal/calendar.mjs';
const day=d=>new Date(d+'T12:00:00Z');
for(const [year,easter,carnival] of [[2026,'2026-04-05','2026-02-17'],[2027,'2027-03-28','2027-02-09'],[2028,'2028-04-16','2028-02-29'],[2029,'2029-04-01','2029-02-13']]){
 assert.equal(easterSunday(year),easter);assert.equal(carnivalTuesday(year),carnival);
 assert.ok(seasonWindows(year).every(w=>w.from<=w.to));
}
for(const [date,id] of Object.entries({'2026-11-12':'base','2026-12-01':'christmas','2026-12-26':'christmas','2026-12-27':'newyear','2027-01-03':'newyear','2027-01-04':'base','2027-02-05':'carnival','2027-02-09':'carnival','2027-02-10':'carnival','2027-02-11':'valentines','2027-02-14':'valentines','2027-02-16':'base','2027-03-22':'easter','2027-03-29':'easter','2027-03-30':'base','2027-07-01':'summer','2027-08-31':'summer','2027-09-01':'base','2027-10-24':'halloween','2027-11-01':'halloween','2027-11-02':'base','2029-02-13':'carnival','2029-02-14':'valentines'})){
 assert.equal(seasonForDate(day(date)),id,date);
}
console.log('Seasonal calendar: Easter, Carnival, boundaries and overlaps verified.');
