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
/// <reference path="lib\lib.ts" />
var P;
var ds;
window.onload = function () {
    ds = new CovidDataSet();
    P = new MyPage();
};
var MyPage = /** @class */ (function (_super) {
    __extends(MyPage, _super);
    function MyPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.elementiSelezionati = "";
        return _this;
    }
    MyPage.prototype.onPageReady = function () {
        var urlParams = new URLSearchParams(window.location.search);
        //let id: string = urlParams.get('id');
        //if (!id) programmaId = "9";
        Client.getCovidDataSetAsync(function (cds) {
            ds = cds;
            ds.paesi[0].isSelected = true;
            ds.paesi[0].isExpanded = false;
            P.tv.reRender(ds.paesi);
        });
    };
    MyPage.onCheckChanged = function (id) {
        var e = event.target;
        if (e.checked) {
            P.elementiSelezionati += "," + id;
        }
        else {
            P.elementiSelezionati = P.elementiSelezionati.replace("," + id, "");
        }
        console.log("occ: " + P.elementiSelezionati);
        Client.getGraficoAsync('', P.elementiSelezionati, function (svg) {
            $("#boxViewData").html(svg);
        });
    };
    return MyPage;
}(Page));
var NodoEA = /** @class */ (function (_super) {
    __extends(NodoEA, _super);
    function NodoEA(e) {
        return _super.call(this, e) || this;
        //        this.registerEvent("onclick");
    }
    NodoEA.prototype.getNodiEA = function (dc) {
        var r = new Array();
        switch (dc.tipo) {
            case 'C':
                if (dc.codice === "IT") {
                    r = ds.regioni;
                }
                break;
            case 'R':
                ds.province.forEach(function (p) {
                    if (p.codiceRegione === dc.codice) {
                        r.push(p);
                    }
                });
        }
        return r;
    };
    return NodoEA;
}(TreeViewNode));
Page.registerClass(NodoEA);
var TVEA = /** @class */ (function (_super) {
    __extends(TVEA, _super);
    function TVEA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TVEA.prototype.getPaesi = function (dc) {
        return ds.paesi;
    };
    return TVEA;
}(TreeView));
Page.registerClass(TVEA);
//# sourceMappingURL=G.js.map