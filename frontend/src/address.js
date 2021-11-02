/**
 * Address found thanks to queryLocations and we recover its GPS position
 * @author Mehdi Sahi
 */

import {queryLocations} from './geo';

export default class Address {

    #street;
    #city;
    #country;
    #locations;

    /**
     * Build a new Address
     * @param locations optional
     */
    constructor(street, city, country, locations=null) {
        this.#street = street;
        this.#city = city;
        this.#country = country;
        this.#locations = locations;
    }

    /**
     * Long network access to retrieve the location of the desired address
     */
    async resolve() {
        if (!this.#locations)
            this.#locations = await queryLocations(this.toString());
        else
            console.warn('address already resolved');
    }

    /**
     * Create a new address and initializes it before returning it
     * @param  {...any} addressFields array of address
     * @returns the address created
     */
    static async create(...addressFields) {
        const newAddress = new Address(...addressFields);
        await newAddress.resolve(); // accès réseau long ici
        return newAddress;
    }

    toString () {
        return `${this.#street}, ${this.#city}, ${this.#country}`;
    }

    /**
     * Retrieve the GPS coordinates of an address
     * @param {*} index optional
     * @returns array of GPS coordinates
     */
    getPosition(index=0) {
        if (!this.#locations)
            throw new Error('address not resolved');

        return [
            parseFloat(this.#locations[index].lon),
            parseFloat(this.#locations[index].lat)
        ];
    }

    /** 
     * Serialize the content of the address
     */
    serialize() {
        return {
            street: this.#street,
            city: this.#city,
            country: this.#country,
            locations: this.#locations
        };
    }
}
