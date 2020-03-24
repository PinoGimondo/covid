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
    public elementiSelezionati:string="";

    protected onPageReady(): void {
        let urlParams = new URLSearchParams(window.location.search);
        //let id: string = urlParams.get('id');
        //if (!id) programmaId = "9";
        Client.getCovidDataSetAsync(function (cds: CovidDataSet) {
            ds = cds;
            ds.paesi[0].isSelected = true;
            ds.paesi[0].isExpanded=false;
            P.tv.reRender(ds.paesi);
        });
    }

    public static onCheckChanged(id: string) {
        let e: HTMLInputElement = <HTMLInputElement>event.target;
        if (e.checked) {
            P.elementiSelezionati += "," + id;
        } else {
            P.elementiSelezionati = P.elementiSelezionati.replace("," + id, "");
        }
        console.log("occ: " + P.elementiSelezionati);

        Client.getGraficoAsync('', P.elementiSelezionati, function (svg: string) {
            $("#boxViewData").html(svg);
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
        switch (dc.tipo) {
            case 'C':
                if (dc.codice === "IT") {
                    r = ds.regioni;
                }
                break;
            case 'R':
                ds.province.forEach( function(p: Provincia) {
                    if (p.codiceRegione === dc.codice) {
                        r.push(p);
                    }
                })
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

