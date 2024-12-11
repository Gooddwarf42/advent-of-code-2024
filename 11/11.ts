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

        console.log(this.blink(parsedInput, rules, 75).length);
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

}

type Rule = {
    condition: (ruleInput: number) => boolean,
    effect: (ruleInput: number) => number[]
};

class ScientificNotationNumber {
    public base: number;
    public exponent: number;

    constructor(base: number, exponent: number) {
        if (base < 0.1 || base >= 1) {
            throw new RangeError("base should be between 0.1 and 1");
        }
        this.base = base;
        this.exponent = exponent;
    }

    public static toScientificNotationNumber(normalNumber: number): ScientificNotationNumber {
        let base = normalNumber
        let exponent = 0;
        while (base >= 1) {
            base = base / 10;
            exponent++;
        }
        while (base < 0.1) {
            base = base * 10;
            exponent--;
        }
        return new ScientificNotationNumber(base, exponent);
    }


    public toString() {
        return `${this.base}E${this.exponent}`
    }

    public toNumber(): number {
        return this.base * (10 ** this.exponent);
    }

    public multiply(right: ScientificNotationNumber): ScientificNotationNumber {
        let resultBase = this.base * right.base;
        let resultExponent = this.exponent + right.exponent;
        while (resultBase >= 1) {
            resultBase = resultBase / 10;
            resultExponent++;
        }
        while (resultBase < 0.1) {
            resultBase = resultBase * 10;
            resultExponent--;
        }
        return new ScientificNotationNumber(resultBase, resultExponent);
    }
}