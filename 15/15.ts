import * as fs from 'fs';
import {assertNever, printTable} from "../Shared/shared";

export class AOC15 {
    private _day: string = '15';
    private _test: boolean = true;
    private _inputFile: string = this._test
        ? `./${this._day}/testInput.txt`
        : `./${this._day}/input.txt`;

    public readInput(): string {
        const input = fs.readFileSync(this._inputFile, 'utf-8');
        console.log('input read!')
        return input;
    }

    public partOne(input: string): void {
        console.log('Solving part one...');

        const parsedInput = this.parseInput(input);

        printTable(parsedInput.map);

        for (const movement of parsedInput.movements) {
            parsedInput.state.robot.move(parsedInput.state, movement);
        }

        let count = 0;
        for (const box of parsedInput.state.boxes) {
            count += box.gpsCoordinates;
        }
        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): { map: MapTile[][], state: State, movements: Direction[] } {
        const parts = input.split('\n\n');
        const map = parts[0].split('\n').map(line => line.split('')) as MapTile[][];

        // @ts-ignore
        const state: State =
            {
                boxes: [],
                walls: [],
                all: []
            };

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] === '.') {
                    continue;
                }
                if (map[i][j] === '@') {
                    state.robot = new Robot(i, j);
                    continue;
                }
                if (map[i][j] === 'O') {
                    state.boxes.push(new Box(i, j));
                    continue;
                }
                if (map[i][j] === '#') {
                    state.walls.push(new Wall(i, j));
                    continue;
                }
            }
        }

        state.all.push(...state.boxes, ...state.walls);

        const movements = parts[1].split('\n').join('').split('') as Direction[];

        return {map, state, movements}
    }

}

type EntityType = '#' | '@' | 'O';
type Direction = '^' | '>' | 'v' | '<';
type MapTile = EntityType | '.';
type State = {
    boxes: Box[],
    walls: Wall[],
    robot: Robot,
    all: Entity[]
};

function getOffset(direction: Direction): { horMovement: number, verMovement: number } {

    switch (direction) {
        case '^':
            return {horMovement: -1, verMovement: 0};
        case '>':
            return {horMovement: 0, verMovement: 1};
        case 'v':
            return {horMovement: 1, verMovement: 0};
        case '<':
            return {horMovement: 0, verMovement: -1};
        default:
            assertNever(direction);
    }
}


abstract class Entity {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public canMove(state: State, direction: Direction): boolean {
        const offset = getOffset(direction);
        const potentialX = this.x + offset.horMovement;
        const potentialY = this.y + offset.verMovement;

        const entityInFront = state.all.find(e => e.x === potentialX && e.y === potentialY);

        return entityInFront === undefined
            ? true
            : entityInFront.canMove(state, direction);
    }

    public move(state: State, direction: Direction): void {
        const offset = getOffset(direction);
        const potentialX = this.x + offset.horMovement;
        const potentialY = this.y + offset.verMovement;

        const entityInFront = state.all.find(e => e.x === potentialX && e.y === potentialY);

        if (entityInFront === undefined) {
            // can move freely!

            this.x = potentialX;
            this.y = potentialY;
            return;
        }

        if (!entityInFront.canMove(state, direction)) {
            return;
        }

        // can move pushing the entity in front
        entityInFront.move(state, direction);
        this.x = potentialX;
        this.y = potentialY;
    }

    public get gpsCoordinates() {
        return 100 * this.x * this.y;
    }
}

class Box extends Entity {
}

class Wall extends Entity {
    canMove(state: State, direction: Direction): boolean {
        return false;
    }
}

class Robot extends Entity {
}