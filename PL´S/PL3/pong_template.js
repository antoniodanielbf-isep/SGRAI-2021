// Basic Pong - 2021 JPP
// 2D modeling
// Animation
// User interaction

import * as THREE from '../three/build/three.module.js';
import { gameData, tableData, playerData, ballData } from './default_data.js';
import merge from './merge.js';
import Table from './table_template.js';
import Player from './player_template.js';
import Ball from './ball_template.js';

/*
 * gameParameters = {
 *  color: Color,
 *  position: Vector3,
 *  scale: Number,
 *  end: Number,
 *  keyCodes: { start: String, pause: String }
 * }
 *
 * tableParameters = {
 *  color: Color,
 *  size: Vector3,
 *  dashes: Number
 * }
 *
 * player1Parameters = {
 *  color: Color,
 *  side: String,
 *  size: Vector3,
 *  speed: Number,
 *  baseline: Number,
 *  keyCodes: { down: String, up: String }
 * }
 *
 * player2Parameters = {
 *  color: Color,
 *  side: String,
 *  size: Vector3,
 *  speed: Number,
 *  baseline: Number,
 *  keyCodes: { down: String, up: String }
 * }
 *
 * ballParameters = {
 *  color: Color,
 *  radius: Number,
 *  speed: Number,
 *  directionMax: Number,
 * }
 */

