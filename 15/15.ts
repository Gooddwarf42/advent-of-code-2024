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
        printState(parsedInput.map[0].length, parsedInput.map.length, parsedInput.state);
        for (const movement of parsedInput.movements) {
            parsedInput.state.robot.move(parsedInput.state, movement);
            console.log(`Moving ${movement}:`);
            printState(parsedInput.map[0].length, parsedInput.map.length, parsedInput.state);
            console.log('');
        }

        printState(parsedInput.map[0].length, parsedInput.map.length, parsedInput.state);
        let count = 0;
        for (const box of parsedInput.state.boxes) {
            count += box.gpsCoordinates;
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        const bigState = enlargeWarehouse(parsedInput.state);
        printBigState(2 * parsedInput.map[0].length, parsedInput.map.length, bigState);

        for (const movement of parsedInput.movements) {
            bigState.robot.move(bigState, movement);
            console.log(`Moving ${movement}:`);
            printBigState(2 * parsedInput.map[0].length, parsedInput.map.length, bigState);
            console.log('');
        }

        printBigState(2 * parsedInput.map[0].length, parsedInput.map.length, bigState);

        let count = 0;
        for (const box of bigState.boxes) {
            count += box.gpsCoordinates;
        }

        console.log(count);
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
                const currentTile = map[i][j];
                if (currentTile === '.') {
                    continue;
                }
                if (currentTile === '@') {
                    state.robot = new Robot(i, j);
                    continue;
                }
                if (currentTile === 'O') {
                    state.boxes.push(new Box(i, j));
                    continue;
                }
                if (currentTile === '#') {
                    state.walls.push(new Wall(i, j));
                    continue;
                }
                assertNever(currentTile);
            }
        }

        state.all.push(...state.boxes, ...state.walls);

        const movements = parts[1].split('\n').join('').split('') as Direction[];

        return {map, state, movements}
    }

}

type EntityType = '#' | '@' | 'O';
type ExtendedEntityType = EntityType | '[]' | '##';
type Direction = '^' | '>' | 'v' | '<';
type MapTile = EntityType | '.';
type ExtendedMapTile = ExtendedEntityType | '.';
type State = {
    boxes: (Box | BigBox)[],
    walls: (Wall | BigWall)[],
    robot: Robot,
    all: Entity[]
};

function enlargeWarehouse(state: State): State {
    const boxes = state.boxes.map(b => new BigBox(b.x, 2 * b.y));
    const walls = state.walls.map(w => new BigWall(w.x, 2 * w.y));
    const robot = new Robot(state.robot.x, 2 * state.robot.y);
    const all = [];
    all.push(...boxes, ...walls);

    return {boxes, walls, robot, all}
}

function printState(width: number, height: number, state: State) {
    const map = Array.from({length: height}, () => Array(width).fill('.'));

    for (const entity of state.all) {
        map[entity.x][entity.y] = entity.character;
    }

    map[state.robot.x][state.robot.y] = state.robot.character;

    printTable(map);
}

function printBigState(width: number, height: number, state: State) {
    const map = Array.from({length: height}, () => Array(width).fill('.'));

    for (const entity of state.all) {
        // ugly
        map[entity.x][entity.y] = entity.character[0];
        map[entity.x][entity.y + 1] = entity.character[1];
    }

    map[state.robot.x][state.robot.y] = state.robot.character;

    printTable(map);
}

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
    public width: number = 1;

    public abstract character: ExtendedEntityType;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public canMove(state: State, direction: Direction): boolean {
        const offset = getOffset(direction);
        const potentialX = this.x + offset.horMovement;
        const potentialY = this.y + offset.verMovement;

        const hitsEntity = (e: Entity, x: number, y: number): boolean => {
            if (direction === ">") {
                // compensating horizontal movements
                y += (this.width - 1);
            }
            if (direction === "<") {
                // compensating horizontal movements
                y -= (this.width - 1);
            }

            return x === e.x
                && e.y <= y && y < e.y + e.width;
        }

        const entitiesInFront = state.all.filter(e => hitsEntity(e, potentialX, potentialY));

        return entitiesInFront.length === 0
            ? true
            : entitiesInFront.every(e => e.canMove(state, direction));
    }

    public move(state: State, direction: Direction): void {
        const offset = getOffset(direction);
        const potentialX = this.x + offset.horMovement;
        const potentialY = this.y + offset.verMovement;

        const hitsEntity = (e: Entity, x: number, y: number): boolean => {
            if (direction === ">") {
                // compensating horizontal movements
                y += (this.width - 1);
            }
            if (direction === "<") {
                // compensating horizontal movements
                y -= (this.width - 1);
            }

            return x === e.x
                && e.y <= y && y < e.y + e.width;
        }

        const entitiesInFront = state.all.filter(e => hitsEntity(e, potentialX, potentialY));

        if (entitiesInFront.length === 0) {
            // can move freely!

            this.x = potentialX;
            this.y = potentialY;
            return;
        }

        if (!entitiesInFront.every(e => e.canMove(state, direction))) {
            return;
        }

        // can move pushing the entity in front
        entitiesInFront.forEach(e => e.move(state, direction));
        this.x = potentialX;
        this.y = potentialY;
    }

    public get gpsCoordinates() {
        return 100 * this.x + this.y;
    }
}

class Box extends Entity {
    public character: ExtendedEntityType = 'O';
}

class Wall extends Entity {
    public character: ExtendedEntityType = '#';

    canMove(state: State, direction: Direction): boolean {
        return false;
    }
}

class BigBox extends Entity {
    public character: ExtendedEntityType = '[]';
    public width: number = 2;
}

class BigWall extends Entity {
    public character: ExtendedEntityType = '##';
    public width: number = 2;

    override canMove(state: State, direction: Direction): boolean {
        return false;
    }
}

class Robot extends Entity {
    public character: ExtendedEntityType = '@';
}