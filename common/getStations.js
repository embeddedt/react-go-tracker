import fetch from 'isomorphic-unfetch'

/**
 * Extract the list of GO Transit stations.
 * 
 * Metrolinx has made this data available in a processing-friendly format, however, it's buried within a certain page's
 * JavaScript. We use a (fairly inefficient) approach to find this variable in the page's script and extract its value.
 * However, this only needs to be redone if the list of stations changes. 
 */
export async function getStations() {
    const go_res = await fetch(`http://gotracker.ca/gotracker/web/GoMap.aspx?mode=Public?_=${new Date().getTime()}`);
    const html = await go_res.text();
    const searchTerm = "var strStations = ";
    let strStations = html.substr(html.indexOf(searchTerm)+searchTerm.length+1); /* +1 for quote */
    strStations = strStations.substr(0, strStations.indexOf(";")-1); /* -1 for quote */
    const res = JSON.parse(strStations);
    return res;
};