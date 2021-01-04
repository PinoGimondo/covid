/// <reference path="collections.ts" />
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
// ---------------------------------------------------------------------
// ENUM: MsgBoxType
// ---------------------------------------------------------------------
var MsgBoxType;
(function (MsgBoxType) {
    MsgBoxType[MsgBoxType["okOnly"] = 1] = "okOnly";
    MsgBoxType[MsgBoxType["OkCancel"] = 2] = "OkCancel";
    MsgBoxType[MsgBoxType["YesNo"] = 3] = "YesNo";
})(MsgBoxType || (MsgBoxType = {}));
// ---------------------------------------------------------------------
// ENUM: PopUpPosition
// ---------------------------------------------------------------------
var PopUpPosition;
(function (PopUpPosition) {
    PopUpPosition[PopUpPosition["sideAction"] = 1] = "sideAction";
    PopUpPosition[PopUpPosition["centerScreen"] = 2] = "centerScreen";
})(PopUpPosition || (PopUpPosition = {}));
// ---------------------------------------------------------------------
// CLASS: Page
// ---------------------------------------------------------------------
var Page = /** @class */ (function () {
    function Page() {
        Page.instance = this;
        Page.registerClass(Component);
        Page.registerClass(ListViewItem);
        Page.registerClass(ListView);
        Page.registerClass(TreeViewNode);
        Page.registerClass(TreeView);
        Page.registerClass(PopUp);
        Page.registerClass(FixedPopUp);
        Page.registerClass(DialogBox);
        Page.registerClass(MsgBox);
        Page.initPage(this.onPageReady);
    }
    Page.prototype.onPageReady = function () { };
    Page.registerClass = function (classRef) {
        try {
            var cn = void 0;
            if (isdef(classRef["name"]))
                cn = classRef.name.toString().toLowerCase();
            else {
                Page.error("Class " + classRef.toString() + " not defined!");
            }
            if (!Page.classes.ContainsKey(cn))
                Page.classes.Add(cn, classRef);
        }
        catch (e) {
        }
    };
    Page.getResourceFile = function (filename) {
        var s = sessionStorage.getItem(filename);
        if (!s) {
            $.ajaxSetup({ async: false });
            $.get(filename, function (doc) {
                s = doc;
                sessionStorage.setItem(filename, s);
            });
            $.ajaxSetup({ async: true });
        }
        return s;
    };
    Page.insertComponents = function (e) {
        var c;
        var cn;
        var tid;
        var id;
        var _loop_1 = function (i) {
            c = e.children[i];
            cn = c.tagName.toLowerCase();
            if (Page.classes.ContainsKey(cn)) {
                id = c.getAttribute("id");
                if (isStringEmpty(id))
                    id = "id_" + Page.nonce;
                tid = c.getAttribute("templateId");
                var cmp_1 = Page.getComponentById(tid);
                cmp_1.htmlElementId = id;
                var cname = c.getAttribute("name");
                if (isStringEmpty(cname))
                    cname = "cn_" + Page.nonce;
                var _cname_1 = "_" + cname;
                Page.instance[_cname_1] = cmp_1;
                Object.defineProperty(Page.instance, cname, {
                    get: function () { return Page.instance[_cname_1]; },
                });
                try {
                    cmp_1.isRenderingInsideAnotherComponent = true;
                    var re_1 = cmp_1.getRenderedHtmlElement();
                    c.insertAdjacentHTML("afterend", re_1.outerHTML);
                    c.parentElement.removeChild(c);
                    //                     c.outerHTML = re.outerHTML;
                    window.setTimeout(function () {
                        cmp_1.onAfterRender(re_1, undefined);
                    }, 300);
                    cmp_1.isRenderingInsideAnotherComponent = false;
                }
                catch (err) {
                    Page.error(err.message);
                }
            }
            else
                Page.insertComponents(c);
        };
        for (var i = 0; i < e.children.length; i++) {
            _loop_1(i);
        }
    };
    Page.createComponentInstance = function (type, e) {
        if (Page.classes.ContainsKey(type)) {
            var classRef = Page.classes.Item(type);
            var c = new classRef(e);
            Page.componenti.Add(c.id, c);
            return c;
        }
        else {
            Page.error("class '" + type + " is not registered!");
            return null;
        }
    };
    Page.initPage = function (onComplete) {
        $.get("app/config.json", function (jDoc) {
            jDoc.resources.forEach(function (value, index) {
                var doc = Page.getResourceFile(value.url);
                var xmlDoc = $.parseXML(doc);
                var item;
                var type;
                var e;
                xmlDoc.firstChild.childNodes.forEach(function (node, index) {
                    switch (node.nodeName.toLowerCase()) {
                        case "itemtemplate":
                            e = node;
                            type = e.attributes.getNamedItem("type").value.toLowerCase();
                            if (!Page.classes.ContainsKey(type)) {
                                Page.registerClass(type);
                            }
                            Page.insertComponents(e);
                            var newComponent = Page.createComponentInstance(type, e);
                            break;
                        default:
                    }
                });
            });
            Page.insertComponents($('body')[0]);
            Page.msb = Page.getComponentById("msgBox");
            Page.msb.renderAndAppendToBody();
            onComplete();
        });
    };
    Page.error = function (msg, preText) {
        if (isdef(preText))
            msg = preText + msg;
        console.log(msg);
        alert(msg);
    };
    Page.getComponentByNonce = function (nonce) {
        var e = $("[nonce='" + nonce + "']")[0];
        var c = null;
        if (e.dataset.cid)
            c = Page.getComponentById(e.dataset.cid);
        return c;
    };
    Page.getComponentById = function (id) {
        if (this.componenti.ContainsKey(id))
            return this.componenti.Item(id);
        else {
            Page.error("Component '" + id + "' not found!", "e1:");
            return null;
        }
    };
    Object.defineProperty(Page, "nonce", {
        get: function () {
            Page._nonce += 1;
            return Page._nonce;
        },
        enumerable: false,
        configurable: true
    });
    Page.msgbox = function (msg, onOk, type) {
        if (type === undefined)
            type = 2;
        Page.msb.showMsgBox(msg, type, onOk);
    };
    Page._nonce = new Date().getTime();
    Page.classes = new Dictonary();
    Page.componenti = new Dictonary();
    return Page;
}());
// ---------------------------------------------------------------------
// CLASS: Component
// ---------------------------------------------------------------------
var Component = /** @class */ (function () {
    function Component(e) {
        this.isRenderingInsideAnotherComponent = false;
        this.innerComponents = new Dictonary();
        this.classname = "";
        this.childrenCount = 0;
        this.htmlElementId = "";
        this.classname = this.constructor.name;
        if (isdef(e)) {
            this.id = e.getAttribute("componentId");
            if (!this.id) {
                this.id = e.id;
            }
            if (this.id === "") {
                this.id = "cid_" + Page.nonce;
            }
            this.te = e;
        }
        else {
            var xd = $.parseXML("<div></div>");
            this.te = document.createElementNS(xd.namespaceURI, this.classname);
            this.te.appendChild(xd.documentElement);
        }
        if (!this.events) {
            this.events = new Array();
        }
        this._dataContext = Component.getAttributeValue(e, "dataContext").trim();
        this.topElementTagName = this.te.firstElementChild.tagName.toLowerCase();
    }
    Object.defineProperty(Component.prototype, "renderedId", {
        get: function () {
            if (isStringEmpty(this.htmlElementId))
                return this.id;
            else
                return this.htmlElementId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "$", {
        get: function () {
            if (this._$ === undefined)
                this._$ = $("#" + this.renderedId);
            return this._$;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "dataContext", {
        get: function () { return this._dataContext; },
        set: function (value) {
            this._dataContext = value;
            if (this._dataContext.constructor.name === "String") {
            }
            else {
                this.reRender(this._dataContext);
            }
        },
        enumerable: false,
        configurable: true
    });
    Component.updateComponents = function (newObject, oldObject) {
        if (oldObject === undefined && (containsText(newObject.uid))) {
            oldObject = Component.getDataContextByUid(newObject.uid);
        }
        newObject.nonce = oldObject.nonce;
        Component.saveDataContextInstance(newObject);
        var jq = $("[data-o='" + newObject.uid + "']");
        var e;
        var oc;
        for (var index = 0; index < jq.length; index++) {
            e = jq[index];
            oc = Component.getOwnerComponent(e);
            var cc = e.dataset.s.replace(/\[/g, "{").split(";");
            for (var i = 0; i < cc.length; i++) {
                if (cc[i] !== "") {
                    var ss = cc[i].split("|");
                    if (ss[0] === "") {
                        e.innerHTML = Component.processAttributeValue(oc, ss[1], newObject);
                    }
                    else {
                        e.setAttribute(ss[0], Component.processAttributeValue(oc, ss[1], newObject));
                    }
                }
            }
        }
    };
    Component.processAttributeValue = function (c, attributeValue, dc) {
        var s = attributeValue;
        try {
            if (s.indexOf("{") >= 0) {
                var par = getWordsBetweenCurlyBrackets(s);
                var v_1;
                par.forEach(function (value, index, array) {
                    if (value.indexOf("()") > 0) {
                        var funcName = value.replace("()", "").trim();
                        if (c[funcName]) {
                            v_1 = c[funcName](dc);
                            s = s.replace("{" + value + "}", escapeForXml(v_1));
                        }
                    }
                    else {
                        v_1 = dc[value];
                        if (v_1 === undefined)
                            v_1 = "";
                        s = s.replace("{" + value + "}", escapeForXml(v_1));
                    }
                });
            }
        }
        catch (e) {
            console.log("error processing attribute value: " + e.message);
        }
        return s;
    };
    Component.addAttributeComponent = function (e, attributeName, value) {
        var currentValue = this.getAttributeValue(e, attributeName);
        if (!currentValue)
            currentValue = "";
        e.setAttribute(attributeName, currentValue + " " + value);
    };
    Component.replaceAttributes = function (c, e, dc) {
        var a;
        var v;
        var pv;
        try {
            if (e.children.length > 0) {
                for (var i = 0; i < e.children.length; i++) {
                    this.replaceAttributes(c, e.children.item(i), dc);
                }
            }
            else {
                var t = e.innerHTML.trim();
                if (t !== "" && t.indexOf("{") >= 0) {
                    e.setAttribute("data-o", dc.uid);
                    e.setAttribute("data-s", this.getAttributeValue(e, "data-s") + "|" + t.replace(/{/g, "[") + ";");
                    e.innerHTML = Component.processAttributeValue(c, t, dc);
                }
            }
            for (var i = 0; i < e.attributes.length; i++) {
                a = e.attributes.item(i).name;
                if (!(a === "data-s" || a === "data-o")) {
                    v = e.attributes.item(i).value;
                    if (v.indexOf("{") >= 0) {
                        e.setAttribute("data-o", dc.uid);
                        e.setAttribute("data-s", this.getAttributeValue(e, "data-s") + a + "|" + v.replace(/{/g, "[") + ";");
                        pv = Component.processAttributeValue(c, v, dc);
                        e.setAttribute(a, pv);
                    }
                }
            }
        }
        catch (err) {
            console.log("error processing attribute values" + err.message);
        }
    };
    Component.prototype.getSupportElements = function (parentNode, nonce, oid) {
        var a = new Array();
        var i;
        i = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
        i.src = "img/onepixel.png";
        i.style.display = "none";
        i.setAttribute("onload", "Component.componentLoaded('" + nonce + "','" + oid + "');");
        a.push(i);
        return a;
    };
    Component.prototype.onBeforeRender = function (e) { };
    Component.prototype.onRender = function (e, dc, nonce) { };
    Component.prototype.onChildrenRender = function (e, dc, nonce) { return 0; };
    Component.prototype.onAfterRender = function (e, dc) {
        //this.$.find(".html").jqte({
        //    outdent: false, indent: false, br: true, p: false, link: false, unlink: false
        //});
        this.$.find(".datepicker").datepicker();
        this.$.parent().show();
    };
    Component.prototype.getRenderedHtmlElement = function (dc) {
        try {
            return this.render(dc);
        }
        catch (e) {
            Page.error(e.message, "e2:");
        }
    };
    Component.prototype.render = function (dc) {
        var e = this.te.firstElementChild.cloneNode(true);
        this.onBeforeRender(e);
        this._$ = undefined;
        if (!isdef(dc))
            dc = this;
        else {
            Component.saveDataContextInstance(dc);
        }
        var nonce = Page.nonce + "";
        if (dc.uid)
            e.setAttribute("data-oid", dc.uid);
        var nn = dc.nonce;
        if (!nn) {
            nn = new Array();
            dc.nonce = nn;
        }
        if (nn.indexOf(nonce) < 0)
            nn.push(nonce);
        var cn = this.classname;
        e.setAttribute("nonce", nonce);
        e.setAttribute("data-cn", cn);
        e.setAttribute("data-cid", this.id);
        this.events.forEach(function (value, index, array) {
            var onevent = value.toLowerCase();
            if (onevent.substr(0, 2) !== "on")
                onevent = "on" + onevent;
            e.setAttribute(onevent, cn + ".e('" + value + "');");
        });
        var el = this.getSupportElements(e, nonce, dc.uid);
        for (var i = 0; i < el.length; i++) {
            e.appendChild(el[i]);
        }
        this.childrenCount = this.onChildrenRender(e, dc, nonce);
        if (!this.isRenderingInsideAnotherComponent) {
            Component.instances.Add(nonce, this);
            try {
                Component.replaceAttributes(this, e, dc);
            }
            catch (err) {
                console.log(err.message);
            }
        }
        this.onRender(e, dc, nonce);
        if (!isdef(e.id))
            e.id = this.id;
        this.htmlElementId = e.id;
        return e;
    };
    Component.prototype.appendTo = function (e, dc) {
        var he = this.render(dc);
        e.append(he.outerHTML);
        this.onAfterRender(he, dc);
        return he;
    };
    Component.prototype.renderAndAppendToBody = function (dc) {
        return this.appendTo($('body'), dc);
    };
    Component.prototype.reRender = function (dc) {
        return this.renderAs(this.htmlElementId, dc);
    };
    Component.prototype.renderAs = function (targetId, dc) {
        var e = $("#" + targetId);
        if (e.length > 0) {
            var he = this.render(dc);
            e.parent().html(he.outerHTML);
            this.onAfterRender(he, dc);
            return he;
        }
        else {
            Page.error("element id: " + targetId + " not found!");
            return null;
        }
    };
    Component.prototype.renderInto = function (targetId, dc) {
        var e = $("#" + targetId);
        var he = this.render(dc);
        e.html(he.outerHTML);
        this.onAfterRender(he, dc);
        return he;
    };
    Component.prototype.getFormData = function () {
        var fd = new Object;
        this.forEachControl(function (item, tagName, name, value) {
            if (!isStringEmpty(name))
                fd[name] = item.value;
        });
        return fd;
    };
    Component.prototype.setFormData = function (data) {
        this.forEachControl(function (item, tagName, name, value) {
            if (data.hasOwnProperty(name)) {
                item.value = data[name];
            }
            if (item.classList.contains("jqte_editor")) {
                var x_1 = item.nextElementSibling.firstElementChild;
                item.innerHTML = x_1.value;
            }
        });
    };
    Component.prototype.forEachControl = function (func) {
        var name;
        this.$.find("input").each(function (i, item) {
            name = item.name;
            if (isStringEmpty(name))
                name = item.id;
            func(item, "input", name, item.value);
        });
        this.$.find("textarea").each(function (i, item) {
            name = item.name;
            if (isStringEmpty(name))
                name = item.id;
            func(item, "input", name, item.value);
        });
        this.$.find("select").each(function (i, item) {
            name = item.name;
            if (isStringEmpty(name))
                name = item.id;
            func(item, "input", name, item.value);
        });
        this.$.find(".jqte_editor").each(function (i, item) {
            name = item.id;
            func(item, "jqte_editor", name, item.innerText);
        });
    };
    Component.prototype.registerEvent = function (eventName) {
        if (this.events.indexOf(eventName) === -1)
            this.events.push(eventName);
    };
    Component.getOwnerComponent = function (e) {
        var oe = Component.getSenderRecursive(e);
        if (oe) {
            return Page.getComponentById(oe.dataset.cid);
        }
        else
            return null;
    };
    Component.getSenderRecursive = function (e) {
        if (e) {
            var n = e.getAttribute("nonce");
            if (n)
                return e;
            else
                return (Component.getSenderRecursive(e.parentElement));
        }
        else
            return null;
    };
    Component.removeInstance = function (nonce) {
        if (Component.instances.ContainsKey(nonce))
            Component.instances.Remove(nonce);
    };
    Component.instance = function (nonce) {
        return Component.instances.Item(nonce);
    };
    Component.getDataContextByUid = function (uid) {
        return Component.objects.Item(uid);
    };
    Component.saveDataContextInstance = function (o) {
        if (containsText(o.uid)) {
            var doAdd = false;
            var oo = Component.objects.Item(o.uid);
            if (isdef(oo)) {
                if (oo.instanceId !== o.instanceId) {
                    Component.objects.Remove(o.uid);
                    doAdd = true;
                }
            }
            else
                doAdd = true;
            if (doAdd) {
                Component.objects.Add(o.uid, o);
            }
        }
    };
    Component.e = function (eventName) {
        var e = Component.getSenderRecursive(event.target);
        var n = e.getAttribute("nonce");
        var instance = Component.instance(n);
        var dc = Component.getDataContextByUid(e.dataset.oid);
        if (isdef(instance))
            instance.onEvent(eventName, dc, e, event);
        event.stopPropagation();
    };
    Component.prototype.onEvent = function (eventName, dc, sender, event) {
        if (isdef(this[eventName])) {
            this[eventName](dc, sender, event);
        }
        else {
            if (eventName.substr(0, 2) === "on") {
                eventName = eventName.substr(2);
            }
            else {
                eventName = "on" + eventName;
            }
            if (isdef(this[eventName]))
                this[eventName](dc, sender, event);
        }
    };
    Component.getParameterValue = function (attributeValue, dc) {
        var s = attributeValue;
        if (s.substr(0, 1) === "{") {
            var propertyName = s.substr(1, s.length - 2);
            s = dc[propertyName];
        }
        return s;
    };
    Component.getAttributeValue = function (e, attributeName, defaultValue) {
        var a = e.getAttribute(attributeName);
        if (isdef(a))
            return a;
        else {
            return "";
        }
    };
    Component.getInstances = function (cid) {
        return $("[data-cid='" + cid + "']");
    };
    Component.componentLoaded = function (nonce, oid) {
        var c = Component.instance(nonce);
        var dc = Component.getDataContextByUid(oid);
        if (c)
            c.onComponentLoaded(dc);
    };
    Component.prototype.onComponentLoaded = function (dc) { };
    Component.instances = new Dictonary();
    Component.objects = new Dictonary(); // chiave=uid;
    return Component;
}());
// ---------------------------------------------------------------------
// CLASS: AbstractItem
// ---------------------------------------------------------------------
var AbstractItem = /** @class */ (function (_super) {
    __extends(AbstractItem, _super);
    function AbstractItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AbstractItem;
}(Component));
// ---------------------------------------------------------------------
// CLASS: AbstractList
// ---------------------------------------------------------------------
var AbstractList = /** @class */ (function (_super) {
    __extends(AbstractList, _super);
    function AbstractList(e) {
        var _this = _super.call(this, e) || this;
        if (e !== undefined) {
            _this.itemTemplateId = Component.getAttributeValue(e, "itemTemplateId");
            _this.itemsSource = Component.getAttributeValue(e, "itemsSource").trim();
        }
        return _this;
    }
    Object.defineProperty(AbstractList.prototype, "itemTemplateId", {
        get: function () { return this._itemTemplateId; },
        set: function (value) { this._itemTemplateId = value; this._itemTemplate = null; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractList.prototype, "itemTemplate", {
        get: function () {
            if (!this._itemTemplate)
                this._itemTemplate = Page.getComponentById(this._itemTemplateId);
            return this._itemTemplate;
        },
        enumerable: false,
        configurable: true
    });
    AbstractList.prototype.getItemsFromItemsSource = function (dc) {
        var a;
        var v = this.itemsSource;
        if (!isStringEmpty(v)) {
            var res = void 0;
            if (v.indexOf("{") >= 0) {
                v = getWordsBetweenCurlyBrackets(v)[0];
                if (v.indexOf("()") > 0) {
                    v = v.replace("()", "");
                    res = this[v](dc);
                }
                else {
                    if (dc)
                        res = dc[v];
                }
            }
            try {
                a = res;
            }
            catch (e) { }
        }
        return a;
    };
    AbstractList.getListContainerElement = function (e, template) {
        if (template.topElementTagName === "li") {
            var ne = findElement(e, "ul");
            if (!ne) {
                ne = document.createElementNS(document.namespaceURI, "ul");
                e.appendChild(ne);
            }
            return ne;
        }
        else
            return e;
    };
    return AbstractList;
}(AbstractItem));
var ListViewItem = /** @class */ (function (_super) {
    __extends(ListViewItem, _super);
    function ListViewItem(e) {
        return _super.call(this, e) || this;
    }
    return ListViewItem;
}(AbstractItem));
var ListView = /** @class */ (function (_super) {
    __extends(ListView, _super);
    function ListView(e) {
        return _super.call(this, e) || this;
    }
    ListView.prototype.onChildrenRender = function (e, dc, nonce) {
        var cdcl;
        if (!isStringEmpty(this.itemsSource))
            cdcl = this.getItemsFromItemsSource(dc);
        if (isdef(cdcl)) {
            var tem_1 = this.itemTemplate;
            if (cdcl.length > 0 && isdef(tem_1)) {
                var ne_1 = AbstractList.getListContainerElement(e, tem_1);
                cdcl.forEach(function (value, index) {
                    var re = tem_1.getRenderedHtmlElement(value);
                    tem_1.onAfterRender(re, value);
                    ne_1.append(re);
                });
            }
            return cdcl.length;
        }
        return 0;
    };
    ListView.prototype.onRender = function (e, dc, nonce) {
    };
    return ListView;
}(AbstractList));
// ---------------------------------------------------------------------
// CLASS: TreeViewNode
// ---------------------------------------------------------------------
var TreeViewNode = /** @class */ (function (_super) {
    __extends(TreeViewNode, _super);
    function TreeViewNode(e) {
        var _this = _super.call(this, e) || this;
        if (e !== undefined) {
            _this.expanded = Component.getAttributeValue(e, "expanded").toLowerCase();
        }
        _this.registerEvent("onclick");
        return _this;
    }
    TreeViewNode.prototype.onChildrenRender = function (e, dc, nonce) {
        var fdcl;
        if (!isStringEmpty(this.itemsSource))
            fdcl = this.getItemsFromItemsSource(dc);
        var tem = this.itemTemplate;
        if (tem && fdcl) {
            var ne_2;
            if (fdcl.length > 0) {
                ne_2 = AbstractList.getListContainerElement(e, tem);
            }
            var isExpanded = true;
            if (this.expanded !== "") {
                var expPar = Component.processAttributeValue(this, this.expanded, dc).toLowerCase();
                if (expPar === "false" || expPar === "0" || expPar === "no")
                    isExpanded = false;
            }
            if (ne_2) {
                fdcl.forEach(function (value, index) {
                    var re = tem.getRenderedHtmlElement(value);
                    tem.onAfterRender(re, value);
                    ne_2.append(re);
                });
                if (!isExpanded)
                    ne_2.setAttribute("style", "display:none");
            }
            return fdcl.length;
        }
        else
            return 0;
    };
    TreeViewNode.prototype.onRender = function (e, dc, nonce) {
        e.setAttribute("ccc", new Date().getTime() + "");
        var extraClass = "";
        var isExpanded = true;
        if (this.expanded !== "") {
            var expPar = Component.processAttributeValue(this, this.expanded, dc).toLowerCase();
            if (expPar === "false" || expPar === "0" || expPar === "no")
                isExpanded = false;
        }
        if (this.childrenCount > 0) {
            if (isExpanded) {
                extraClass = TreeViewNode.nodeExpandedClassName;
            }
        }
        else {
            extraClass = TreeViewNode.nodeEmptyClassName;
        }
        Component.addAttributeComponent(e, "class", extraClass);
    };
    TreeViewNode.prototype.onEvent = function (eventName, dc, sender, event) {
        if (eventName === "onclick" || eventName === "click") {
            var me = event;
            if (me.offsetX < 0) {
                this.onNodeControlClick(dc, sender, event);
                return null;
            }
        }
        _super.prototype.onEvent.call(this, eventName, dc, sender, event);
    };
    TreeViewNode.prototype.onNodeControlClick = function (dc, sender, event) {
        this.toggleExpanded(event.target);
    };
    TreeViewNode.prototype.toggleExpanded = function (target) {
        var e = $(target).find("ul");
        if (e[0]) {
            var isExpanded = e.css("display") != "none";
            if (isExpanded) {
                e.hide(200);
                target.classList.remove(TreeViewNode.nodeExpandedClassName);
            }
            else {
                e.show(200);
                target.classList.add(TreeViewNode.nodeExpandedClassName);
            }
        }
    };
    TreeViewNode.nodeEmptyClassName = "nodeEmpty";
    TreeViewNode.nodeSelectedClassName = "nodeSelected";
    TreeViewNode.nodeExpandedClassName = "nodeExpanded";
    return TreeViewNode;
}(AbstractList));
// ---------------------------------------------------------------------
// CLASS: TreeView
// ---------------------------------------------------------------------
var TreeView = /** @class */ (function (_super) {
    __extends(TreeView, _super);
    function TreeView(e) {
        var _this = _super.call(this, e) || this;
        _this.selectedElements = null;
        return _this;
    }
    TreeView.prototype.setSelected = function (targets) {
        if (this.selectedElements)
            for (var i = 0; i < this.selectedElements.length; i++) {
                this.selectedElements[i].classList.remove(TreeViewNode.nodeSelectedClassName);
            }
        if (targets)
            for (var i = 0; i < targets.length; i++) {
                targets[i].classList.add(TreeViewNode.nodeSelectedClassName);
            }
        this.selectedElements = targets;
    };
    return TreeView;
}(TreeViewNode));
// ---------------------------------------------------------------------
// CLASS: PopUp
// ---------------------------------------------------------------------
var PopUp = /** @class */ (function (_super) {
    __extends(PopUp, _super);
    function PopUp(e) {
        var _this = _super.call(this, e) || this;
        _this.actionButton = null;
        _this.fromFocus = false;
        _this.fromHover = false;
        _this.width = 600;
        _this.height = 400;
        _this.position = 1;
        var w = Component.getAttributeValue(e, "width").trim().toLowerCase().replace("px", "");
        var h = Component.getAttributeValue(e, "height").trim().toLowerCase().replace("px", "");
        try {
            if (w !== "")
                _this.width = parseInt(w);
            if (h !== "")
                _this.height = parseInt(h);
        }
        catch (e) { }
        return _this;
    }
    PopUp.prototype.onRender = function (e, dc, nonce) {
        Component.addAttributeComponent(e, "class", "popup-overlay");
    };
    PopUp.prototype.onShow = function () {
    };
    PopUp.show = function (id) {
        var instance = Page.getComponentById(id);
        var e = Component.getInstances(id);
        e.css('width', instance.width);
        e.css('height', instance.height);
        switch (instance.position) {
            case PopUpPosition.sideAction:
                var r = instance.actionButton[0].getBoundingClientRect();
                e.css('left', r.left + r.width + 4);
                e.css('top', r.top);
                break;
            case PopUpPosition.centerScreen:
                var vw = document.documentElement.clientWidth;
                var vh = document.documentElement.clientHeight;
                e.css('left', (vw - instance.width) / 2);
                e.css('top', (vh - instance.height) / 2);
                break;
        }
        instance.clearHideTimeout();
        if (instance.fromHover) {
            instance.setToHide(2000);
        }
        e.addClass("active");
        instance.onShow();
    };
    PopUp.hide = function (id) {
        var e = Component.getInstances(id);
        var instance = Page.getComponentById(id);
        instance.fromFocus = false;
        instance.fromFocus = false;
        e[0].parentElement.focus();
        e.removeClass("active");
    };
    PopUp.prototype.clearHideTimeout = function () {
        if (this.hideTimeout) {
            window.clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    };
    PopUp.prototype.setToHide = function (timeout) {
        this.clearHideTimeout();
        var id = this.id;
        this.hideTimeout = window.setTimeout(function () {
            this.hideTimeout = null;
            PopUp.hide(id);
        }, timeout);
    };
    PopUp.prototype.setActionButton = function (buttonElementId) {
        var id = this.id;
        this.actionButton = $("#" + buttonElementId);
        PopUp.hide(id);
        this.fromFocus = false;
        this.fromHover = false;
        if (this.actionButton) {
            this.actionButton.mouseenter(function () {
                var instance = Page.getComponentById(id);
                instance.fromFocus = false;
                instance.fromHover = true;
                PopUp.show(id);
            });
            this.actionButton.focusin(function () {
                var instance = Page.getComponentById(id);
                instance.fromFocus = true;
                instance.fromHover = false;
                PopUp.show(id);
            });
            this.actionButton.focusout(function () {
                var instance = Page.getComponentById(id);
                if (instance.fromFocus) {
                    instance.setToHide(400);
                }
            });
        }
        var e = Component.getInstances(this.id);
        e.mouseenter(function () {
            var instance = Page.getComponentById(id);
            instance.clearHideTimeout();
        });
        e.mouseleave(function () {
            var instance = Page.getComponentById(id);
            if (instance.fromHover) {
                instance.setToHide(600);
            }
        });
    };
    return PopUp;
}(Component));
// ---------------------------------------------------------------------
// CLASS: FixedPopUp
// ---------------------------------------------------------------------
var FixedPopUp = /** @class */ (function (_super) {
    __extends(FixedPopUp, _super);
    function FixedPopUp(e) {
        var _this = _super.call(this, e) || this;
        _this.position = PopUpPosition.centerScreen;
        return _this;
    }
    FixedPopUp.prototype.onRender = function (e, dc, nonce) {
        _super.prototype.onRender.call(this, e, dc, nonce);
        this.closeButtonId = Page.nonce + "";
        var btn = document.createElement("div");
        btn.id = this.closeButtonId;
        btn.className = "modal-close-button";
        e.appendChild(btn);
    };
    FixedPopUp.prototype.onAfterRender = function (e, dc) {
        _super.prototype.onAfterRender.call(this, e, dc);
        var o = this;
        var but = $("#" + this.closeButtonId);
        but.click(function () {
            o.doCancel();
        });
    };
    FixedPopUp.prototype.doCancel = function () {
        this.setToHide(100);
    };
    FixedPopUp.prototype.onCancel = function () {
        this.onCancel();
    };
    FixedPopUp.prototype.onShow = function () {
        var but = $("#" + this.closeButtonId);
        var p = but[0].parentElement;
        but.css("left", p.offsetWidth - 16);
        but.css("top", p.clientTop - 16);
    };
    FixedPopUp.prototype.setActionButton = function (buttonElementId) {
        var id = this.id;
        this.actionButton = $("#" + buttonElementId);
        PopUp.hide(id);
        if (this.actionButton) {
            this.actionButton.click(function () {
                var instance = Page.getComponentById(id);
                instance.fromFocus = true;
                instance.fromHover = false;
                PopUp.show(id);
            });
        }
    };
    return FixedPopUp;
}(PopUp));
// ---------------------------------------------------------------------
// CLASS: DialogBox
// ---------------------------------------------------------------------
var DialogBox = /** @class */ (function (_super) {
    __extends(DialogBox, _super);
    function DialogBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkDataMessage = "";
        return _this;
    }
    DialogBox.prototype.onRender = function (e, dc, nonce) {
        _super.prototype.onRender.call(this, e, dc, nonce);
        var re = $(e);
        var ok = re.find(".btn-ok");
        var cancel = re.find(".btn-cancel");
        if (ok.length === 0 || cancel.length === 0) {
            var econtainer = void 0;
            var spacer = void 0;
            var eok = void 0;
            var ecancel = void 0;
            econtainer = document.createElement("div");
            econtainer.className = "horizontal h-fill";
            spacer = document.createElement("div");
            spacer.className = "fill";
            econtainer.appendChild(spacer);
            if (ok.length === 0) {
                eok = document.createElement("button");
                eok.className = "btn btn-dialog btn-ok";
                eok.innerText = "OK";
                econtainer.appendChild(eok);
            }
            if (cancel.length === 0) {
                ecancel = document.createElement("button");
                ecancel.className = "btn btn-dialog btn-cancel";
                ecancel.innerText = "Cancel";
                econtainer.appendChild(ecancel);
            }
            e.appendChild(econtainer);
        }
    };
    DialogBox.prototype.isDataOk = function (data) {
        this.checkDataMessage = "";
        return true;
    };
    DialogBox.prototype.doOk = function () {
        var data;
        data = this.getFormData();
        this.checkDataMessage = "";
        var res = this.isDataOk(data);
        if (res) {
            this.onOk(data);
            this.setToHide(100);
        }
        else {
            if (this.checkDataMessage !== "")
                Page.error(this.checkDataMessage, "e3:");
        }
    };
    DialogBox.prototype.onOk = function (data) { };
    ;
    DialogBox.prototype.onAfterRender = function (e, dc) {
        _super.prototype.onAfterRender.call(this, e, dc);
        var o = this;
        var ok = this.$.find(".btn-ok");
        var cancel = this.$.find(".btn-cancel");
        ok.click(function () { o.doOk(); });
        cancel.click(function () { o.doCancel(); });
    };
    return DialogBox;
}(FixedPopUp));
// ---------------------------------------------------------------------
// CLASS: MsgBox
// ---------------------------------------------------------------------
var MsgBox = /** @class */ (function (_super) {
    __extends(MsgBox, _super);
    function MsgBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgBox.prototype.showMsgBox = function (msg, type, onOk) {
        var ok = this.$.find(".btn-ok");
        var cancel = this.$.find(".btn-cancel");
        var e = this.$.find("#msgText");
        e.html(msg);
        this.onOk = onOk;
        ok.show();
        cancel.show();
        switch (type) {
            case MsgBoxType.okOnly:
                cancel.hide();
                break;
            case MsgBoxType.OkCancel:
                cancel.html("Annulla");
                ok.html("Ok");
                break;
            case MsgBoxType.YesNo:
                cancel.html("No");
                ok.html("Si");
                break;
        }
        MsgBox.show(this.id);
    };
    return MsgBox;
}(DialogBox));
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function getWordsBetweenCurlyBrackets(str) {
    var results = [];
    var re = /{([^}]+)}/g;
    var text;
    while (text = re.exec(str)) {
        results.push(text[1]);
    }
    return results;
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function isStringEmpty(s) {
    if (s) {
        if (s === undefined || s === "")
            return true;
        else
            return false;
    }
    return true;
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function containsText(s) {
    return !isStringEmpty(s);
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function isdef(o) {
    if (o)
        if (o !== undefined)
            return true;
    return false;
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function findElement(p, tagName) {
    var e;
    tagName = tagName.toLowerCase();
    for (var i = 0; i < p.children.length; i++) {
        e = p.children[i];
        if (e.tagName.toLowerCase() === tagName) {
            break;
        }
        else {
            return findElement(e, tagName);
        }
    }
    return e;
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function escapeForXml(s) {
    try {
        s = s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    catch (e) { }
    return s;
}
function mySubmit(e) {
    e.preventDefault();
    try {
        var a = 1 / 0;
    }
    catch (e) {
        //        throw new Error(e.message);
    }
    return false;
}
//# sourceMappingURL=lib.js.map