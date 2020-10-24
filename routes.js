const routes = require("next-routes")();

routes.add("/properties/new", "/properties/new");
routes.add("/properties/:address", "/properties/show");
routes.add("/properties/:address/requests", "/properties/requests/index");
routes.add("/properties/:address/requests/new", "/properties/requests/new");
module.exports = routes;