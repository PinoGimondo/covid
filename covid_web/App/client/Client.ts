/// <reference path="models.ts" />
var C: Client;

class Client {
//    protected static host: string = "http://www.pardesca.it:4080/pillole/";
    protected static host: string = "";

    public static getCovidDataSetAsync(onSuccess: (data: CovidDataSet) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/ds", onSuccess, onError);
    }

    public static getGraficoAsync(tipo: string, p:string, onSuccess: (data: string) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/grafico?t=" + tipo + "&p=" + p, onSuccess, onError);
    }

    public static getPaesiAsync(onSuccess: (data: ListaPaesi) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/paesi", onSuccess, onError);
    }



    public static creaPillolaAsync(pillolaId: string, datiIniziali: any, onSuccess: (data: Pillola) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.postDataAsync("api/gestione_pillola?token=&id=" + pillolaId + "&f=CREA", datiIniziali, onSuccess, onError);
    }

    public static getPillolaAsync(pillolaId: string, onSuccess: (data: Pillola) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/pillola?token=&id=" + pillolaId, onSuccess, onError);
    }

    public static modificaAttributiPillolaAsync(pillolaId: string, modifiche: any, onSuccess: (data: Pillola) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.postDataAsync("api/gestione_pillola?token=&id=" + pillolaId + "&f=MODIFICA_ATTRIBUTI", modifiche, onSuccess, onError);
    }

    public static deletePillolaAsync(pillolaId: string, onSuccess: (data: Pillola) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/gestione_pillola?token=&id=" + pillolaId + "&f=DELETE", onSuccess, onError);
    }
    
    public static getProgrammaAsync(programmaId: string, onSuccess: (data: ProgrammaStudente) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/programma_studente?token=&id=" + programmaId, onSuccess, onError);
    }

    public static getHtmlAsync(t: string,id:string, onSuccess: (data: string) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/html?token=&t=" + t + "&id=" + id, onSuccess, onError);
    }

    public static getArgomentoAsync(argomentoId: string, onSuccess: (data: ArgomentoStudente) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/argomento_studente?token=&id=" + argomentoId, onSuccess, onError);
    }

    public static modificaAttributoArgomentoAsync(argomentoId: string, attributo:string, valore: string, onSuccess: (data: ArgomentoStudente) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {
        this.getDataAsync("api/gestione_argomento_studente?token=&id=" + argomentoId + "&f=MODIFICA_ATTRIBUTO&p1="+ attributo +"&p2=" + valore , onSuccess, onError);
    }

    /* ---------------------------------------------------------------------------------------------------
     * chiamata Sincrona ajax ad una Web API 
       ---------------------------------------------------------------------------------------------------  */

    public static getData(url: string): any {
        var d;

        $.ajax({
            type: "GET",
            dataType: "json",
            url: Client.host+url,
            async: false,
            success: function (data: any) {
                d = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Page.error(XMLHttpRequest.statusText);
            }
        });
        return d;
    }

    public static postFile(url: string, file: File): any {
        if (file) {
            let data: FormData = new FormData();
            data.append('file', file);
            return C.ajaxPost(url, data);
        }
    }

    public static postBlob(url: string, blob: Blob): any {
        if (blob) {
            let data: FormData = new FormData();
            data.append('blob', blob);
            return C.ajaxPost(url, data);
        }
    }

    public static postData(url: string, dati: any): any {

        if (dati instanceof File)
            return this.postFile(url, dati);

        if (dati instanceof Blob)
            return this.postBlob(url, dati);

        var d: any;

        dati = '{' + dati + '}';

        $.ajax({
            type: "POST",
            data: dati,
            dataType: "json",
            url: Client.host + url,
            async: false,
            success: function (data: any) { d = data; },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                this.mostraErrore(XMLHttpRequest);
            }
        });
        return d;
    }

    public ajaxPost(url: string, data: any): void {
        var d: any;
        $.ajax({
            url: Client.host + url,
            processData: false,
            contentType: false,
            data: data,
            async: false,
            type: 'POST'
        }).done(function (result: any) {
            d = result;
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
        return d;
    }

    public static getDataAsync(url: string, onSuccess: (data: any) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {

        if (onError == undefined) {
            onError = function (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) {
                alert(jqXHR.responseText);
            }
        }

        $.ajax({
            type: "GET",
            dataType: "json",
            url: Client.host + url,
            async: true,
            success: onSuccess,
            error: onError
        });
    }

    public static postDataAsync(url: string, data:any, onSuccess: (data: any) => void, onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): void {

        if (onError == undefined) {
            onError = function (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) {
                alert(jqXHR.responseText);
            }
        }

        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            url: Client.host + url,
            async: true,
            success: function (d) {
                onSuccess(d);
            },
            error: function (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) {
                alert(jqXHR.responseText);
            }
        });
    }

    public static esc(s: string): string {
        return s.replace(/\"/g, "'");
    }

    public static esc2(s: string): string {
        return s.replace(/\"/g, "\\\"");
    }
}