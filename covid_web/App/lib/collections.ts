class Stack<TData> {

    private _topNode: StackElement<TData> = undefined;
    private _count: number = 0;

    get count(): number {
        return this._count;
    }

    public isEmpty(): boolean {
        return (this._topNode === undefined);
    }

    public push(value: TData): TData {
        // create a new StackElement and add it to the top
        let node: StackElement<TData> = new StackElement<TData>(value, this._topNode);
        this._topNode = node;
        this._count++;
        return value; 
    }

    public pop(): TData {
        // remove the top StackElement from the stack.
        // the node at the top now is the one before it
        if (this._topNode !== undefined) {
            let poppedNode = this._topNode;
            this._topNode = poppedNode.previous;
            this._count--;
            return poppedNode.data;
        } else return undefined;

    }

    public peek(): TData {
        if (this._topNode !== undefined) {
            return this._topNode.data;
        } else return undefined;
    }

}

class StackElement<T> {

    previous: StackElement<T>;
    data: T;

    constructor(data: T, previous: StackElement<T>) {
        this.previous = previous;
        this.data = data;
    }
}


interface IKeyedCollection<T> {
    Add(key: string, value: T);
    ContainsKey(key: string): boolean;
    Count: number;
    Item(key: string): T;
    Keys: string[];
    Remove(key: string): T;
    Values: T[];
}

class Dictonary<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};
    private _items: Array<T> = new Array<T>();

    private count: number = 0;

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    get Count(): number {
        return this.count;
    }

    public Add(key: string, value: T) {
        if (!this.items.hasOwnProperty(key))
            this.count++;

        this.items[key] = value;
        this._items = this._values;
    }

    public Remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;

        this._items = this._values;

        return val;
    }

    public Item(key: string): T {
        return this.items[key];
    }

    get Keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    get _values(): T[] {
        var values: T[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }

    get Values(): T[] {
        return this._items
    }

    public forEach(loop: (value: T, index: number, a: Array<T>) =>void ) {
        return this.Values.forEach(loop);
    }

}