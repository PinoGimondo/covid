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
window.onload = function () {
    P = new MyPage();
};
var MyPage = /** @class */ (function (_super) {
    __extends(MyPage, _super);
    function MyPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyPage.prototype.onPageReady = function () {
        var urlParams = new URLSearchParams(window.location.search);
        //let id: string = urlParams.get('id');
        //if (!id) programmaId = "9";
        var instance = this;
        Client.getPaesiAsync(function (lp) {
            instance.paesi = lp;
            P.tv.reRender(instance.paesi);
        });
    };
    //public SelezionaArgomentoById(argomentoId: string, reload?:boolean) {
    //    P.tv.setSelected($("[id='arg_" + argomentoId + "']"));
    //    let arg: ArgomentoStudente = Component.getDataContextByUid("ArgomentoStudente_" + argomentoId);
    //    let needsReload: boolean = true;
    //    if (arg) {
    //        if (arg.pillole) {
    //            this.SelezionaArgomento(arg);
    //            needsReload = false;
    //        }
    //    }
    //    if (needsReload || reload) {
    //        let instance: MyPage = this;
    //        Client.getArgomentoAsync(argomentoId, function (arg: ArgomentoStudente) {
    //            Component.updateComponents(arg, P.argomentoSelezionato);
    //            instance.SelezionaArgomento(arg);
    //        });
    //    }
    // }
    //protected SelezionaArgomento(arg: ArgomentoStudente) {
    //        P.argomentoSelezionato = arg;
    //        P.as.reRender(P.argomentoSelezionato);
    //        $("#containerArgomento").show();
    //        P.pup.setActionButton("mnu_stato_argomento");
    //        P.lb.reRender(arg);
    //        let data: any = new Object;
    //        data.titolo = "Appunti su " + P.argomentoSelezionato.argomento;
    //        data.tipoPillolaId = "6";
    //        data.tipoContenutiId = "1";
    //        P.dnp.setFormData(data);
    //        if (arg.pillole.length > 0) {
    //            let pill: Pillola;
    //            if (isdef(P.pillolaSelezionata)) {
    //                pill = getPillola(arg, P.pillolaSelezionata.pillolaId);
    //            }
    //            if (!isdef(pill)) pill = arg.pillole[0];
    //            P.SelezionaPillola(pill);
    //        }
    //        else
    //            P.SelezionaPillola(new Pillola());
    // }
    MyPage.button = function (action, argId) {
        //switch (action) {
        //    case "set_stato_argomento":
        //        Client.modificaAttributoArgomentoAsync(P.argomentoSelezionato.argomentoId, "statoArgomentoId", argId, function (arg: ArgomentoStudente) {
        //            Component.updateComponents(arg, P.argomentoSelezionato);
        //            P.SelezionaArgomentoById(arg.argomentoId);
        //        })
        //        break;
        //}
    };
    return MyPage;
}(Page));
var NodoEA = /** @class */ (function (_super) {
    __extends(NodoEA, _super);
    function NodoEA(e) {
        var _this = _super.call(this, e) || this;
        if (_this.id === "nodoArgomento") {
            _this.registerEvent("onclick");
        }
        return _this;
    }
    NodoEA.prototype.getNodiEA = function (dc) {
        var r = new Array();
        //let nodoScheda: boolean = (dc.argomentoId === "E");
        //if (P.programmaSelezionato) {
        //    P.programmaSelezionato.argomentiStudente.forEach(function (value: ArgomentoStudente, index: number) {
        //        if (nodoScheda) {
        //            if (value.statoArgomentoId === "3" || value.statoArgomentoId === "5" || value.statoArgomentoId === "6") {
        //                r.push(value);
        //            }
        //        }
        //        else {
        //            if (value.argomentoPadreId === dc.argomentoId) {
        //                r.push(value);
        //            }
        //        }
        //    })
        //}
        return r;
    };
    NodoEA.prototype.css = function (dc) {
        switch (dc.statoArgomentoId) {
            case "0": return "argomento-non-previsto";
            case "3": return "argomento-da-studiare";
            default: return "";
        }
    };
    NodoEA.prototype.click = function (arg, sender, event) {
        //if (arg.argomentoPadreId !== "S") {
        //    P.SelezionaArgomentoById(arg.argomentoId);
        //}
    };
    return NodoEA;
}(TreeViewNode));
Page.registerClass(NodoEA);
var TVEA = /** @class */ (function (_super) {
    __extends(TVEA, _super);
    function TVEA(e) {
        var _this = _super.call(this, e) || this;
        _this.sezioni = new Array();
        var a;
        a = new ArgomentoStudente();
        a.uid = "Argomento_E";
        a.argomentoId = "E";
        a.argomentoPadreId = "S";
        a.argomento = "Argomenti in evidenza";
        a.expanded = "1";
        _this.sezioni.push(a);
        a = new ArgomentoStudente();
        a.uid = "Argomento_";
        a.argomentoId = "";
        a.argomentoPadreId = "S";
        a.argomento = "Programma Completo";
        a.expanded = "0";
        _this.sezioni.push(a);
        return _this;
    }
    TVEA.prototype.getSezioni = function (dc) {
        return this.sezioni;
    };
    return TVEA;
}(TreeView));
Page.registerClass(TVEA);
//# sourceMappingURL=G.js.map