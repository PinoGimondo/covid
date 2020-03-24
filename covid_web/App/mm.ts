/// <reference path="lib/sp.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />
declare var sendMessageToParent: (msg: string, b: any) => void;
let parentNotifyExpected: boolean = false;
let MW: MyWorld;
try {
    sendMessageToParent("app_start", "");
    parentNotifyExpected = true;
} catch (e) { }


function notifyParent(msg: string, b: any): void {
    if (parentNotifyExpected) {
        try {
            sendMessageToParent(msg, b);
        } catch (e) { }
    }
}

function onPageCommand(cmd: string, par?: any, getXml?:boolean): string {
    let retVal: string = "";
    try {
        switch (cmd) {
            case 'add_nodo': MW.addNodo(); break;
            case 'rem_nodo': MW.remNodo(); break;
            case 'set_content': if (MW.snb) { MW.snb.setContent(par); }; break;
            case 'set_fixed': if (MW.snb) { MW.snb.setFixed(par); }; break;
            case 'set_w': if (MW.snb) { MW.snb.setWidth(par); }; break;
            case 'set_h': if (MW.snb) { MW.snb.setHeight(par); }; break;
            case 'set_r': if (MW.snb) { MW.snb.setRadius(par); }; break;
            case 'set_a': MW.attrito = par; break;
            case 'set_gy': MW.gy = par; break;
            case 'set_gx': MW.gx = par; break;
            case 'get_xml': retVal = MW.getXml(); break;
        }
        if (getXml) {
            retVal = MW.getXml();
        }
    } catch (ex) { console.log(ex.message); }
    return retVal;
}

class MyWorld extends World {
    public e_content: HTMLInputElement;
    public e_fixed: HTMLInputElement;
    public snb: NodeBody;
    constructor(root: SVGSVGElement, gy:number, attrito:number) {
        super(root);

        MW = this;

        this.gy = gy;
        this.attrito = .97;
        let instance: MyWorld = this;

        this.e_content = <HTMLInputElement>document.getElementById("label");
        this.e_fixed = <HTMLInputElement>document.getElementById("fixed");

        if (this.e_content) {

            this.e_content.addEventListener("input", function (ev: Event) { onPageCommand("set_content", instance.e_content.value); });

            document.getElementById("add_nodo").addEventListener("click", function (ev: Event) { onPageCommand("add_nodo", ""); });

            document.getElementById("rem_nodo").addEventListener("click", function (ev: Event) { onPageCommand("rem_nodo", "");  });

            this.e_fixed.addEventListener("change", function (ev: Event) {  onPageCommand("set_fixed", ( <HTMLInputElement> ev.srcElement).checked); });

            let gr: JQuery = $("#gravity");
            let grv: JQuery = $("#gravity_value");

            gr.slider({
                min: -.1, max: .1, step: .005, value: instance.gy,
                slide: function (event: Event, ui: any) {
                    let v: number = gr.slider("value");
                    onPageCommand("set_gy", v);
                    grv.html((v) + "");
                }
            });

            let at: JQuery = $("#attrito");
            let atv: JQuery = $("#attrito_value");

            at.slider({
                min: .85, max: 1, step: .005, value: instance.attrito,
                slide: function (event: Event, ui: any) {
                    let v: number = at.slider("value");
                    onPageCommand("set_a", v);
                    atv.html((v) + "");
                }
            });

            let lar: JQuery = $("#lar");
            let larv: JQuery = $("#lar_value");

            lar.slider({
                min: 50, max: 400, step: 1, value: 100,
                slide: function (event: Event, ui: any) {
                    let v: number = lar.slider("value");
                    onPageCommand("set_w", v);
                    larv.html((v) + "");
                }
            });

            let alt: JQuery = $("#alt");
            let altv: JQuery = $("#alt_value");

            alt.slider({
                min: 50, max: 800, step: 1, value: 100,
                slide: function (event: Event, ui: any) {
                    let v: number = alt.slider("value");
                    onPageCommand("set_h", v);
                    altv.html((v) + "");
                }
            });

            let rad: JQuery = $("#rad");
            let radv: JQuery = $("#rad_value");

            rad.slider({
                min: 1, max: 100, step: 1, value: 10,
                slide: function (event: Event, ui: any) {
                    let v: number = rad.slider("value");
                    onPageCommand("set_r", v);
                    radv.html((v) + "");
                }
            });


        }
    }

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
    public addNodo() {
        let parentId: string = "";

        if (this.snb) {
            parentId = this.snb.id;
            MM.node(parentId, World.nonce + "", "", "", "")
        }
        else {
            if (parentId !== "" || this.bb.Count === 0) {
                MM.node(parentId, World.nonce + "", "", this.root.clientWidth / 2 + "", this.root.clientHeight / 2 + "")
            }
        }
    }

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
    public remNodo() {
        if (this.snb) {
            if (this.snb.nchildren === 0) {
                this.removeb(this.snb);
            } else {
                if (confirm('sei sicuro di volere eliminare questo nodo e tutti i suoi figlioletti?')) {
                    let a: Array<NodeBody> = this.getChildren(this.snb.id);
                    a.forEach(function (value: NodeBody) {
                        this.removeb(value);
                    });
                    this.removeb(this.snb);
                }
            }
        }
    }


