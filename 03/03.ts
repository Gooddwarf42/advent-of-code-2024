import * as fs from 'fs';

export class AOC03 {
    private _day: string = '03';
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

        let result = 0;
        for (const multiplication of parsedInput.multiplications) {
            result += multiplication.first * multiplication.second;
        }

        console.log(result);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        type FilterClause = (matchIndex: number) => boolean;
        const filterConditions: FilterClause[] = [];

        for (const dontIndex of parsedInput.dontIndices) {
            const nextDoIndex = parsedInput.doIndices.find(doIndex => doIndex > dontIndex) ?? input.length;
            const condition: FilterClause = (matchIndex: number) => matchIndex > dontIndex && matchIndex < nextDoIndex
            filterConditions.push(condition);
        }

        const filteredInput = parsedInput.multiplications.filter(mult => {
            for (const condition of filterConditions) {
                if (condition(mult.index)) {
                    return false;
                }
            }
            return true;
        });

        let result = 0;
        for (const multiplication of filteredInput) {
            result += multiplication.first * multiplication.second;
        }

        console.log(result);
    }

    private parseInput(input: string): {
        multiplications: Array<{ first: number, second: number, index: number }>,
        doIndices: number[],
        dontIndices: number[]
    } {
        const multiplications: Array<{ first: number, second: number, index: number }> = [];
        const doIndices: number[] = [-1];
        const dontIndices: number[] = [];

        const multiplicationRegex = /mul\((?<first>\d{1,3}),(?<second>\d{1,3})\)/g
        const multiplicationMatches = input.matchAll(multiplicationRegex);
        for (const match of multiplicationMatches) {
            const first = parseInt(match.groups!.first);
            const second = parseInt(match.groups!.second);
            const index = match.index;
            multiplications.push({first, second, index});
        }

        const doRegex = /do(?!n't)\(\)/g;
        const dontRegex = /don't\(\)/g;

        const doMatches = input.matchAll(doRegex);
        const dontMatches = input.matchAll(dontRegex);

        for (const match of doMatches) {
            doIndices.push(match.index);
        }

        for (const match of dontMatches) {
            dontIndices.push(match.index);
        }
        return {multiplications, doIndices, dontIndices};
    }
}