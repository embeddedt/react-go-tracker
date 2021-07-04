
import fetch from 'isomorphic-unfetch'
import xml2js from 'xml2js'
import { pad } from '~/common/utils';
import memoize from 'memoizee';

function normalizeGOTrip(trip) {
    trip['$'].CorridorCode = trip['$'].CorridorCode.trim();
    if(trip['$'].CorridorCode == "GT")
        trip['$'].CorridorCode = "KI";
}

const getTripsForRoute = memoize(async(routeNumber) => {
    const go_res = await fetch(`http://gotracker.ca/GoTracker/web/GODataAPIProxy.svc/TripLocation/Service/Lang/${pad(routeNumber, 2, '0')}/en?_=${new Date().getTime()}`);
    const xml = await go_res.text();
    return new Promise((resolve) => {
        xml2js.parseString(xml, (err, result) => {
            const info = result.ReturnValueOfListOfInServiceTripPublic;
            const trips = [];
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