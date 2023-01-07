import {
    gunzip, gzip, b64
} from "../../deps.js";

function b64e(str) {
    return b64.encode(str).replace(/\+/g,'_').replace(/=/g,'.');
}

function b64d(str) {
    return b64.decode(str.replace(/\./g,'=').replace(/_/g,'+'));
}

export function decode(str) {
    const dec = new TextDecoder();
    return dec.decode(gunzip(b64d(str)));
}

export function encode(str) {
    const enc = new TextEncoder();
    return b64e(gzip(enc.encode(str)));
}
