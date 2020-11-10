import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

export function dumpObjectToConsoleAsString(root) {
    console.log(dumpObjectToTextLines(root).join("\n"))
}

function dumpObjectToTextLines(obj, lines = [], isLast = true, prefix = '') {
    if (!obj || !obj.children) {
        return lines;
    }
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObjectToTextLines(child, lines, isLast, newPrefix);
    });
    return lines;
}

