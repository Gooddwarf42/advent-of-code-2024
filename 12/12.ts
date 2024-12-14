import * as fs from 'fs';

export class AOC12 {
    private _day: string = '12';
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
            const currentEdges =
                current.edges.up.length
                + current.edges.right.length
                + current.edges.down.length
                + current.edges.left.length;
            acc += (current.area * currentEdges);
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

                const areaData = this.visitArea(regionIdentifier, i, j, map, visitedMap) as RegionInfo;
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

        const potentialNewEdges: RegionEdges = {
            up: [],
            right: [],
            down: [],
            left: []
        };

        nonrelevantNeighbours.forEach((neighbour) => {
            switch (neighbour.direction) {
                case 'U':
                    potentialNewEdges.up.push([{i, j}]);
                    break;
                case 'R':
                    potentialNewEdges.right.push([{i, j}]);
                    break;
                case 'D':
                    potentialNewEdges.down.push([{i, j}]);
                    break;
                case 'L':
                    potentialNewEdges.left.push([{i, j}]);
                    break;
                default:
                    const never: never = neighbour.direction;
                    throw new Error('Unknown direction. Bad things happened');
            }
        });

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

        const relevantNeigboursEdges = relevantNeighbours.map(r => r.result.edges);
        const edges = this.mergeEdges(relevantNeigboursEdges, potentialNewEdges);

        return {area, perimeter, edges};
    }

    private mergeEdges(edgesFromRecursiveCalls: RegionEdges[], potentialNewEdges: RegionEdges): RegionEdges {
        return {
            up: this.mergeHorizontalEdges(edgesFromRecursiveCalls, potentialNewEdges, e => e.up),
            right: this.mergeVerticalEdges(edgesFromRecursiveCalls, potentialNewEdges, e => e.right),
            down: this.mergeHorizontalEdges(edgesFromRecursiveCalls, potentialNewEdges, e => e.down),
            left: this.mergeVerticalEdges(edgesFromRecursiveCalls, potentialNewEdges, e => e.left),
        };
    }

    private mergeHorizontalEdges(edgesFromRecursiveCalls: RegionEdges[], potentialNewEdges: RegionEdges, edgeInfoSelector: (edgesSelector: RegionEdges) => EdgeInfo[]): EdgeInfo[] {

        const allHorizontalEdges = edgesFromRecursiveCalls.map(e => edgeInfoSelector(e)).flat();
        allHorizontalEdges.push(...edgeInfoSelector(potentialNewEdges));

        allHorizontalEdges.forEach(e => e.sort((a, b) => a.j - b.j)); // ensure all horizontal edges are sorted. Probably unnecessary, but heh
        const groupedHorizontalEdges = groupBy(allHorizontalEdges, edge => edge[0].i);

        for (const [_, edges] of Object.entries(groupedHorizontalEdges)) {
            edges.sort((a, b) => a[0].j - b[0].j); // ensure the edges of each row are ordered
            let k = 0;
            while (k < edges.length - 1) {
                if (edges[k][edges[k].length - 1].j + 1 !== edges[k + 1][0].j) {
                    // these are actualy distinct edges
                    k++;
                    continue;
                }

                // we need to merge these k and k+1 into asingle edge!
                edges[k].push(...edges[k + 1]);
                edges.splice(k + 1, 1);
            }
        }
        return Object.values(groupedHorizontalEdges).flat();
    }

    private mergeVerticalEdges(edgesFromRecursiveCalls: RegionEdges[], potentialNewEdges: RegionEdges, edgeInfoSelector: (edgesSelector: RegionEdges) => EdgeInfo[]): EdgeInfo[] {

        const allVerticalEdges = edgesFromRecursiveCalls.map(e => edgeInfoSelector(e)).flat();
        allVerticalEdges.push(...edgeInfoSelector(potentialNewEdges));
        allVerticalEdges.forEach(e => e.sort((a, b) => a.i - b.i)); // ensure all vertical edges are sorted. Probably unnecessary, but heh
        const groupedVerticalEdges = groupBy(allVerticalEdges, edge => edge[0].j);

        for (const [_, edges] of Object.entries(groupedVerticalEdges)) {
            edges.sort((a, b) => a[0].i - b[0].i); // ensure the edges of each column are ordered
            let k = 0;
            while (k < edges.length - 1) {
                if (edges[k][edges[k].length - 1].i + 1 !== edges[k + 1][0].i) {
                    // these are actualy distinct edges
                    k++;
                    continue;
                }

                // we need to merge these k and k+1 into asingle edge!
                edges[k].push(...edges[k + 1]);
                edges.splice(k + 1, 1);
            }
        }
        return Object.values(groupedVerticalEdges).flat();
    }
}

type VisitResult = RegionInfo | 'visited' | 'nonrelevant';
type RegionInfo = {
    area: number,
    perimeter: number,
    edges: RegionEdges
};
type RegionEdges = {
    up: EdgeInfo[],
    right: EdgeInfo[],
    down: EdgeInfo[],
    left: EdgeInfo[]
};
type Direction = 'U' | 'R' | 'D' | 'L';
type Coordinate = { i: number, j: number };
type EdgeInfo = Coordinate[];


function groupBy<T, K extends keyof any>(array: T[], keySelector: (item: T) => K): Record<K, T[]> {
    return array.reduce((acc: Record<K, T[]>, current: T) => {
        const key = keySelector(current);
        if (acc[key] === undefined) {
            acc[key] = [];
        }
        acc[key].push(current);
        return acc;
    }, {} as Record<K, T[]>);

}