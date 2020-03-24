/// <reference path="collections.ts" />

var W: World;
var x: string="";

class Dist {
    public dx: number;
    public dy: number;
    public d2: number;
    public d: number;
}

class World {
    protected bb: Dictonary<Body>;
    protected ll: Dictonary<Link>;
    protected lastId:number = 10000101;

    protected grabbedBody: Body = undefined;
    protected grabPointX: number;
    protected grabPointY: number;


    public root: SVGSVGElement
    public repulsione: number;
    public attrito: number;
    public selectedBody: Body = undefined;
    public padding: number = 50;
    public k: number = .005;
    public gx: number = 0;
    public gy: number = 0;

    protected static _nonce: number = new Date().getTime();
    public static get nonce(): number {
        World._nonce += 1;
        return World._nonce;
    }

    constructor(root:SVGSVGElement) {
        this.root = root;
        this.repulsione = 100;
        this.attrito = .96;
        let instance: World = this;

        window.setInterval(function () {
            instance.step();
        }, 10);

        this.root.addEventListener("mousedown", function (ev: MouseEvent) { instance.onMouseDown(ev); } , false);
        this.root.addEventListener("mouseup", function (ev: MouseEvent) { instance.onMouseUp(ev); }, false);
        this.root.addEventListener("mousemove", function (ev: MouseEvent) { instance.onMouseMove(ev); }, false);
    }

    public newId():string {
        this.lastId += 1;
        return this.lastId+"";
    }

    protected onBodySelected(b: Body) { }
    protected onBodyUnselected(b: Body) { }
    protected onBodyMoved(b: Body) { }

    protected onMouseUp(ev: MouseEvent): any {
        if (this.grabbedBody !== undefined) {
            this.grabbedBody.grabbed = false;
        }

        this.grabbedBody = undefined;
    }

    protected onMouseDown(ev: MouseEvent): any {

        let bc: Array<Body> = this.getBodiesAtCoords(ev.x, ev.y);

        if (bc.length > 0) {
            this.grabbedBody = bc[bc.length - 1];
            this.grabbedBody.grabbed = true;
            this.grabPointX = ev.x;
            this.grabPointY = ev.y;
            this.selectBody(this.grabbedBody);
        }
        else {
            this.grabbedBody = undefined;
        }
    }

    protected onMouseMove(ev: MouseEvent): any {
        if (this.grabbedBody !== undefined) {
            let dx: number = (ev.x - this.grabPointX);
            let dy: number = (ev.y - this.grabPointY);
            let speedFactor = .1;

            this.grabbedBody.p.x += dx;
            this.grabbedBody.p.y += dy;

            this.grabbedBody.v.x += dx * speedFactor;
            this.grabbedBody.v.y += dy * speedFactor;

            this.grabPointX = ev.x;
            this.grabPointY = ev.y;

            if (dx > 10 || dy > 10) {
                this.onBodyMoved(this.grabbedBody);
            }
        }
    }

    protected unselectCurrentSelectedBody() {
        if (this.selectedBody !== undefined) {
            this.onBodyUnselected(this.selectedBody);
        }
    }

    protected selectBody(b?: Body) {
        if (b === undefined) {
            b = this.bb.Values[this.bb.Count - 1];
        }

        this.unselectCurrentSelectedBody();
        this.selectedBody = b;
        this.onBodySelected(b);
    }

    public getBodiesAtCoords(x: number, y: number): Array<Body> {
        let a: Array<Body> = new Array<Body>();
        this.bb.forEach(function (value: Body) {
            let r: DOMRect = value.r;
            if (!(r.left > x || (r.left + r.width) < x || r.top > y || (r.top + r.height) < y)) {
                a.push(value);
            }
        })
        return a;
    }

    public getBody(id: string): Body {
        if (this.bb.ContainsKey(id))
            return this.bb.Item(id);
        else
            return undefined;
    }

