/**
 * uses URLSearchParams to extract query parameters 
 * and convert the window.location url into a nicely usable object
 */
export function route(location) {
    const route = new URLSearchParams(location);
    let params = {};

    let q = route.get("search");
    if (q.startsWith("?")) {
        q = q.substring(1);
        const list = q.split("&").map(kv => { const [k, v] = kv.split("="); return { [k]: v }; });
        for (const param of list) {
            params = { ...param };
        }
    }

    return {
        origin: route.get("origin"),
        path: route.get("pathname"),
        params,
        hash: route.get("hash")
    };
}

export const RouteParams = (state, params) => ({
    ...state,
    route: {
        ...state.route,
        params
    }
});
