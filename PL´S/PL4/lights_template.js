import * as THREE from '../three/build/three.module.js';

/*
 * parameters = {
 *  ambientLight: { color: Color, intensity: Number },
 *  pointLight1: { color: Color, intensity: Number, distance: Number, position: Vector3 },
 *  pointLight2: { color: Color, intensity: Number, distance: Number, position: Vector3 },
 *  spotLight: { color: Color, intensity: Number, distance: Number, angle: Number, penumbra: Number, position: Vector3, direction: Number }
 * }
 */

export default class Lights {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the ambient light
        this.object.ambientLight = new THREE.AmbientLight(this.ambientLight.color, this.ambientLight.intensity);

        this.object.add(this.object.ambientLight);

        /* To-do #26 - Create the first point light and set its position in the scene
            - light color: this.pointLight1.color
            - light intensity: this.pointLight1.intensity
            - light distance: this.pointLight1.distance
            - light position: this.pointLight1.position.x, this.pointLight1.position.y, this.pointLight1.position.z
        this.object.pointLight1 = new ...;
        this.object.pointLight1....; */
        /* To-do #31 - Turn on shadows for this light and set its properties:
            - shadow map width: 512
            - shadow map height: 512
            - shadow camera near plane: 5.0
            - shadow camera far plane: 15.0

        this.object.pointLight1.castShadow = ...;

        // Set up shadow properties for this light
        this.object.pointLight1.shadow... = ...;
        this.object.pointLight1.shadow... = ...;
        this.object.pointLight1.shadow... = ...;
        this.object.pointLight1.shadow... = ...; */
        /* To-do #28 - Add this light to the scene
        this.object.add(...); */

        /* To-do #27 - Create the second point light and set its position in the scene
            - light color: this.pointLight2.color
            - light intensity: this.pointLight2.intensity
            - light distance: this.pointLight2.distance
            - light position: this.pointLight2.position.x, this.pointLight2.position.y, this.pointLight2.position.z
        this.object.pointLight2 = new ...;
        this.object.pointLight2....; */
        /* To-do #32 - Turn on shadows for this light and set its properties:
            - shadow map width: 512
            - shadow map height: 512
            - shadow camera near plane: 5.0
            - shadow camera far plane: 15.0

        this.object.pointLight2.castShadow = ...;

        // Set up shadow properties for this light
        this.object.pointLight2.shadow... = ...;
        this.object.pointLight2.shadow... = ...;
        this.object.pointLight2.shadow... = ...;
        this.object.pointLight2.shadow... = ...; */
        /* To-do #29 - Add this light to the scene
        this.object.add(...); */
    }
}