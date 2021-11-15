import * as THREE from '../three/build/three.module.js';

// Shallow / deep merge objects (with the exception of Vector2, Vector3 and Vector4 objects)
export default function merge(deep, ...sources) {
    let target = {};
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
        if (deep) {
            for (let key in source) {
                const value = source[key];
                if (value instanceof Object && !(value instanceof THREE.Vector2) && !(value instanceof THREE.Vector3) && !(value instanceof THREE.Vector4)) {
                    target[key] = merge(true, target[key], value);
                }
                else {
                    target[key] = value;
                }
            }
        }
        else {
            target = Object.assign(target, source);
        }
    }
    return target;
}