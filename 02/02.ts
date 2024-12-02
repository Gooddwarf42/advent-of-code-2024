import * as fs from 'fs';

export class AOC02 {
    private _day: string = '02';
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
        let safeCount = 0;

        parsedInput.forEach(report => {
            if (this.isSafe(report)) {
                safeCount++;
            }
        })

        console.log(safeCount);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        console.log('TODO');
    }

    private parseInput(input: string): Array<number[]> {
        const lines = input.split('\n');

        const parsedInput: Array<number[]> = [];
        lines.forEach((line) => {
            const numbers = line.split(/\s+/);
            parsedInput.push(numbers.map(s => parseInt(s)));
        })
        console.log('input parsed!')
        return parsedInput;
    }

    private isSafe(report: number[]): boolean {
        if (report.length <= 1) {
            return true;
        }

        const isAscending = report[0] < report[1];
        for (let i = 1; i < report.length; i++) {
            // check monotonicity
            const breakCondition = isAscending
                ? report[i - 1] >= report[i]
                : report[i - 1] <= report[i];

            if (breakCondition) {
                return false;
            }

            // check difference
            const difference = Math.abs(report[i - 1] - report[i]);
            if (difference > 3) {
                return false;
            }

        }

        return true;
    }

}