
import { DateTime } from 'luxon';
import { Marker, Popup, useMap } from 'react-leaflet'
import { useMemo, useCallback } from 'react';
import { useEmitterContext } from '~/components/EventContext';
import useSWR from 'swr';
import prefetch from '~/common/prefetch';

const icon_height = 40;
const icon_width = Math.ceil(icon_height * 0.897435897);

/**
 * Used to render the rows of the table which lists trips servicing a particular station.
 */
const StationTrips = (props) => {
    const eventBus = useEmitterContext();
    const map = useMap();
    const onClick = (e) => {
        e.preventDefault();
        const tripNumber = e.currentTarget.getAttribute("data-tripnumber");
        /* Close our own popup - the trip will open its shortly */
        map.closePopup();
        /* Fire the open trip event for this trip - see GOMapTrip.tsx */
        eventBus.emit("open-trip", { tripCode: tripNumber });
    }
    const stationTrips = useSWR('/api/go_stations/' + props.id);
    /* Wait for trip data to be downloaded before rendering */
    
    if(stationTrips.data == null)
        return null;
    const actualTrips = stationTrips.data.filter(trip => typeof trip.TripName != 'undefined');
    if(actualTrips.length < 1) {
        return <div>Please check the schedule for available GO service.</div>;
    }
    return <table>
        <thead>
            <tr>
                <th>Trip name</th>
                <th>ETA</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {actualTrips.map(trip => {
                const scheduledArrivalTime = DateTime.fromISO(trip.Scheduled);
                return <tr key={trip.TripNumber}>
                    <td>{trip.TripName}</td>
                    <td title={scheduledArrivalTime.toLocaleString(DateTime.TIME_SIMPLE)}>{scheduledArrivalTime.toRelative()}</td>
                    <td><a onClick={onClick} data-tripnumber={trip.TripNumber.toString()} href="#">Jump to</a></td>
                </tr>;
            })}
        </tbody>
    </table>;
};

/**
 * Component for rendering a station on the map. Used when the "Stations" layer is enabled.
 */
const GOStation = (props) => {
    const { stop_name, ATLS_LID: stationId, ATLS_LOCATIONLABEL: shortened_name, stop_lat, stop_url, stop_lon } = props;
    /* Make a custom "icon" that will show the station name as well */
    const icon = useMemo(() => (
        require("leaflet").divIcon({
            html: `<div class="station-marker-dot"></div><span>${shortened_name}</span>`,
            className: 'station-marker-image'
        })
    ), [ shortened_name ]);
    /* Callback for prefetching trip list on mouseover */
    const prefetchTripList = useCallback(() => {
        prefetch('/api/go_stations/' + stationId);
    }, [ stationId ]);    
    return <Marker
        position={[parseFloat(stop_lat), parseFloat(stop_lon)]}
        icon={icon}
        eventHandlers={{
            mouseover: prefetchTripList
        }}
        attribution="<a href='http://gotracker.ca/gotracker/web/'>GO Transit</a>"
    >
        <Popup>
            <h5>{stop_name}</h5>
            <StationTrips id={stationId}/>
            
        </Popup>
    </Marker>;
};
export default GOStation;