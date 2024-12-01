import {AOC01} from "./01/01";

let welcomeMessage: string = 'I\'m running, rawr!!';
//let message2: string = 4;
console.log(welcomeMessage);
var puzzle = new AOC01();
const input = puzzle.readInput();
puzzle.partOne(input);
puzzle.partTwo(input);