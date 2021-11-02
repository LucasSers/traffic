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

import { destination, point, polygon, toMercator} from '@turf/turf';

export default class CarCanvas {

    static CANVAS_WIDTH = 600;
    static CANVAS_HEIGHT = 400;
    static SCALE = 1;

    constructor(center) {
        this.xy = toMercator(center);
        this.canvas = document.createElement('canvas');
        this.canvas.width = CarCanvas.CANVAS_WIDTH;
        this.canvas.height = CarCanvas.CANVAS_HEIGHT;
        document.body.appendChild(this.canvas);
    }

    setVehicles(vehicles) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let car of vehicles) {
            const center = point(car.position);
            const radius = .01;
            let first = true;
            ctx.fillStyle = car.color;
            ctx.beginPath();
            for (let angle of [ 45, -45, 225, 135 ]) {
                const corner = destination(center, radius, angle);
                const mercator = toMercator(corner.geometry.coordinates);
                const coords = [
                    CarCanvas.SCALE*(mercator[0]-this.xy[0])+this.canvas.width/2,
                    CarCanvas.SCALE*(mercator[1]-this.xy[1])+this.canvas.height/2
                ];
                if (first) {
                    ctx.moveTo(...coords);
                    first = false;
                }
                else
                    ctx.lineTo(...coords);
            }
            ctx.fill();
        }
    }
}
