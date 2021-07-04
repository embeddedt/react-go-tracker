import fetch from 'isomorphic-unfetch'

export async function getStations() {
    const go_res = await fetch(`http://gotracker.ca/gotracker/web/GoMap.aspx?mode=Public?_=${new Date().getTime()}`);
    const html = await go_res.text();
    const searchTerm = "var strStations = ";
    let strStations = html.substr(html.indexOf(searchTerm)+searchTerm.length+1); /* +1 for quote */
    strStations = strStations.substr(0, strStations.indexOf(";")-1); /* -1 for quote */
    const res = JSON.parse(strStations);
    return res;
};