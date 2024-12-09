import * as fs from 'fs';

export class AOC09 {
    private _day: string = '09';
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

        let i = 0;
        while (i < parsedInput.length) {

            if (parsedInput[i].fileId !== null) {
                i++;
                continue;
            }

            const lastAllocation = parsedInput[parsedInput.length - 1];

            if (lastAllocation.blockLength > parsedInput[i].blockLength) {
                // I can't fit the entirety of the file in here, I will just make a partial insertion
                parsedInput[i].fileId = lastAllocation.fileId;
                lastAllocation.blockLength -= parsedInput[i].blockLength; // this is > 0
                i++;
                //console.log(diskToString(parsedInput));
                continue;
            }

            // I can fit the entirety of the file in here. So I need to insert a new blockAllocation
            // before the non allocated space

            parsedInput[i].blockLength -= lastAllocation.blockLength;

            const shouldRemoveAllocationBlock = parsedInput[i].blockLength === 0;

            const newAllocationBlock = {...lastAllocation};
            parsedInput.splice(i, shouldRemoveAllocationBlock ? 1 : 0, newAllocationBlock);

            // get rid of both the last file (already copied fully into previous memory places
            // and the preceding empty space (RISKY!)
            parsedInput.pop();
            parsedInput.pop();
            i++;
            //console.log(diskToString(parsedInput));
        }

        console.log(diskCheckSum(parsedInput));
    }

    public partTwo(input: string): void {
        console.log('Solving part two...');

        const parsedInput = this.parseInput(input);
        console.log('TODO');
    }

    private parseInput(input: string): AllocationInfo[] {

        const diskMap: AllocationInfo[] = [];

        for (let i = 0; i < input.length; i++) {
            diskMap.push({blockLength: parseInt(input[i]), fileId: i % 2 == 0 ? i / 2 : null})
        }

        return diskMap;
    }

}

type AllocationInfo = { blockLength: number, fileId: number | null };

function diskToString(disk: AllocationInfo[]): string {
    const stringParts: string[] = [];
    for (const info of disk) {
        const element: string = info.fileId === null
            ? '.'
            : '\'' + info.fileId!.toString() + '\'';
        stringParts.push(element.repeat(info.blockLength))
    }
    return stringParts.join('');
}

function diskCheckSum(disk: AllocationInfo[]): number {
    let sum: number = 0;
    let counter = 0;
    for (const info of disk) {
        for (let i = 0; i < info.blockLength; i++) {
            if (info.fileId !== null) {
                sum += counter * info.fileId;
            }
            counter++;
        }
    }
    return sum;
}