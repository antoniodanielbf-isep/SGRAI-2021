import * as THREE from '../three/build/three.module.js';

/*
 * parameters = {
 *  color: Color,
 *  size: Vector3,
 *  dashes: Number
 * }
 */

export default class Table {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
        this.halfSize = this.size.clone().divideScalar(2.0);

        // Create the table (a bottom line, a top line and the net)

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the bottom line and the top line (two line segments)
        let points = [
            new THREE.Vector3(-this.halfSize.x, -this.halfSize.y, 0.0),
            new THREE.Vector3(this.halfSize.x, -this.halfSize.y, 0.0),
            new THREE.Vector3(-this.halfSize.x, this.halfSize.y, 0.0),
            new THREE.Vector3(this.halfSize.x, this.halfSize.y, 0.0),
        ];
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial({ color: parameters.color });
        let lines = new THREE.LineSegments(geometry, material);
        this.object.add(lines);

        /* To-do #1 - Create the net (a dashed line segment) with properties defined by the following parameters:
            - end points coordinates: (0.0, -this.halfSize.y, 0.0) and (0.0, this.halfSize.y, 0.0)
            - color: parameters.color
            - dashSize and gapSize: parameters.size.y / (2.0 * parameters.dashes - 1.0)

            - follow the instructions in this example to create the dashed line: https://threejs.org/examples/webgl_lines_dashed.html*/
        let points2 = [
            new THREE.Vector3(0, -this.halfSize.y, 0.0),
            new THREE.Vector3(0, this.halfSize.y, 0.0),
        ];

        geometry = new THREE.BufferGeometry().setFromPoints(points2);
        material = new THREE.LineDashedMaterial({color: 0xffffff,
            linewidth: 1,
            scale: 1,
            dashSize: parameters.size.y / (2.0 * parameters.dashes - 1.0),
            gapSize: parameters.size.y / (2.0 * parameters.dashes - 1.0)});
        lines = new THREE.LineSegments(geometry, material);
        lines.computeLineDistances();
        this.object.add(lines);
    }
}