import * as fs from 'fs';

export class AOC17 {
    private _day: string = '17';
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

        console.log(parsedInput);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): { state: State, program: ProgramData[] } {
        const parts = input.split("\n\n");

        const getRegisterValue = (str: string): number => {
            const splot = str.split(": ");
            return parseInt(splot[1], 10);
        }

        const registers = parts[0].split('\n');

        const state = {
            A: getRegisterValue(registers[0]),
            B: getRegisterValue(registers[1]),
            C: getRegisterValue(registers[2]),
            PC: 0
        };

        const programString = parts[1].split(': ');
        const program = programString[1].split(",").map(s => parseInt(s)) as ProgramData[];
        return {state, program};
    }

}

type ProgramData = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type State = {
    A: number,
    B: number,
    C: number,
    PC: number
}