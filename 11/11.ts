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

        type Rule = {
            condition: (ruleInput: number) => boolean,
            effect: (ruleInput: number) => number[]
        };

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

        let result = [...parsedInput];
        for (let i = 0; i < 25; i++) {
            result = result.reduce((acc, curr) => {
                    const applicableRule = rules.find(r => r.condition(curr))
                    return acc.concat(applicableRule!.effect(curr));
                }, []
            );
        }

        console.log(result.length);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): number[] {

        return input.split(/\s+/).map(s => parseInt(s));
    }

}