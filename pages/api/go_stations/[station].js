
import { getTripsForStation } from '~/common/getTripsForStation';

export default async (req, res) => {
    res.status(200).json(await getTripsForStation(req.query.station));
};