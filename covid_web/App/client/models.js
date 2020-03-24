var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dato = /** @class */ (function () {
    function Dato() {
    }
    return Dato;
}());
var ElementoAnalisi = /** @class */ (function () {
    function ElementoAnalisi() {
    }
    return ElementoAnalisi;
}());
var Paese = /** @class */ (function (_super) {
    __extends(Paese, _super);
    function Paese() {
        var _this = _super.call(this) || this;
        _this.tipo = "C";
        return _this;
    }
    Object.defineProperty(Paese.prototype, "codice_paese", {
        get: function () {
            return this.codice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paese.prototype, "denominazione_paese", {
        get: function () {
            return this.label;
        },
        enumerable: true,
        configurable: true
    });
    return Paese;
}(ElementoAnalisi));
var ListaPaesi = /** @class */ (function (_super) {
    __extends(ListaPaesi, _super);
    function ListaPaesi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListaPaesi;
}(Array));
var ProgrammaStudente = /** @class */ (function () {
    function ProgrammaStudente() {
    }
    return ProgrammaStudente;
}());
var ArgomentoStudente = /** @class */ (function () {
    function ArgomentoStudente() {
    }
    return ArgomentoStudente;
}());
function getPillola(arg, pillolaId) {
    var e = undefined;
    if (isdef(arg.pillole)) {
        arg.pillole.forEach(function (value) {
            if (value.pillolaId === pillolaId) {
                e = value;
            }
        });
    }
    return e;
}
var Pillola = /** @class */ (function () {
    function Pillola() {
    }
    return Pillola;
}());
//# sourceMappingURL=models.js.map