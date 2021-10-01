

import fetch from 'isomorphic-unfetch'
import xml2js from 'xml2js'

function normalizeGOTrip(trip) {

}

/**
 * Get the list of trips servicing a station in a friendly JSON format.
 * See getTripsForRoute for a rationale of these functions.
 */
async function getTripsForStation(stationNumber) {
    const go_res = await fetch(`http://gotracker.ca/GOTracker/web/GODataAPIProxy.svc/StationStatus/${stationNumber}?_=${new Date().getTime()}`);
    const xml = await go_res.text();
    return new Promise((resolve) => {
        xml2js.parseString(xml, (err, result) => {
            const info = result.ReturnValueOfListOfStationStatus;
            const trips = [];
            if(info.Data[0].StationStatus != undefined)
                info.Data[0].StationStatus.forEach((station) => {
                    normalizeGOTrip(station);
                    let tripObj = station['$'];
                    trips.push(tripObj);
                });
            /* Sort trips by estimated time of arrival at their destination, soonest first */
            trips.sort((a, b) => a.EstimatedArrival - b.EstimatedArrival);
            resolve(trips);
        });
    });
    
};
export { getTripsForStation };


