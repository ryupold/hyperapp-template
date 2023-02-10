export const jsonFetch = async (dispatch, payload) => {
    const response = await fetch(payload.url)
    const json = await response.json();
    requestAnimationFrame(() => dispatch(payload.action, json));
}