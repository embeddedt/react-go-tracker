

import fetch from 'isomorphic-unfetch'
import xml2js from 'xml2js'

function normalizeGOTrip(trip) {

}

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
            trips.sort((a, b) => a.EstimatedArrival - b.EstimatedArrival);
            resolve(trips);
        });
    });
    
};
export { getTripsForStation };


