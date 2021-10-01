
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, LayersControl, LayerGroup, Marker, Popup } from 'react-leaflet'
import GOMapTrip from '~/components/GOMapTrip'
import GOStation from '~/components/GOStation'
import { usePosition } from 'use-position';


const position = [43.645278, -79.380556]

/**
 * Overall map component - renders the Leaflet map and all the necessary subcomponents to display stations and trains.
 */
const GOMap = ({ goTripData, stations }) => {
    const {
        latitude,
        longitude,
    } = usePosition(true);
    useEffect(() => {
        /* Work around Leaflet using the wrong URLs for marker images */
        const L = require("leaflet");
        delete L.Icon.Default.prototype._getIconUrl;
    
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/static/leaflet/marker-icon-2x.png",
          iconUrl: "/static/leaflet/marker-icon.png",
          shadowUrl: "/static/leaflet/marker-shadow.png"
        });
    }, []);
    /*
     * Get a unique list of routes currently running by trying to add each train's route to a Set, which can only
     * contain one of each element.
     */
    const servicesList = useMemo(() => {
        const set = new Set();
        goTripData.data?.forEach(trip => set.add(trip.Service.trim()));
        return set;
    }, [ goTripData.data ]);
    return <MapContainer center={position} zoom={9} maxZoom={18} minZoom={9}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
            {[...servicesList].map(service => <LayersControl.Overlay checked name={service} key={service}>
                <LayerGroup>
                    {goTripData.data?.filter(trip => trip.Service.trim() == service).map(trip => <GOMapTrip key={trip.TripNumber} {...trip}/>)}
                </LayerGroup>
            </LayersControl.Overlay>)}
            <LayersControl.Overlay name="Stations">
                <LayerGroup>
                    {stations.filter(station => station.isYard == 'false').map(station => <GOStation key={station.stop_short_name} {...station}/>)}
                </LayerGroup>
            </LayersControl.Overlay>
        </LayersControl>
        {typeof latitude == 'number' && typeof longitude == 'number' && <Marker position={[latitude, longitude]}>
            <Popup>
                Your current location.
            </Popup>
        </Marker>}
    </MapContainer>;
};

export default GOMap;