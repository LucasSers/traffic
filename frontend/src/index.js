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

/*
 * URLs for online-request demo:
 * - https://nominatim.openstreetmap.org/search?q=Rue+Louis+Oustry%2C+Rodez%2C+France&limit=1&format=json
 * - https://nominatim.openstreetmap.org/search?q=50+avenue+de+Bordeaux%2C+Rodez%2C+France&limit=1&format=json
 * - https://metric-osrm-backend.lab.sspcloud.fr/route/v1/driving/2.5763105,44.3499813;2.576429191630135,44.36004035?overview=full&geometries=polyline&steps=false
*/

import VehicleMap from './map';
//import VehicleCanvas from './canvas';
import Simulation from './simulation';
import cssColors from 'css-color-names';
import RandomColorProvider from './random-color-provider';

const ADDRESS_BOOK_DATA = [{"street":"Viaduc de Bourran","city":"Rodez","country":"France","locations":[{"place_id":120580684,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":131750320,"boundingbox":["44.3546825","44.3568023","2.5595687","2.5626345"],"lat":"44.355743200000006","lon":"2.5610934784679844","display_name":"Viaduc de Bourran, Route de Moyrazès, Plateau Paul-Lignon, Cité Robinson, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"man_made","type":"bridge","importance":0.6731507590430759}]},{"street":"Boulevard du 122e Régiment d'Infanterie","city":"Rodez","country":"France","locations":[{"place_id":299350895,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":890573532,"boundingbox":["44.3553386","44.3554324","2.5666767","2.5667169"],"lat":"44.3553386","lon":"2.5667169","display_name":"Boulevard du 122e Régiment d'Infanterie, Plateau Paul-Lignon, Cité Robinson, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"highway","type":"secondary","importance":0.9199999999999999}]},{"street":"Rue Saint-Just","city":"Rodez","country":"France","locations":[{"place_id":142427394,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":215306772,"boundingbox":["44.348791","44.3495408","2.576337","2.5773659"],"lat":"44.3489842","lon":"2.5769248","display_name":"Rue Saint-Just, Croix de Buffaux, Cité Lalande, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"highway","type":"residential","importance":0.6199999999999999}]},{"street":"Boulevard Denys Puech","city":"Rodez","country":"France","locations":[{"place_id":126908798,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":158719787,"boundingbox":["44.3499839","44.3508879","2.5779044","2.5779343"],"lat":"44.3505297","lon":"2.5779343","display_name":"Boulevard Denys Puech, Layoule, Cité Lalande, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"highway","type":"tertiary","importance":0.6199999999999999}]},{"street":"6 Rue de Copenhague","city":"Rodez","country":"France","locations":[{"place_id":143554172,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":218866653,"boundingbox":["44.3606206","44.3606485","2.5557465","2.5560343"],"lat":"44.3606206","lon":"2.5557465","display_name":"Rue de Copenhague, Bourran - La Gineste, Bourran, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"highway","type":"residential","importance":0.6199999999999999}]},{"street":"Lycée Alexis Monteil","city":"Rodez","country":"France","locations":[{"place_id":102435667,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":45428486,"boundingbox":["44.3560287","44.3581662","2.5706076","2.5737128"],"lat":"44.35712945","lon":"2.5717308303031574","display_name":"Lycée Alexis-Monteil, 14, Rue Carnus, L'Usine à Gaz, Camonil, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"amenity","type":"school","importance":0.6677880391065012,"icon":"https://nominatim.openstreetmap.org/ui/mapicons//education_school.p.20.png"}]},{"street":"Lycée François d\"Estaing","city":"Rodez","country":"France","locations":[{"place_id":16100074,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"node","osm_id":1548072076,"boundingbox":["44.3489416","44.3490416","2.5774965","2.5775965"],"lat":"44.3489916","lon":"2.5775465","display_name":"Lycée d'Enseignement Général et Technologique Privé François d'Estaing, 22, Boulevard Denys Puech, Layoule, Sainte-Catherine, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"amenity","type":"school","importance":0.621,"icon":"https://nominatim.openstreetmap.org/ui/mapicons//education_school.p.20.png"}]},{"street":"Avenue du Maréchal Joffre","city":"Rodez","country":"France","locations":[{"place_id":126888036,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":158672760,"boundingbox":["44.3615901","44.3619196","2.5753407","2.577076"],"lat":"44.3617349","lon":"2.5758932","display_name":"Avenue du Maréchal Joffre, Saint-Éloi, Camonil, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"highway","type":"secondary","importance":0.72}]},{"street":"50 Avenue de Bordeaux","city":"Rodez","country":"France","locations":[{"place_id":150020352,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":243004966,"boundingbox":["44.3593471","44.3607427","2.5754429","2.5776875"],"lat":"44.36004035","lon":"2.576429191630135","display_name":"Institut universitaire de technologie, 50, Avenue de Bordeaux, L'Usine à Gaz, Camonil, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"amenity","type":"university","importance":0.6309999999999999,"icon":"https://nominatim.openstreetmap.org/ui/mapicons//education_university.p.20.png"}]},{"street":"2 Avenue du 8 Mai 1945","city":"Rodez","country":"France","locations":[{"place_id":118579147,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":124622601,"boundingbox":["44.3574734","44.3576594","2.5773155","2.5784924"],"lat":"44.35756155","lon":"2.5779114135479784","display_name":"Centre des Impôts, 2, Avenue du 8 Mai 1945, L'Usine à Gaz, Camonil, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"amenity","type":"public_building","importance":0.831}]},{"street":"24 Avenue Tarayre","city":"Rodez","country":"France","locations":[{"place_id":119203790,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":124637611,"boundingbox":["44.3559102","44.3561243","2.5778358","2.5780057"],"lat":"44.35605875","lon":"2.5779093621100855","display_name":"24, Avenue Tarayre, Layoule, Les Besses, Rodez, Aveyron, Occitania, Metropolitan France, 12000, France","class":"building","type":"apartments","importance":0.5309999999999999}]},{"street":"8 Avenue de Vabre","city":"Rodez","country":"France","locations":[{"place_id":99806073,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":36873117,"boundingbox":["44.3830653","44.3988243","2.560828","2.5671"],"lat":"44.3922667","lon":"2.5655833","display_name":"Avenue de Vabre, Vabre, Onet-le-Château, Rodez, Aveyron, Occitania, Metropolitan France, 12850, France","class":"highway","type":"secondary","importance":0.7299999999999999}]},{"street":"8 Boulevard des Balquières","city":"Onet-le-Château","country":"France","locations":[{"place_id":124422443,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":148376579,"boundingbox":["44.371838","44.372362","2.580039","2.58121"],"lat":"44.37208655","lon":"2.5805986887954093","display_name":"Centre de Traitement du Courrier de Rodez, 8, Boulevard des Balquières, Les Balquières, Onet-le-Château, Rodez, Aveyron, Occitania, Metropolitan France, 12850, France","class":"building","type":"yes","importance":0.821}]}];

async function main() {

    /* center of the map */
    const LOC_RODEZ = [ 2.572, 44.351 ];

    // the canvas est un renderer alternatif, mais il faut le retoucher
    //const canvas = new VehicleCanvas(LOC_RODEZ);

    /* create a new vehicule map that will be used as the simulation renderer */
    const map = new VehicleMap(LOC_RODEZ);
    await map.init();

    /* create a new simulation instance using the map as its renderer */
    const simulation = new Simulation(map); // or canvas

    /* make it global so that it can be accessed in the browser's console */
    window.simulation = simulation;

    /* load the prefetched address-book data */
    simulation.addressBook.deserialize(ADDRESS_BOOK_DATA);

    /*
    for (let adressFields of [
        [ 'Viaduc de Bourran', 'Rodez', 'France' ],
        [ 'Boulevard du 122e Régiment d\'Infanterie', 'Rodez', 'France' ],
        [ 'Rue Saint-Just', 'Rodez', 'France' ],
        [ 'Boulevard Denys Puech', 'Rodez', 'France' ],
        [ '6 Rue de Copenhague', 'Rodez', 'France' ],
        [ 'Lycée Alexis Monteil', 'Rodez', 'France' ],
        [ 'Lycée François d"Estaing', 'Rodez', 'France' ],
        [ 'Avenue du Maréchal Joffre', 'Rodez', 'France' ],
        [ '50 Avenue de Bordeaux', 'Rodez', 'France' ],
        [ '2 Avenue du 8 Mai 1945', 'Rodez', 'France' ],
        [ '24 Avenue Tarayre', 'Rodez', 'France' ],
        [ '8 Avenue de Vabre', 'Rodez', 'France' ],
        [ '8 Boulevard des Balquières', 'Onet-le-Château', 'France' ],
    ])
        await simulation.addressBook.create(...adressFields);
    */

    /* create two models */
    for (let modelFields of [
        /* model   year     brand      type    mass  length   width  height brakeMaximumForce enginMaximumForce  */
        [ 'Clio', '2008', 'Renault',  'car',    1,   8.0,     2.0,    1,        3,                  1, ],
        [ 'Axor', '1990', 'Mercedes', 'truck', 3.0,  25.0,    4.0,    3.5,      9,                  3, ],
    ])
        simulation.models.create(...modelFields);

    const cssColorNames = Object.keys(cssColors);
    const colorProvider = new RandomColorProvider(cssColorNames);

    for (let i = 0; i < cssColorNames.length; ++i) {

        /* get random color, model and initial address for the vehicle */
        const color = colorProvider.random();
        const model = simulation.models.random();
        const initial = simulation.addressBook.random();

        /* create a new vehicule with the previous parameters;
         * the first parameter is the vehicule id, the second its actual color */
        const vehicle = simulation.collection.create(color, color, model, initial);

        /* pick a random address and request that the car drive there */
        const destination = simulation.addressBook.random();
        await vehicle.driveTo(destination);
    }

    /* start the clock and hence simulation */
    simulation.clock.start();
}

main().catch(error => console.error(error));
