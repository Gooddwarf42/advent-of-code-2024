import * as fs from 'fs';
import {sum} from "../Shared/shared";

export class AOC19 {
    private _day: string = '19';
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

        let possible = 0;
        for (const request of parsedInput.requests) {
            const towelsNeeded = this.minimumAmountOfTowelsNeededForThis(request, parsedInput.towels);
            if (towelsNeeded !== undefined) {
                possible++;
            }
        }

        console.log(possible);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        let combinations = 0;
        for (const request of parsedInput.requests) {
            const towelCombinations = this.possibleTowelCombinationsForThis(request, parsedInput.towels);
            if (towelCombinations !== undefined) {
                combinations += towelCombinations;
            }
        }

        console.log(combinations);
    }

    private parseInput(input: string): { towels: string[], requests: string[] } {
        const parts = input.split("\n\n");

        const towels = parts[0].split(', ');
        const requests = parts[1].split('\n');

        return {towels, requests};
    }

    private _minimumAmountOfTowelsNeededCache: Map<string, number | undefined> = new Map([['', 1]]);
    private _minimumAmountOfTowelsNeededCacheHits: number = 0;

    private _possibleTowelCombinationsCache: Map<string, number | undefined> = new Map([['', 1]]);
    private _possibleTowelCombinationsCacheHits: number = 0;

    private minimumAmountOfTowelsNeededForThis(request: string, towels: string[]): number | undefined {

        if (this._minimumAmountOfTowelsNeededCache.has(request)) {
            this._minimumAmountOfTowelsNeededCacheHits++;
            return this._minimumAmountOfTowelsNeededCache.get(request);
        }

        const setResult = (result: number | undefined): number | undefined => {
            this._minimumAmountOfTowelsNeededCache.set(request, result);
            return result;
        }

        const usableAtTheEnd = towels.filter(towel => request.endsWith(towel));
        if (usableAtTheEnd.length === 0) {
            return setResult(undefined);
        }

        const possibilities: number[] = [];
        for (const usableTowel of usableAtTheEnd) {
            const slicedRequest = request.slice(0, request.length - usableTowel.length);
            const minimumTowelsForTheRest = this.minimumAmountOfTowelsNeededForThis(slicedRequest, towels);
            if (minimumTowelsForTheRest !== undefined) {
                possibilities.push(minimumTowelsForTheRest);
            }
        }

        return possibilities.length === 0
            ? setResult(undefined)
            : setResult(Math.min(...possibilities));
    }

    private possibleTowelCombinationsForThis(request: string, towels: string[]): number | undefined {

        if (this._possibleTowelCombinationsCache.has(request)) {
            this._possibleTowelCombinationsCacheHits++;
            return this._possibleTowelCombinationsCache.get(request);
        }

        const setResult = (result: number | undefined): number | undefined => {
            this._possibleTowelCombinationsCache.set(request, result);
            return result;
        }

        const usableAtTheEnd = towels.filter(towel => request.endsWith(towel));
        if (usableAtTheEnd.length === 0) {
            return setResult(undefined);
        }

        const possibilities: number[] = [];
        for (const usableTowel of usableAtTheEnd) {
            const slicedRequest = request.slice(0, request.length - usableTowel.length);
            const minimumTowelsForTheRest = this.possibleTowelCombinationsForThis(slicedRequest, towels);
            if (minimumTowelsForTheRest !== undefined) {
                possibilities.push(minimumTowelsForTheRest);
            }
        }

        return possibilities.length === 0
            ? setResult(undefined)
            : setResult(sum(...possibilities));
    }
}