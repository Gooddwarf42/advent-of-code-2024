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

        const add = (a: number, b: number): number => a + b;
        const multiply = (a: number, b: number): number => a * b;

        let count = 0;
        for (const line of parsedInput) {
            if (this.isSolvable(line.goal, line.operands, [add, multiply])) {
                count += line.goal;
            }
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        const add = (a: number, b: number): number => a + b;
        const multiply = (a: number, b: number): number => a * b;
        const concat = (a: number, b: number): number => parseInt(`${a}${b}`);

        let count = 0;
        for (const line of parsedInput) {
            if (this.isSolvable(line.goal, line.operands, [add, multiply, concat])) {
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


    private isSolvable(goal: number, operands: number[], operators: ((first: number, second: number) => number)[]): boolean {
        if (operands.length < 2) {
            throw Error("BAD INPUT!");
        }

        if (operands[0] > goal) {
            return false;
        }

        const newFirstOperands = operators.map(op => op(operands[0], operands[1]));

        if (operands.length === 2) {
            return newFirstOperands.includes(goal);
        }

        const tail = operands.slice(2);

        for (const newFirstOperand of newFirstOperands) {
            if (this.isSolvable(goal, [newFirstOperand, ...tail], operators)) {
                return true;
            }
        }
        return false;
    }
}