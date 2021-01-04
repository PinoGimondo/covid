var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CovidDataSet = /** @class */ (function () {
    function CovidDataSet() {
    }
    return CovidDataSet;
}());
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
    Object.defineProperty(Paese.prototype, "codicePaese", {
        get: function () {
            return this.codice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paese.prototype, "denominazionePaese", {
        get: function () {
            return this.label;
        },
        enumerable: false,
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
var Regione = /** @class */ (function (_super) {
    __extends(Regione, _super);
    function Regione() {
        var _this = _super.call(this) || this;
        _this.tipo = "R";
        return _this;
    }
    Object.defineProperty(Regione.prototype, "codiceRegione", {
        get: function () {
            return this.codice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Regione.prototype, "denominazioneRegione", {
        get: function () {
            return this.label;
        },
        enumerable: false,
        configurable: true
    });
    return Regione;
}(ElementoAnalisi));
var ListaRegioni = /** @class */ (function (_super) {
    __extends(ListaRegioni, _super);
    function ListaRegioni() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListaRegioni;
}(Array));
var Provincia = /** @class */ (function (_super) {
    __extends(Provincia, _super);
    function Provincia() {
        var _this = _super.call(this) || this;
        _this.tipo = "P";
        return _this;
    }
    Object.defineProperty(Provincia.prototype, "codiceProvincia", {
        get: function () {
            return this.codice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Provincia.prototype, "denominazioneProvincia", {
        get: function () {
            return this.label;
        },
        enumerable: false,
        configurable: true
    });
    return Provincia;
}(ElementoAnalisi));
var ListaProvince = /** @class */ (function (_super) {
    __extends(ListaProvince, _super);
    function ListaProvince() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListaProvince;
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