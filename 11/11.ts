import * as fs from 'fs';

export class AOC11 {
    private _day: string = '11';
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

        const rules = this.getRules();

        console.log('recursion with memorization version');
        const start = performance.now();

        let count = 0;
        for (const entry of parsedInput) {
            count += this.countStonesGeneratedFromThisAfterBlinks(entry, 25, rules);
        }
        const end = performance.now();
        console.log(`"Done. ElapsedTime: ${end - start}ms`);
        console.log(count);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        const rules = this.getRules();

        console.log('recursion with memorization version');
        const start = performance.now();

        let count = 0;
        for (const entry of parsedInput) {
            count += this.countStonesGeneratedFromThisAfterBlinks(entry, 75, rules);
        }
        const end = performance.now();
        console.log(`"Done. ElapsedTime: ${end - start}ms`);
        console.log(count);
    }

    private parseInput(input: string): number[] {

        return input.split(/\s+/).map(s => parseInt(s));
    }

    private getRules(): Rule[] {
        const rule1: Rule = {
            condition: ruleInput => ruleInput === 0,
            effect: () => [1]
        };
        const rule2: Rule = {
            condition: ruleInput => ruleInput.toString().length % 2 === 0,
            effect: (ruleInput) => [
                parseInt(ruleInput.toString().substring(0, ruleInput.toString().length / 2)),
                parseInt(ruleInput.toString().substring(ruleInput.toString().length / 2)),
            ]
        };
        const rule3: Rule = {
            condition: () => true,
            effect: (ruleInput) => [ruleInput * 2024]
        };

        return [rule1, rule2, rule3];
    }

    private countStonesGeneratedFromThisAfterBlinks(entry: number, remainingBlinks: number, rules: Rule[]) {

        let cachedResults = this._stonesCache.get(entry);
        // initialize cachedResult[entry]
        if (cachedResults === undefined) {
            this._stonesCache.set(entry, new Map<number, number>());
            cachedResults = this._stonesCache.get(entry);
        }
        const properCachedResult = cachedResults!.get(remainingBlinks);

        if (properCachedResult !== undefined) {
            return properCachedResult;
        }

        // base case here!
        if (remainingBlinks === 0) {
            const result = 1;
            cachedResults!.set(remainingBlinks, result);
            return result;
        }

        // meat of the logic here
        for (const rule of rules) {
            if (!rule.condition(entry)) {
                continue;
            }

            const nextStepStones = rule.effect(entry);

            let count = 0;
            for (const stone of nextStepStones) {
                count += this.countStonesGeneratedFromThisAfterBlinks(stone, remainingBlinks - 1, rules);
            }
            cachedResults!.set(remainingBlinks, count);
            return count;
        }

        throw Error("something bad happened");
    }

    private _stonesCache: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
}

type Rule = {
    condition: (ruleInput: number) => boolean,
    effect: (ruleInput: number) => number[]
};