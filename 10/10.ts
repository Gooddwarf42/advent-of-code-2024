import * as fs from 'fs';

export class AOC10 {
    private _day: string = '10';
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

        let count = 0;
        for (let i = 0; i < parsedInput.length; i++) {
            for (let j = 0; j < parsedInput[i].length; j++) {
                const coordinates = {x: i, y: j} as Coordinate;
                const trailStarts = this.getTrailsToHere(9, coordinates, parsedInput);
                count += trailStarts.length;
            }
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): string[] {

        return input.split('\n');
    }

    private getTrailsToHere(height: number, coordinate: Coordinate, parsedInput: string[]): Coordinate[] {
        if (isOutOfBounds(coordinate, parsedInput.length, parsedInput[0].length)) {
            return [];
        }

        if (parsedInput[coordinate.x][coordinate.y] !== height.toString()) {
            return [];
        }

        if (height === 0) {
            return [coordinate];
        }

        const trails =
            this.getTrailsToHere(height - 1, move(coordinate, 1, 0), parsedInput)
                .concat(this.getTrailsToHere(height - 1, move(coordinate, 0, 1), parsedInput))
                .concat(this.getTrailsToHere(height - 1, move(coordinate, -1, 0), parsedInput))
                .concat(this.getTrailsToHere(height - 1, move(coordinate, 0, -1), parsedInput));

        const distinctTrails = trails.reduce((acc, current, index) => {
            if (!acc.some(item => item.x === current.x && item.y === current.y)) {
                acc.push(current);
            }
            return acc;
        }, [] as Coordinate[]);

        return distinctTrails;
    }
}

type Coordinate = { x: number; y: number };

function move(coordinate: Coordinate, xOffset: 1 | 0 | -1, yOffset: 1 | 0 | -1): Coordinate {
    return {x: coordinate.x + xOffset, y: coordinate.y + yOffset};
}

function isOutOfBounds(coordinate: Coordinate, rows: number, columns: number): boolean {
    return coordinate.x < 0 || coordinate.x >= rows
        || coordinate.y < 0 || coordinate.y >= columns;
}