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

import EventEmitter from "events";
import Route from './route';
import { point, rhumbBearing } from '@turf/turf';
import Simulation from "./simulation";

/* Liens Utiles
 * https://aerodynamismeautomobile.webnode.fr/les-forces-s%27exerçant-sur-une-automobile/
 * http://propulsion2.e-monsite.com/pages/partie-2/les-forces/resistance-de-l-air.html
 */

export default class Vehicle extends EventEmitter {

    #id;
    #color;
    #model;
    #route;
    #speed;
    #distance;
    #timestamp;
    #lastTimestamp
    #destination;

    /**
     * A virtual pedal whose value is between -1 and +1.
     * Positive values mean that the gas pedal is pushed
     * Negative values mean that the the brake pedal is pushed
     * A zero value means that neither are pushed.
     */
    #pedal;

    /**
     * the current position of the vehicule, as a [ longitude, latitude ] pair
     */
    #position;

    /**
     * the bearing of the vehicle, as an angle in degrees
     */
    #bearing = 0;

    /**
     * Build a Vehicle
     * @param {*} id 
     * @param {*} color 
     * @param {*} model 
     * @param {*} deliveryAddress 
     */
    constructor(id, color, model, deliveryAddress)
    {
        super();
        this.#id = id;
        this.#model = model;
        this.#color = color;
        this.#position = deliveryAddress.getPosition();
    }

    /**
     * find a route between our current position and the new destination,
     * record the current time, the destination, reset the distance
     * @param {*} destination new destination address
     */
    async driveTo(destination)
    {
        this.#route = await Route.create(this.#position, destination.getPosition());
        this.#timestamp = new Date();
        this.#destination = destination;
        this.#distance = 0;
        this.emit('route', this);
        this.#pedal = 0.2;
        this.#speed = 0.001;
    }

    /**
     * Update the cars and their dynamic values in order to move them 
     * @returns nothing if the car has no current route
     */
    updatePosition()
    {
        /* nothing to do if the car has no current route */
        if (!this.#route)
            return;

        /* get current date and compute the elapsed time since the last update */
        
        this.#lastTimestamp = this.#timestamp;
        this.#timestamp = new Date();
        const elapsedSeconds = (this.#timestamp - this.#lastTimestamp)/1000;
        

        /* driving force exerted by the engine towards the front */
        const engineForce = this.#pedal > 0 ? this.#pedal * this.model.enginMaximumForce : 0;
       
        /* force exerted by the brakes */
        const brakeForce = this.#pedal < 0 ? -this.#pedal * this.model.brakeMaximumForce  : 0;
       

        /* Compute drag force
         * https://en.wikipedia.org/wiki/Drag_equation
         * https://fr.wikipedia.org/wiki/Masse_volumique_de_l%27air
         *
         * we should find 0.3 for a normal car : 
         * for an SUV on average we have Cx = 0.38 and for a clio cx = 0.35 */
        const dragCoefficient = 0.3;
        const airDensity = 1.225;
        const referenceArea = this.model.width * this.model.height;
        const dragForce = 0.5 * airDensity * dragCoefficient * referenceArea * this.#speed * this.#speed;


        /* compute rolling-friction force
         * https://en.wikipedia.org/wiki/Rolling_resistance */
        const frictionCoefficient = 0.015;
        const gravitationalConstant  = 9.8;
        const frictionForce = frictionCoefficient * gravitationalConstant * this.model.mass;

        /* Compute the resultant force
         * https://en.wikipedia.org/wiki/Resultant_force */
        const resultantForce = engineForce - brakeForce - dragForce - frictionForce;


        /* Compute the change in speed using Newton's second law
         * https://en.wikipedia.org/wiki/Newton%27s_second_law */
        this.#speed += elapsedSeconds * resultantForce / this.model.mass;
        
        


        /* If the speed is (slightly) negative, bring it back to zero*/
        if (this.#speed < 0) {
            this.#speed = 0;
        }

        this.#distance += this.#speed * elapsedSeconds / 100;


        /* Test if the vehicle reached the end of the route */

        if (this.#distance <= this.route.length) {
            const lastPosition = this.#position;
            this.#position = this.route.positionAtKilometer(this.#distance);
            this.#bearing = rhumbBearing(point(lastPosition), point(this.#position));
        }
        else {
            this.#position = this.destination.getPosition();
            this.#distance = 0;
            this.#speed = 0;
            this.#route = null;
        }
    }

    get id() {
        return this.#id;
    }

    get color() {
        return this.#color;
    }

    get model() {
        return this.#model;
    }

    get route() {
        return this.#route;
    }

    get speed() {
        return this.#speed;
    }

    get distance() {
        return this.#distance;
    }

    get destination() {
        return this.#destination;
    }

    get pedal() {
        return this.#pedal;
    }

    /**
     * Allows you to change the value of the pedal and thus change the speed 
     * of the vehicle according to it and to calculate the dynamics
     */
    set setPedal(newPedal) {
        if (!(-1 <= newPedal && newPedal <= +1))
            throw new Error(`pedal must be between -1 and +1, ${newPedal} given`);
        this.#pedal = newPedal;
    }

    get position() {
        return this.#position;
    }

    get bearing() {
        return this.#bearing;
    }

    /**
     * Allows move vehicle to the POINT GPS indicated
     * @param {*} lon 
     * @param {*} lat 
     */
    #moveTo(lon, lat) {
        this.#position = [ lon, lat ];
    }
}
