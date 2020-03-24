/// <reference path="collections.ts" />

// ---------------------------------------------------------------------
// ENUM: MsgBoxType
// ---------------------------------------------------------------------
enum MsgBoxType {
    okOnly = 1,
    OkCancel = 2,
    YesNo = 3
}


// ---------------------------------------------------------------------
// ENUM: PopUpPosition
// ---------------------------------------------------------------------
enum PopUpPosition {
    sideAction = 1,
    centerScreen = 2
}

// ---------------------------------------------------------------------
// INTERFACE: ResourceFile
// ---------------------------------------------------------------------
interface ResourceFile {
    url: string;
}


// ---------------------------------------------------------------------
// INTERFACE: AppConfigurationFile
// ---------------------------------------------------------------------
interface AppConfigurationFile {
    resources: Array<ResourceFile>;
}

// ---------------------------------------------------------------------
// CLASS: Page
// ---------------------------------------------------------------------
class Page {
    protected static _nonce: number = new Date().getTime();
    protected static classes: Dictonary<typeof Component> = new Dictonary<typeof Component>();
    protected static componenti: Dictonary<Component> = new Dictonary<Component>();
    protected static instance: any;

    protected static msb: MsgBox;


    constructor() {
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

    protected onPageReady(): void {}

    public static registerClass(classRef: typeof Component): void {
        try {
            let cn: string;

            if (isdef(classRef["name"]))
                cn = (<any>classRef).name.toString().toLowerCase();
            else {
                Page.error("Class " + classRef.toString() + " not defined!");
             }

            if (!Page.classes.ContainsKey(cn))
                Page.classes.Add(cn, classRef);

          } catch (e) {
       }

    }

    protected static getResourceFile(filename: string): string {
        let s: string = sessionStorage.getItem(filename);

        if (!s) {
            $.ajaxSetup({ async: false });
            $.get(filename, function (doc: string) {
                s = doc;
                sessionStorage.setItem(filename, s);
            });
            $.ajaxSetup({ async: true });
        }
        return s;
    }

    protected static insertComponents(e: HTMLElement): void {
        let c: HTMLElement;
        let cn: string;
        let tid: string;
        let id: string;

        for (let i: number = 0; i < e.children.length; i++) {
            c = <HTMLElement>e.children[i];
            cn = c.tagName.toLowerCase();
            if (Page.classes.ContainsKey(cn)) {
                id = c.getAttribute("id");
                if (isStringEmpty(id)) id = "id_" + Page.nonce; 

                tid = c.getAttribute("templateId");
                let cmp: Component = Page.getComponentById(tid);
                cmp.htmlElementId = id;
                let cname: string = c.getAttribute("name");

                if (isStringEmpty(cname)) cname = "cn_" + Page.nonce;
                let _cname: string = "_" + cname;
                Page.instance[_cname] = cmp;

                Object.defineProperty(Page.instance, cname, {
                    get: () => { return Page.instance[_cname]; },
                });        

                try {
                    cmp.isRenderingInsideAnotherComponent = true;
                    let re: HTMLElement = cmp.getRenderedHtmlElement();
                     c.insertAdjacentHTML("afterend", re.outerHTML)
                     c.parentElement.removeChild(c);
//                     c.outerHTML = re.outerHTML;
                    window.setTimeout(function () {
                        cmp.onAfterRender(re, undefined);
                    }, 300);

                    cmp.isRenderingInsideAnotherComponent = false;

                } catch (err) { Page.error(err.message); }
           
            }
            else Page.insertComponents(c);
        }
    }

    protected static createComponentInstance(type:string, e: HTMLElement):Component {
        if (Page.classes.ContainsKey(type)) {
            let classRef: any = Page.classes.Item(type);
            let c: Component = new (<typeof Component>classRef)(e);
            Page.componenti.Add(c.id, c);
            return c;
        }
        else {
            Page.error("class '" + type + " is not registered!")
            return null;
        }
    }

    protected static initPage(onComplete: () => void): void {
        $.get("app/config.json", function (jDoc: AppConfigurationFile) {
            jDoc.resources.forEach(function (value: ResourceFile, index: number) {
                let doc: string = Page.getResourceFile(value.url);

                var xmlDoc: XMLDocument = $.parseXML(doc);
                let item: HTMLElement;
                let type: string;
                let e: HTMLElement;

                xmlDoc.firstChild.childNodes.forEach(function (node: ChildNode, index: number) {
                    switch (node.nodeName.toLowerCase()) {
                        case "itemtemplate":
                            e = <HTMLElement>node;
                            type = e.attributes.getNamedItem("type").value.toLowerCase();
                            if (!Page.classes.ContainsKey(type)) {
                                Page.registerClass(<typeof Component> <unknown > type );
                            }

                            Page.insertComponents(e);
                            let newComponent: Component = Page.createComponentInstance(type, e);
                            break;
                        default:
                    }
                });
            })

            Page.insertComponents($('body')[0]);
            Page.msb = <MsgBox>Page.getComponentById("msgBox");
            Page.msb.renderAndAppendToBody();
            onComplete();
        });
    }

    public static error(msg: string, preText?: string) {
        if (isdef(preText)) msg = preText + msg;
        console.log(msg)
        alert(msg);
    }

    protected static getComponentByNonce(nonce: string): Component {
        let e: HTMLElement = $("[nonce='" + nonce + "']")[0]
        let c: Component=null;
        if (e.dataset.cid)
            c = Page.getComponentById(e.dataset.cid);
        return c;
    }

    public static getComponentById(id: string): Component {
        if (this.componenti.ContainsKey(id))
            return this.componenti.Item(id);
        else {
            Page.error("Component '" + id + "' not found!","e1:")
            return null;
        }
    }

   public static get nonce(): number {
       Page._nonce += 1;
       return Page._nonce;
    }

    public static msgbox(msg: string, onOk?: () => void, type?: MsgBoxType ): void {
        if (type === undefined) type = 2;
        Page.msb.showMsgBox(msg, type, onOk);
    }
}


// ---------------------------------------------------------------------
// CLASS: Component
// ---------------------------------------------------------------------
class Component {
    protected static instances: Dictonary<Component> = new Dictonary<Component>();
    protected static objects: Dictonary<any> = new Dictonary<any>();      // chiave=uid;
    public isRenderingInsideAnotherComponent = false;