    public onBodyUnselected(b: NodeBody) {
        b.b.classList.remove("mm-selected")
    }

    public onBodySelected(b: NodeBody) {
        b.b.classList.add("mm-selected")
        this.snb = b;
        if (this.e_content) {
            this.e_content.value = this.snb.label.replace(/\|/g, String.fromCharCode(10));
            this.e_fixed.checked = this.snb.fixed;
        } 
        notifyParent("bodySelected", b);
    }

    public onBodyMoved(b: NodeBody) {
        notifyParent("bodyMoved", b);
    }

    public getXml(): string {
        try {
            var root: XMLDocument = $.parseXML("<mm></mm>");
            root.documentElement.setAttribute("gy", this.gy + "");
            root.documentElement.setAttribute("attrito", this.attrito + "");
            this.addn(root.documentElement, "");
            return new XMLSerializer().serializeToString(root);
        } catch (ex) { console.log(ex.message);}
    }

    protected addn(e: Element, parentId: string) {
        let a: Array<NodeBody> = this.getChildren(parentId);
        let n: number = a.length;
        let ne: Element;
        let instance: MyWorld = this;
        a.forEach(function (value: NodeBody) {
            ne = document.createElement("nodo")
            let label: string = value.label;
            ne.setAttribute("id", value.id);
            ne.setAttribute("label", label);
            ne.setAttribute("w", Math.floor(value.r.width) + "");
            ne.setAttribute("h", Math.floor(value.r.height) + "");
            ne.setAttribute("r", value.b.getAttribute("rx"));

            if (value.fixed) {
                ne.setAttribute("x", Math.floor(value.p.x) + "");
                ne.setAttribute("y", Math.floor(value.p.y) + "");
            }

            instance.addn(ne, value.id);
            e.append(ne);

        });
    }
}

class NodeBody extends Body {
    public label: string;
    public b: SVGRectElement;
    public o: SVGRectElement;
    public l: SVGTextElement;
    public ld: HTMLDivElement;
    public i: SVGImageElement

    constructor(e: SVGGElement, w:World) {
        super(e,w);
        this.b = <SVGRectElement>e.children[1];
        this.l = <SVGTextElement>e.children[2];
    }

    public setFixed(fixed:boolean) {
        this.fixed = fixed;
        if (this.fixed) {
            this.o.style.display = "none";
            this.i.style.display = "";
        }
        else {
            this.o.style.display = "";
            this.i.style.display = "none";
        }
    }

    public refreshLabel() {
        this.ld.innerHTML = MM.getBoxHtml(this.label, this.ld);
    }

    public setContent(l: string) {
        this.label = l.replace(/(?:\r\n|\r|\n)/g, '|');
        this.ld.innerHTML = MM.getBoxHtml(l, this.ld);
    }

    public setWidth(w: number) {
        this.b.setAttribute("width", w + "");
        this.o.setAttribute("width", w + "");
        this.l.setAttribute("width", w + "");
        this.i.setAttribute("x", w / 2 - 15 + "");
        this.resized();
        this.refreshLabel();
    }
    public setHeight(h: number) {
        this.b.setAttribute("height", h + "");
        this.o.setAttribute("height", h + "");
        this.l.setAttribute("height", h + "");
        this.resized();
        this.refreshLabel();
    }

    public setRadius(r: number) {
        this.b.setAttribute("rx", r + "");
        this.b.setAttribute("ry", r + "");
        this.o.setAttribute("rx", r + "");
        this.o.setAttribute("ry", r + "");
        this.resized();
        this.refreshLabel();
    }

    public resized() {
        super.resized();
        if (this.ld) {
            this.ld.style.width = (this.r.width -3) + "px";
            this.ld.style.height = (this.r.height-3) + "px";
        }
    }

}
class MMLink extends Link {
    constructor(e: SVGElement, w: World) {
        super(e, w);
        this.l = 40;
    }
}


class MM {

    public static getBoxHtml(txt:string, div: HTMLDivElement): string {
        let s: string = txt;
        s = s.replace(/(?:\r\n|\r|\n)/g, '<br>')
        s = s.replace(/\|/g, "<br />")

        if (s.substr(0, 1) === '@') {
            let id: string = s.substr(3, s.length - 4);
            if (Client !=undefined) {
                try {
                    switch (s.substr(1, 1)) {
                        case 'X':
                            Client.getHtmlAsync("x", id, function (d: string) {
                                div.innerHTML = d;
                            })
                            s = "";
                        case 'M':
                            s = "<img draggable='false' src='" + id + "' style='width:100%'  />";
                            break;
                        case 'A':
                            Client.getArgomentoAsync(id, function (d: ArgomentoStudente) {
                                s = "<br />" + "Argomento  " + d.statoArgomento + "<br /><a href=javascript:parent.P.SelezionaArgomentoById('" + d.argomentoId + "'); >" + d.argomento + "</a>";
                                div.innerHTML = s
                            })
                            s = "";
                        case 'P':
                            Client.getPillolaAsync(id, function (d: Pillola) {
                                s = "Pillola " + "<br />" + d.titolo;
                                div.innerHTML = s
                            })
                            s = "";

                        default:
                    }
                } catch (ex) { s = "PUPPA"; }

            }
            else {
                s = "pippo";
            }


        }
        return s;
    } 

