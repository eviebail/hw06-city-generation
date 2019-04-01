import Turtle from "./Turtle";
import {vec2, vec3, mat3} from 'gl-matrix';
import {vec4} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';
import Edge from "./Edge";
import Intersection from "./Intersection";
import RoadSystem from './RoadSystem';

export default class BuildingSystem {
    roadWidth : number;
    gridWidth : number;
    gridHeight : number;
    roadsystem : RoadSystem;
    grid : Array<number> = new Array<number>();
    positions : vec2[] = new Array<vec2>();

    constructor(roadWidth : number, rs : RoadSystem) {
        this.roadWidth = roadWidth;
        this.roadsystem = rs;
        this.grid = this.roadsystem.buildRasterizedGrid(this.roadWidth);
    }

    placeBuildings() : vec2[] {
        for (let i = 0; i < this.roadsystem.width; i++) {
            for (let j = 0; j < this.roadsystem.height; i++) {
                if (this.grid[i + this.roadsystem.width*j] == 1) {
                    this.positions.push(vec2.fromValues(i,j));
                }
            }
        }
        return this.positions;
    }
}