export default class Pong {
    constructor(gameParameters, tableParameters, player1Parameters, player2Parameters, ballParameters) {
        this.gameParameters = merge(true, gameData, gameParameters);
        this.tableParameters = merge(true, tableData, tableParameters);
        this.player1Parameters = merge(true, playerData, player1Parameters);
        this.player2Parameters = merge(true, playerData, player2Parameters);
        this.ballParameters = merge(true, ballData, ballParameters);

        // Create the game (a table, two players and a ball)

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the table
        this.table = new Table(this.tableParameters);
        this.object.add(this.table.object);

        // Create the two players
        this.player1Parameters.side = 'left';
        this.player1 = new Player(this.player1Parameters, this.table);
        this.player2Parameters.side = 'right';
        this.player2 = new Player(this.player2Parameters, this.table);

        /* To-do #4 - Add player 1 racket to the scene*/
        this.object.add(this.player1.object); 
       
        /* To-do #5 - Add player 2 racket to the scene*/
        this.object.add(this.player2.object); 

        // Create the ball
        this.ball = new Ball(this.ballParameters, this.player1, this.player2, this.table);
        this.object.add(this.ball.object);

        // Make the ball invisible
        this.ball.object.visible = false;

        // Set the game position and scale
        this.object.position.set(this.gameParameters.position.x, this.gameParameters.position.y, this.gameParameters.position.z);
        this.object.scale.set(this.gameParameters.scale, this.gameParameters.scale, 1.0);

        // Set the game state
        this.gameRunning = false;
        this.gamePaused = false;

        // Create the clock
        this.clock = new THREE.Clock(false);

        // Create two HTML <div> elements

        // Start by getting a 'parent' <div> element with the top-left corner at the center of the viewport (the origin of the coordinate system)
        const parent = document.getElementById('parent');

        // Then create a 'score' <div> element and append it as a child of 'parent'
        this.score = document.createElement('div');
        this.score.style.position = 'absolute';
        this.score.style.left = (50.0 * this.gameParameters.position.x - 50.0 * this.gameParameters.scale).toString() + 'vmin';
        this.score.style.bottom = (50.0 * this.gameParameters.position.y + 38.0 * this.gameParameters.scale).toString() + 'vmin';
        this.score.style.width = (100.0 * this.gameParameters.scale).toString() + 'vmin';
        this.score.style.fontSize = (4.0 * this.gameParameters.scale).toString() + 'vmin';
        this.score.style.color = '#' + new THREE.Color(this.gameParameters.color).getHexString();
        parent.appendChild(this.score);

        // Finally, create a 'status' <div> element and append it as a child of 'parent'
        this.status = document.createElement('div');
        this.status.style.position = 'absolute';
        this.status.style.left = (50.0 * this.gameParameters.position.x - 50.0 * this.gameParameters.scale).toString() + 'vmin';
        this.status.style.top = (-50.0 * this.gameParameters.position.y + 38.0 * this.gameParameters.scale).toString() + 'vmin';
        this.status.style.width = (100.0 * this.gameParameters.scale).toString() + 'vmin';
        this.status.style.fontSize = (1.5 * this.gameParameters.scale).toString() + 'vmin';
        this.status.style.color = '#' + new THREE.Color(this.gameParameters.color).getHexString();
        parent.appendChild(this.status);

        // Register the event handler to be called on blur
        document.addEventListener('blur', event => this.focusChange(true));

        // Register the event handler to be called on focus
        document.addEventListener('focus', event => this.focusChange(false));

        // Register the event handler to be called on key press
        document.addEventListener('keydown', event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        document.addEventListener('keyup', event => this.keyChange(event, false));

        // Display the score
        this.displayScore();

        // Display players keys
        this.displayStatus('<table>\
        <tr><th colspan = "2">Player 1</th><th colspan = "2">Player 2</th></tr>\
        <tr><td><b>Down:</b> ' + this.player1.keyCodes.down + '</td><td><b>Up:</b> ' + this.player1.keyCodes.up + '</td><td><b>Down:</b> ' + this.player2.keyCodes.down + '</td><td><b>Up:</b> ' + this.player2.keyCodes.up + '</td></tr>\
        <tr><td colspan = "4">Press ' + this.gameParameters.keyCodes.start + ' to play</td></tr>\
        </table>');
    }

    displayScore() {
        // Display the score
        this.score.innerHTML = this.player1.score + ' - ' + this.player2.score;
    }

    displayStatus(text) {
        // Display the current game state
        this.status.innerHTML = text;
    }

    focusChange(state) {
        if (this.gameRunning) {
            if (state) { // Blur
                this.gamePaused = true;
                this.clock.stop();
                this.displayStatus('<table>\
                <tr><td>Game paused</td></tr>\
                </table>');
            }
            else { // Focus
                this.displayStatus('<table>\
                <tr><td>Game paused</td></tr>\
                <tr><td>Press ' + this.gameParameters.keyCodes.pause + ' to resume</td></tr>\
                </table>');
            }
        }
    }

    keyChange(event, state) {
        // Prevent the 'Space' and 'Arrow' keys from scrolling the document's content
        if (event.code == 'Space' || event.code == 'ArrowLeft' || event.code == 'ArrowRight' || event.code == 'ArrowDown' || event.code == 'ArrowUp') {
            event.preventDefault();
        }
        if (event.code == this.player1.keyCodes.down) {
            this.player1.keyStates.down = state;
        }
        if (event.code == this.player1.keyCodes.up) {
            this.player1.keyStates.up = state;
        }
        if (event.code == this.player2.keyCodes.down) {
            this.player2.keyStates.down = state;
        }
        if (event.code == this.player2.keyCodes.up) {
            this.player2.keyStates.up = state;
        }
        // The following two cases are handled together, as the start and pause keys can be the same
        if (event.code == this.gameParameters.keyCodes.start) {
            if (event.code == this.gameParameters.keyCodes.pause) {
                if (state) {
                    if (!this.gameRunning) {
                        if (event.code == this.gameParameters.keyCodes.start) {
                            this.player1.initialize();
                            this.player2.initialize();
                            this.ball.initialize();
                            this.ball.object.visible = true; // Make the ball visible
                            this.gameRunning = true;
                            this.gamePaused = false;
                            this.clock.start();
                            this.displayScore();
                        }
                    }
                    else {
                        if (event.code == this.gameParameters.keyCodes.pause) {
                            this.gamePaused = !this.gamePaused;
                        }
                        if (this.gamePaused) {
                            this.clock.stop();
                            this.displayStatus('<table>\
                            <tr><td>Game paused</td></tr>\
                            <tr><td>Press ' + this.gameParameters.keyCodes.pause + ' to resume</td></tr>\
                            </table>');
                        }
                        else {
                            this.clock.start();
                        }
                    }
                }
            }
        }
    }

    update() {
        if (this.gameRunning && !this.gamePaused) {
            // Compute the elapsed time in seconds
            const deltaT = this.clock.getDelta();

            // Update the players
            this.player1.update(deltaT);
            this.player2.update(deltaT);

            // Update the ball
            this.ball.update(deltaT);

            /* To-do #14 - Check if a player scored
                - a player scores when the ball passes the end of the opposite side of the table
                - consider the following parameters:
                    this.ball.center.x (the ball's center X-position)
                    this.table.halfsize.x (the table's half X-dimension)
                    this.player1.score (player 1 score)
                    this.player2.score (player 2 score)

            if (...) { // Player 1 scored
                ...; // Increment player 1 score
                this.ball.initialize();
                this.displayScore();
            }
            else if (...) { // Player 2 scored
                ...; // Increment player 2 score
                this.ball.initialize();
                this.ball.direction = Math.PI - this.ball.direction; // Reverse the ball direction
                this.displayScore();
            } */

            /* To-do #15 - Check if the game is over
                - the game ends when a player's score reaches a given threshold
                - consider the following parameters:
                    this.player1.score (player 1 score)
                    this.player2.score (player 2 score)
                    this.gameParameters.end (the threshold)

            if (...) {
                this.ball.object.visible = false; // Make the ball invisible
                this.gameRunning = false;
                this.clock.stop();
                this.displayStatus('<table>\
                <tr><td>Game over. <b>Player ' + (this.player1.score == this.gameParameters.end ? '1' : '2') + '</b> wins</td></tr>\
                <tr><td>Press ' + this.gameParameters.keyCodes.start + ' to play again</td></tr>\
                </table>');
            }
            else */ {
                this.displayStatus('<table>\
                <colgroup><col style = "width: 8.33%"><col style = "width: 11.0%"><col style = "width: 8.33%"><col style = "width: 5.67%"><col style = "width: 8.33%"><col style = "width: 11.0%"><col style = "width: 8.33%"><col style = "width: 5.67%"><col style = "width: 8.33%"><col style = "width: 11.0%"><col style = "width: 8.33%"><col style = "width: 5.67%"></colgroup>\
                <tr><th colspan = "4">Player 1</th><th colspan = "4">Ball</th><th colspan = "4">Player 2</th></tr>\
                <tr><td rowspan = "2">Position:</td><td rowspan = "2">' + this.player1.center.x.toFixed(2) + ', ' + this.player1.center.y.toFixed(2) + '</td><td>Speed:</td><td>' + this.player1.speed.toFixed(2) + '</td><td>Position:</td><td>' + this.ball.center.x.toFixed(2) + ', ' + this.ball.center.y.toFixed(2) + '</td><td>Speed:</td><td>' + this.ball.speed.toFixed(2) + '</td><td rowspan = "2">Position:</td><td rowspan = "2">' + this.player2.center.x.toFixed(2) + ', ' + this.player2.center.y.toFixed(2) + '</td><td>Speed:</td><td>' + this.player2.speed.toFixed(2) + '</td></tr>\
                <tr><td>Size:</td><td>' + this.player1.size.y.toFixed(2) + '</td><td>Direction:</td><td>' + THREE.MathUtils.radToDeg(this.ball.direction).toFixed(2) + '°</td><td>Spin:</td><td>0.00°</td><td>Size:</td><td>' + this.player2.size.y.toFixed(2) + '</td></tr>\
                </table>');
            }
        }
    }
}