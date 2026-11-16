"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMs = toMs;
exports.toSeconds = toSeconds;
function toMs(time, unit) {
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
function toSeconds(time, unit) {
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
