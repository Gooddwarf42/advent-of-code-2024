import * as fs from 'fs';

export class AOC06 {
    private _day: string = '06';
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
        const startingPosition = findStart(parsedInput);

        // inelegant, but will work for now
        // I actually hate this, it throws away type checks, uugh
        const visitedPositions: Set<string> = new Set([JSON.stringify(startingPosition)]);

        const guard = {direction: 'U' as Direction, position: startingPosition};

        while (true) {
            const movement = directionMap.get(guard.direction)!;
            const nextCoordinates = {
                x: guard.position.x + movement.horMovement,
                y: guard.position.y + movement.verMovement
            };
            const whatIHaveInFront = parsedInput?.[nextCoordinates.x]?.[nextCoordinates.y] as PossibleCharacters | undefined;

            if (whatIHaveInFront === '#') {
                guard.direction = nextDirection(guard.direction);
                continue;
            }

            visitedPositions.add(JSON.stringify(guard.position))
            if (whatIHaveInFront === undefined) {
                // map was exited
                break;
            }

            guard.position = nextCoordinates;
        }

        console.log(visitedPositions.size);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        type PositionInfo = { x: number, y: number, moving: DirectionFlag }
        const parsedInput = this.parseInput(input);
        const startingPosition = {...findStart(parsedInput), moving: DirectionFlag.U} as PositionInfo;

        const traceMap: DirectionFlag[][] = Array.from({length: parsedInput.length}, () => Array(parsedInput[0].length).fill(DirectionFlag.NONE));

        const guard = {direction: DirectionFlag.U, position: startingPosition};
        traceMap[startingPosition.x][startingPosition.y] |= startingPosition.moving;

        let loopables = 0;

        while (true) {
            const movement = directionFlagMap.get(guard.direction)!;
            const nextCoordinates = {
                x: guard.position.x + movement.horMovement,
                y: guard.position.y + movement.verMovement
            };
            const whatIHaveInFront = parsedInput?.[nextCoordinates.x]?.[nextCoordinates.y] as PossibleCharacters | undefined;

            if (whatIHaveInFront === '#') {
                const nextDirection = rotateLeft<DirectionFlag>(guard.direction);
                guard.direction = nextDirection;
                guard.position.moving = nextDirection;
                traceMap[guard.position.x][guard.position.y] |= guard.position.moving;
                continue;
            }

            if (whatIHaveInFront === undefined) {
                // map was exited
                break;
            }

            // I have in front a free tile. Woudl I loop if i put an obstacle there?

            const hypotheticalGuard = {direction: rotateLeft(guard.direction), position: {...guard.position}};
            hypotheticalGuard.position.moving = hypotheticalGuard.direction; // eeewwwww I have very ill data types here...
            const hypotheticalTraceMap: DirectionFlag[][] = JSON.parse(JSON.stringify(traceMap));
            const hypotheticalMap: string[] = JSON.parse(JSON.stringify(parsedInput));
            hypotheticalMap[nextCoordinates.x] = hypotheticalMap[nextCoordinates.x].split('').splice(nextCoordinates.y, 1, '#').join('');
            while (true) {
                const loopCheckMovement = directionFlagMap.get(hypotheticalGuard.direction)!;
                const loopCheckNextCoordinates = {
                    x: hypotheticalGuard.position.x + loopCheckMovement.horMovement,
                    y: hypotheticalGuard.position.y + loopCheckMovement.verMovement
                };
                const loopCheckWhatIHaveInFront = hypotheticalMap?.[loopCheckNextCoordinates.x]?.[loopCheckNextCoordinates.y] as PossibleCharacters | undefined;

                if (loopCheckWhatIHaveInFront === '#') {
                    const loopChecknextDirection = rotateLeft<DirectionFlag>(hypotheticalGuard.direction);
                    hypotheticalGuard.direction = loopChecknextDirection;
                    hypotheticalGuard.position.moving = loopChecknextDirection;

                    if ((hypotheticalTraceMap[hypotheticalGuard.position.x][hypotheticalGuard.position.y] & hypotheticalGuard.direction) !== 0) {
                        loopables++;
                        break;
                    }

                    hypotheticalTraceMap[hypotheticalGuard.position.x][hypotheticalGuard.position.y] |= hypotheticalGuard.position.moving;
                    continue;
                }

                if (loopCheckWhatIHaveInFront === undefined) {
                    // map was exited
                    break;
                }

                hypotheticalGuard.position.x = loopCheckNextCoordinates.x;
                hypotheticalGuard.position.y = loopCheckNextCoordinates.y;

                if ((hypotheticalTraceMap[hypotheticalGuard.position.x][hypotheticalGuard.position.y] & hypotheticalGuard.direction) !== 0) {
                    loopables++;
                    break;
                }

                hypotheticalTraceMap[hypotheticalGuard.position.x][hypotheticalGuard.position.y] |= hypotheticalGuard.position.moving
            }

            guard.position.x = nextCoordinates.x;
            guard.position.y = nextCoordinates.y;
            traceMap[guard.position.x][guard.position.y] |= guard.position.moving
        }

        console.log(loopables);
    }

    private parseInput(input: string): string[] {
        return input.split("\n");
    }
}

type PossibleCharacters = '.' | '#' | '^';
type Direction = 'U' | 'R' | 'D' | 'L';
const directionMap: Map<Direction, { horMovement: number, verMovement: number }> = new Map([
    ['U', {horMovement: -1, verMovement: 0}],
    ['R', {horMovement: 0, verMovement: 1}],
    ['D', {horMovement: 1, verMovement: 0}],
    ['L', {horMovement: 0, verMovement: -1}],
]);

// Ew, but there are only 4 directions, it's manageable and not too ugly
const nextDirection = (direction: Direction): Direction => {
    switch (direction) {
        case 'U':
            return 'R';
        case 'R':
            return 'D';
        case 'D':
            return 'L';
        case 'L':
            return 'U';
        default:
            const shouldBeNever: never = direction;
            throw new Error('There is surely a better way to do this, I need to see how it\'s done at work');
    }
};

const findStart = (input: string[]): { x: number, y: number } => {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] === '^') {
                return {x: i, y: j};
            }
        }
    }
    throw new Error('start not found!');
}

// dropping additional stuff here that I need for part 2
enum DirectionFlag {
    NONE = 0,
    U = 0b0001,
    R = 0b0010,
    D = 0b0100,
    L = 0b1000
}

function rotateLeft<T extends number>(value: T, shift: number = 1, width: number = 4): T {
    const rotated =
        (
            (value << shift)
            | (value >>> (width - shift))
        )
        & ((1 << width) - 1);
    return rotated as T;
}

function rotateRight<T extends number>(value: T, shift: number = 1, width: number = 4): T {
    const rotated =
        (
            (value >>> shift)
            | (value << (width - shift))
        )
        & ((1 << width) - 1);
    return rotated as T;
}

const directionFlagMap: Map<DirectionFlag, { horMovement: number, verMovement: number }> = new Map([
    [DirectionFlag.U, {horMovement: -1, verMovement: 0}],
    [DirectionFlag.R, {horMovement: 0, verMovement: 1}],
    [DirectionFlag.D, {horMovement: 1, verMovement: 0}],
    [DirectionFlag.L, {horMovement: 0, verMovement: -1}],
]);