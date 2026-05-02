import fs from 'fs';

const p2 = "1976";
const p = parseInt(p2);
const origFromDouble = Math.round(p / 0.36);
const remD = origFromDouble % 100;
console.log('Presumed Original:', origFromDouble);
console.log('Remainder:', remD);
const isRound = (remD > 85 || remD < 15 || (remD > 45 && remD < 55));
console.log('Is Round:', isRound);
const corrected = Math.round(origFromDouble * 0.6);
console.log('Corrected:', corrected);
