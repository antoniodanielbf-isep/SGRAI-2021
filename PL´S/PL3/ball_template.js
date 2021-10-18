import * as THREE from '../three/build/three.module.js';

/*
 * parameters = {
 *  color: Color,
 *  radius: Number,
 *  speed: Number,
 *  directionMax: Number,
 * }
 */

export default class Ball {
    constructor(parameters, player1, player2, table) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
        this.player1 = player1;
        this.player2 = player2;
        this.table = table;

        // Create the ball (a circle)
        const geometry = new THREE.CircleGeometry(this.radius, 16);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.object = new THREE.Mesh(geometry, material);

        this.initialize();
    }

    initialize() {
        this.center = new THREE.Vector3(0.0, THREE.MathUtils.randFloatSpread(this.table.size.y - 4.0 * this.radius), 0.0);
        this.direction = THREE.MathUtils.randFloatSpread(2.0 * this.directionMax); // Direction in radians
        this.object.position.set(this.center.x, this.center.y, this.center.z);
    }

    update(deltaT) {
        /* To-do #9 - Compute the ball's new center position
            - current position: this.center
            - current speed: this.speed
            - current direction: this.direction
            - elapsed time: deltaT

            - use the parametric form of the circle equation to compute the ball's new position:
                x = r * cos(t) + x0
                y = r * sin(t) + y0
                z = z0;

                where:
                - (x, y, z) are the ball's new center coordinates
                - (x0, y0, z0) are the ball's current center coordinates
                - r = (ball speed * elapsed time) is the distance covered by the ball
                - t is the ball direction (expressed in radians)

        const coveredDistance = ...;
        const centerIncrement = new THREE.Vector3(...);
        this.center.add(...); */

        /* To-do #11 - Check if the ball hit player 1 racket
            - the hit depends on the ball direction (it must be moving to the left), ball position, ball radius, player 1 racket's position and dimension
            - more specifically, the hit depends on the following parameters:
                centerIncrement.x (the ball's X-direction, which must be negative)
                this.center.x and .y (the ball's center position)
                this.radius (the ball's radius)
                this.player1.center.x and .y (player 1 racket's center position)
                this.player1.halfSize.x and .y (player 1 racket's half dimensions)

        if (...) { // The ball is moving to the left
            if (... &&
                ... &&
                ... &&
                ...) { // The ball hit player 1 racket
                this.direction = ...; // The ball rebounds
            }
        } */

        /* To-do #12 - Check if the ball hit player 2 racket
            - the hit depends on the ball direction (it must be moving to the right), ball position, ball radius, player 2 racket's position and dimension
            - more specifically, the hit depends on the following parameters:
                centerIncrement.x (the ball's X-direction, which must be positive)
                this.center.x and .y (the ball's center position)
                this.radius (the ball's radius)
                this.player2.center.x and .y (player 2 racket's center position)
                this.player2.halfSize.x and .y (player 2 racket's half dimensions)

        else { // The ball is moving to the right
            if (... &&
                ... &&
                ... &&
                ...) { // The ball hit player 2 racket
                this.direction = ...;  // The ball rebounds
            }
        } */

        /* To-do #10 - Check if the ball hit the sidelines
            - the hit depends on the ball direction (down or up), ball position, ball radius and table dimension
            - more specifically, the hit depends on the following parameters:
                centerIncrement.y (the ball's Y-direction, negative or positive)
                this.center.y (the ball's center Y-position)
                this.radius (the ball's radius)
                this.table.halfSize.y (the table's half Y-dimension)

        if (... && ... || // The ball is moving down and hit the bottom line
            ... && ...) { // The ball is moving up and hit the top line
            this.direction = ...; // The ball rebounds
            if (centerIncrement.x < 0.0) {
                this.direction += 2.0 * Math.PI; // This is to ensure that the ball direction stays within the interval 0.0 <= direction < 2.0 * π (pi)
            }
        }

        /* To-do #13 - Set the ball's new center position:
            - x: this.center.x
            - y: this.center.y
            - z: this.center.z

        this.object.position.set(...); */
    }
}