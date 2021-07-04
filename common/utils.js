export function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function indexOfAny(s, options) {
    let index = -1;
    for(var i = 0; i < options.length && index == -1; i++) {
        index = s.indexOf(options[i]);
    }
    return index;
}