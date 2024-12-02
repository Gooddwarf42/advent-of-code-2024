import * as fs from 'fs';

export class AOC02 {
    private _day: string = '02';
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
        let safeCount = 0;

        parsedInput.forEach(report => {
            if (this.isSafe(report, 0)) {
                safeCount++;
            }
        })

        console.log(safeCount);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        let safeCount = 0;

        parsedInput.forEach(report => {
            if (this.isSafe(report, 1)) {
                safeCount++;
            }
        })

        console.log(safeCount);
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

    private isSafe(report: number[], levelDampers: number, ascending?: boolean | undefined): boolean {
        if (report.length <= 1) {
            return true;
        }

        const handleUnsafety = (): boolean => {
            if (levelDampers === 0) {
                return false;
            }
            levelDampers--;
            return this.isSafe(report.slice(1), levelDampers, isAscending);
        }

        const isAscending = report[0] < report[1];

        if (ascending !== undefined && ascending !== isAscending) {
            return handleUnsafety();
        }

        // check monotonicity
        const breakCondition = isAscending
            ? report[0] >= report[1]
            : report[0] <= report[1];

        if (breakCondition) {
            return handleUnsafety();
        }

        // check difference
        const difference = Math.abs(report[0] - report[1]);
        if (difference > 3) {
            return handleUnsafety();
        }

        // TODO check at home if I get a warning if I forget this return!
        return this.isSafe(report.slice(1), levelDampers, isAscending);
    }

}