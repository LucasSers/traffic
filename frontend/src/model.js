/**
 * Information on the model, for dynamics calculations and displaying 
 * vehicles on the map according to the chosen model
 * @author Dorian Besre
 */
export default class Model {

    #name;
    #year;
    #brand;
    #type;
    #mass;      
    #length;    
    #width;     
    #height;    
    #brakeMaximumForce;
    #enginMaximumForce;

    /**
     * Build a Model
     * @param {*} name 
     * @param {*} year 
     * @param {*} brand 
     * @param {*} type 
     * @param {*} mass 
     * @param {*} length 
     * @param {*} width 
     * @param {*} height 
     * @param {*} brakeMaximumForce maximum force exerted by the brakes
     * @param {*} enginMaximumForce maximum driving force exerted by the engine in a forward direction
     */
    constructor (name, year, brand, type, mass, length, width, height,
                 brakeMaximumForce, enginMaximumForce) {

        /* Impossible to have negative values for a model */
        if (mass < 0.0 || length < 0.0 || width < 0.0 || height < 0.0 
            || brakeMaximumForce < 0.0 || enginMaximumForce < 0.0) {
            throw new Error('Negative value(s) detected : impossible to create a model');
        }
        this.#name = name;
        this.#year = year;
        this.#brand = brand;
        this.#type = type;
        this.#mass = mass;
        this.#length = length;
        this.#width = width;
        this.#height = height;
        this.#brakeMaximumForce = brakeMaximumForce;
        this.#enginMaximumForce = enginMaximumForce;
    }

    get name() {
        return this.#name;
    }

    get year() {
        return this.#year;
    }

    get brand() {
        return this.#brand;
    }

    get type() {
        return this.#type;
    }

    get mass() {
        return this.#mass;
    }

    get length() {
        return this.#length;
    }

    get height() {
        return this.#height;
    }

    get width() {
        return this.#width;
    }

    get enginMaximumForce() {
        return this.#enginMaximumForce;
    }

    get brakeMaximumForce() {
        return this.#brakeMaximumForce;
    }

    toString() {
        return `${this.#name} de ${this.#year}, ${this.#brand} : ${this.#type}`;
    }
}
