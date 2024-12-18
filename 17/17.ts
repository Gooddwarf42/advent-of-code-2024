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

        const upperBound = 40000000;
        let attemptedA = 30000000;
        let thisAIsGood = false;

        while (!thisAIsGood && attemptedA < upperBound) {
            if (attemptedA % 100000 === 0) {
                console.log(`Attempting A: ${attemptedA}`);
            }

            const outputBuffer: number[] = [];
            const state = {...parsedInput.state};
            state.A = attemptedA;

            // execute program
            while (state.PC < parsedInput.program.length) {
                const command = getCommand(parsedInput.program[state.PC]);
                command.execute(state, parsedInput.program, outputBuffer);

                if (command.opcode !== 5) {
                    continue;
                }

                // ugly way to check if it is an out command.
                // In this case we have outputted a value, so we
                // check it against the program
                const lastIndex = outputBuffer.length - 1;

                // if current value is different, break out in any case
                if (outputBuffer[lastIndex] !== parsedInput.program[lastIndex]) {
                    break;
                }

                if (outputBuffer.length < parsedInput.program.length) {
                    // we still have to do things
                    continue;
                }

                //  we are checking the last possible value amd they all are equal!
                thisAIsGood = true;
                break;
            }

            if (!thisAIsGood) {
                attemptedA++;
            }
        }

        console.log(attemptedA);
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

    public execute(state: State, program: ProgramData[], outputBuffer: number[]): void {
        this.executeInternal(state, program, outputBuffer);
        state.PC += this.pcIncrement;
    }

    protected abstract executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void;
}

class ADV extends Command {
    override opcode: ProgramData = 0;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.A = Math.floor(numerator / denominator);
    }
}

class BXL extends Command {
    override opcode: ProgramData = 1;
    override operandType: 'literal' | 'combo' = 'literal';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        state.B = state.B ^ this.getOperand(state, program);
    }
}

class BST extends Command {
    override opcode: ProgramData = 2;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        state.B = this.getOperand(state, program) % 8;
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
}

class BXC extends Command {
    override opcode: ProgramData = 4;
    override operandType: 'literal' | 'combo' = 'literal';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        state.B = state.B ^ state.C;
    }
}

class OUT extends Command {
    override opcode: ProgramData = 5;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        outputBuffer.push(this.getOperand(state, program) % 8);
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
}

class CDV extends Command {
    override opcode: ProgramData = 6;
    override operandType: 'literal' | 'combo' = 'combo';

    override executeInternal(state: State, program: ProgramData[], outputBuffer: number[]): void {
        const numerator = state.A;
        const denominator = 2 ** this.getOperand(state, program);

        state.C = Math.floor(numerator / denominator);
    }
}
