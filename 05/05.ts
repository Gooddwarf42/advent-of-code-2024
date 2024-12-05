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

        const isCorrect = (update: number[]): boolean => {
            const indexes = new Map<number, number>();
            for (const [index, pageNumber] of update.entries()) {
                indexes.set(pageNumber, index);
            }

            for (const rule of parsedInput.rules) {
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

        let count = 0;
        for (let i = 0; i < parsedInput.updates.length; i++) {
            const update = parsedInput.updates[i];
            if (isCorrect(update)) {
                const middle = update[(update.length - 1) / 2];
                count += middle;
            }
        }

        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        const rules = parsedInput.rules;

        const rulesWithOccurrencesOnRight: (Rule & { rightOccurrences: number }) [] = [];
        for (const rule of rules) {
            const rightOccurrences = rules.filter(r => r.second === rule.first).length;
            rulesWithOccurrencesOnRight.push({...rule, rightOccurrences});
        }
        console.log(rulesWithOccurrencesOnRight);

        const theTruth: number [] = [];
        let copyOfRules = [...rules];

        while (copyOfRules.length > 0) {
            console.log(copyOfRules)
            let brokeOut = false;

            if (copyOfRules.length === 1) {
                theTruth.push(copyOfRules[0].first, copyOfRules[0].second);
                console.log("done!");
                break;
            }

            for (const rule of copyOfRules) {
                const rightOccurrences = copyOfRules.filter(r => r.second === rule.first).length;
                if (rightOccurrences === 0) {
                    console.log(rule.first + 'is good!');
                    theTruth.push(rule.first);
                    copyOfRules = copyOfRules.filter(r => r.first !== rule.first);
                    brokeOut = true;
                    break;
                }
            }

            if (!brokeOut) {
                console.log('WTF');
                console.log(copyOfRules);
                break;
            }
        }

        console.log(theTruth);
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