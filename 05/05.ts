import * as fs from 'fs';

export class AOC05 {
    private _day: string = '05';
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
        for (const update of parsedInput.updates) {
            if (!this.isCorrect(update, parsedInput.rules)) {
                continue;
            }

            const middle = this.getMiddleOfOddSizedArray(update);
            count += middle;
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        let count = 0;
        for (const update of parsedInput.updates) {
            if (this.isCorrect(update, parsedInput.rules)) {
                continue;
            }

            const relevantRules = parsedInput.rules.filter(r => update.includes(r.first) && update.includes(r.second));
            const theTruth = this.findTruth(relevantRules);

            // first attempt that will not work. But actually does thanks to input analysis.
            const middle = this.getMiddleOfOddSizedArray(theTruth);
            count += middle;
        }

        console.log(count);
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

    private isCorrect = (update: number[], rules: Rule[]): boolean => {
        const indexes = new Map<number, number>();
        for (const [index, pageNumber] of update.entries()) {
            indexes.set(pageNumber, index);
        }

        for (const rule of rules) {
            const firstIndex = indexes.get(rule.first);
            const secondIndex = indexes.get(rule.second);
            if (firstIndex === undefined
                || secondIndex === undefined
                || firstIndex < secondIndex) {
                continue;
            }
            return false;
        }

        return true;
    }

    private findTruth(rules: Rule[]): number[] {
        const theTruth: number [] = [];
        let copyOfRules = [...rules];

        while (copyOfRules.length > 1) {
            for (const rule of copyOfRules) {
                const rightOccurrences = copyOfRules.filter(r => r.second === rule.first).length;
                if (rightOccurrences === 0) {
                    theTruth.push(rule.first);
                    copyOfRules = copyOfRules.filter(r => r.first !== rule.first);
                    break;
                }
            }
        }
        theTruth.push(copyOfRules[0].first, copyOfRules[0].second);
        return theTruth;
    }

    private getMiddleOfOddSizedArray(array: number[]): number {
        return array[(array.length - 1) / 2];
    }
}

type Gigi = { rules: Rule[], updates: number[][] };
type Rule = { first: number, second: number };