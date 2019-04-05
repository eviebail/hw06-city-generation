import Turtle from "./Turtle";
import {vec2, vec3, mat3} from 'gl-matrix';
import {vec4} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';
import Edge from "./Edge";
import Intersection from "./Intersection";
import RoadSystem from './RoadSystem';
import Building from './Building';

export default class BuildingSystem {
    roadWidth : number;
    gridWidth : number;
    gridHeight : number;
    roadsystem : RoadSystem;
    grid : Array<number> = new Array<number>();
    positions : vec2[] = new Array<vec2>();
    buildings : Array<Building> = new Array<Building>();

    constructor(roadWidth : number, rs : RoadSystem, gridWidth : number, gridHeight : number) {
        this.roadWidth = roadWidth;
        this.roadsystem = rs;
        this.grid = this.roadsystem.buildRasterizedGrid(this.roadWidth);
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
    }

    placeBuildings() {
        // for (let i = 0; i < this.gridWidth; i++) {
        //     for (let j = 0; j < this.gridHeight; j++) {
        //         if (this.grid[i + this.gridWidth*j] == 1) {
        //             this.positions.push(vec2.fromValues(i,j));
        //         }
        //     }
        // }

        let numBuildings = 500;
        for (let i = 0; i < numBuildings; i++) {
            //generate a valid random pos
            //get population density from road system. /255
            //if math.random < this, place building
            
                let posX : number = Math.floor((Math.random()) * this.gridWidth);
                let posY : number = Math.floor((Math.random()) * this.gridHeight);

                let density = this.roadsystem.densityValue(vec3.fromValues(2.0 * (posX / this.gridWidth) - 1.0, 2.0 * (posY / this.gridHeight) - 1.0, 0.0));
                density /= 255;
                console.log(density);
                //console.log("X: " + posX + ", " + posY);
                if (Math.random() < Math.pow(density, 4.0) && this.grid[posX + this.gridWidth * posY] == 1) {
                    this.buildings.push(new Building(Math.floor(Math.pow(density, 2.0) * 4.0), vec2.fromValues(posX,posY)));
                    //this.positions.push(vec2.fromValues(posX,posY));
                }
        }
        //return this.positions;
    }
}