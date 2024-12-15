import * as fs from 'fs';
import readline from 'readline';
import {deepClone, niceModulo, printTable, VectorClass} from "../Shared/shared";

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
                .sum(robot.velocity.multiply(seconds));
            finalPosition.x = niceModulo(finalPosition.x, mapWidth);
            finalPosition.y = niceModulo(finalPosition.y, mapHeight);

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

    public async partTwo(input: string): Promise<void> {

        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        const mapWidth = this._test ? 11 : 101;
        const mapHeight = this._test ? 7 : 103;

        const map: ('.' | '#')[][] = Array(mapHeight).fill(Array(mapWidth).fill('.'));

        const moveRobot = (robot: Robot): void => {
            robot.startingPosition = robot.startingPosition
                .sum(robot.velocity);
            robot.startingPosition.x = niceModulo(robot.startingPosition.x, mapWidth);
            robot.startingPosition.y = niceModulo(robot.startingPosition.y, mapHeight);
        }

        const hasPotentialChristmasTree = (position: ('.' | '#')[][]): boolean => {
            const lines = position.map(row => row.join(''));
            return lines.some(l => l.includes('##########'))
        }

        const upperBound = 10000000000;
        let counter = 1;


        while (counter <= upperBound) {
            const mapCopy = deepClone(map);
            for (const robot of parsedInput) {
                moveRobot(robot);
                mapCopy[robot.startingPosition.y][robot.startingPosition.x] = '#';
            }

            if (hasPotentialChristmasTree(mapCopy)) {
                console.log(`This is the situation after ${counter} seconds`);
                printTable(mapCopy)

                const userInput = await askQuestionAsync('Is this a christmas tree? [y/N]')
                if (userInput.toLowerCase() === 'y') {
                    break;
                }
            }
            counter++;
        }

        console.log(counter);
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


function askQuestionAsync(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}