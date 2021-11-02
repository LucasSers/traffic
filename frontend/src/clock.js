/**
 * Clock to synchronize cars on the map
 * @author Mehdi Sahi
 */

import { EventEmitter } from 'events';

export default class Clock extends EventEmitter
{
    /**
     * Clock frequency in Hertz
     */
    #frequency;

    /**
     * Internal timeout reference
     */
    #interval;

    /**
     * Build a new Clock
     * @param {*} frequency optional
     */
    constructor(frequency=1) {
        super();
        this.#frequency = frequency;  /* Hertz */
    }

    /**
     * Start the clock and vehicles start moove
     */
    start() {
        if (this.#interval)
            throw new Error('already started');
        this.emit('start');
        this.#interval = setInterval(() => this.emit('tick'), 1000/this.#frequency);
    }

    /**
     * Stop the clock and vehicles stop too
     */
    stop() {
        if (!this.#interval)
            throw new Error('not started');
        this.emit('stop');
        clearInterval(this.#interval);
        this.#interval = null;
    }

    /**
     * Frequency of the clock
     */
    get frequency() {
        return this.#frequency;
    }

    /**
     * Set the new frequency and re-start the clock to apply the changes
     */
    set frequency(frequency) {
        this.#frequency = frequency;
        this.stop();
        this.start();
    }
}
