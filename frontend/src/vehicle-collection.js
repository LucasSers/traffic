/**
 * Allows to list all the vehicles present on the map
 * @author Lucien Prs
 * @author Lucas Sers
 */

import { EventEmitter } from 'events';
import Util from './util';
import Vehicle from './vehicle';

export default class VehicleCollection extends EventEmitter {

    #vehicles = {};

    /**
     * Create a new Vehicle and add its in vehicle collection
     * @param {*} id 
     * @param {*} color 
     * @param {*} model 
     * @param {*} address 
     * @returns the vehicle created
     */
    create(id, color, model, address) {
        const newVehicle = new Vehicle(id, color, model, address);
        this.add(id, newVehicle);
        return newVehicle;
    }

    /**
    * Randomly pick a vehicle from the collection
    * @returns a random vehicle
    */
    random() {
        /* build the list of available vehicles */
        const vehicles = Object.values(this.#vehicles);
        const randomVehicleIndex = Util.numRandom(0, vehicles.length);
        return vehicles[randomVehicleIndex];
    }

    /**
     * Update the position of each vehicule in the collection
     */
    updatePositions() {
        const vehicles = Object.values(this.#vehicles);

        for (let vehicle of vehicles)
            vehicle.updatePosition();

        this.emit('update', vehicles);
    }

    /**
     * Add at the VehicleCollection a vehicle object
     */
    add(id, vehicle) {
        this.#vehicles[id] = vehicle;
    }

    get vehicles() {
        return this.#vehicles;
    }
}
