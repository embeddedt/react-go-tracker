
import { Marker, Popup, useMap } from 'react-leaflet'
import { useMemo, useCallback } from 'react';
import { useEmitterContext } from '~/components/EventContext';
import useSWR from 'swr';
import prefetch from '~/common/prefetch';

const icon_height = 40;
const icon_width = Math.ceil(icon_height * 0.897435897);


const StationTrips = (props) => {
    const eventBus = useEmitterContext();
    const map = useMap();
    const onClick = (tripNumber, e) => {
        e.preventDefault();
        map.closePopup();
        eventBus.emit("open-trip", { tripCode: tripNumber });
    }
    const stationTrips = useSWR('/api/go_stations/' + props.id);
    if(stationTrips.data == null)
        return null;
    return stationTrips.data.map(trip => (typeof trip.TripName != 'undefined' ? <tr key={trip.TripNumber}>
        <td>{trip.TripName}</td>
        <td><a onClick={onClick.bind(void 0, trip.TripNumber)} href="#">Jump to</a></td>
    </tr> : null));
};


const GOStation = (props) => {
    const { stop_name, ATLS_LID: stationId, ATLS_LOCATIONLABEL: shortened_name, stop_lat, stop_url, stop_lon } = props;
    const icon = useMemo(() => (
        require("leaflet").divIcon({
            html: `<div class="station-marker-dot"></div><span>${shortened_name}</span>`,
            className: 'station-marker-image'
        })
    ), [ shortened_name ]);
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
            <table>
                <thead>
                    <tr>
                        <th>Trip name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <StationTrips id={stationId}/>
                </tbody>
            </table>
        </Popup>
    </Marker>;
};
export default GOStation;