import * as fs from 'fs';

// 1976 is not right
// 1915 con il controllo sulla starting position

// non sono 1842 (posizioni distinte, starting position esclusa

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

        function isLoop(
            guard: {
                position: { x: number; y: number; moving: DirectionFlag };
                direction: DirectionFlag
            },
            map: string[],
            traceMap: DirectionFlag[][]): boolean {

            const currentTraceMapData = traceMap?.[guard.position.x]?.[guard.position.y];
            if (currentTraceMapData === undefined) {
                // console.log("loop not found!")
                // printTraceMap(traceMap);
                return false;
            }
            if ((currentTraceMapData & guard.direction) !== 0) {
                // console.log("loop found!")
                // printTraceMap(traceMap);
                return true;
            }

            // Mark this place as visited
            traceMap[guard.position.x][guard.position.y] |= guard.position.moving

            const movement = directionFlagMap.get(guard.direction)!;
            const nextCoordinates = {
                x: guard.position.x + movement.horMovement,
                y: guard.position.y + movement.verMovement
            };
            const whatIHaveInFront = map?.[nextCoordinates.x]?.[nextCoordinates.y] as PossibleCharacters | undefined;

            if (whatIHaveInFront !== '#') {
                guard.position.x = nextCoordinates.x;
                guard.position.y = nextCoordinates.y;
                return isLoop(guard, map, traceMap);
            }

            const nextDirection = rotateLeft<DirectionFlag>(guard.direction);
            guard.direction = nextDirection;
            guard.position.moving = nextDirection;
            return isLoop(guard, map, traceMap);
        }

        type PositionInfo = { x: number, y: number, moving: DirectionFlag }
        const parsedInput = this.parseInput(input);
        const startingPosition = {...findStart(parsedInput), moving: DirectionFlag.U} as PositionInfo;

        const traceMap: DirectionFlag[][] = Array.from({length: parsedInput.length}, () => Array(parsedInput[0].length).fill(DirectionFlag.NONE));
        const cleanTraceMap: DirectionFlag[][] = Array.from({length: parsedInput.length}, () => Array(parsedInput[0].length).fill(DirectionFlag.NONE));

        const startingGuard = {direction: DirectionFlag.U, position: JSON.parse(JSON.stringify(startingPosition))};
        const guard = JSON.parse(JSON.stringify(startingGuard))

        let loopables: { x: number, y: number, str: string }[] = [];

        while (true) {
            const currentTraceMapData = traceMap?.[guard.position.x]?.[guard.position.y];
            if (currentTraceMapData === undefined) {
                // we exited the map. Break!
                break;
            }

            // Mark this place as visited
            traceMap[guard.position.x][guard.position.y] |= guard.position.moving

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
                continue;
            }

            if (whatIHaveInFront === undefined) {
                // Nothing more to do. Can't even test for loops. Just break out.
                break;
            }

            // I have in front a free tile. Woudl I loop if i put an obstacle there?
            const hypotheticalGuard = JSON.parse(JSON.stringify(startingGuard));
            const hypotheticalTraceMap: DirectionFlag[][] = JSON.parse(JSON.stringify(cleanTraceMap));
            const hypotheticalMap: string[] = JSON.parse(JSON.stringify(parsedInput));
            const rowToChange = hypotheticalMap[nextCoordinates.x].split('');
            rowToChange[nextCoordinates.y] = '#';
            hypotheticalMap[nextCoordinates.x] = rowToChange.join('');

            // console.log(guard);
            // console.log(hypotheticalGuard);
            // for (const line of hypotheticalMap) {
            //     console.log(line);
            // }

            if (isLoop(hypotheticalGuard, hypotheticalMap, hypotheticalTraceMap)) {
                const loopPosition = {
                    x: nextCoordinates.x,
                    y: nextCoordinates.y,
                    str: JSON.stringify(nextCoordinates),
                }
                // console.log(loopPosition);
                loopables.push(loopPosition);
            }

            guard.position.x = nextCoordinates.x;
            guard.position.y = nextCoordinates.y;
        }

        //printTraceMap(traceMap);

        console.log(loopables.length);

        const loopablePositionsStartingExcluded = loopables.filter(e => e.x != startingPosition.x || e.y != startingPosition.y);
        console.log(loopablePositionsStartingExcluded.length);

        const distinctLoopablePositions = loopables.reduce((acc: { x: number, y: number, str: string }[], current) => {
            if (acc.every(e => e.str != current.str)) {
                acc.push(current);
            }
            return acc;
        }, []);

        console.log(distinctLoopablePositions.length);

        const distinctLoopablePositionsStartingExcluded = distinctLoopablePositions.filter(e => e.x != startingPosition.x || e.y != startingPosition.y);
        console.log(distinctLoopablePositionsStartingExcluded.length);
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

function printTraceMap(traceMap: DirectionFlag[][]): void {
    const selectCharacter = (f: DirectionFlag): string => {
        const isVertical = (f & (DirectionFlag.U | DirectionFlag.D)) !== 0;
        const isHorizontal = (f & (DirectionFlag.R | DirectionFlag.L)) !== 0;

        if (isVertical && isHorizontal) {
            return '+';
        }
        if (isVertical) {
            return '|';
        }
        if (isHorizontal) {
            return '-';
        }
        return '.';
    };

    const string = traceMap.map(row => row.map(selectCharacter).join('')).join('\n');
    console.log(string);
}