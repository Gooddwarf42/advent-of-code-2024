import * as fs from 'fs';
import * as Assert from "node:assert";

export class AOC06 {
    private _day: string = '06';
    private _test: boolean = false;
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
        const startingPosition = findStart(parsedInput);

        // inelegant, but will work for now
        // I actually hate this, it throws away type checks, uugh
        const visitedPositions: Set<string> = new Set([JSON.stringify(startingPosition)]);

        const guard = {direction: 'U' as Direction, position: startingPosition};

        while (true) {
            const movement = directionMap.get(guard.direction)!;
            const nextCoordinates = {
                x: guard.position.x + movement.horMovement,
                y: guard.position.y + movement.verMovement
            };
            const whatIHaveInFront = parsedInput?.[nextCoordinates.x]?.[nextCoordinates.y] as PossibleCharacters | undefined;

            if (whatIHaveInFront === '#') {
                guard.direction = nextDirection(guard.direction);
                continue;
            }

            visitedPositions.add(JSON.stringify(guard.position))
            if (whatIHaveInFront === undefined) {
                // map was exited
                break;
            }

            guard.position = nextCoordinates;
        }

        console.log(visitedPositions.size);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): string[] {
        return input.split("\n");
    }
}

type PossibleCharacters = '.' | '#' | '^';
type Direction = 'U' | 'R' | 'D' | 'L';
const directionMap: Map<Direction, { horMovement: number, verMovement: number }> = new Map([
    ['U', {horMovement: -1, verMovement: 0}],
    ['R', {horMovement: 0, verMovement: 1}],
    ['D', {horMovement: 1, verMovement: 0}],
    ['L', {horMovement: 0, verMovement: -1}],
]);

// Ew, but there are only 4 directions, it's manageable and not too ugly
const nextDirection = (direction: Direction): Direction => {
    switch (direction) {
        case 'U':
            return 'R';
        case 'R':
            return 'D';
        case 'D':
            return 'L';
        case 'L':
            return 'U';
        default:
            const shouldBeNever: never = direction;
            throw new Error('There is surely a better way to do this, I need to see how it\'s done at work');
    }
};

const findStart = (input: string[]): { x: number, y: number } => {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] === '^') {
                return {x: i, y: j};
            }
        }
    }
    throw new Error('start not found!');
}