    public innerComponents: Dictonary<Component> = new Dictonary<Component>();
    protected events: Array<string>;
    protected classname: string = "";
    protected _dataContext: any;
    protected _$: JQuery;
    protected childrenCount: number=0;

    public te: HTMLElement;
    public id: string;
    public htmlElementId: string ="";
    public topElementTagName: string;
    

    get renderedId(): string {
        if ( isStringEmpty(this.htmlElementId) )return this.id
        else return this.htmlElementId;
    }

    get $(): JQuery {
        if (this._$ === undefined) this._$ = $("#" + this.renderedId);
        return this._$;
    }

    constructor(e?: HTMLElement) {
        this.classname = (<any>this.constructor).name;

        if (isdef(e)) {
            this.id = e.getAttribute("componentId");
            if (!this.id) {
                this.id = e.id;
            }
            if (this.id==="") {
                this.id = "cid_" + Page.nonce;
            }

            this.te = <HTMLElement>e;
        }
        else {
            let xd: XMLDocument = $.parseXML("<div></div>");
            this.te = <HTMLElement> document.createElementNS(xd.namespaceURI, this.classname);  
            this.te.appendChild(xd.documentElement);
        }

        if (!this.events) {
            this.events = new Array<string>();
        }

        this._dataContext = Component.getAttributeValue(e, "dataContext").trim();
        this.topElementTagName = (<HTMLElement>this.te.firstElementChild).tagName.toLowerCase();
    }
   
    get dataContext(): any { return this._dataContext; }

    set dataContext(value: any) {
        this._dataContext = value;
        if (this._dataContext.constructor.name === "String") {

        } else {
            this.reRender(this._dataContext);
        }
    }


