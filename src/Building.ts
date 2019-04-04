import Turtle from "./Turtle";
import {vec2, vec3, mat3} from 'gl-matrix';
import {vec4} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';
import Edge from "./Edge";
import Intersection from "./Intersection";
import RoadSystem from './RoadSystem';
import Drawable from "./rendering/gl/Drawable";

export default class Building {
    height : number;
    startPos : vec2;
    positions : Array<vec3> = new Array<vec3>();
    shapes : Array<vec2> = new Array<vec2>();


    constructor(height : number, startPos : vec2) {
        this.height = height;
        this.startPos = startPos;
        this.shapes.push(this.startPos);
        this.generatePositions();
    }

    generatePositions() {
        for (let y = Math.ceil(this.height); y >= 0; y--) {
            //console.log(y);
            for (let i = 0; i < this.shapes.length; i++) {
                this.positions.push(vec3.fromValues(this.shapes[i][0], y, this.shapes[i][1]));
            }
            //decide to add something
            if (Math.random() < 0.5) {
                let pos = vec2.fromValues(0.1 * (Math.random() * 2.0 - 1.0), 0.1 * (Math.random() * 2.0 - 1.0));
                vec2.add(pos, this.startPos, pos);
                this.shapes.push(pos);
            }
        }

    }

}