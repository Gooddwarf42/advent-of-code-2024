import * as fs from 'fs';

export class AOC03 {
    private _day: string = '03';
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

        let result = 0;
        for (const multiplication of parsedInput) {
            result += multiplication.first * multiplication.second;
        }

        console.log(result);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): Array<{ first: number, second: number }> {
        const parsedInput: Array<{ first: number, second: number }> = [];

        const regex = /mul\((?<first>\d{1,3}),(?<second>\d{1,3})\)/g
        const matches = input.matchAll(regex);
        for (const match of matches) {
            const first = parseInt(match.groups.first);
            const second = parseInt(match.groups.second);
            parsedInput.push({first, second});
        }
        return parsedInput;
    }
}