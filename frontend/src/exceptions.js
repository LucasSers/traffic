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

/**
 * Base class for our exceptions
 */
class BaseError extends Error {
    constructor(message) {
        super(message);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}

/**
 * An exception class for fetch errors
 */
export class FetchError extends BaseError {
    /**
     * Constructs a new fetch exception.
     * @param {Response} response A fetch response
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
     */
    constructor(response) {
        super(`fetch error: ${response.statusText} route not found`);
        this.status = response.status;
        this.statusText = response.statusText;
    }
}

/**
 * An exception class for location errors
 * @author Lucas Sers
 */
 export class LocationError extends BaseError {
    /**
     * Constructs a new location exception.
     * @param {string} query The location query that triggered the exception
     */
    constructor(query) {
        super(`location error: ${query} not found, invalid`);
        this.query = query;
    }
}

/**
 * An exception class for nominatim errors
 */
export class NominatimError extends BaseError {
    /**
     * Constructs a new nominatim exception.
     * @param {string} query The nominatim query that triggered the exception
     */
    constructor(query) {
        super(`nominatim error: ${query}`);
        this.query = query;
    }
}

/**
 * An exception class for OSRM errors
 */
export class OsrmError extends BaseError {
    /**
     * Constructs a new osrm exception.
     * @param {Request} request The osrm request that triggered the exception
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
     */
    constructor(request, payload) {
        super(`osrm error: ${request}`);
        this.request = request;
        this.payload = payload;
    }
}
