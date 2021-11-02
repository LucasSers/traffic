/**
 * Address book which groups together addresses created
 * @author Jérémy Btry
 * @author Lucas Sers
 */

import Util from './util';
import Address from './address';

export default class AddressBook {

    /**
     * The list of addresses in the address book
     */
    #addresses = [];

    /**
     * Add at the AdressBook an address object
     */
    add(address) {
        if (!(address instanceof Address))
            throw new Error(address + 'is not an Address');
        this.#addresses.push(address);
    }

    /**
     * Create a new Address and add its in address book
     * @param  {...any} addressFields array of addresses
     * @returns the address created
     */
    async create(...addressFields) {
        const newAddress = await Address.create(...addressFields);
        this.add(newAddress);
        return newAddress;
    }

    /**
     * Randomly give an address in an address array
     * @returns a random address
     */
    random() {
        let heightAddressTable = this.#addresses.length;
        return this.#addresses[Util.numRandom(0, heightAddressTable)];
    }

    /** 
     * Serialize the content of the address book
     */
    serialize() {
        return this.#addresses.map(address => address.serialize());
    }

    /**
     * Deserialize addresses and populate the address book
     */
    deserialize(data) {
        for (let addr of data) {
            const newAddress = new Address(addr.street, addr.city, addr.country, addr.locations);
            this.add(newAddress);
        }
    }
}
