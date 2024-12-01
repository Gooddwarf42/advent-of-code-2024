import * as fs from 'fs';

export class AOC01 {
    private _test: boolean = true;
    private _inputFile: string = this._test
        ? './01/testInput.txt'
        : './01/input.txt';

    private readInput() : void {
        const data = fs.readFileSync(this._inputFile, 'utf-8');
        console.log('File content:', data);
    }

    public partOne(): void {
        let message: string = 'Hello, yu!';

        //let message2: string = 4;
        console.log(message);
        this.readInput();
    }


    public partTwo(): void {
        console.log("TODO");
    }
}