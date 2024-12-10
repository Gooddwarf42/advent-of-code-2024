import * as fs from 'fs';

export class AOC10 {
    private _day: string = '10';
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

        let count = 0;
        for (let i = 0; i < parsedInput.length; i++) {
            for (let j = 0; j < parsedInput[i].length; j++) {
                if (parsedInput[i][j] === '9') {
                    const trailStarts = this.countTrails(9, i, j);
                    count += trailStarts.length;
                }
            }
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): string[] {

        return input.split('\n');
    }

    private countTrails(height: number, i: number, j: number): { x: number, y: number }[] {
        return [];
    }
}