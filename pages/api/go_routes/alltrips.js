import routes from '~/common/allGORoutes';
import getTripsForRoute from '~/common/getTripsForRoute';

export async function getAllTripsData() {
    let allRouteInfo = await Promise.all(routes.map(route => getTripsForRoute(route.code)));
    allRouteInfo = [].concat.apply([], allRouteInfo);
    return allRouteInfo;
}
export default async(req, res) => {
    let allRouteInfo = await getAllTripsData();
    res.status(200).json(allRouteInfo);
};