    public getChildren(parentId: string): Array<NodeBody> {
        let a: Array<NodeBody> = new Array<NodeBody>();
        this.bb.forEach(function (value: NodeBody) {
            if (value.parentId === parentId && value.id !== parentId) {
                a.push(<NodeBody>value);
            }
        })
        return a;
    }

    protected init() {
        this.bb = new Dictonary<Body>();
        this.ll = new Dictonary<Link>();

        let n: HTMLCollectionOf<Element> = document.getElementsByClassName("mm-node");
        for (let i: number = 0; i < n.length; i++) {
            let g: SVGGElement = <SVGGElement>n[i];
            let b: Body = new Body(g, this);
            this.addb(b); 
        }

        n = document.getElementsByClassName("mm-link");
        for (let i: number = 0; i < n.length; i++) {
            let e: SVGElement = <SVGElement>n[i];
            let l: Link = new Link(e, this);
            this.addl(l);
        }
    }

    public removeb(b: Body): Body {
        if (this.bb.ContainsKey(b.id)) {
            this.bb.Remove(b.id);
            this.ll.Remove(b.link.id);
            b.link.a.nchildren--;
            b.e.remove();
            b.link.e.remove();
        }
        this.selectBody();
        return b;
    }


    public addb(b: Body): Body {
        this.bb.Add(b.id, b);
        this.selectBody(b);
        return b;
    }

    public addl(l: Link): Link {
        this.ll.Add(l.id, l);
        return l;
    }

    protected step() {
        let n: number = this.bb.Count;
        let nl: number = this.ll.Count;


        for (let i: number = 0; i < (n - 1); i++) {
            for (let k: number = i + 1; k < n; k++) {
                this.bb.Values[i].dinamics(this.bb.Values[k]);
            }
        }

        for (let i: number = 0; i < nl; i++) {
            this.ll.Values[i].dinamics();
        }

        for (let i: number = 0; i < n; i++) {
            this.bb.Values[i].borderBouncing();
            this.bb.Values[i].cinematics();
        }

        for (let i: number = 0; i < nl; i++) {
            this.ll.Values[i].cinematics();
        }

    }
}

class Body {
    public W: World;
    public id: string;
    public parentId: string = ""; 

    public e: SVGGElement;
    public p: SVGPoint;
    public v: SVGPoint;
    public a: SVGPoint;
    public m: number = 1;
    public r: DOMRect;
    public link: Link;
    public nchildren: number = 0;

    public grabbed: boolean = false;
    public fixed: boolean = false;

    constructor(e: SVGGElement, w: World) {
        this.W = w;
        this.p= this.W.root.createSVGPoint();
        this.v = this.W.root.createSVGPoint();
        this.a = this.W.root.createSVGPoint();

        this.e = e;
        this.id = e.id;
        this.resized();

        this.p.x = Body.getNumericValue(e.getAttribute("x"));
        this.p.y = Body.getNumericValue(e.getAttribute("y"));

        this.v.x = Body.getNumericValue(e.dataset.vx);
        this.v.y = Body.getNumericValue(e.dataset.vy)
        this.a.x = 0;
        this.a.y = 0;
    }

    public resized() {
        this.r = this.e.getBoundingClientRect();
        this.m = this.r.width * this.r.height / 1000;
    }

    public static getNumericValue(value: string): number {
        let n: number = 0;
        if (value)
            if (value !== undefined) {
                n = parseInt(value);
            }
        if (n === NaN) n = 0;
        return n;
    }

    public dist(b: Body): Dist {
        let d: Dist = new Dist();
        d.dx = b.p.x - this.p.x;
        d.dy = b.p.y - this.p.y;
        d.d2 = d.dx * d.dx + d.dy * d.dy;
        d.d = Math.sqrt(d.d2)
        if (d.d === 0) d.d = .0000000001;
        if (d.d2 === 0) d.d2 = .0000000001;
        return d;
    }

