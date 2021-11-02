/**
 * Util class regrouping reusable "tool" functions
 * @author Mehdi Sahi
 * @author Lucas Sers
 */


export default class Util {

    /*
    * Function to draw a random number
    * in a given interval (min, max)
    */
    static numRandom (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Use for compare 2 arrays
     * @param {*} a first array
     * @param {*} b second array
     * @returns true if equal,
     *          false if not
     */
    static arraysEqual(a, b) {
        /* compare the elements one by one of the tables */
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }








}