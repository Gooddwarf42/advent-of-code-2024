import * as fs from 'fs';
import {assertNever} from "../Shared/shared";

export class AOC17 {
    private _day: string = '17';
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
        const outputBuffer: number[] = [];

        while (parsedInput.state.PC < parsedInput.program.length) {
            const command = getCommand(parsedInput.program[parsedInput.state.PC]);
            command.execute(parsedInput.state, parsedInput.program, outputBuffer);
        }

        console.log(outputBuffer.join(','));
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        while (parsedInput.state.PC < parsedInput.program.length) {
            const command = getCommand(parsedInput.program[parsedInput.state.PC]);
            command.print(parsedInput.state, parsedInput.program);
        }
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

function getCommand(opCode: ProgramData): Command {
    switch (opCode) {
        case 0:
            return new ADV();
        case 1:
            return new BXL();
        case 2:
            return new BST();
        case 3:
            return new JNZ();
        case 4:
            return new BXC();
        case 5:
            return new OUT();
        case 6:
            return new BDV();
        case 7:
            return new CDV();
        default:
            assertNever(opCode);
    }
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

function getComboOperandString(operand: ProgramData, state: State): string {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand.toString();
        case 4:
            return 'A';
        case 5:
            return 'B';
        case 6:
            return 'C';
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

    protected getOperandString(state: State, program: ProgramData[]): string {
        const operand = program[state.PC + 1];
        switch (this.operandType) {
            case 'literal':
                return operand.toString();
            case 'combo':
                return getComboOperandString(operand, state);
            default:
                assertNever(this.operandType);
        }
    }

    public execute(state: State, program: ProgramData[], outputBuffer: number[]): void {
        this.executeInternal(state, program, outputBuffer);
        state.PC += this.pcIncrement;
    }

    public print(state: State, program: ProgramData[]): void {
        console.log(`${this.opcodeToString(state, program)} ${this.getOperandString(state, program)}`);
        state.PC += 2;
    }

    protected abstract executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void;

    protected abstract opcodeToString(state: State, program: ProgramData[]): string;
}

class ADV extends Command {
    override opcode: ProgramData = 0;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.A = Math.floor(numerator / denominator);
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "A = A / (2 ** operand)";
    }
}

class BXL extends Command {
    override opcode: ProgramData = 1;
    override operandType: 'literal' | 'combo' = 'literal';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        state.B = state.B ^ this.getOperand(state, program);
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "B = B ^";
    }
}

class BST extends Command {
    override opcode: ProgramData = 2;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        state.B = this.getOperand(state, program) % 8;
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "B = 0bx111 &";
    }
}


class JNZ extends Command {
    override opcode: ProgramData = 3;
    override operandType: 'literal' | 'combo' = 'literal';
    override pcIncrement: number = 0;

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        if (state.A === 0) {
            state.PC += 2; // we do this manually for the special case where we do not jump
            return;
        }

        state.PC = this.getOperand(state, program);
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "jnz //";
    }
}

class BXC extends Command {
    override opcode: ProgramData = 4;
    override operandType: 'literal' | 'combo' = 'literal';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        state.B = state.B ^ state.C;
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "B = B ^ C //";
    }
}

class OUT extends Command {
    override opcode: ProgramData = 5;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        outputBuffer.push(this.getOperand(state, program) % 8);
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "out";
    }
}

class BDV extends Command {
    override opcode: ProgramData = 6;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.B = Math.floor(numerator / denominator);
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "B = A / (2 ** operand)";
    }
}

class CDV extends Command {
    override opcode: ProgramData = 6;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.C = Math.floor(numerator / denominator);
    }

    protected opcodeToString(state: State, program: ProgramData[]): string {
        return "C = A / (2 ** operand)";
    }
}
