import * as fs from 'fs';

export class AOC19 {
    private _day: string = '19';
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

    private parseInput(input: string): { towels: Towel[], requests: Color[][] } {
        const parts = input.split("\n\n");

        const towels = parts[0].split(', ').map(rawTowel => rawTowel.split('')) as Towel[];
        const requests = parts[1].split('\n').map(rawTowel => rawTowel.split('')) as Color[][];

        return {towels, requests};
    }
}

type Color = 'r' | 'g' | 'u' | 'b' | 'w';
type Towel = Color[];