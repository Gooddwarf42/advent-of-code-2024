// noinspection JSSuspiciousNameCombination

import * as fs from 'fs';
import {Vector} from "../Shared/shared";

export class AOC13 {
    private _day: string = '13';
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

        let total = 0;

        for (const machine of parsedInput) {
            const result = this.horrificGaussElimination(machine);
            if (result === null) {
                continue;
            }

            total += 3 * result.aPresses + result.bPresses;
        }

        console.log(total);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        let total = 0;

        for (const machine of parsedInput) {
            const offsetConstant = 10000000000000;

            machine.prize.x += offsetConstant;
            machine.prize.y += offsetConstant;

            const result = this.horrificGaussElimination(machine);
            if (result === null) {
                continue;
            }

            total += 3 * result.aPresses + result.bPresses;
        }

        console.log(total);
    }

    private horrificGaussElimination(machine: Machine): { aPresses: number, bPresses: number } | null {
        //console.log(machine);
        // using gaussian elimination on linear system
        // buttonA.x * a  + buttonB.x * b = prize.x
        // buttonA.y * a  + buttonB.y * b = prize.y

        // I am lazy and I'll do it with all the scalars

        // multiply second row by buttonA.x
        // and first row by buttonA.y
        const secondRowMultiplier = machine.buttonA.x;
        const firstRowMultiplier = machine.buttonA.y;

        machine.buttonA.y *= secondRowMultiplier;
        machine.buttonB.y *= secondRowMultiplier;
        machine.prize.y *= secondRowMultiplier;

        machine.buttonA.x *= firstRowMultiplier;
        machine.buttonB.x *= firstRowMultiplier;
        machine.prize.x *= firstRowMultiplier;

        // perform gaussian elimination. buttonA.y now should become 0
        machine.buttonA.y -= machine.buttonA.x;
        machine.buttonB.y -= machine.buttonB.x;
        machine.prize.y -= machine.prize.x;

        if (machine.buttonA.y !== 0) {
            throw Error("I shouldn't do this linear algebra at 2am");
        }

        // solve for b if possible
        if (machine.prize.y % machine.buttonB.y !== 0) {
            console.log('no solutions!')
            return null;
        }

        const secondRowDivisor = machine.buttonB.y;
        machine.buttonB.y /= secondRowDivisor;
        machine.prize.y /= secondRowDivisor;

        const bPresses = machine.prize.y / machine.buttonB.y;

        // propagating up the result. First, multiply the second roy by buttonB.x
        const gettingBackToFirstRowMultiplier = machine.buttonB.x;
        machine.buttonB.y *= gettingBackToFirstRowMultiplier;
        machine.prize.y *= gettingBackToFirstRowMultiplier;

        // subtract it back from row 1. machine.buttonB.x should became 0
        machine.buttonB.x -= machine.buttonB.y;
        machine.prize.x -= machine.prize.y;

        // solve for a if possible
        if (machine.prize.x % machine.buttonA.x !== 0) {
            console.log('no solutions!')
            return null;
        }
        const aPresses = machine.prize.x / machine.buttonA.x;

        console.log(`Solved! a:${aPresses}, b:${bPresses}`);
        return {aPresses, bPresses};
    }

    private parseInput(input: string): Machine[] {

        const machines: Machine[] = []
        for (const rawMachine of input.split('\n\n')) {
            const lines = rawMachine.split('\n');

            const lineToVector = (line: string): Vector => {
                const split = line.split(/:\s+/);
                const data = split[1].split(/,\s+/);
                return {
                    x: parseInt(data[0].substring(2)),
                    y: parseInt(data[1].substring(2)),
                }
            }

            const machine: Machine = {
                buttonA: lineToVector(lines[0]),
                buttonB: lineToVector(lines[1]),
                prize: lineToVector(lines[2]),
            };
            machines.push(machine);
        }

        return machines;
    }

}

type Machine = { buttonA: Vector, buttonB: Vector, prize: Vector };