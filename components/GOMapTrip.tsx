
import { Marker, Popup, useMap } from 'react-leaflet'
import { useMemo, useRef } from 'react'
import DOMPurify from 'dompurify'
import { DateTime } from 'luxon';
import { useEventHandler } from './EventContext';

const icon_height = 40;
const icon_width = Math.ceil(icon_height * 0.897435897);

/**
 * Displays the train icon at a specific location on the map and provides the popup functionality.
 */
const GOMapTrip = (props) => {
    const map = useMap();
    const markerRef = useRef<L.Marker>();
    useEventHandler("open-trip", (e) => {
        /*
         * This event is fired when the user clicks on one of the trips in the station's popup (see GOStation.js).
         * We only process it if it happens to be our trip.
         */
        if(e.tripCode == props.TripNumber) {
            /* Open our popup once the map finishes panning */
            map.once("moveend", () => {
                markerRef.current.openPopup();
            });
            /* Pan the map to our location */
            map.panTo(markerRef.current.getLatLng());
        }
    }, [ props.TripNumber, markerRef.current ]);
    /* Get a static reference to the appropriate icon for our trip based on the route */
    const icon = useMemo(() => (
        require("leaflet").icon({
            iconUrl: `/static/go_route_logos/GO_${props.Service.replace(/ /g, '_')}_logo.svg`, 
            iconSize:     [icon_width, icon_height], // size of the icon
            iconAnchor:   [icon_width / 2, icon_height * (3/4)], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -(icon_height * (3/4))], // point from which the popup should open relative to the iconAnchor,
            
            shadowUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        
            
            shadowSize:   [0, 0], // size of the shadow
            
            shadowAnchor: [0, 0],
            
            className: 'corridor-marker-image'
        })
    ), [ props.Service ]);
    /*
     * We only want to show station information if the train is actually in a station (meaning InStation contains at
     * least one non-alphanumeric character).
     */
    const station = (props.InStation.trim().length > 0) ? `at <b>${props.InStation}</b>` : "";
    /* Convert the GO-provided date to a Luxon object */
    const modifiedDate = useMemo(() => DateTime.fromISO(props.ModifiedDate), [ props.ModifiedDate ]);
    return <Marker
        position={[parseFloat(props.Latitude), parseFloat(props.Longitude)]}
        icon={icon}
        ref={markerRef}
        attribution="<a href='http://gotracker.ca/gotracker/web/'>GO Transit</a>"
    >
        <Popup className="go-trip-popup">
            <h5>{props.TripName}</h5>
            <p></p>
            <ul>
                <li>Trip number is <b>{props.TripNumber}</b></li>
                <li>Towards <b>{props.CorridorCode} - {props.EndStation}</b></li>
                <li>Currently <b>{props.IsMoving == "true" ? "moving" : "stopped"}</b> <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(station)}}></span></li>
                <li>Moved by locomotive {props.EquipmentCode}</li>
            </ul>
            <small className="trip-data-disclaimer" title={modifiedDate.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)}>Data last updated {modifiedDate.toRelative()}.</small>
        </Popup>
    </Marker>;
};
export default GOMapTrip;