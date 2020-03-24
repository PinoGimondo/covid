var Stack = /** @class */ (function () {
    function Stack() {
        this._topNode = undefined;
        this._count = 0;
    }
    Object.defineProperty(Stack.prototype, "count", {
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.isEmpty = function () {
        return (this._topNode === undefined);
    };
    Stack.prototype.push = function (value) {
        // create a new StackElement and add it to the top
        var node = new StackElement(value, this._topNode);
        this._topNode = node;
        this._count++;
        return value;
    };
    Stack.prototype.pop = function () {
        // remove the top StackElement from the stack.
        // the node at the top now is the one before it
        if (this._topNode !== undefined) {
            var poppedNode = this._topNode;
            this._topNode = poppedNode.previous;
            this._count--;
            return poppedNode.data;
        }
        else
            return undefined;
    };
    Stack.prototype.peek = function () {
        if (this._topNode !== undefined) {
            return this._topNode.data;
        }
        else
            return undefined;
    };
    return Stack;
}());
var StackElement = /** @class */ (function () {
    function StackElement(data, previous) {
        this.previous = previous;
        this.data = data;
    }
    return StackElement;
}());
var Dictonary = /** @class */ (function () {
    function Dictonary() {
        this.items = {};
        this._items = new Array();
        this.count = 0;
    }
    Dictonary.prototype.ContainsKey = function (key) {
        return this.items.hasOwnProperty(key);
    };
    Object.defineProperty(Dictonary.prototype, "Count", {
        get: function () {
            return this.count;
        },
        enumerable: true,
        configurable: true
    });
    Dictonary.prototype.Add = function (key, value) {
        if (!this.items.hasOwnProperty(key))
            this.count++;
        this.items[key] = value;
        this._items = this._values;
    };
    Dictonary.prototype.Remove = function (key) {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        this._items = this._values;
        return val;
    };
    Dictonary.prototype.Item = function (key) {
        return this.items[key];
    };
    Object.defineProperty(Dictonary.prototype, "Keys", {
        get: function () {
            var keySet = [];
            for (var prop in this.items) {
                if (this.items.hasOwnProperty(prop)) {
                    keySet.push(prop);
                }
            }
            return keySet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictonary.prototype, "_values", {
        get: function () {
            var values = [];
            for (var prop in this.items) {
                if (this.items.hasOwnProperty(prop)) {
                    values.push(this.items[prop]);
                }
            }
            return values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictonary.prototype, "Values", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Dictonary.prototype.forEach = function (loop) {
        return this.Values.forEach(loop);
    };
    return Dictonary;
}());
//# sourceMappingURL=collections.js.map