    public dinamics(b: Body) {
        let d: Dist = this.dist(b);
        let f: number = -this.m * b.m * this.W.repulsione / d.d2;
        let acc: number;
        let acc_d: number;

        // accelerazioni proprie
        acc = f / this.m;
        acc_d= acc / d.d;
        this.a.x += (d.dx * acc_d);
        this.a.y += (d.dy * acc_d);

        // accelerazioni corpo b
        acc = -f / b.m;
        acc_d = acc / d.d;
        b.a.x += (d.dx * acc_d);
        b.a.y += (d.dy * acc_d);

    }

    public borderBouncing() {
        let urtoX: boolean = false;
        let urtoY: boolean = false;

        let dx:number = this.p.x - this.W.padding - this.r.width / 2;
        let dy:number = this.p.y - this.W.padding - this.r.height / 2;

        if (dx < 0) {
            urtoX = true;
        } else {
            dx = this.p.x - (-this.W.padding + this.W.root.clientWidth) + this.r.width / 2;
            urtoX = (dx > 0);
        }

        if (dy < 0) {
            urtoY = true;
        } else {
            dy = this.p.y - (-this.W.padding + this.W.root.clientHeight) + this.r.height/ 2;
            urtoY = (dy > 0);
       }
              
        let f: number = 0;
        let acc: number;
        if (urtoX) {
            f = dx * this.W.k;
            acc = -10*f / this.m;
            this.a.x += acc;
        }

        if (urtoY) {
            f = dy * this.W.k;
            acc = -10*f / this.m;
            this.a.y += acc;
        }
    }

    public cinematics() {
        this.v.x += (this.a.x + this.W.gx);
        this.v.y += (this.a.y + this.W.gy);

        if (! (this.fixed || this.grabbed) ) {
            this.p.x += this.v.x;
            this.p.y += this.v.y;
        }

        this.r = this.e.getBoundingClientRect();

        this.e.setAttribute("transform", "translate(" + (this.p.x - this.r.width / 2) + "," + (this.p.y - this.r.height / 2) + ") rotate(0)");

        // azzeriamo le accelerazioni che verranno ricalcolate nel prossimo ciclo
        this.a.x = 0;
        this.a.y = 0;

        // applichiamo l'attrito
        this.v.x *= this.W.attrito;
        this.v.y *= this.W.attrito;
    }

    public getChildren(): Array<NodeBody> {
        return this.W.getChildren(this.id);
    }

}

class Link {
    public W: World;
    public id: string;
    public e: SVGElement;
    public l: number = 50;
    public a: Body;
    public b: Body;
    public opacity: number=.5;

    constructor(e: SVGElement, w: World) {
        this.W = w;
        this.e = e;
        this.id = e.id;
        this.a = this.W.getBody(e.dataset.from);
        this.b = this.W.getBody(e.dataset.to);
        this.b.link = this;
        this.b.parentId = this.a.id;
        this.a.nchildren ++;
    }

    public dinamics() {
        let d: Dist = this.a.dist(this.b);
        let dx = (d.d - this.l);
        let f: number = dx * this.W.k; 
        let acc: number;

        // accelerazioni corpo a
        acc = f / this.a.m;
        this.a.a.x += (d.dx * acc / d.d);
        this.a.a.y += (d.dy * acc / d.d);

        // accelerazioni corpo b
        acc = -f / this.b.m;
        this.b.a.x += (d.dx * acc / d.d);
        this.b.a.y += (d.dy * acc / d.d);

        this.opacity = 1 - dx / d.d;
    }

    public cinematics() {
        this.e.setAttribute("x1", this.a.p.x + "");
        this.e.setAttribute("y1", this.a.p.y + "");
        this.e.setAttribute("x2", this.b.p.x + "");
        this.e.setAttribute("y2", this.b.p.y + "");
        this.e.style.opacity = this.opacity+"";
    }
}
