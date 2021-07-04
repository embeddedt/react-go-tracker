import getTripsForRoute from '~/common/getTripsForRoute';

export default async (req, res) => {
    res.status(200).json(await getTripsForRoute(req.query.route));
};
  