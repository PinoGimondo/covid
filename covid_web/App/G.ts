/// <reference path="lib\lib.ts" />
let P: MyPage;
let ds: CovidDataSet;

window.onload = function () {
    ds = new CovidDataSet();
    P = new MyPage();
};

class MyPage extends Page {
    protected as: Component;
    protected tv: TVEA;
    protected pup: PopUp;

    public elementoSelezionato: ElementoAnalisi;

    protected onPageReady(): void {
        var urlParams = new URLSearchParams(window.location.search);
        //let id: string = urlParams.get('id');
        //if (!id) programmaId = "9";
        let instance: MyPage = this;
        Client.getCovidDataSetAsync(function (cds: CovidDataSet) {
            ds = cds;
            ds.paesi[0].isSelected = true;
            ds.paesi[0].isExpanded=false;
            P.tv.reRender(ds.paesi);
        });
    }
}

class NodoEA extends TreeViewNode {

    constructor(e?: HTMLElement) {
        super(e);
//        this.registerEvent("onclick");
    }
    
    public getNodiEA(dc: ElementoAnalisi ): Array<ElementoAnalisi> {
        let r: Array<ElementoAnalisi> = new Array<ElementoAnalisi>();
        if (dc.codice === "IT") {
            r= ds.regioni;
        }
        return r;
    }
}
Page.registerClass(NodoEA);

class TVEA extends TreeView {
   public getPaesi(dc:any): ListaPaesi {
        return ds.paesi;
   }
}
Page.registerClass(TVEA);

