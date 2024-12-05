import * as fs from 'fs';

export class AOC04 {
    private _day: string = '04';
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

        const xmas = this.CountXmas(parsedInput);

        console.log(xmas);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        const xMas = this.CountXMas(parsedInput);
        console.log(xMas);
    }

    private parseInput(input: string): string[] {
        return input.split("\n");
    }

    private CountXmas(parsedInput: string[]): number {
        let count = 0;

        const isXmas = (i: number, j: number, horizontalOffset: 1 | 0 | -1, verticalOffset: 1 | 0 | -1): boolean => {
            return parsedInput[i + horizontalOffset]?.[j + verticalOffset] === 'M'
                && parsedInput[i + 2 * horizontalOffset]?.[j + 2 * verticalOffset] === 'A'
                && parsedInput[i + 3 * horizontalOffset]?.[j + 3 * verticalOffset] === 'S'
        };

        const countXmases = (i: number, j: number): number => {
            let count = 0;
            count += +isXmas(i, j, 1, 1);
            count += +isXmas(i, j, 1, 0);
            count += +isXmas(i, j, 1, -1);
            count += +isXmas(i, j, 0, 1);
            count += +isXmas(i, j, -1, 1);
            count += +isXmas(i, j, -1, 0);
            count += +isXmas(i, j, -1, -1);
            count += +isXmas(i, j, 0, -1);
            return count;
        };

        for (let i = 0; i < parsedInput.length; i++) {
            for (let j = 0; j < parsedInput[i].length; j++) {
                if (parsedInput[i][j] === 'X') {
                    count += countXmases(i, j);
                }
            }
        }

        return count;
    }

    private CountXMas(parsedInput: string[]): number {
        let count = 0;

        const isXMas = (i: number, j: number): boolean => {
            const topLeft = parsedInput[i - 1]?.[j - 1];
            const topRight = parsedInput[i + 1]?.[j - 1];
            const bottomLeft = parsedInput[i - 1]?.[j + 1];
            const bottomRight = parsedInput[i + 1]?.[j + 1];

            if (topLeft === undefined
                || topRight === undefined
                || bottomLeft === undefined
                || bottomRight === undefined) {
                return false;
            }

            const magicSequence = [topLeft, topRight, bottomRight, bottomLeft]
            const magicString = magicSequence.concat(magicSequence).join('');

            return magicString.includes("MMSS");
        };

        for (let i = 0; i < parsedInput.length; i++) {
            for (let j = 0; j < parsedInput[i].length; j++) {
                if (parsedInput[i][j] === 'A') {
                    count += +isXMas(i, j);
                }
            }
        }

        return count;
    }
}