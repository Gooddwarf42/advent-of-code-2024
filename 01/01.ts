import * as fs from 'fs';

export class AOC01 {
    private _test: boolean = false;
    private _inputFile: string = this._test
        ? './01/testInput.txt'
        : './01/input.txt';

    public readInput(): string {
        const input = fs.readFileSync(this._inputFile, 'utf-8');
        console.log('input read!')
        return input;
    }

    public partOne(input: string): void {
        console.log('Solving part one...');
        const parsedInput = this.parseInput(input);
        parsedInput.firstColumn.sort();
        parsedInput.secondColumn.sort();

        let distance = 0;
        for (let i = 0; i < parsedInput.length; i++) {
            distance += Math.abs(parsedInput.firstColumn[i] - parsedInput.secondColumn[i])
        }

        console.log(distance);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');
        console.log("TODO");
    }

    private parseInput(input: string): { firstColumn: number[], secondColumn: number[], length: number } {
        // Yes, I know, I could have read the stream from the file one line at the time,
        // but let me play around a bit first
        const lines = input.split('\n');

        const firstColumn: number[] = [];
        const secondColumn: number[] = [];
        lines.forEach((line) => {
            var numbers = line.split(/\s+/);
            firstColumn.push(parseInt(numbers[0]));
            secondColumn.push(parseInt(numbers[1]));
        })

        console.log('input parsed!')
        return {firstColumn, secondColumn, length: firstColumn.length};
    }
}