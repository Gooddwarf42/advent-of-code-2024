import * as fs from 'fs';

export class AOC08 {
    private _day: string = '08';
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

        const antennaMap = this.buildAntennaMap(parsedInput);

        const antinodes: Coordinate[] = [];

        for (const antenna of antennaMap) {
            const antennaCoordinates = antenna[1];
            const potentialAntinodes = this.getAntinodes(antennaCoordinates);

            for (const potentialAntinode of potentialAntinodes) {
                if (isOutOfBounds(potentialAntinode, parsedInput.length, parsedInput[0].length)) {
                    continue;
                }

                if (antinodes.find(a => a.x === potentialAntinode.x && a.y === potentialAntinode.y)) {
                    continue;
                }

                antinodes.push(potentialAntinode);
            }
        }

        console.log(antinodes.length);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        const antennaMap = this.buildAntennaMap(parsedInput);

        const antinodes: Coordinate[] = [];

        for (const antenna of antennaMap) {
            const antennaCoordinates = antenna[1];
            const potentialAntinodes = this.getAntinodes2(antennaCoordinates, parsedInput.length, parsedInput[0].length);

            for (const potentialAntinode of potentialAntinodes) {
                if (isOutOfBounds(potentialAntinode, parsedInput.length, parsedInput[0].length)) {
                    continue;
                }

                if (antinodes.find(a => a.x === potentialAntinode.x && a.y === potentialAntinode.y)) {
                    continue;
                }

                antinodes.push(potentialAntinode);
            }
        }

        console.log(antinodes.length);
    }

    private parseInput(input: string): string[] {
        return input.split('\n');
    }

    private buildAntennaMap(parsedInput: string[]) {
        const antennaMap: Map<string, Coordinate[]> = new Map<string, Coordinate[]>();

        for (let i = 0; i < parsedInput.length; i++) {
            for (let j = 0; j < parsedInput[i].length; j++) {
                if (parsedInput[i][j].match(antennaRegex) === null) {
                    continue;
                }

                if (!antennaMap.has(parsedInput[i][j])) {
                    antennaMap.set(parsedInput[i][j], []);
                }
                antennaMap.get(parsedInput[i][j])!.push({x: i, y: j});
            }
        }

        return antennaMap;
    }

    private getAntinodes(antennaCoordinates: Coordinate[]): Coordinate[] {

        if (antennaCoordinates.length < 2) {
            throw Error('BAD INPUT');
        }

        if (antennaCoordinates.length !== 2) {
            const antinodes: Coordinate[] = [];
            const tail = antennaCoordinates.slice(1);
            antinodes.push(...this.getAntinodes(tail));
            for (const item of tail) {
                antinodes.push(...this.getAntinodes([antennaCoordinates[0], item]));
            }
            return antinodes;
        }

        // here antennaCoordinates.length === 2
        const rowDifference = antennaCoordinates[1].x - antennaCoordinates[0].x;
        const colDifference = antennaCoordinates[1].y - antennaCoordinates[0].y;
        return [
            {x: antennaCoordinates[0].x - rowDifference, y: antennaCoordinates[0].y - colDifference},
            {x: antennaCoordinates[1].x + rowDifference, y: antennaCoordinates[1].y + colDifference}
        ];
    }

    private getAntinodes2(antennaCoordinates: Coordinate[], rowBound: number, colBound: number): Coordinate[] {

        if (antennaCoordinates.length < 2) {
            throw Error('BAD INPUT');
        }

        if (antennaCoordinates.length !== 2) {
            const antinodes: Coordinate[] = [];
            const tail = antennaCoordinates.slice(1);
            antinodes.push(...this.getAntinodes2(tail, rowBound, colBound));
            for (const item of tail) {
                antinodes.push(...this.getAntinodes2([antennaCoordinates[0], item], rowBound, colBound));
            }
            return antinodes;
        }

        // here antennaCoordinates.length === 2
        const rowDifference = antennaCoordinates[1].x - antennaCoordinates[0].x;
        const colDifference = antennaCoordinates[1].y - antennaCoordinates[0].y;

        const differenceGcd = gcd(rowDifference, colDifference);

        const simplifiedRowDifference = rowDifference / differenceGcd;
        const simplifiedColDifference = colDifference / differenceGcd;

        let position = {...antennaCoordinates[0]};
        const antinodes: Coordinate[] = [];

        while (!isOutOfBounds(position, rowBound, colBound)) {
            antinodes.push({...position})
            position.x -= simplifiedRowDifference;
            position.y -= simplifiedColDifference;
        }

        position = {...antennaCoordinates[0]};
        position.x += simplifiedRowDifference;
        position.y += simplifiedColDifference;

        while (!isOutOfBounds(position, rowBound, colBound)) {
            antinodes.push({...position})
            position.x += simplifiedRowDifference;
            position.y += simplifiedColDifference;
        }

        return antinodes;
    }
}

type Coordinate = { x: number, y: number };

const antennaRegex = /[A-Z]|[a-z]|\d/g

// chatgpt enhacned wuclideian algorithm for gcd.
// Yes I am lazy
function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a); // Ensure the result is always positive
}

function isOutOfBounds(coordinate: Coordinate, rows: number, columns: number): boolean {
    return coordinate.x < 0 || coordinate.x >= rows
        || coordinate.y < 0 || coordinate.y >= columns;
}