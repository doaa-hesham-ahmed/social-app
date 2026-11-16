type TimeUnit = 'seconds'|'minutes'|'hours'|'millisecond'|'days'
export function toMs (time:number,unit:TimeUnit){
       switch (unit) {
        case 'seconds':
           return time * 1000;
        case 'minutes':
           return time * 1000 * 60;
        case 'hours':
           return time * 1000 * 60 * 60;
        case 'days':
               return time * 24 * 1000 * 60 * 60;
        default:
            return time;
       }
}

export function toSeconds (time:number,unit:TimeUnit){
       switch (unit) {
        case 'millisecond':
           return time / 1000;
        case 'minutes':
           return time * 60;
        case 'hours':
           return time * 60 * 60;
        case 'days':
            return time * 24 * 60 * 60;
        default:
            return time;
       }
}