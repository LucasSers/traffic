/**
 * Model catalog which groups together models created
 * @author Lucas Sers
 */

import Util from './util';
import Model from './model';

export default class ModelCatalog {

    /**
     * List of models in the catalog
     */
    #models = [];

    /**
     * Add at the ModelCatalog a model object
     */
    add(model) {
        this.#models.push(model);
    }

    /**
     * Create a new Model and add its in model catalog
     * @param  {...any} modelFields array of models
     * @returns the model created
     */
    create(...modelFields) {
        const newModel = new Model(...modelFields);
        this.add(newModel);
        return newModel;
    }

    /**
    * Randomly pick a model from the calalog
    * @returns a random model
    */
    random() {
        return this.#models[Util.numRandom(0, this.#models.length)];
    }
}
