import {AOC01} from "./01/01";
import {AOC02} from "./02/02";
import {AOC03} from "./03/03";
import {AOC04} from "./04/04";
import {AOC05} from "./05/05";
import {AOC07} from "./07/07";
import {AOC08} from "./08/08";
import {AOC09} from "./09/09";
import {AOC10} from "./10/10";
import {AOC11} from "./11/11";
import {AOC12} from "./12/12";
import {AOC13} from "./13/13";
import {AOC14} from "./14/14";
import {AOC18} from "./18/18";
import {AOC19} from "./19/19";

const welcomeMessage: string = 'I\'m running, rawr!!';
//let message2: string = 4;
console.log(welcomeMessage);
const puzzle = new AOC19();
const input = puzzle.readInput();
puzzle.partOne(input);
puzzle.partTwo(input);