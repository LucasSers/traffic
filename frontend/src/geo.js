/**
 * Copyright (C) 2021 Johnny Accot <johnny.accot@iut-rodez.fr>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import { FetchError, OsrmError, NominatimError, LocationError } from './exceptions';

/**
 * Asynchronously revolve an address using OpenStreetMap's Nominatim service.
 * Given an address, the function will return an array of possible matches,
 * up to a certain count (one by default). For example, a call to:
 *
 *   queryLocations('50 avenue de Bordeaux, Rodez, France')
 *
 * will return the array:
 *
 *   [
 *     {
 *       "place_id": 150020352,
 *       "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
 *       "osm_type": "way",
 *       "osm_id": 243004966,
 *       "boundingbox": ["44.3593471", "44.3607427", "2.5754429", "2.5776875"],
 *       "lat": "44.36004035",
 *       "lon": "2.576429191630135",
 *       "display_name": "Institut universitaire de technologie, 50, Avenue de Bordeaux, L'Usine à Gaz, Camonil, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France",
 *       "class": "amenity",
 *       "type": "university",
 *       "importance": 0.6309999999999999,
 *       "icon": "https://nominatim.openstreetmap.org/ui/mapicons//education_university.p.20.png"
 *     }
 *   ]
 *
 * @param {string} query The comma-separated address to be resolved,
 *        e.g. "50 avenue de Bordeaux, Rodez, France"
 * @param {number} limit The maximum number of matches to be queried
 * @return an array with found matches, up to |limit|
 * @throws FetchError if the network query fails
 * @throws NominatimError if the nominatim query fails
 */
export async function queryLocations(query, limit=1)
{
    /* Build the query params. For query options, see:
     * https://nominatim.org/release-docs/develop/api/Search/ */
    const params = new window.URLSearchParams();
    params.append('q', query);
    params.append('limit', limit);
    params.append('format', 'json'); // xml|json|jsonv2|geojson|geocodejson

    /* Perform the query */
    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const response = await fetch(url);

    if (!response.ok)
        throw new FetchError(response);

    /* Check the response */
    const locations = await response.json();

    if (!locations)
        throw new NominatimError(query);

    /* when the location is not found and returns an empty array */
    if (Object.keys(locations).length === 0)
        throw new LocationError(query);

    return locations;
}


/**
 * Find routes between two positions using an online OSRM service.
 * Depending on the options, the returned object will be something like:
 *
 *   {
 *     "code": "Ok",
 *     "routes": [
 *       {
 *         "geometry": "kbumG}dvNhAVFADK@w@@g@EECGBcB@KFgA?UQAAAa@Ci@CKAaBCK?[@M?I@GAyADI?Y@U@a@@c@@_@@q@BE?g@KSEWAQ?MFy@pBU`@QLq@VaDfAKDg@LMDm@Jc@Je@Xe@FC@QFBFOLCB_Ad@c@Ly@Ty@PSIKBeCa@_@EGAKCIIUAIDq@CmA@oCZaB^AM?m@@[B_@",
 *         "legs": [
 *           {
 *             "steps": [],
 *             "distance": 1472.7,
 *             "duration": 166.3,
 *             "summary": "",
 *             "weight": 3443
 *           }
 *         ],
 *         "distance": 1472.7,
 *         "duration": 166.3,
 *         "weight_name": "routability",
 *         "weight": 3443
 *       }
 *     ],
 *     "waypoints": [
 *       {
 *         "hint": "XEXMgf___38AAAAAQAAAACQAAAAGAAAAAAAAAMgmKkI09MBB3g6JQAAAAABAAAAAJAAAAAYAAAClOwAAt08nAB26pAK3TycAHbqkAgEADwxDI_P5",
 *         "distance": 0,
 *         "name": "Rue Louis Oustry",
 *         "location": [2.576311, 44.349981]
 *       }, {
 *         "hint": "r5jMgbCYzIEAAAAAIAAAAAAAAAAAAAAAAAAAAE-TVkEAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAClOwAABE8nAIHhpAItUCcAaOGkAgAArxFDI_P5",
 *         "distance": 23.833827,
 *         "name": "",
 *         "location": [2.576132, 44.360065]
 *       }
 *     ]
 *   }
 *
 * @see http://project-osrm.org/docs/v5.22.0/api/
 *
 * @param {...} coords An array of [ longitude, latitude ]
 * @param {string} baseUrl The base URL of the service to use, for example:
 *        https://metric-osrm-backend.lab.sspcloud.fr
 *        https://routing.openstreetmap.de/routed-car
 *        https://router.project-osrm.org
 * @param {string} service The service type, one of route|nearest|trip|table|tile
 * @param {string} version The service version, e.g. v1
 * @param {string} profile The profile to use, one of driving|biking|foot
 * @return the request result as returned by the service, if it succeeded
 * @throws FetchError if the network query fails
 * @throws OsrmError if the online request failed
 */
export async function queryRoutes(
    coords,
    baseUrl='https://metric-osrm-backend.lab.sspcloud.fr',
    service='route',
    version='v1',
    profile='driving',
    options={ geometries: 'polyline', overview: 'full', steps: 'false' })
{
    /* Build the URL */
    const params = new window.URLSearchParams();
    for (let [ key, val ] of Object.entries(options))
        params.append(key, val);

    const coordinates = coords.map(coord => `${coord[0]},${coord[1]}`).join(';');
    const url = `${baseUrl}/${service}/${version}/${profile}/${coordinates}?${params}`;

    /* Perform the network request */
    const request = new window.Request(url/*, { mode: 'no-cors' } */);
    const response = await fetch(request);

    /* check that the response was successful */
    if (!response.ok)
        throw new FetchError(response);

    const payload = await response.json();

    if (payload.code !== 'Ok')
        throw new OsrmError(request, payload);

    /* remove status code and return */
    delete payload.code;
    return payload;
}
