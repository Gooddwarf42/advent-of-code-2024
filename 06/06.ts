import * as fs from 'fs';
import * as Assert from "node:assert";

export class AOC06 {
    private _day: string = '06';
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

        console.log(directionMap);
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