import * as fs from 'fs';
import {NiceModulo, Sum, VectorClass} from "../Shared/shared";

export class AOC14 {
    private _day: string = '14';
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

        const mapWidth = this._test ? 11 : 101;
        const mapHeight = this._test ? 7 : 103;

        const widthMiddleIndex = (mapWidth - 1) / 2
        const heightMiddleIndex = (mapHeight - 1) / 2

        const checkQuadrant = (position: VectorClass): 'TL' | 'TR' | 'BL' | 'BR' | null => {
            if (position.x < 0
                || position.x >= mapWidth
                || position.y < 0
                || position.y >= mapHeight) {
                throw new Error("Invalid position");
            }

            if (position.x < widthMiddleIndex) {
                if (position.y < heightMiddleIndex) {
                    return 'TL'
                }
                if (position.y > heightMiddleIndex) {
                    return 'BL'
                }
                return null;
            }

            if (position.x > widthMiddleIndex) {
                if (position.y < heightMiddleIndex) {
                    return 'TR'
                }
                if (position.y > heightMiddleIndex) {
                    return 'BR'
                }
                return null;
            }
            return null;
        }

        const quadrantCountMap = new Map<'TL' | 'TR' | 'BL' | 'BR', number>();
        quadrantCountMap.set('TL', 0);
        quadrantCountMap.set('TR', 0);
        quadrantCountMap.set('BL', 0);
        quadrantCountMap.set('BR', 0);

        const seconds = 100;
        for (const robot of parsedInput) {

            const finalPosition = robot.startingPosition
                .Sum(robot.velocity.Multiply(seconds));
            finalPosition.x = NiceModulo(finalPosition.x, mapWidth);
            finalPosition.y = NiceModulo(finalPosition.y, mapHeight);

            const quadrant = checkQuadrant(finalPosition);
            if (quadrant === null) {
                continue;
            }

            const countToIncrement = quadrantCountMap.get(quadrant) as number;
            quadrantCountMap.set(quadrant, countToIncrement + 1)
        }


        let count = 1;
        quadrantCountMap.forEach(value => count *= value)
        console.log(count);
    }

    public partTwo(input: string): void {

        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): Robot[] {

        const robots: Robot[] = [];
        const lines = input.split('\n');

        for (const line of lines) {

            const parts = line.split(' ');

            const extractVector = (s: string): VectorClass => {
                const data = s.substring(2).split(',').map(s => parseInt(s));
                return new VectorClass(data[0], data[1]);
            };

            const robot: Robot = {
                startingPosition: extractVector(parts[0]),
                velocity: extractVector(parts[1]),
            };
            robots.push(robot);
        }

        return robots;
    }

}

type Robot = { startingPosition: VectorClass, velocity: VectorClass };