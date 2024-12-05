import * as fs from 'fs';

export class AOC05 {
    private _day: string = '05';
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

        console.log('TODO');
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): Gigi {

        const split = input.split('\n\n');
        const rawRules = split[0];
        const rawUpdates = split[1];

        const rules = rawRules.split('\n').map<Rule>(line => {
            const components = line.split('|').map(s => parseInt(s));
            return {first: components[0], second: components[1]};
        });
        const updates = rawUpdates.split('\n').map<number[]>(line => line.split(',').map(s => parseInt(s)));
        return {rules, updates};
    }
}

type Gigi = { rules: Rule[], updates: number[][] };
type Rule = { first: number, second: number };