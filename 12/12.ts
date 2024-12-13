import * as fs from 'fs';

export class AOC12 {
    private _day: string = '12';
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

        const fences = this.computeFences(parsedInput);

        const cost = fences.reduce((acc: number, current) => {
            acc += (current.area * current.perimeter);
            return acc;
        }, 0)

        console.log(cost);
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);

        const fences = this.computeFences(parsedInput);

        const cost = fences.reduce((acc: number, current) => {
            acc += (current.area * current.edges.length);
            return acc;
        }, 0)

        console.log(cost);
    }

    private parseInput(input: string): string[] {

        return input.split('\n');
    }

    private computeFences(parsedInput: string[]): RegionInfo[] {
        const fences: RegionInfo[] = [];

        const map: string[][] = [...parsedInput].map(s => s.split(''));
        const visitedMap: (string | '.')[][] = [...parsedInput].map(s => s.split(''));
        for (let i = 0; i < visitedMap.length; i++) {
            for (let j = 0; j < visitedMap[i].length; j++) {
                const regionIdentifier = visitedMap[i][j];

                if (regionIdentifier === '.') {
                    continue;
                }

                //console.log(`Found region to compute! ${regionIdentifier} at (${i},${j})`);
                const areaData = this.visitArea(regionIdentifier, i, j, map, visitedMap) as RegionInfo;

                //console.log(areaData);
                fences.push(areaData);
            }
        }
        return fences;
    }

    private visitArea(regionIdentifier: string, i: number, j: number, map: string[][], visitedMap: (string | ".")[][]): VisitResult {

        const identifier = map?.[i]?.[j];
        const visited = visitedMap?.[i]?.[j];
        if (identifier === undefined) {
            return 'nonrelevant';
        }
        if (identifier != regionIdentifier) {
            return 'nonrelevant';
        }
        if (visited === '.') {
            return 'visited';
        }

        // We are in a proper place of this region. Mark this as visited and continue exploring
        visitedMap[i][j] = '.';

        const neighboursResults: { direction: Direction, result: VisitResult }[] = [
            {direction: 'U', result: this.visitArea(regionIdentifier, i - 1, j, map, visitedMap)},
            {direction: 'R', result: this.visitArea(regionIdentifier, i, j + 1, map, visitedMap)},
            {direction: 'D', result: this.visitArea(regionIdentifier, i + 1, j, map, visitedMap)},
            {direction: 'L', result: this.visitArea(regionIdentifier, i, j - 1, map, visitedMap)},
        ];

        const nonrelevantNeighbours = neighboursResults.filter(r => r.result === 'nonrelevant');
        const relevantNeighbours = neighboursResults.filter(r => r.result !== 'nonrelevant' && r.result !== 'visited') as {
            direction: Direction,
            result: RegionInfo
        }[];

        const potentialNewEdges = nonrelevantNeighbours.map(e => ({coordinates: [{i, j}], direction: e.direction}));
        if (relevantNeighbours.length === 0) {
            return {
                area: 1,
                perimeter: nonrelevantNeighbours.length,
                edges: potentialNewEdges
            };
        }

        const area = relevantNeighbours.reduce((acc: number, current) => {
            acc += current.result.area;
            return acc;
        }, 1);
        const perimeter = relevantNeighbours.reduce((acc: number, current) => {
            acc += current.result.perimeter;
            return acc;
        }, nonrelevantNeighbours.length);

        // TODO merge edgesInfos properly
        const edges: EdgeInfo[] = relevantNeighbours.reduce((acc: EdgeInfo[], current) => {
            acc.push(...current.result.edges);
            return acc;
        }, potentialNewEdges);
        return {area, perimeter, edges};
    }
}

type VisitResult = RegionInfo | 'visited' | 'nonrelevant';
type RegionInfo = { area: number, perimeter: number, edges: EdgeInfo[] };
type Direction = 'U' | 'R' | 'D' | 'L';
type EdgeInfo = { coordinates: { i: number, j: number }[], direction: Direction };