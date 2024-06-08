
import fetch from 'isomorphic-unfetch'
import xml2js from 'xml2js'
import { pad } from '~/common/utils';
import memoize from 'memoizee';

function normalizeGOTrip(trip) {
    /* Remove any spaces around the corridor code to simplify comparisons */
    trip['$'].CorridorCode = trip['$'].CorridorCode.trim();
    /*
     * The Georgetown line was renamed to the Kitchener line, and is referred to as KI on Triplinx and other sites, so
     * we normalize any incoming data to the same.
     */
    if(trip['$'].CorridorCode == "GT")
        trip['$'].CorridorCode = "KI";
}

/**
 * Gets the list of trips for a given route number. Metrolinx/GO provide this data in XML format, so we use xml2js
 * to convert this to a more palatable JSON format.
 *
 * This function is memoized and only returns new data every 10 seconds.
 */
const getTripsForRoute = memoize(async(routeNumber) => {
    const url = `http://gotracker.ca/GoTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/${pad(routeNumber, 2, '0')}/en?_=${new Date().getTime()}`;
    const go_res = await fetch(url);
    const xml = await go_res.text();
    return new Promise((resolve) => {
        xml2js.parseString(xml, (err, result) => {
            const info = result.ReturnValueOfListOfInServiceTripPublic;
            const trips = [];
            if(info == undefined) {
                console.error("No data returned for " + url);
                resolve([]);
                return;
            }
            if(info.Data[0].InServiceTripPublic != undefined)
                info.Data[0].InServiceTripPublic.forEach((trip) => {
                    normalizeGOTrip(trip);
                    let tripObj = trip['$'];
                    trips.push(tripObj);
                });
            resolve(trips);
        });
    });

}, {
    maxAge: 10*1000
});
export default getTripsForRoute;