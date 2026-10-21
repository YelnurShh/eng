import type { Locale } from "./i18n";
const weekdays={kk:["Жс","Дс","Сс","Ср","Бс","Жм","Сб"],ru:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]};
const months={kk:["қаң","ақп","нау","сәу","мам","мау","шіл","там","қыр","қаз","қар","жел"],ru:["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"],en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]};
export const weekday=(date:Date,locale:Locale)=>weekdays[locale][date.getDay()];
export const shortDate=(time:number,locale:Locale)=>{const date=new Date(time);return `${date.getDate()} ${months[locale][date.getMonth()]}`;};
