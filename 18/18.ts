import * as fs from 'fs';

import {createBidimensionalArray, printTable} from "../Shared/shared";

export class AOC18 {
    private _day: string = '18';
    private _test: boolean = false;
    private _inputFile: string = this._test
        ? `./${this._day}/testInput.txt`
        : `./${this._day}/input.txt`;

    private get size(): number {
        return this._test ? 7 : 71;
    }

    private get bytesToFall(): number {
        return this._test ? 12 : 1024;
    }

    public readInput(): string {
        const input = fs.readFileSync(this._inputFile, 'utf-8');
        console.log('input read!')
        return input;
    }

    public partOne(input: string): void {
        console.log('Solving part one...');

        const parsedInput = this.parseInput(input);

        const map: ('.' | '#')[][] = createBidimensionalArray(this.size, this.size, '.' as ('.' | '#'));

        for (let i = 0; i < this.bytesToFall; i++) {
            map[parsedInput[i].y] [parsedInput[i].x] = '#';
        }

        printTable(map);
        const minimumPath = this.findMinimumPath(map);

        console.log(minimumPath);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): { x: number, y: number }[] {
        const result: { x: number, y: number }[] = [];
        const split = input.split("\n");

        for (const line of split) {
            const coords = line.split(",");
            result.push({x: parseInt(coords[0]), y: parseInt(coords[1])});
        }

        return result;
    }

    private findMinimumPath(map: ("." | "#")[][]): number {
        const queue: { i: number, j: number }[] = [{i: this.size - 1, j: this.size - 1}];
        const minimumPaths = createBidimensionalArray<number | undefined>(this.size, this.size, undefined);
        minimumPaths[this.size - 1][this.size - 1] = 0;

        while (queue.length > 0) {
            const dequeued = queue.shift()!;

            const minimumPathFromHere = minimumPaths[dequeued.i][dequeued.j];

            const potentialNeighbours: { i: number, j: number }[] = [
                {i: dequeued.i - 1, j: dequeued.j},
                {i: dequeued.i, j: dequeued.j + 1},
                {i: dequeued.i + 1, j: dequeued.j},
                {i: dequeued.i, j: dequeued.j - 1}
            ];

            const isValidUnvisited = (neighbour: { i: number, j: number }): boolean => {
                if (neighbour.i < 0 || neighbour.i >= this.size
                    || neighbour.j < 0 || neighbour.j >= this.size) {
                    // OOB neigbour
                    return false;
                }

                if (minimumPaths[neighbour.i][neighbour.j] !== undefined) {
                    // Already done!
                    return false;
                }

                if (map[neighbour.i][neighbour.j] === '#') {
                    // Corrupted!
                    return false;
                }

                return true;
            }

            const validUnvisitedNeigbours = potentialNeighbours.filter(n => isValidUnvisited(n));

            for (const neighbour of validUnvisitedNeigbours) {
                minimumPaths[neighbour.i][neighbour.j] = minimumPathFromHere + 1;
                queue.push(neighbour);
            }
        }


        if (minimumPaths[0][0] === undefined) {
            throw Error('AAAAAAA');
        }

        return minimumPaths[0][0]!;
    }
}