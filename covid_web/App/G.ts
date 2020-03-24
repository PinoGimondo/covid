/// <reference path="lib\lib.ts" />
let P: MyPage;
window.onload = function () {
    P = new MyPage();
};

class MyPage extends Page {
    protected paesi: ListaPaesi;
    protected as: Component;
    protected tv: TVEA;
    protected pup: PopUp;

    public elementoSelezionato: ElementoAnalisi;

    protected onPageReady(): void {

        var urlParams = new URLSearchParams(window.location.search);
        //let id: string = urlParams.get('id');
        //if (!id) programmaId = "9";
        let instance: MyPage = this;
        Client.getPaesiAsync(function (lp: ListaPaesi) {
            instance.paesi = lp;
            P.tv.reRender(instance.paesi);
        });
    }

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

    public static button(action: string, argId: string) {
        //switch (action) {
        //    case "set_stato_argomento":
        //        Client.modificaAttributoArgomentoAsync(P.argomentoSelezionato.argomentoId, "statoArgomentoId", argId, function (arg: ArgomentoStudente) {
        //            Component.updateComponents(arg, P.argomentoSelezionato);
        //            P.SelezionaArgomentoById(arg.argomentoId);
        //        })
        //        break;
        //}
    }
}

class NodoEA extends TreeViewNode {

    constructor(e?: HTMLElement) {
        super(e);
        if (this.id === "nodoArgomento") {
            this.registerEvent("onclick");
        }
    }
    
    public getNodiEA(dc: Paese ): Array<Paese> {

        let r: Array<Paese> = new Array<Paese>();
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
    }

    public css(dc: ArgomentoStudente): string {
        switch (dc.statoArgomentoId) {
            case "0": return "argomento-non-previsto";
            case "3": return "argomento-da-studiare";
            default: return "";
        }
    }

    public click(arg: ArgomentoStudente, sender: HTMLElement, event: MouseEvent) {
        //if (arg.argomentoPadreId !== "S") {
        //    P.SelezionaArgomentoById(arg.argomentoId);
        //}
    }
}
Page.registerClass(NodoEA);

class TVEA extends TreeView {
    protected sezioni:Array<ArgomentoStudente>;

    constructor(e?: HTMLElement) {
        super(e);

        this.sezioni = new Array<ArgomentoStudente>()
        let a: ArgomentoStudente;

        a = new ArgomentoStudente();
        a.uid= "Argomento_E";
        a.argomentoId = "E";
        a.argomentoPadreId = "S";
        a.argomento = "Argomenti in evidenza";
        (<any>a).expanded = "1"
        this.sezioni.push(a);

        a = new ArgomentoStudente();
        a.uid = "Argomento_";
        a.argomentoId = "";
        a.argomentoPadreId = "S";
        a.argomento = "Programma Completo";
        (<any>a).expanded = "0"
        this.sezioni.push(a);
    }

    public getSezioni(dc: ProgrammaStudente): Array<ArgomentoStudente> {
        return this.sezioni;
    }
}
Page.registerClass(TVEA);

