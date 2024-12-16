export function groupBy<T, K extends keyof any>(array: T[], keySelector: (item: T) => K): Record<K, T[]> {
    return array.reduce((acc: Record<K, T[]>, current: T) => {
        const key = keySelector(current);
        if (acc[key] === undefined) {
            acc[key] = [];
        }
        acc[key].push(current);
        return acc;
    }, {} as Record<K, T[]>);
}

export type Vector = { x: number, y: number };

export class VectorClass {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public sum(vector: VectorClass): VectorClass {
        return new VectorClass(this.x + vector.x, this.y + vector.y);
    }

    public multiply(scalar: number): VectorClass {
        return new VectorClass(this.x * scalar, this.y * scalar);
    }

}

export function niceModulo(input: number, modulo: number): number {
    if (modulo <= 0) {
        throw new Error("Bad modulo");
    }

    const standardModuloResult = input % modulo;
    return standardModuloResult >= 0
        ? standardModuloResult
        : standardModuloResult + modulo;
}

export function printTable(table: string[][]): void {
    const string = table.map(r => r.join('')).join('\n');
    console.log(string);
}

export function deepClone<T>(input: T): T {
    return (JSON.parse(JSON.stringify(input)) as T);
}

export function assertNever(input: never): never {
    return input;
}