import { Coordinates } from "./Coordinates"
export type Grid = {
    width : number;
    height : number;
    coordinates : Coordinates[];
    elementMap : Map<string, unknown>;
    //JSON.stringify Coordinate objects
} 
