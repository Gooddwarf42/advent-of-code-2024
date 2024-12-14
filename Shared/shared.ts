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

    public Sum(vector: VectorClass): VectorClass {
        return new VectorClass(this.x + vector.x, this.y + vector.y);
    }

    public Multiply(scalar: number): VectorClass {
        return new VectorClass(this.x * scalar, this.y * scalar);
    }

}

export function SumVectors(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
    }
}

export function Sum(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
    }
}

export function NiceModulo(input: number, modulo: number): number {
    if (modulo <= 0) {
        throw new Error("Bad modulo");
    }

    const standardModuloResult = input % modulo;
    return standardModuloResult >= 0
        ? standardModuloResult
        : standardModuloResult + modulo;
}