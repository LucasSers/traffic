/**
 * Generate a random color
 * @author Mehdi Sahi
 * @author Lucas Sers
 */

 import cssColors from 'css-color-names';
 import Util from './util';

export default class RandomCSSColorProvider {

    #colorTable;

    /**
     * Build a colorTable
     * @param {*} colorTable array of colors
     */
    constructor(colorTable) {
        this.#colorTable = colorTable;
    }

    /**
    * Randomly pick a color from the colorTable
    * @returns a random color
    */
    random() {
        if (this.#colorTable.length == 0) {
            console.log(`All colors are already used: cannot create another vehicle`);
            this.#colorTable = Object.keys(cssColors);
        }
        const heightColorTable = this.#colorTable.length;
        const indexRandomColor = Util.numRandom(0, heightColorTable);
        const randomColor = this.#colorTable[indexRandomColor];
        /* deletes the color already assigned for have unique color */
        this.#colorTable.splice(indexRandomColor, 1);
        return randomColor;
    }
}
