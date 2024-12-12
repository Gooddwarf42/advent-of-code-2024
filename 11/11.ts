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

        const rules = [rule1, rule2, rule3];

        console.log(this.blink(parsedInput, rules, 25).length);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');
        console.log('ACTUALLY doing part1 again');
        const parsedInput = this.parseInput(input);

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

        const rules = [rule1, rule2, rule3];

        const start = performance.now();
        let count = 0;
        for (const entry of parsedInput) {
            count += this.countStonesGeneratedFromThisAfterBlinks(entry, 25, rules);
        }
        const end = performance.now();
        console.log(`"Done. ElapsedTime: ${end - start}ms`);
        console.log(count);
    }

    private parseInput(input: string): number[] {

        return input.split(/\s+/).map(s => parseInt(s));
    }

    private blink(input: number[], rules: Rule[], times: number): number[] {
        const start = performance.now();

        let result = [...input];
        for (let i = 0; i < times; i++) {
            result = result.reduce((acc, curr) => {
                    const applicableRule = rules.find(r => r.condition(curr))
                    return acc.concat(applicableRule!.effect(curr));
                }, []
            );

            if ((i + 1) % 5 === 0) {
                const end = performance.now();
                console.log(`"blinked ${i + 1} times. Length is ${result.length} ElapsedTime: ${end - start}ms`);
            }
        }

        const end = performance.now();
        console.log(`"blinked ${times} times. ElapsedTime: ${end - start}ms`);
        return result;
    }

    private countStonesGeneratedFromThisAfterBlinks(entry: number, remainingBlinks: number, rules: Rule[]) {

        let cachedResults = this.stonesCache.get(entry);
        // initialize cachedResult[entry]
        if (cachedResults === undefined) {
            this.stonesCache.set(entry, new Map<number, number>());
            cachedResults = this.stonesCache.get(entry);
        }
        const properCachedResult = cachedResults!.get(remainingBlinks);

        if (properCachedResult !== undefined) {
            return properCachedResult;
        }


        // base case here!
        if (remainingBlinks === 0) {
            return 1;
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
            return count;
        }

        throw Error("something bad happened");
    }

    private stonesCache: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
}

type Rule = {
    condition: (ruleInput: number) => boolean,
    effect: (ruleInput: number) => number[]
};