    public static node(parentId: string, id: string, txt: string, x?: string, y?: string, _w?: string, _h?: string, _r?: string ) {
        let liv: number = 0;
        let px: number = 400;
        let py: number = 500;
        let w: number = 160;
        let h: number = 90;
        let r: number = 10;
        let sel: Body = W.getBody(parentId);

        if (sel != undefined) {
            liv = Body.getNumericValue(sel.e.dataset.livello) + 1;
            px = sel.p.x + Math.random()*50-20; 
            py = sel.p.y - sel.r.height + Math.random()*50-20; 
        }

        if (_w === undefined || _w === "" || _h === undefined || _h === "" || _r === undefined || _r === "") {
            r = 10;
            switch (liv) {
                case 0: w = 160; h = 90; break;
                case 1: w = 130; h = 70; break;
                case 2: w = 100; h = 40; break;
                default: w = 90; h = 30;
            }
        } else {
            w = parseInt(_w); h = parseInt(_h); r = parseInt(_r);
        }

        let g: SVGGElement = <SVGRectElement><unknown>document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = id;
        g.setAttribute("transform", "translate(" + px + "," + py + ") rotate(0)");
        g.setAttribute("data-livello", liv + "");

        let o: SVGRectElement = <SVGRectElement><unknown>document.createElementNS("http://www.w3.org/2000/svg", "rect");
        o.id = "or_" + id;
        o.setAttribute("x", "5");
        o.setAttribute("y", "5");
        o.setAttribute("width", w + "");
        o.setAttribute("height", h + "");
        o.classList.add("mm-node-shade");
        g.appendChild(o);

        let n: SVGRectElement = <SVGRectElement><unknown>document.createElementNS("http://www.w3.org/2000/svg", "rect");
        n.id = "r_" + id;
        n.setAttribute("width", w + "");
        n.setAttribute("height", h + "");
        n.classList.add("mm-node");
        n.classList.add("mm-liv-" + liv + "");
        g.appendChild(n);

        let t: SVGForeignObjectElement = <SVGForeignObjectElement><unknown>document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        t.id = "t_" + id;
        t.setAttribute("x", "0");
        t.setAttribute("y", "0");
        t.setAttribute("width", w + "");
        t.setAttribute("height", h + "");
        t.classList.add("mm-node-text");
        t.classList.add("mm-text-liv-" + liv + "");

        let div: HTMLDivElement = document.createElement("div");
        div.style.height = (h-4)+"px";
        div.style.width = (w-4) +"px";
        div.innerHTML = this.getBoxHtml(txt, div);
        div.classList.add("mm-node-text");
        div.classList.add("mm-text-liv-" + liv + "");

        t.appendChild(div);
        g.appendChild(t);
               
        let i: SVGImageElement = <SVGImageElement><unknown>document.createElementNS("http://www.w3.org/2000/svg", "image");
        i.id = "pi_" + id;
        i.setAttribute("x", w/2 -15 + "");
        i.setAttribute("y", "-10");
        i.setAttribute("width", "20");
        i.setAttribute("height", "30");
        i.setAttribute("href", "app/img/pin.png");
        i.style.display = "none";

        g.appendChild(i);

        W.root.appendChild(g);

        let b: NodeBody = new NodeBody(g, W);

        b.label = txt;
        b.parentId = parentId;
        b.p.x = px;
        b.p.y = py;
        b.i = i;
        b.o = o;
        b.ld = div;

        if (x !== "" && y !== "") {
            b.p.x = parseInt(x);
            b.p.y = parseInt(y);
            b.fixed = true;
            b.i.style.display = "";
            b.o.style.display = "none";
        }
        
        W.addb(b);
        b.setRadius(r);

        if (sel != undefined) {
            let l: SVGLineElement = <SVGLineElement><unknown>document.createElementNS("http://www.w3.org/2000/svg", "line");
            l.id = "l_" + id;
            l.setAttribute("x1", sel.p.x + "");
            l.setAttribute("y1", sel.p.y + "");
            l.setAttribute("x2", b.p.x + "");
            l.setAttribute("y2", b.p.y + "");
            l.classList.add("mm-link")
            l.classList.add("mm-link-liv-" + liv)
            l.setAttribute("data-from", sel.id);
            l.setAttribute("data-to", g.id);

             W.root.insertBefore(l, W.root.firstChild);

             W.addl(new MMLink(l, W)); 
        }


    }
}
