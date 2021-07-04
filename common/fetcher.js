import fetch from 'isomorphic-unfetch'

const fetcher = async(url) => {
    const res = await fetch(url);
    const j = await res.json();
    return j;
}
export default fetcher