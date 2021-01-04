/// <reference path="collections.ts" />
var W;
var x = "";
var Dist = /** @class */ (function () {
    function Dist() {
    }
    return Dist;
}());
var World = /** @class */ (function () {
    function World(root) {
        this.lastId = 10000101;
        this.grabbedBody = undefined;
        this.selectedBody = undefined;
        this.padding = 50;
        this.k = .005;
        this.gx = 0;
        this.gy = 0;
        this.root = root;
        this.repulsione = 100;
        this.attrito = .96;
        var instance = this;
        window.setInterval(function () {
            instance.step();
        }, 10);
        this.root.addEventListener("mousedown", function (ev) { instance.onMouseDown(ev); }, false);
        this.root.addEventListener("mouseup", function (ev) { instance.onMouseUp(ev); }, false);
        this.root.addEventListener("mousemove", function (ev) { instance.onMouseMove(ev); }, false);
    }
    Object.defineProperty(World, "nonce", {
        get: function () {
            World._nonce += 1;
            return World._nonce;
        },
        enumerable: false,
        configurable: true
    });
    World.prototype.newId = function () {
        this.lastId += 1;
        return this.lastId + "";
    };
    World.prototype.onBodySelected = function (b) { };
    World.prototype.onBodyUnselected = function (b) { };
    World.prototype.onBodyMoved = function (b) { };
    World.prototype.onMouseUp = function (ev) {
        if (this.grabbedBody !== undefined) {
            this.grabbedBody.grabbed = false;
        }
        this.grabbedBody = undefined;
    };
    World.prototype.onMouseDown = function (ev) {
        var bc = this.getBodiesAtCoords(ev.x, ev.y);
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
    };
    World.prototype.onMouseMove = function (ev) {
        if (this.grabbedBody !== undefined) {
            var dx = (ev.x - this.grabPointX);
            var dy = (ev.y - this.grabPointY);
            var speedFactor = .1;
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
    };
    World.prototype.unselectCurrentSelectedBody = function () {
        if (this.selectedBody !== undefined) {
            this.onBodyUnselected(this.selectedBody);
        }
    };
    World.prototype.selectBody = function (b) {
        if (b === undefined) {
            b = this.bb.Values[this.bb.Count - 1];
        }
        this.unselectCurrentSelectedBody();
        this.selectedBody = b;
        this.onBodySelected(b);
    };
    World.prototype.getBodiesAtCoords = function (x, y) {
        var a = new Array();
        this.bb.forEach(function (value) {
            var r = value.r;
            if (!(r.left > x || (r.left + r.width) < x || r.top > y || (r.top + r.height) < y)) {
                a.push(value);
            }
        });
        return a;
    };
    World.prototype.getBody = function (id) {
        if (this.bb.ContainsKey(id))
            return this.bb.Item(id);
        else
            return undefined;
    };
    World.prototype.getChildren = function (parentId) {
        var a = new Array();
        this.bb.forEach(function (value) {
            if (value.parentId === parentId && value.id !== parentId) {
                a.push(value);
            }
        });
        return a;
    };
    World.prototype.init = function () {
        this.bb = new Dictonary();
        this.ll = new Dictonary();
        var n = document.getElementsByClassName("mm-node");
        for (var i = 0; i < n.length; i++) {
            var g = n[i];
            var b = new Body(g, this);
            this.addb(b);
        }
        n = document.getElementsByClassName("mm-link");
        for (var i = 0; i < n.length; i++) {
            var e = n[i];
            var l = new Link(e, this);
            this.addl(l);
        }
    };
    World.prototype.removeb = function (b) {
        if (this.bb.ContainsKey(b.id)) {
            this.bb.Remove(b.id);
            this.ll.Remove(b.link.id);
            b.link.a.nchildren--;
            b.e.remove();
            b.link.e.remove();
        }
        this.selectBody();
        return b;
    };
    World.prototype.addb = function (b) {
        this.bb.Add(b.id, b);
        this.selectBody(b);
        return b;
    };
    World.prototype.addl = function (l) {
        this.ll.Add(l.id, l);
        return l;
    };
    World.prototype.step = function () {
        var n = this.bb.Count;
        var nl = this.ll.Count;
        for (var i = 0; i < (n - 1); i++) {
            for (var k = i + 1; k < n; k++) {
                this.bb.Values[i].dinamics(this.bb.Values[k]);
            }
        }
        for (var i = 0; i < nl; i++) {
            this.ll.Values[i].dinamics();
        }
        for (var i = 0; i < n; i++) {
            this.bb.Values[i].borderBouncing();
            this.bb.Values[i].cinematics();
        }
        for (var i = 0; i < nl; i++) {
            this.ll.Values[i].cinematics();
        }
    };
    World._nonce = new Date().getTime();
    return World;
}());
var Body = /** @class */ (function () {
    function Body(e, w) {
        this.parentId = "";
        this.m = 1;
        this.nchildren = 0;
        this.grabbed = false;
        this.fixed = false;
        this.W = w;
        this.p = this.W.root.createSVGPoint();
        this.v = this.W.root.createSVGPoint();
        this.a = this.W.root.createSVGPoint();
        this.e = e;
        this.id = e.id;
        this.resized();
        this.p.x = Body.getNumericValue(e.getAttribute("x"));
        this.p.y = Body.getNumericValue(e.getAttribute("y"));
        this.v.x = Body.getNumericValue(e.dataset.vx);
        this.v.y = Body.getNumericValue(e.dataset.vy);
        this.a.x = 0;
        this.a.y = 0;
    }
    Body.prototype.resized = function () {
        this.r = this.e.getBoundingClientRect();
        this.m = this.r.width * this.r.height / 1000;
    };
    Body.getNumericValue = function (value) {
        var n = 0;
        if (value)
            if (value !== undefined) {
                n = parseInt(value);
            }
        if (n === NaN)
            n = 0;
        return n;
    };
    Body.prototype.dist = function (b) {
        var d = new Dist();
        d.dx = b.p.x - this.p.x;
        d.dy = b.p.y - this.p.y;
        d.d2 = d.dx * d.dx + d.dy * d.dy;
        d.d = Math.sqrt(d.d2);
        if (d.d === 0)
            d.d = .0000000001;
        if (d.d2 === 0)
            d.d2 = .0000000001;
        return d;
    };
    Body.prototype.dinamics = function (b) {
        var d = this.dist(b);
        var f = -this.m * b.m * this.W.repulsione / d.d2;
        var acc;
        var acc_d;
        // accelerazioni proprie
        acc = f / this.m;
        acc_d = acc / d.d;
        this.a.x += (d.dx * acc_d);
        this.a.y += (d.dy * acc_d);
        // accelerazioni corpo b
        acc = -f / b.m;
        acc_d = acc / d.d;
        b.a.x += (d.dx * acc_d);
        b.a.y += (d.dy * acc_d);
    };
    Body.prototype.borderBouncing = function () {
        var urtoX = false;
        var urtoY = false;
        var dx = this.p.x - this.W.padding - this.r.width / 2;
        var dy = this.p.y - this.W.padding - this.r.height / 2;
        if (dx < 0) {
            urtoX = true;
        }
        else {
            dx = this.p.x - (-this.W.padding + this.W.root.clientWidth) + this.r.width / 2;
            urtoX = (dx > 0);
        }
        if (dy < 0) {
            urtoY = true;
        }
        else {
            dy = this.p.y - (-this.W.padding + this.W.root.clientHeight) + this.r.height / 2;
            urtoY = (dy > 0);
        }
        var f = 0;
        var acc;
        if (urtoX) {
            f = dx * this.W.k;
            acc = -10 * f / this.m;
            this.a.x += acc;
        }
        if (urtoY) {
            f = dy * this.W.k;
            acc = -10 * f / this.m;
            this.a.y += acc;
        }
    };
    Body.prototype.cinematics = function () {
        this.v.x += (this.a.x + this.W.gx);
        this.v.y += (this.a.y + this.W.gy);
        if (!(this.fixed || this.grabbed)) {
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
    };
    Body.prototype.getChildren = function () {
        return this.W.getChildren(this.id);
    };
    return Body;
}());
var Link = /** @class */ (function () {
    function Link(e, w) {
        this.l = 50;
        this.opacity = .5;
        this.W = w;
        this.e = e;
        this.id = e.id;
        this.a = this.W.getBody(e.dataset.from);
        this.b = this.W.getBody(e.dataset.to);
        this.b.link = this;
        this.b.parentId = this.a.id;
        this.a.nchildren++;
    }
    Link.prototype.dinamics = function () {
        var d = this.a.dist(this.b);
        var dx = (d.d - this.l);
        var f = dx * this.W.k;
        var acc;
        // accelerazioni corpo a
        acc = f / this.a.m;
        this.a.a.x += (d.dx * acc / d.d);
        this.a.a.y += (d.dy * acc / d.d);
        // accelerazioni corpo b
        acc = -f / this.b.m;
        this.b.a.x += (d.dx * acc / d.d);
        this.b.a.y += (d.dy * acc / d.d);
        this.opacity = 1 - dx / d.d;
    };
    Link.prototype.cinematics = function () {
        this.e.setAttribute("x1", this.a.p.x + "");
        this.e.setAttribute("y1", this.a.p.y + "");
        this.e.setAttribute("x2", this.b.p.x + "");
        this.e.setAttribute("y2", this.b.p.y + "");
        this.e.style.opacity = this.opacity + "";
    };
    return Link;
}());
//# sourceMappingURL=sp.js.map