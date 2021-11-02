/**
 * Route class to generate a random route
 * @author Mehdi Sahi
 * @author Lucas Sers
 */

import { queryRoutes } from './geo';
import polyline from '@mapbox/polyline';
import { along, length } from '@turf/turf';

export default class Route {

    /**
     * the route geometry in GeoJSON format
     */
    #geometry;

    /**
     * the length of |#geometry| in kilometers
     */
    #length;

    /**
     * Build a route instance from an OSRM route
     * @param routeData A route object as returned by the OSRM project
     */
    constructor(osrmRoute) {

        /* decode the encoded geometry */
        this.#geometry = polyline.toGeoJSON(osrmRoute.geometry);

        /* compute the length of the road, in kilometers */
        this.#length = length(this.#geometry);
    }

    /**
     * Find the position on the route at a certain distance from the start
     */
    positionAtKilometer(distance)
    {
        const point = along(this.#geometry, Math.min(distance, this.#length));
        return point.geometry.coordinates;
    }

    get length () {
        return this.#length;
    }

    get geometry () {
        return this.#geometry;
    }

    /**
     * Create a new route from a list of positions
     * @returns the Route created
     */
    static async create(...positions) {

        /* Find routes using an OSRM-project service online */
        const { routes } = await queryRoutes(positions);

        if (!routes.length)
            throw new Error(`no route found between ${positions}`);

        return new Route(routes[0]);
    }
}
