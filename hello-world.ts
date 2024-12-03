import {AOC01} from "./01/01";
import {AOC02} from "./02/02";

const welcomeMessage: string = 'I\'m running, rawr!!';
//let message2: string = 4;
console.log(welcomeMessage);
const puzzle = new AOC03();
const input = puzzle.readInput();
puzzle.partOne(input);
puzzle.partTwo(input);