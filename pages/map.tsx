
import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import { getAllTripsData } from '~/pages/api/go_routes/alltrips';
import { getStations } from '~/common/getStations';
import mitt from 'mitt';
import { EventContext } from '~/components/EventContext';

/* Ensure the actual map is not rendered server-side */
const GOMap = dynamic(() => import('~/components/GOMap'), {
    ssr: false,
    loading: () => <Loader
        type="TailSpin"
        color="#00BFFF"
        height={100}
        width={100}
        className="tailspin-loader"
    />
})

/* Fetch the initial trips server-side to reduce the round-trip time for loading */
export async function getServerSideProps() {
    const [ trips, stations ] = await Promise.all([ getAllTripsData(), getStations() ])
  
    return { props: { trips, stations } };
}

/**
 * Top level component for the map page.
 */
const MapComponent = props => {
    /* Create an event bus for the map components to use for communication */
    const [ eventBus ] = useState(() => mitt());
    /* Refresh the list of trips every 3 seconds */
    const goTripData = useSWR('/api/go_routes/alltrips', { initialData: props.trips, refreshInterval: 3000 });
    const stations = props.stations;
    return <div className="map-container">
        <Head>
            <title>Unofficial GO Transit tracker</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <EventContext.Provider value={eventBus}>
            <GOMap goTripData={goTripData} stations={stations}/>
        </EventContext.Provider>
    </div>;
};

export default MapComponent;