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
        const parsedInput = this.parseInput(input);

        const occurrencesInSecondColumn = this.constructOccurrencesMap(parsedInput.secondColumn);

        let similarity = 0;
        for (let i = 0; i < parsedInput.length; i++) {
            similarity += (occurrencesInSecondColumn.get(parsedInput.firstColumn[i]) ?? 0) * parsedInput.firstColumn[i];
        }

        console.log(similarity);
    }

    private parseInput(input: string): { firstColumn: number[], secondColumn: number[], length: number } {
        // Yes, I know, I could have read the stream from the file one line at the time,
        // but let me play around a bit first
        const lines = input.split('\n');

        const firstColumn: number[] = [];
        const secondColumn: number[] = [];
        lines.forEach((line) => {
            const numbers = line.split(/\s+/);
            firstColumn.push(parseInt(numbers[0]));
            secondColumn.push(parseInt(numbers[1]));
        })

        console.log('input parsed!')
        return {firstColumn, secondColumn, length: firstColumn.length};
    }

    private constructOccurrencesMap(input: number[]): Map<number, number> {
        const sortedInput = [...input].sort();
        const occurrencesInSecondColumn = new Map<number, number>();

        let previous = sortedInput[0];
        let count = 1;
        for (let i = 1; i <= sortedInput.length; i++) {
            // on last loop, current = undefined, making sure we save the last occurrences amount!
            const current: number | undefined = sortedInput[i];
            if (current === previous) {
                count++;
                continue;
            }

            // This nullable suppression annotation is safe. previous gets set to undefined only in the
            // last iteration of the loop
            occurrencesInSecondColumn.set(previous!, count);
            count = 1;
            previous = current;
        }
        return occurrencesInSecondColumn;
    }
}