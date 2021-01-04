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
/// <reference path="lib/sp.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />
var parentNotifyExpected = false;
var MW;
try {
    sendMessageToParent("app_start", "");
    parentNotifyExpected = true;
}
catch (e) { }
function notifyParent(msg, b) {
    if (parentNotifyExpected) {
        try {
            sendMessageToParent(msg, b);
        }
        catch (e) { }
    }
}
function onPageCommand(cmd, par, getXml) {
    var retVal = "";
    try {
        switch (cmd) {
            case 'add_nodo':
                MW.addNodo();
                break;
            case 'rem_nodo':
                MW.remNodo();
                break;
            case 'set_content':
                if (MW.snb) {
                    MW.snb.setContent(par);
                }
                ;
                break;
            case 'set_fixed':
                if (MW.snb) {
                    MW.snb.setFixed(par);
                }
                ;
                break;
            case 'set_w':
                if (MW.snb) {
                    MW.snb.setWidth(par);
                }
                ;
                break;
            case 'set_h':
                if (MW.snb) {
                    MW.snb.setHeight(par);
                }
                ;
                break;
            case 'set_r':
                if (MW.snb) {
                    MW.snb.setRadius(par);
                }
                ;
                break;
            case 'set_a':
                MW.attrito = par;
                break;
            case 'set_gy':
                MW.gy = par;
                break;
            case 'set_gx':
                MW.gx = par;
                break;
            case 'get_xml':
                retVal = MW.getXml();
                break;
        }
        if (getXml) {
            retVal = MW.getXml();
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
    return retVal;
}
var MyWorld = /** @class */ (function (_super) {
    __extends(MyWorld, _super);
    function MyWorld(root, gy, attrito) {
        var _this = _super.call(this, root) || this;
        MW = _this;
        _this.gy = gy;
        _this.attrito = .97;
        var instance = _this;
        _this.e_content = document.getElementById("label");
        _this.e_fixed = document.getElementById("fixed");
        if (_this.e_content) {
            _this.e_content.addEventListener("input", function (ev) { onPageCommand("set_content", instance.e_content.value); });
            document.getElementById("add_nodo").addEventListener("click", function (ev) { onPageCommand("add_nodo", ""); });
            document.getElementById("rem_nodo").addEventListener("click", function (ev) { onPageCommand("rem_nodo", ""); });
            _this.e_fixed.addEventListener("change", function (ev) { onPageCommand("set_fixed", ev.srcElement.checked); });
            var gr_1 = $("#gravity");
            var grv_1 = $("#gravity_value");
            gr_1.slider({
                min: -.1, max: .1, step: .005, value: instance.gy,
                slide: function (event, ui) {
                    var v = gr_1.slider("value");
                    onPageCommand("set_gy", v);
                    grv_1.html((v) + "");
                }
            });
            var at_1 = $("#attrito");
            var atv_1 = $("#attrito_value");
            at_1.slider({
                min: .85, max: 1, step: .005, value: instance.attrito,
                slide: function (event, ui) {
                    var v = at_1.slider("value");
                    onPageCommand("set_a", v);
                    atv_1.html((v) + "");
                }
            });
            var lar_1 = $("#lar");
            var larv_1 = $("#lar_value");
            lar_1.slider({
                min: 50, max: 400, step: 1, value: 100,
                slide: function (event, ui) {
                    var v = lar_1.slider("value");
                    onPageCommand("set_w", v);
                    larv_1.html((v) + "");
                }
            });
            var alt_1 = $("#alt");
            var altv_1 = $("#alt_value");
            alt_1.slider({
                min: 50, max: 800, step: 1, value: 100,
                slide: function (event, ui) {
                    var v = alt_1.slider("value");
                    onPageCommand("set_h", v);
                    altv_1.html((v) + "");
                }
            });
            var rad_1 = $("#rad");
            var radv_1 = $("#rad_value");
            rad_1.slider({
                min: 1, max: 100, step: 1, value: 10,
                slide: function (event, ui) {
                    var v = rad_1.slider("value");
                    onPageCommand("set_r", v);
                    radv_1.html((v) + "");
                }
            });
        }
        return _this;
    }
    // -------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------
    MyWorld.prototype.addNodo = function () {
        var parentId = "";
        if (this.snb) {
            parentId = this.snb.id;
            MM.node(parentId, World.nonce + "", "", "", "");
        }
        else {
            if (parentId !== "" || this.bb.Count === 0) {
                MM.node(parentId, World.nonce + "", "", this.root.clientWidth / 2 + "", this.root.clientHeight / 2 + "");
            }
        }
    };
    // -------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------
    MyWorld.prototype.remNodo = function () {
        if (this.snb) {
            if (this.snb.nchildren === 0) {
                this.removeb(this.snb);
            }
            else {
                if (confirm('sei sicuro di volere eliminare questo nodo e tutti i suoi figlioletti?')) {
                    var a = this.getChildren(this.snb.id);
                    a.forEach(function (value) {
                        this.removeb(value);
                    });
                    this.removeb(this.snb);
                }
            }
        }
    };
    MyWorld.prototype.onBodyUnselected = function (b) {
        b.b.classList.remove("mm-selected");
    };
    MyWorld.prototype.onBodySelected = function (b) {
        b.b.classList.add("mm-selected");
        this.snb = b;
        if (this.e_content) {
            this.e_content.value = this.snb.label.replace(/\|/g, String.fromCharCode(10));
            this.e_fixed.checked = this.snb.fixed;
        }
        notifyParent("bodySelected", b);
    };
    MyWorld.prototype.onBodyMoved = function (b) {
        notifyParent("bodyMoved", b);
    };
    MyWorld.prototype.getXml = function () {
        try {
            var root = $.parseXML("<mm></mm>");
            root.documentElement.setAttribute("gy", this.gy + "");
            root.documentElement.setAttribute("attrito", this.attrito + "");
            this.addn(root.documentElement, "");
            return new XMLSerializer().serializeToString(root);
        }
        catch (ex) {
            console.log(ex.message);
        }
    };
    MyWorld.prototype.addn = function (e, parentId) {
        var a = this.getChildren(parentId);
        var n = a.length;
        var ne;
        var instance = this;
        a.forEach(function (value) {
            ne = document.createElement("nodo");
            var label = value.label;
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
    };
    return MyWorld;
}(World));
var NodeBody = /** @class */ (function (_super) {
    __extends(NodeBody, _super);
    function NodeBody(e, w) {
        var _this = _super.call(this, e, w) || this;
        _this.b = e.children[1];
        _this.l = e.children[2];
        return _this;
    }
    NodeBody.prototype.setFixed = function (fixed) {
        this.fixed = fixed;
        if (this.fixed) {
            this.o.style.display = "none";
            this.i.style.display = "";
        }
        else {
            this.o.style.display = "";
            this.i.style.display = "none";
        }
    };
    NodeBody.prototype.refreshLabel = function () {
        this.ld.innerHTML = MM.getBoxHtml(this.label, this.ld);
    };
    NodeBody.prototype.setContent = function (l) {
        this.label = l.replace(/(?:\r\n|\r|\n)/g, '|');
        this.ld.innerHTML = MM.getBoxHtml(l, this.ld);
    };
    NodeBody.prototype.setWidth = function (w) {
        this.b.setAttribute("width", w + "");
        this.o.setAttribute("width", w + "");
        this.l.setAttribute("width", w + "");
        this.i.setAttribute("x", w / 2 - 15 + "");
        this.resized();
        this.refreshLabel();
    };
    NodeBody.prototype.setHeight = function (h) {
        this.b.setAttribute("height", h + "");
        this.o.setAttribute("height", h + "");
        this.l.setAttribute("height", h + "");
        this.resized();
        this.refreshLabel();
    };
    NodeBody.prototype.setRadius = function (r) {
        this.b.setAttribute("rx", r + "");
        this.b.setAttribute("ry", r + "");
        this.o.setAttribute("rx", r + "");
        this.o.setAttribute("ry", r + "");
        this.resized();
        this.refreshLabel();
    };
    NodeBody.prototype.resized = function () {
        _super.prototype.resized.call(this);
        if (this.ld) {
            this.ld.style.width = (this.r.width - 3) + "px";
            this.ld.style.height = (this.r.height - 3) + "px";
        }
    };
    return NodeBody;
}(Body));
var MMLink = /** @class */ (function (_super) {
    __extends(MMLink, _super);
    function MMLink(e, w) {
        var _this = _super.call(this, e, w) || this;
        _this.l = 40;
        return _this;
    }
    return MMLink;
}(Link));
var MM = /** @class */ (function () {
    function MM() {
    }
    MM.getBoxHtml = function (txt, div) {
        var s = txt;
        s = s.replace(/(?:\r\n|\r|\n)/g, '<br>');
        s = s.replace(/\|/g, "<br />");
        if (s.substr(0, 1) === '@') {
            var id = s.substr(3, s.length - 4);
            if (Client != undefined) {
                try {
                    switch (s.substr(1, 1)) {
                        case 'X':
                            Client.getHtmlAsync("x", id, function (d) {
                                div.innerHTML = d;
                            });
                            s = "";
                        case 'M':
                            s = "<img draggable='false' src='" + id + "' style='width:100%'  />";
                            break;
                        case 'A':
                            Client.getArgomentoAsync(id, function (d) {
                                s = "<br />" + "Argomento  " + d.statoArgomento + "<br /><a href=javascript:parent.P.SelezionaArgomentoById('" + d.argomentoId + "'); >" + d.argomento + "</a>";
                                div.innerHTML = s;
                            });
                            s = "";
                        case 'P':
                            Client.getPillolaAsync(id, function (d) {
                                s = "Pillola " + "<br />" + d.titolo;
                                div.innerHTML = s;
                            });
                            s = "";
                        default:
                    }
                }
                catch (ex) {
                    s = "PUPPA";
                }
            }
            else {
                s = "pippo";
            }
        }
        return s;
    };
    MM.node = function (parentId, id, txt, x, y, _w, _h, _r) {
        var liv = 0;
        var px = 400;
        var py = 500;
        var w = 160;
        var h = 90;
        var r = 10;
        var sel = W.getBody(parentId);
        if (sel != undefined) {
            liv = Body.getNumericValue(sel.e.dataset.livello) + 1;
            px = sel.p.x + Math.random() * 50 - 20;
            py = sel.p.y - sel.r.height + Math.random() * 50 - 20;
        }
        if (_w === undefined || _w === "" || _h === undefined || _h === "" || _r === undefined || _r === "") {
            r = 10;
            switch (liv) {
                case 0:
                    w = 160;
                    h = 90;
                    break;
                case 1:
                    w = 130;
                    h = 70;
                    break;
                case 2:
                    w = 100;
                    h = 40;
                    break;
                default:
                    w = 90;
                    h = 30;
            }
        }
        else {
            w = parseInt(_w);
            h = parseInt(_h);
            r = parseInt(_r);
        }
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = id;
        g.setAttribute("transform", "translate(" + px + "," + py + ") rotate(0)");
        g.setAttribute("data-livello", liv + "");
        var o = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        o.id = "or_" + id;
        o.setAttribute("x", "5");
        o.setAttribute("y", "5");
        o.setAttribute("width", w + "");
        o.setAttribute("height", h + "");
        o.classList.add("mm-node-shade");
        g.appendChild(o);
        var n = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        n.id = "r_" + id;
        n.setAttribute("width", w + "");
        n.setAttribute("height", h + "");
        n.classList.add("mm-node");
        n.classList.add("mm-liv-" + liv + "");
        g.appendChild(n);
        var t = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        t.id = "t_" + id;
        t.setAttribute("x", "0");
        t.setAttribute("y", "0");
        t.setAttribute("width", w + "");
        t.setAttribute("height", h + "");
        t.classList.add("mm-node-text");
        t.classList.add("mm-text-liv-" + liv + "");
        var div = document.createElement("div");
        div.style.height = (h - 4) + "px";
        div.style.width = (w - 4) + "px";
        div.innerHTML = this.getBoxHtml(txt, div);
        div.classList.add("mm-node-text");
        div.classList.add("mm-text-liv-" + liv + "");
        t.appendChild(div);
        g.appendChild(t);
        var i = document.createElementNS("http://www.w3.org/2000/svg", "image");
        i.id = "pi_" + id;
        i.setAttribute("x", w / 2 - 15 + "");
        i.setAttribute("y", "-10");
        i.setAttribute("width", "20");
        i.setAttribute("height", "30");
        i.setAttribute("href", "app/img/pin.png");
        i.style.display = "none";
        g.appendChild(i);
        W.root.appendChild(g);
        var b = new NodeBody(g, W);
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
            var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
            l.id = "l_" + id;
            l.setAttribute("x1", sel.p.x + "");
            l.setAttribute("y1", sel.p.y + "");
            l.setAttribute("x2", b.p.x + "");
            l.setAttribute("y2", b.p.y + "");
            l.classList.add("mm-link");
            l.classList.add("mm-link-liv-" + liv);
            l.setAttribute("data-from", sel.id);
            l.setAttribute("data-to", g.id);
            W.root.insertBefore(l, W.root.firstChild);
            W.addl(new MMLink(l, W));
        }
    };
    return MM;
}());
//# sourceMappingURL=mm.js.map