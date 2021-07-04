import { getStations } from '~/common/getStations';
export default async (req, res) => {
    res.status(200).json(await getStations());
};