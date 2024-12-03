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

        console.log(this.isSafe([2, 1, 2, 5, 3, 4, 6], 1));

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
                //console.log(`${report} is safe!`)
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

    private isSafe(report: number[], levelDampers: number): boolean {
        if (report.length <= 3) {
            console.log("SHORT SEQUENCE: ")
            const safe = Math.max(...report) - Math.min(...report) <= 3;
            console.log(`${report} is ${safe}`)
            return safe;
        }

        const isReportAscending = (input: number[]): boolean => {
            let up = 0;
            let down = 0;
            for (let i = 0; i < 3; i++) {
                const diff = input[i + 1] - input[i];
                if (diff > 0) {
                    up++;
                } else {
                    down++;
                }
            }
            return up > down;
        };

        const isAscending = isReportAscending(report);
        return this.isLongReportSafe(report, levelDampers, 0, isAscending);
    }

    private isLongReportSafe(report: number[], levelDampers: number, i: number, ascending: boolean): boolean {
        if (report.length - 1 === i) {
            return true;
        }

        const handleUnsafety = (): boolean => {
            if (levelDampers === 0) {
                return false;
            }
            const reportWithoutLaterOffendingElement = report.filter((_, index) => index !== i + 1);
            const whatHappensIfIRemoveLaterOffender = this.isLongReportSafe(reportWithoutLaterOffendingElement, levelDampers - 1, i, ascending);

            const reportWithoutFormerOffendingElement = report.filter((_, index) => index !== i);
            const whatHappensIfIRemoveFormerOffender = this.isLongReportSafe(reportWithoutFormerOffendingElement, levelDampers - 1, Math.max(i - 1, 0), ascending);

            return whatHappensIfIRemoveLaterOffender || whatHappensIfIRemoveFormerOffender;
        }

        const isAscending = report[i] < report[i + 1];

        if (ascending !== undefined && ascending !== isAscending) {
            return handleUnsafety();
        }

        // check monotonicity
        const breakCondition = isAscending
            ? report[i] >= report[i + 1]
            : report[i] <= report[i + 1];

        if (breakCondition) {
            return handleUnsafety();
        }

        // check difference
        const difference = Math.abs(report[i] - report[i + 1]);
        if (difference > 3) {
            return handleUnsafety();
        }

        return this.isLongReportSafe(report, levelDampers, i + 1, isAscending);
    }

}