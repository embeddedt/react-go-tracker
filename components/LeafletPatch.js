import { useEffect } from "react";

const LeafletPatch = () => {
    useEffect(() => {
        /*
        const L = require("leaflet");
        delete L.Icon.Default.prototype._getIconUrl;
    
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/static/leaflet/marker-icon-2x.png",
          iconUrl: "/static/leaflet/marker-icon.png",
          shadowUrl: "/static/leaflet/marker-shadow.png"
        });
        */
    }, []);
    return null;
}

export { LeafletPatch };