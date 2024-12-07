import * as fs from 'fs';

export class AOC07 {
    private _day: string = '07';
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
        for (const line of parsedInput) {
            if (this.isSolvable(line.goal, line.operands)) {
                count += line.goal;
            }
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        let count = 0;
        for (const line of parsedInput) {
            if (this.isSolvable2(line.goal, line.operands)) {
                count += line.goal;
            }
        }

        console.log(count);
    }

    private parseInput(input: string): { goal: number, operands: number[] }[] {
        const parsedInput: { goal: number, operands: number[] }[] = [];

        const lines = input.split('\n');
        for (const line of lines) {
            const split = line.split(': ');
            const goal = parseInt(split[0]);
            const operands = split[1].split(' ').map(s => parseInt(s));

            parsedInput.push({goal, operands});
        }

        return parsedInput;
    }


    // TODO introcude a factory of values and just use one method
    private isSolvable(goal: number, operands: number[]): boolean {
        if (operands.length < 2) {
            throw Error("BAD INPUT!");
        }

        if (operands[0] > goal) {
            return false;
        }

        const add = operands[0] + operands[1];
        const multiply = operands[0] * operands[1];

        if (operands.length === 2) {
            return goal === add
                || goal === multiply;
        }

        const tail = operands.slice(2);
        return this.isSolvable(goal, [add, ...tail])
            || this.isSolvable(goal, [multiply, ...tail]);
    }

    private isSolvable2(goal: number, operands: number[]): boolean {
        if (operands.length < 2) {
            throw Error("BAD INPUT!");
        }

        if (operands[0] > goal) {
            return false;
        }

        const add = operands[0] + operands[1];
        const multiply = operands[0] * operands[1];
        const concat = parseInt(`${operands[0]}${operands[1]}`);

        if (operands.length === 2) {
            return goal === add
                || goal === multiply
                || goal === concat;
        }

        const tail = operands.slice(2);
        return this.isSolvable2(goal, [add, ...tail])
            || this.isSolvable2(goal, [multiply, ...tail])
            || this.isSolvable2(goal, [concat, ...tail]);
    }
}