    public static updateComponents(newObject: any, oldObject?: any): void {

        if (oldObject === undefined && (containsText(newObject.uid))) {
            oldObject = Component.getDataContextByUid(newObject.uid)
        }
        newObject.nonce = oldObject.nonce;
        Component.saveDataContextInstance(newObject);

        let jq: JQuery = $("[data-o='" + newObject.uid + "']");
        let e: HTMLElement;
        let oc: Component;
        for (let index: number = 0; index < jq.length; index++) {
            e = jq[index];
            oc = Component.getOwnerComponent(e);

            let cc: string[] = e.dataset.s.replace(/\[/g, "{").split(";");
            for (let i: number = 0; i < cc.length; i++) {
                if (cc[i] !== "") {
                    let ss: string[] = cc[i].split("|");
                    if (ss[0] === "") {
                        e.innerHTML = Component.processAttributeValue(oc, ss[1], newObject)
                    }
                    else {
                        e.setAttribute(ss[0], Component.processAttributeValue(oc, ss[1], newObject));
                    }
                }
            }
        }
    }

    protected static processAttributeValue(c: Component, attributeValue: string, dc: any): string {
        let s: string = attributeValue;
        try {
            if (s.indexOf("{") >= 0) {
                let par: Array<string> = getWordsBetweenCurlyBrackets(s);
                let v: string;
                par.forEach(function (value: string, index: number, array: string[]) {
                    if (value.indexOf("()") > 0) {
                        let funcName: string = value.replace("()", "").trim();
                        if (c[funcName]) {
                            v = c[funcName](dc);
                            s = s.replace("{" + value + "}", escapeForXml(v));
                        }
                    }
                    else {
                        v = dc[value];
                        if (v === undefined) v = "";
                        s = s.replace("{" + value + "}", escapeForXml(v));
                    }
                })
            }
        }
        catch (e) {
            console.log("error processing attribute value: " + e.message);
        }
        return s;
    }


    protected static addAttributeComponent(e: HTMLElement, attributeName: string, value: string) {
        let currentValue: string = this.getAttributeValue(e,attributeName);
        if (!currentValue) currentValue = "";
        e.setAttribute(attributeName, currentValue + " " + value);
    }

    protected static replaceAttributes(c:Component, e: HTMLElement, dc: any) {
        let a: string;
        let v: string;
        let pv: string;

        try {

            if (e.children.length > 0) {
                for (let i: number = 0; i < e.children.length; i++) {
                    this.replaceAttributes(c, <HTMLElement>e.children.item(i), dc);
                }
            } else {
                let t: string = e.innerHTML.trim();
                if (t !== "" && t.indexOf("{") >= 0) {
                    e.setAttribute("data-o", dc.uid);
                    e.setAttribute("data-s", this.getAttributeValue(e, "data-s") + "|" + t.replace(/{/g, "[") + ";")
                    e.innerHTML = Component.processAttributeValue(c, t, dc)
                }
            }

            for (let i: number = 0; i < e.attributes.length; i++) {
                a = e.attributes.item(i).name;
                if (!(a === "data-s" || a === "data-o")){
                    v = e.attributes.item(i).value;
                    if (v.indexOf("{") >= 0) {
                        e.setAttribute("data-o", dc.uid);
                        e.setAttribute("data-s", this.getAttributeValue(e, "data-s") + a + "|" + v.replace(/{/g, "[") + ";")
                        pv = Component.processAttributeValue(c, v, dc);
                        e.setAttribute(a, pv);
                    }
                }
            }
        }
        catch (err) {
            console.log("error processing attribute values" + err.message);
        }
    }

    protected getSupportElements(parentNode:HTMLElement, nonce: string, oid:string): Array<HTMLElement> {
        let a: Array<HTMLElement> = new Array<HTMLElement>();
        let i: HTMLImageElement;
        i = <HTMLImageElement>document.createElementNS("http://www.w3.org/1999/xhtml", "img");
        i.src = "img/onepixel.png";
        i.style.display = "none";
        i.setAttribute("onload", "Component.componentLoaded('" + nonce + "','" + oid + "');")

        a.push(i);
        return a;
    }

    public onBeforeRender(e: HTMLElement) {}
    protected onRender(e: HTMLElement, dc: any, nonce: string) { }
    protected onChildrenRender(e: HTMLElement, dc: any, nonce: string): number { return 0;}

    public onAfterRender(e: HTMLElement, dc: any) {
        //this.$.find(".html").jqte({
        //    outdent: false, indent: false, br: true, p: false, link: false, unlink: false
        //});
        this.$.find(".datepicker").datepicker();
        this.$.parent().show();
    }

    public getRenderedHtmlElement(dc?: any): HTMLElement {
        try {
            return this.render(dc);
        } catch (e) {
            Page.error(e.message, "e2:");
        }
    }

    private render(dc?: any): HTMLElement {
        let e: HTMLElement = <HTMLElement>this.te.firstElementChild.cloneNode(true);
        this.onBeforeRender(e);
        
        this._$ = undefined;

        if (!isdef(dc))
            dc = this;
        else {
           Component.saveDataContextInstance(dc);
        }

        let nonce: string = Page.nonce + "";

        if (dc.uid)
            e.setAttribute("data-oid", dc.uid);

        let nn: Array<string> = dc.nonce;
        if (!nn) {
            nn = new Array<string>();
            dc.nonce = nn;
        }
        if (nn.indexOf(nonce) < 0) nn.push(nonce);

        let cn: string = this.classname;

        e.setAttribute("nonce", nonce);
        e.setAttribute("data-cn", cn);
        e.setAttribute("data-cid", this.id);

        this.events.forEach(function (value: string, index: number, array: string[]) {
            let onevent:string = value.toLowerCase();
            if (onevent.substr(0, 2) !== "on") onevent = "on" + onevent;
            e.setAttribute(onevent, cn + ".e('" + value + "');")
        })

        let el = this.getSupportElements(e, nonce,dc.uid);
        for (let i: number = 0; i < el.length; i++) {
            e.appendChild(el[i]);
        }

       this.childrenCount=this.onChildrenRender(e, dc, nonce);

        if (!this.isRenderingInsideAnotherComponent) {
            Component.instances.Add(nonce, this);
            try {
                Component.replaceAttributes(this, e, dc);
            } catch (err) {
                console.log(err.message);
            }
        }
        this.onRender(e, dc, nonce);
        if (!isdef(e.id)) 
            e.id = this.id; 
        this.htmlElementId = e.id;

        return e;
    }

    public appendTo(e: JQuery, dc?: any):HTMLElement {
        let he: HTMLElement = this.render(dc);    
        e.append(he.outerHTML);
        this.onAfterRender(he,dc);
        return he;
    }

    public renderAndAppendToBody(dc?: any): HTMLElement  {
        return this.appendTo($('body'), dc);
    }

    public reRender(dc?: any): HTMLElement  {
       return this.renderAs(this.htmlElementId, dc);
    }

    public renderAs(targetId: string, dc?: any): HTMLElement  {
        let e: JQuery = $("#" + targetId);
        if (e.length > 0) {
            let he: HTMLElement = this.render(dc);  
            e.parent().html(he.outerHTML);
            this.onAfterRender(he,dc);
            return he;
        } else {
            Page.error("element id: " + targetId + " not found!");
            return null;
        }
    }

    public renderInto(targetId: string, dc?: any): HTMLElement {
        let e: JQuery = $("#" + targetId);
        let he: HTMLElement = this.render(dc);  
        e.html(he.outerHTML);
        this.onAfterRender(he,dc);
        return he;
    }

    public getFormData(): any {
        let fd: Object = new Object;
        this.forEachControl(function (item: HTMLElement, tagName: string, name: string, value: string) {
            if (!isStringEmpty(name)) fd[name] = (<any>item).value;
        });
        return fd;
    }

    public setFormData(data: any) {
        this.forEachControl(function (item: HTMLElement, tagName: string, name: string, value: string) {
            if (data.hasOwnProperty(name)) {
                (<any>item).value = data[name];
            }
            if (item.classList.contains("jqte_editor")) {
                let x: HTMLTextAreaElement = <HTMLTextAreaElement>item.nextElementSibling.firstElementChild;
                (<any>item).innerHTML= x.value;
            }
        });
    }

    public forEachControl(func: (item: HTMLElement, tagName: string, name: string, value: string) => void) {
        let name: string;
        this.$.find("input").each(function (i: number, item: HTMLInputElement) {
            name = item.name; if (isStringEmpty(name)) name = item.id;
            func(item, "input", name, item.value);
        });
        this.$.find("textarea").each(function (i: number, item: HTMLTextAreaElement) {
            name = item.name; if (isStringEmpty(name)) name = item.id;
            func(item, "input", name, item.value);
        });
        this.$.find("select").each(function (i: number, item: HTMLSelectElement) {
            name = item.name; if (isStringEmpty(name)) name = item.id;
            func(item, "input", name, item.value);
        });
        this.$.find(".jqte_editor").each(function (i: number, item: HTMLDivElement) {
            name = item.id;
            func(item, "jqte_editor", name, item.innerText);
        });
        
    }


    protected registerEvent(eventName: string) {
        if (this.events.indexOf(eventName) === -1)
            this.events.push(eventName);
    }

    public static getOwnerComponent(e: HTMLElement):Component {
        let oe: HTMLElement = Component.getSenderRecursive(e);
        if (oe) {
            return Page.getComponentById(oe.dataset.cid);
        } else
            return null
    }

    protected static getSenderRecursive(e:HTMLElement) {
        if (e) {
            let n: string = e.getAttribute("nonce");
            if (n)
                return e;
            else
                return (Component.getSenderRecursive(e.parentElement));
        }
        else return null;
    }

    public static removeInstance(nonce: string) {
        if (Component.instances.ContainsKey(nonce))
         Component.instances.Remove(nonce);
    }

    public static instance(nonce: string): Component {
        return Component.instances.Item(nonce);
    }

    public static getDataContextByUid(uid: string): any {
        return Component.objects.Item(uid);
    }

    public static saveDataContextInstance(o: OggettoPillola) {
        if (containsText(o.uid)) {
            let doAdd: boolean = false;
            let oo: OggettoPillola = Component.objects.Item(o.uid);
            if (isdef(oo)) {
                if (oo.instanceId !== o.instanceId) {
                    Component.objects.Remove(o.uid);
                    doAdd = true;
                }
            } else doAdd = true;
            if (doAdd) {
                Component.objects.Add(o.uid, o);
            }
        }


    }


    private static e(eventName: string) {
        let e: HTMLElement = Component.getSenderRecursive(<HTMLElement>event.target);
        let n: string = e.getAttribute("nonce");
        let instance: Component = Component.instance(n);
        let dc: any = Component.getDataContextByUid(e.dataset.oid);

        if (isdef(instance))
            instance.onEvent(eventName, dc, e, event);

        event.stopPropagation();
    }

    protected onEvent(eventName: string, dc: any, sender: HTMLElement, event: any) {
        if (isdef(this[eventName])) {
            this[eventName](dc, sender, event);
        }
        else
        {
            if (eventName.substr(0, 2) === "on") {
                eventName = eventName.substr(2);
            } else {
                eventName = "on" +eventName;
            }

            if (isdef(this[eventName]))
                this[eventName](dc, sender, event);
        }
    }

    protected static getParameterValue(attributeValue:string, dc: any): string {
        let s: string = attributeValue;
        if (s.substr(0, 1) === "{") {
            let propertyName: string = s.substr(1, s.length - 2);
            s = dc[propertyName];

        }
        return s;
    }

    protected static getAttributeValue(e: HTMLElement, attributeName: string, defaultValue?: string): string {
        let a = e.getAttribute(attributeName);
        if (isdef(a))
            return a;
        else {
            return "";
        }
    }
    
    protected static getInstances(cid: string): JQuery {
        return  $("[data-cid='" + cid + "']");
    }

    protected static componentLoaded(nonce: string, oid:string) {
        let c: Component = Component.instance(nonce);
        let dc: any = Component.getDataContextByUid(oid);

        if (c)
            c.onComponentLoaded(dc);
    }

    protected onComponentLoaded(dc: any) {}
}

// ---------------------------------------------------------------------
// CLASS: AbstractItem
// ---------------------------------------------------------------------
class AbstractItem extends Component {}

// ---------------------------------------------------------------------
// CLASS: AbstractList
// ---------------------------------------------------------------------
class AbstractList extends AbstractItem  {
 
    protected _itemTemplateId: string;
    protected _itemTemplate: AbstractItem;
    public itemsSource: string;

    constructor(e?: HTMLElement) {
        super(e);

        if (e !== undefined) {
            this.itemTemplateId = Component.getAttributeValue(e, "itemTemplateId");
            this.itemsSource = Component.getAttributeValue(e, "itemsSource").trim();
        }
    }

    get itemTemplateId(): string { return this._itemTemplateId; }
    set itemTemplateId(value: string) { this._itemTemplateId = value; this._itemTemplate = null; }

    get itemTemplate(): AbstractItem {
        if (!this._itemTemplate)
            this._itemTemplate = <AbstractItem>Page.getComponentById(this._itemTemplateId);
        return this._itemTemplate;
    }

    protected getItemsFromItemsSource(dc?: any): Array<any> {
        let a: Array<any>;
        let v = this.itemsSource;

        if (!isStringEmpty(v)) {
            let res: any;

            if (v.indexOf("{") >= 0) {
                v = getWordsBetweenCurlyBrackets(v)[0];
                if (v.indexOf("()") > 0) {
                    v = v.replace("()", "");
                    res = this[v](dc);
                } else {
                    if (dc)
                        res = dc[v];
                }
            }

            try {
                a = <Array<any>>res;
            } catch (e) { }
        }

        return a;
    }

    protected static getListContainerElement(e: HTMLElement, template: Component): HTMLElement {
        if (template.topElementTagName === "li") {
            let ne: HTMLElement = findElement(e, "ul");
            if (!ne) {
                ne =<HTMLElement> document.createElementNS(document.namespaceURI, "ul");
                e.appendChild(ne);
            }
            return ne;
        }
        else
            return e;
    }


}

class ListViewItem extends AbstractItem {
    constructor(e?: HTMLElement ) {
        super(e);
    }
}

class ListView extends AbstractList  {

    constructor(e?: HTMLElement ) {
        super(e);

    }

    protected onChildrenRender(e: HTMLElement, dc: any, nonce: string): number {
        let cdcl: Array<any>;

        if (!isStringEmpty(this.itemsSource))
            cdcl = this.getItemsFromItemsSource(dc);

        if (isdef(cdcl)) {
            let tem: ListViewItem = <ListViewItem>this.itemTemplate;

            if (cdcl.length > 0 && isdef(tem) ) {
                let ne: HTMLElement = AbstractList.getListContainerElement(e, tem);

                cdcl.forEach(function (value: any, index: number) {
                    let re: HTMLElement = tem.getRenderedHtmlElement(value);
                    tem.onAfterRender(re, value)
                    ne.append(re);
                })
            }
            return cdcl.length;
        }
        return 0;
    }



    protected onRender(e: HTMLElement, dc: any, nonce: string) {
    }

}


// ---------------------------------------------------------------------
// CLASS: TreeViewNode
// ---------------------------------------------------------------------
class TreeViewNode extends AbstractList {
    public expanded: string;

    public static nodeEmptyClassName: string = "nodeEmpty";
    public static nodeSelectedClassName: string = "nodeSelected";
    public static nodeExpandedClassName: string = "nodeExpanded";

    constructor(e?: HTMLElement) {
        super(e);

        if (e !== undefined) {
            this.expanded= Component.getAttributeValue(e, "expanded").toLowerCase();
        }
        this.registerEvent("onclick");
    }

    protected onChildrenRender(e: HTMLElement, dc: any, nonce: string): number {

        let fdcl: Array<any>;
        if (!isStringEmpty(this.itemsSource))
            fdcl = this.getItemsFromItemsSource(dc);

        let tem: TreeViewNode = <TreeViewNode>this.itemTemplate;

        if (tem && fdcl) {

            let ne: HTMLElement;
            if (fdcl.length > 0) {
                ne = AbstractList.getListContainerElement(e, tem);
            }

            let isExpanded: boolean = true;

            if (this.expanded !== "") {
                let expPar: string = Component.processAttributeValue(this, this.expanded, dc).toLowerCase();
                if (expPar === "false" || expPar === "0" || expPar === "no") isExpanded = false;
            }

            if (ne) {
                fdcl.forEach(function (value: any, index: number) {
                    let re: HTMLElement = tem.getRenderedHtmlElement(value);
                    tem.onAfterRender(re, value)
                    ne.append(re);
                });

                if (!isExpanded)
                    ne.setAttribute("style", "display:none");
            }

            return fdcl.length;
        } else return 0;
    }

    protected onRender(e: HTMLElement, dc: any, nonce: string) {

        e.setAttribute("ccc", new Date().getTime()+"");

        let extraClass: string = "";
        let isExpanded: boolean = true;

        if (this.expanded !== "") {
            let expPar: string = Component.processAttributeValue(this, this.expanded, dc).toLowerCase();
            if (expPar === "false" || expPar === "0" || expPar === "no") isExpanded = false;
        }

        if (this.childrenCount>0) {
            if (isExpanded) {
                extraClass = TreeViewNode.nodeExpandedClassName;
            }  
        }
        else {
            extraClass = TreeViewNode.nodeEmptyClassName;
        }

        Component.addAttributeComponent(e, "class", extraClass);
    }

    protected onEvent(eventName: string, dc: any, sender:HTMLElement, event: any) {

        if (eventName === "onclick" || eventName === "click" ) {
            let me: MouseEvent = <MouseEvent>event;
            if (me.offsetX < 0) {
                this.onNodeControlClick(dc, sender, event);
                return null;
            }
        }

        super.onEvent( eventName, dc, sender, event);
    }

    protected onNodeControlClick( dc: any, sender: HTMLElement, event: MouseEvent) {
       this.toggleExpanded( <HTMLElement>event.target);
    }

    protected toggleExpanded(target: HTMLElement) {
            let e = $(target).find("ul");
            if (e[0]) {
                let isExpanded: boolean = e.css("display") != "none";

                if (isExpanded) {
                    e.hide(200);
                    target.classList.remove(TreeViewNode.nodeExpandedClassName);
                }
                else {
                    e.show(200);
                    target.classList.add(TreeViewNode.nodeExpandedClassName);
                }
        }
    }
}
 


// ---------------------------------------------------------------------
// CLASS: TreeView
// ---------------------------------------------------------------------
class TreeView extends TreeViewNode {
    public selectedElements: JQuery  = null;

    constructor(e?: HTMLElement) {
        super(e);
    }

    public setSelected(targets: JQuery) {

        if (this.selectedElements)
            for (let i: number=0; i < this.selectedElements.length; i++) {
                this.selectedElements[i].classList.remove(TreeViewNode.nodeSelectedClassName);
            }

        if (targets)
            for (let i: number=0; i < targets.length; i++) {
                targets[i].classList.add(TreeViewNode.nodeSelectedClassName);
            }

        this.selectedElements = targets;
    }

}


// ---------------------------------------------------------------------
// CLASS: PopUp
// ---------------------------------------------------------------------
class PopUp extends Component {
    public actionButton: JQuery = null;
    public fromFocus: boolean = false;
    public fromHover: boolean = false;
    public width: number = 600;
    public height: number = 400;

    protected hideTimeout: any;
    public position: PopUpPosition = 1;

    constructor(e?: HTMLElement) {
        super(e);

        let w: string = Component.getAttributeValue(e, "width").trim().toLowerCase().replace("px", "");
        let h: string = Component.getAttributeValue(e, "height").trim().toLowerCase().replace("px", "");

        try {
            if (w !== "")
                this.width = parseInt(w);

            if (h !== "")
                this.height = parseInt(h);
        } catch (e) { }
       
     }

    protected onRender(e: HTMLElement, dc: any, nonce: string) {
        Component.addAttributeComponent(e, "class", "popup-overlay")
    }

    protected onShow(): void {
    }


    public static show(id: string) {
        let instance: PopUp = <PopUp>Page.getComponentById(id);
        let e: JQuery = Component.getInstances(id);
        e.css('width', instance.width);
        e.css('height', instance.height);

        switch (instance.position) {
            case PopUpPosition.sideAction:
                let r: any = instance.actionButton[0].getBoundingClientRect();
                e.css('left', r.left + r.width + 4);
                e.css('top', r.top);
                break;
            case PopUpPosition.centerScreen:
                let vw: number = document.documentElement.clientWidth;
                let vh: number = document.documentElement.clientHeight;

                e.css('left', (vw-instance.width)/2);
                e.css('top', (vh-instance.height)/2);
                break;
        }

        instance.clearHideTimeout();

        if (instance.fromHover) {
            instance.setToHide(2000);
        }

        e.addClass("active");
        instance.onShow();
    }

    public static hide(id: string) {
        let e: JQuery = Component.getInstances(id);
        let instance: PopUp = <PopUp>Page.getComponentById(id);

        instance.fromFocus = false;
        instance.fromFocus = false;
        e[0].parentElement.focus();

        e.removeClass("active");
    }

    public clearHideTimeout() {
        if (this.hideTimeout) {
            window.clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    public setToHide(timeout) {
        this.clearHideTimeout();
        let id: string = this.id;
        this.hideTimeout = window.setTimeout(function () {
            this.hideTimeout = null;
            PopUp.hide(id);
        }, timeout)
    }

    public setActionButton(buttonElementId: string) {

        let id: string = this.id;
        this.actionButton = $("#" + buttonElementId);
        PopUp.hide(id);
        this.fromFocus = false;
        this.fromHover = false;

        if (this.actionButton) {
            this.actionButton.mouseenter(function () {
                let instance: PopUp = <PopUp>Page.getComponentById(id);
                instance.fromFocus = false;
                instance.fromHover = true;
                PopUp.show(id);
            });

            this.actionButton.focusin(function () {
                let instance: PopUp = <PopUp>Page.getComponentById(id);
                instance.fromFocus = true;
                instance.fromHover = false;
                PopUp.show(id);
            });

            this.actionButton.focusout(function () {
                let instance: PopUp = <PopUp>Page.getComponentById(id);
                if (instance.fromFocus) {
                    instance.setToHide(400);
                }
            });
        }

        let e: JQuery = Component.getInstances(this.id);

        e.mouseenter(function () {
            let instance: PopUp = <PopUp>Page.getComponentById(id);
            instance.clearHideTimeout();
        });

        e.mouseleave(function () {
            let instance: PopUp = <PopUp>Page.getComponentById(id);
            if (instance.fromHover) {
                instance.setToHide(600);
            }
        });

    }
}

// ---------------------------------------------------------------------
// CLASS: FixedPopUp
// ---------------------------------------------------------------------
class FixedPopUp extends PopUp {
    protected closeButtonId: string;

    constructor(e?: HTMLElement) {
        super(e);
        this.position = PopUpPosition.centerScreen;
    }


    protected onRender(e: HTMLElement, dc: any, nonce: string) {
        super.onRender(e, dc, nonce);

        this.closeButtonId = Page.nonce + "";
        let btn: HTMLElement = <HTMLElement>document.createElement("div");
        btn.id = this.closeButtonId;
        btn.className = "modal-close-button";

        e.appendChild(btn);
    }

    public onAfterRender(e: HTMLElement, dc:any) {
        super.onAfterRender(e, dc);
        let o: FixedPopUp = this;
        let but: JQuery = $("#" + this.closeButtonId);

        but.click(function () {
            o.doCancel();
        })

    }

    protected doCancel() {
        this.setToHide(100);
          
    }
    public onCancel() {
        this.onCancel();
    }

    protected onShow(): void {

        let but: JQuery = $("#" + this.closeButtonId);
        let p: HTMLElement = but[0].parentElement;

        but.css("left", p.offsetWidth - 16);
        but.css("top", p.clientTop - 16);
    }
    
    public setActionButton(buttonElementId: string) {

        let id: string = this.id;
        this.actionButton = $("#" + buttonElementId);
        PopUp.hide(id);

        if (this.actionButton) {

            this.actionButton.click(function () {
                let instance: PopUp = <PopUp>Page.getComponentById(id);
                instance.fromFocus = true;
                instance.fromHover = false;
                PopUp.show(id);
            });
        }
    }
}

// ---------------------------------------------------------------------
// CLASS: DialogBox
// ---------------------------------------------------------------------
class DialogBox extends FixedPopUp {
    protected checkDataMessage: string = "";

    protected onRender(e: HTMLElement, dc: any, nonce: string) {
        super.onRender(e, dc, nonce);

        let re: JQuery = $(e);
        let ok: JQuery = re.find(".btn-ok");
        let cancel: JQuery = re.find(".btn-cancel");

        if (ok.length === 0 || cancel.length === 0) {
            let econtainer: HTMLElement;
            let spacer: HTMLElement;
            let eok: HTMLElement;
            let ecancel: HTMLElement;

            econtainer = document.createElement("div");
            econtainer .className = "horizontal h-fill";

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

    }
    
    protected isDataOk(data:any): boolean {
        this.checkDataMessage = "";
        return true;
    }

    protected doOk() {
        let data: any;
        data = this.getFormData(); 

        this.checkDataMessage="";
        let res: boolean = this.isDataOk(data);

        if (res) {
            this.onOk(data);
            this.setToHide(100);
        } else {
            if (this.checkDataMessage !== "")
                Page.error(this.checkDataMessage, "e3:" );
        }
    }

    public onOk(data: any) { };

    public onAfterRender(e: HTMLElement, dc:any) {
        super.onAfterRender(e,dc);
        let o: DialogBox = this;
        let ok: JQuery = this.$.find(".btn-ok");
        let cancel: JQuery = this.$.find(".btn-cancel");
        ok.click(function () { o.doOk(); });
        cancel.click(function () { o.doCancel(); });
    }
}

// ---------------------------------------------------------------------
// CLASS: MsgBox
// ---------------------------------------------------------------------
class MsgBox extends DialogBox {
    public showMsgBox(msg: string, type: MsgBoxType, onOk: () => void) {
        let ok: JQuery = this.$.find(".btn-ok");
        let cancel: JQuery = this.$.find(".btn-cancel");
        let e: JQuery = this.$.find("#msgText");
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
    }
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function getWordsBetweenCurlyBrackets(str: string) {
    let results: Array<string> = [];
    let re: RegExp = /{([^}]+)}/g;
    let text: RegExpExecArray;

    while (text = re.exec(str)) {
        results.push(text[1]);
    }
    return results;
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function isStringEmpty(s: string): boolean {
    if (s) {
        if (s === undefined || s === "") return true;
        else return false;
    }
    return true;
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function containsText(s: string): boolean {
    return !isStringEmpty(s);
}


// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function isdef(o: any): boolean {
    if (o) 
        if (o !== undefined) return true;
    return false;
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function findElement(p: HTMLElement, tagName: string): HTMLElement {
    let e: HTMLElement;
    tagName = tagName.toLowerCase();
    for (let i: number = 0; i < p.children.length; i++) {
        e = <HTMLElement> p.children[i];
        if (e.tagName.toLowerCase() === tagName) {
            break;
        } else {
            return findElement(e, tagName);
        }
    }
    return e;
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

function escapeForXml(s: string): string {
    try {
        s = s.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    } catch (e) {}

    return s;
}

function mySubmit(e) {
    e.preventDefault();
    try {
        let a = 1 / 0;
    } catch (e) {
//        throw new Error(e.message);
    }
    return false;
}