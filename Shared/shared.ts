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