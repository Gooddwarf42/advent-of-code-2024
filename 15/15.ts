import * as fs from 'fs';

export class AOC15 {
    private _day: string = '15';
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

        console.log('TODO');
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): string[] {
        return input.split("\n");
    }

}

type EntityType = '#' | '@' | 'O';
type Direction = '^' | '>' | 'v' | '<';
type MapTile = EntityType | '.';

abstract class Entity {
    public abstract entityType: EntityType;
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public canMove(map: MapTile[][], direction: Direction): boolean {

    }
}