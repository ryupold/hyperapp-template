export function isString(x) {
    return (typeof x === 'string' || x instanceof String);
}

export function isArray(x) {
    return Array.isArray(x);
}

export function isObject(x) {
    return Object.isObject(x);
}

export function isNumber(x) {
    return typeof x === "number" || x instanceof Number;
}

export function isBool(x) {
    return typeof x === "boolean" || x instanceof Boolean;
}

export function formatDate(date) {
    return date.toLocaleDateString(navigator.language, { year:"numeric", month:"long", day:"numeric"})
}