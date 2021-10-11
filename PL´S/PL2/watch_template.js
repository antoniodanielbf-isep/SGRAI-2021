// Basic Watch - 2021 JPP
// 2D modeling
// Basic animation
// Transformations

import * as THREE from '../three/build/three.module.js';

export default class Watch {
    constructor(cityName, center = new THREE.Vector3(0.0, 0.0, 0.0), radius = 0.75, nameBackgroundColor = 0xffffff, nameForegroundColor = 0x000000, dialColor = 0x000000, markersColor = 0xffffff, handsHMColor = 0xffffff, handSColor = 0xff0000) {
        this.cities = [
            {name: 'Porto', timeZone: 0},
            {name: 'Paris', timeZone: 1},
            {name: 'Helsinki', timeZone: 2},
            {name: 'Beijing', timeZone: 7},
            {name: 'Tokyo', timeZone: 8},
            {name: 'Sydney', timeZone: 9},
            {name: 'Los Angeles', timeZone: -8},
            {name: 'New York', timeZone: -5},
            {name: 'Rio de Janeiro', timeZone: -4},
            {name: 'Reykjavik', timeZone: -1}
        ]

        this.cityIndex = 0;
        const numberOfCities = this.cities.length;
        while (this.cityIndex < numberOfCities && cityName != this.cities[this.cityIndex].name) {
            this.cityIndex++;
        }
        if (this.cityIndex == numberOfCities) {
            this.cityIndex = 0
        }

        // Create the watch (a dial, sixty markers, an hour hand, a minute hand and a second hand)

        // Create a group of objects
        this.object = new THREE.Group();

        /* To-do #1 - Create the dial (a circle) with properties defined by the following parameters and constant:
            - radius: radius
            - segments: 64
            - color: dialColor

            - follow the instructions in this example to create the circle: https://threejs.org/docs/api/en/geometries/CircleGeometry.html */

        let geometry = new THREE.CircleGeometry(radius, 60);
        let material = new THREE.MeshBasicMaterial({color: 0x333333});
        this.object.dial = new THREE.Mesh(geometry, material);
        this.object.add(this.object.dial);

        /* To-do #2 - Create the sixty markers (sixty line segments) as follows:
            - start by considering three imaginary circles centered on the origin of the coordinate system, with radii defined by the following parameters: radius0, radius1 and radius2
            - each of the twelve main markers is a line segment connecting a point on the first circle to the corresponding point on the third
            - the remaining markers are line segments connecting points on the second circle to the equivalent points on the third
            - the segments color is defined by parameter markersColor
            - use a for () loop
            - use the parametric form of the circle equation to compute the points coordinates:*/
        //let x = r * cos(t) + x0
        //let y = r * sin(t) + y0
        //let z = z0;

        /*     where:
               - (x, y, z) are the point coordinates
               - (x0, y0, z0) = (0.0, 0.0, 0.0) are the center coordinates
               - r is the radius
               - t is a parametric variable in the range 0.0 <= t < 2.0 * π (pi)
           - don't forget that angles must be expressed in radians (180.0 degrees = π radians)
           - follow the instructions in this example to create the line segments: https://threejs.org/docs/api/en/objects/Line.html
           - note, however, that instead of making use of class Line you should use class LineSegments: https://threejs.org/docs/api/en/objects/LineSegments.html

       const radius0 = 0.85 * radius;
       const radius1 = 0.90 * radius;
       const radius2 = 0.95 * radius; */
        const radius0 = 0.85 * radius;
        const radius1 = 0.90 * radius;
        const radius2 = 0.95 * radius;
        let points = [];
        let x0 = 0;
        let y0 = 0;
        let z = 0;

        let t = 0;

        let x1;
        let y1;
        let x2;
        let y2;

        for (let i = 0; i < 60; i++) {
            x1 = radius2 * Math.cos(t) + x0;
            y1 = radius2 * Math.sin(t) + y0;

            x2 = radius1 * Math.cos(t) + x0;
            y2 = radius1 * Math.sin(t) + y0;
            points.push(new THREE.Vector3(x1, y1, z));
            points.push(new THREE.Vector3(x2, y2, z));
            t += Math.PI * 2 / 60;
        }

        for (let i = 0; i < 12; i++) {
            x1 = radius2 * Math.cos(t) + x0;
            y1 = radius2 * Math.sin(t) + y0;

            x2 = radius0 * Math.cos(t) + x0;
            y2 = radius0 * Math.sin(t) + y0;
            points.push(new THREE.Vector3(x1, y1, z));
            points.push(new THREE.Vector3(x2, y2, z));
            t += Math.PI * 2 / 12;
        }

        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({color: markersColor});

        this.object.markers = new THREE.LineSegments(geometry, material);
        this.object.add(this.object.markers);
        /* ...
        geometry = new THREE.BufferGeometry()...;
        material = new THREE.LineBasicMaterial(...);
        this.object.markers = new THREE.LineSegments(...);
        this.object.add(this.object.markers); */

        /* To-do #3: Create the hour hand (a line segment) with length 0.5 * radius, pointing at 0.0 radians (the positive X-semiaxis) and color handsHMColor
        points = [...];
        geometry = new THREE.BufferGeometry()...;
        material = new THREE.LineBasicMaterial(...);
        this.object.handH = new THREE.LineSegments(...);
        this.object.add(this.object.handH); */

        /* To-do #4: Create the minute hand (a line segment) with length 0.7 * radius, pointing at 0.0 radians (the positive X-semiaxis) and color handsHMColor
        points = [...];
        geometry = new THREE.BufferGeometry()...;
        this.object.handM = new THREE.LineSegments(...);
        this.object.add(this.object.handM); */

        // Create the second hand (a line segment and a circle) pointing at 0.0 radians (the positive X-semiaxis)

        // Create a subgroup of objects
        this.object.handS = new THREE.Group();

        // Create the line segment
        points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.8 * radius, 0.0, 0.0)];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({color: handSColor});
        let handS = new THREE.LineSegments(geometry, material);
        this.object.handS.add(handS);

        // Create the circle
        geometry = new THREE.CircleGeometry(0.03 * radius, 16);
        material = new THREE.MeshBasicMaterial({color: handSColor});
        handS = new THREE.Mesh(geometry, material);
        this.object.handS.add(handS);

        this.object.add(this.object.handS);

        // Create a subgroup of objects
        this.object.handM = new THREE.Group();

        // Create the line segment
        points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.7 * radius, 0.0, 0.0)];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({color: handsHMColor});//handsHMColor
        let handM = new THREE.LineSegments(geometry, material);
        this.object.handM.add(handM);

        this.object.add(this.object.handM);

        // Create a subgroup of objects
        this.object.handH = new THREE.Group();

        // Create the line segment
        points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.5 * radius, 0.0, 0.0)];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({color: handsHMColor});
        let handH = new THREE.LineSegments(geometry, material);
        this.object.handH.add(handH);

        this.object.add(this.object.handH);

        // Set the watch position
        this.object.position.set(center.x, center.y, center.z);

        // Create one HTML <div> element

        // Start by getting a 'parent' <div> element with the top-left corner at the center of the viewport (the origin of the coordinate system)
        const parent = document.getElementById('parent');

        // Then create a 'label' <div> element and append it as a child of 'parent'
        this.label = document.createElement('div');
        this.label.style.position = 'absolute';
        this.label.style.left = (50.0 * center.x - 30.0 * radius).toString() + 'vmin';
        this.label.style.top = (-50.0 * center.y + 54.0 * radius).toString() + 'vmin';
        this.label.style.width = (60.0 * radius).toString() + 'vmin';
        this.label.style.fontSize = (8.0 * radius).toString() + 'vmin';
        this.label.style.backgroundColor = '#' + new THREE.Color(nameBackgroundColor).getHexString();
        this.label.style.color = '#' + new THREE.Color(nameForegroundColor).getHexString();
        this.label.innerHTML = this.cities[this.cityIndex].name;
        parent.appendChild(this.label);
    }

    update() {
        const time = Date().split(' ')[4].split(':').map(Number); // Hours: time[0]; minutes: time[1]; seconds: time[2]
        time[0] = (time[0] + this.cities[this.cityIndex].timeZone) % 12;
        // Compute the second hand angle
        let angle = Math.PI / 2.0 - 2.0 * Math.PI * time[2] / 60.0;
        this.object.handS.rotation.z = angle;

        /* To-do #5 - Compute the minute hand angle. It depends mostly on the current minutes value (time[1]), but you will get a more accurate result if you make it depend on the seconds value (time[2]) as well. */
        angle = Math.PI / 2.0 - 2.0 * Math.PI * (time[1] / 60 + time[2] / 3600.0);
        this.object.handM.rotation.z = angle;

        /* To-do #6 - Compute the hour hand angle. It depends mainly on the current hours value (time[0]). Nevertheless, you will get a much better result if you make it also depend on the minutes and seconds values (time[1] and time[2] respectively).*/
        angle = Math.PI / 2.0 - 2.0 * Math.PI * (time[0] / 12 + time[1] / 720 + time[2] / 43200.0);
        this.object.handH.rotation.z = angle;
    }
}