import routes from '~/common/allGORoutes';

export default (req, res) => {
    res.status(200).json(routes);
};