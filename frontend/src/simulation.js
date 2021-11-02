/**
 * Traffic simulation file, initialize the simulation 
 * @author Johnny Cot
 * @author Lucien Prs
 */
import AddressBook from './address-book';
import VehicleCollection from './vehicle-collection';
import Clock from './clock';
import ModelCatalog from './model-catalog';

export default class Simulation {

    #addressBook = new AddressBook();
    #models = new ModelCatalog();
    #clock;
    #collection = new VehicleCollection();
    #renderer;

    /**
     * Build a Simulation and Clock for synchronizing
     */
    constructor(renderer /* map */, frequency=1 /* in Hertz */) {

        this.#renderer = renderer;
        this.#clock = new Clock(frequency);

        /* on each clock tick, update the collection */
        this.#clock.on('tick', () => this.#collection.updatePositions());

        /* when the collection has been updated, render it */
        this.#collection.on('update', vehicles => renderer.setVehicles(vehicles));
    }

    get addressBook() {
        return this.#addressBook;
    }

    get models() {
        return this.#models;
    }

    get clock() {
        return this.#clock;
    }

    get collection() {
        return this.#collection;
    }
}
