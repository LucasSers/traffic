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

import { Map as MapLibreGL } from 'maplibre-gl';
import { destination, featureCollection, point, polygon } from '@turf/turf';

export default class VehicleMap extends MapLibreGL {

    /**
     * Constructs a new map element
     * @param {HTMLElement} [parent=document.body] - The parent element of the map
     */
    constructor(center, parent=document.body) {

        /* create a new container element and add it as a child of |parent| */
        const container = document.createElement('div');
        container.style.cssText = 'position:absolute;top:0;right:0;bottom:0;left:0;';
        parent.appendChild(container);

        /* Ideally we should also pass the style parameter, i.e.
         *
         *   style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
         *
         * to the super-class constructor, but this results in an error:
         *
         *   Error: Could not load image because of Failed to execute
         *   'getImageData' on 'CanvasRenderingContext2D': The canvas has been
         *   tainted by cross-origin data.. Please make sure to use a supported
         *   image type such as PNG or JPEG. Note that SVGs are not supported.
         *
         * followed by warnings such as:
         *
         *   Image "swimming_pool_11" could not be loaded. Please make sure you
         *   have added the image with map.addImage() or a "sprite" property in
         *   your style. You can provide missing images by listening for the
         *   "styleimagemissing" map event.
         *
         * Instead, we will fetch the style in the |init| method and remove
         * references to icons.
         */
        super({ center, container, minZoom: 14, pitch: 60, zoom: 17 });
    }

    /**
     * Initializes the map by fetching its style and adding the vehicle and route layers.
     * It will use the OSM-bright map style
     * @see https://github.com/openmaptiles/osm-bright-gl-style.git
     */
    async init() {

        /* Let's fetch the OSM-bright style from the French open-data site */
        const url = 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json';
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('could not fetch style');

        /* remove any reference to icons */
        const style = await response.json();
        style.layers = style.layers.filter(layer =>
            !(layer.layout && layer.layout['icon-image']) &&
            !(layer.paint && layer.paint['fill-pattern']));
        delete style.sprite;

        /* finally set the map style */
        this.setStyle(style);

        /* wait for the map to be loaded */
        await new Promise((resolve, reject) => this.on('load', resolve));

        /* add a vehicle source */
        this.addSource('vehicles', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [],
            },
        });

        /* add a vehicle layer */
        this.addLayer({
            'id': 'vehicles',
            'type': 'fill-extrusion',
            'source': 'vehicles',
            'layout': {},
            'paint': {
                'fill-extrusion-opacity': 0.8,
                'fill-extrusion-color': ['get', 'color'],
                'fill-extrusion-height': ['get', 'height']
            }
        });

        /* add a route source */
        this.addSource('routes', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [],
            },
        });

        /* add a route layer */
        this.addLayer({
            'id': 'routes',
            'type': 'line',
            'source': 'routes',
            'layout': {},
            'paint': {
                'line-color': ['get', 'color'],
                'line-width': 5,
                'line-opacity': 0.5
            }
        });

        this.addLayer({
            'id': 'building-3d',
            'type': 'fill-extrusion',
            'source': 'openmaptiles',
            'source-layer': 'building',
            'filter': ['!has', 'hide_3d'],
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-extrusion-base': {
                    'property': 'render_min_height',
                    'type': 'identity'
                },
                'fill-extrusion-color': [
                    'case',
                    ['has', 'colour'],
                    ['get', 'colour'],
                    'hsl(39, 41%, 86%)'
                ],
                'fill-extrusion-height': {
                    'property': 'render_height',
                    'type': 'identity'
                },
                'fill-extrusion-opacity': 0.6
            }
        });
    }

    /**
     * Method to optionally add a 3D building layer to the map
     */
    toggle3D() {
        const oldVisibility = this.getLayoutProperty('building-3d', 'visibility');
        const newVisibility = oldVisibility === 'visible' ? 'none' : 'visible';
        this.setLayoutProperty('building-3d', 'visibility', newVisibility);
    }

    /**
     * Set the vehicle data
     * @param data - a GeoJSON feature collection with the vehicles
     */
    setVehicles(vehicles) {
        const features = [];
        for (let vehicle of vehicles) {
            const center = point(vehicle.position);
            const W = vehicle.model.width; 
            const L = vehicle.model.length;
            /* The radius is simply given by the Pythagorean theorem */ 
            const radius = Math.sqrt((L/2)**2 + (W/2)**2)/1000; 
            /* The angle is simply given with trigonometry */
            const angle = Math.atan2(W, L) * 180/Math.PI; 
            const coords = [];
            /* Simply rotate by adding vehicule.bearing to the previous four corners */
            for (let cornerAngle of [ angle, -angle, 180+angle, 180-angle ]) {
                const corner = destination(center, radius, cornerAngle+vehicle.bearing);
                coords.push(corner.geometry.coordinates);
            }
            coords.push(coords[0]);
            const properties = { color: vehicle.color, height: vehicle.model.height };
            features.push(polygon([coords], properties));
        }
        const vehicleCollection = featureCollection(features);
        this.getSource('vehicles').setData(vehicleCollection);
    }

    /**
     * Set the route data
     * @param data - a GeoJSON feature collection with the routes
     */
    setRoutes(data) {
        this.getSource('routes').setData(data);
    }
}
