import * as fs from 'fs';
import {assertNever} from "../Shared/shared";

export class AOC17 {
    private _day: string = '17';
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

        console.log(parsedInput);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): { state: State, program: ProgramData[] } {
        const parts = input.split("\n\n");

        const getRegisterValue = (str: string): number => {
            const splot = str.split(": ");
            return parseInt(splot[1], 10);
        }

        const registers = parts[0].split('\n');

        const state = {
            A: getRegisterValue(registers[0]),
            B: getRegisterValue(registers[1]),
            C: getRegisterValue(registers[2]),
            PC: 0
        };

        const programString = parts[1].split(': ');
        const program = programString[1].split(",").map(s => parseInt(s)) as ProgramData[];
        return {state, program};
    }

}

type ProgramData = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type State = {
    A: number,
    B: number,
    C: number,
    PC: number
}

function getComboOperandValue(operand: ProgramData, state: State): number {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand as number;
        case 4:
            return state.A;
        case 5:
            return state.B;
        case 6:
            return state.C;
        case 7:
            throw Error('Reserved combo operand');
        default:
            assertNever(operand);
    }
}

abstract class Command {
    abstract opcode: ProgramData;
    abstract operandType: 'literal' | 'combo';
    protected pcIncrement: number = 2;

    protected getOperand(state: State, program: ProgramData[]): number {
        const operand = program[state.PC + 1];
        switch (this.operandType) {
            case 'literal':
                return operand;
            case 'combo':
                return getComboOperandValue(operand, state);
            default:
                assertNever(this.operandType);
        }
    }

    public execute(state: State, program: ProgramData[]): void {
        this.executeInternal(state, program);
        state.PC += this.pcIncrement;
    }

    protected abstract executeInternal(state: State, program: ProgramData[]): void;
}

class ADV extends Command {
    override opcode: ProgramData = 0;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.A = Math.floor(denominator / numerator);
    }
}

class BXL extends Command {
    override opcode: ProgramData = 1;
    override operandType: 'literal' | 'combo' = 'literal';

    override executeInternal(state: State, program: ProgramData[]): void {
        state.B = state.B ^ this.getOperand(state, program);
    }
}

class BST extends Command {
    override opcode: ProgramData = 2;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[]): void {
        state.B = this.getOperand(state, program) % 8;
    }
}


class JNZ extends Command {
    override opcode: ProgramData = 3;
    override operandType: 'literal' | 'combo' = 'literal';
    override pcIncrement: number = 0;

    override executeInternal(state: State, program: ProgramData[]): void {
        if (state.A === 0) {
            state.PC += 2; // we do this manually for the special case where we do not jump
            return;
        }

        state.PC = this.getOperand(state, program);
    }
}

class BXC extends Command {
    override opcode: ProgramData = 4;
    override operandType: 'literal' | 'combo' = 'literal';

    override executeInternal(state: State, program: ProgramData[]): void {
        state.B = state.B ^ state.C;
    }
}

class OUT extends Command {
    override opcode: ProgramData = 5;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[]): void {
        // TODO;
        console.log(this.getOperand(state, program) % 8);
    }
}

class BDV extends Command {
    override opcode: ProgramData = 6;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.B = Math.floor(denominator / numerator);
    }
}

class CDV extends Command {
    override opcode: ProgramData = 6;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.C = Math.floor(denominator / numerator);
    }
}
