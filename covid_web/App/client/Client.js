/// <reference path="models.ts" />
var C;
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.getCovidDataSetAsync = function (onSuccess, onError) {
        this.getDataAsync("api/ds", onSuccess, onError);
    };
    Client.getGraficoAsync = function (tipo, p, onSuccess, onError) {
        this.getDataAsync("api/grafico?t=" + tipo + "&p=" + p, onSuccess, onError);
    };
    Client.getPaesiAsync = function (onSuccess, onError) {
        this.getDataAsync("api/paesi", onSuccess, onError);
    };
    Client.creaPillolaAsync = function (pillolaId, datiIniziali, onSuccess, onError) {
        this.postDataAsync("api/gestione_pillola?token=&id=" + pillolaId + "&f=CREA", datiIniziali, onSuccess, onError);
    };
    Client.getPillolaAsync = function (pillolaId, onSuccess, onError) {
        this.getDataAsync("api/pillola?token=&id=" + pillolaId, onSuccess, onError);
    };
    Client.modificaAttributiPillolaAsync = function (pillolaId, modifiche, onSuccess, onError) {
        this.postDataAsync("api/gestione_pillola?token=&id=" + pillolaId + "&f=MODIFICA_ATTRIBUTI", modifiche, onSuccess, onError);
    };
    Client.deletePillolaAsync = function (pillolaId, onSuccess, onError) {
        this.getDataAsync("api/gestione_pillola?token=&id=" + pillolaId + "&f=DELETE", onSuccess, onError);
    };
    Client.getProgrammaAsync = function (programmaId, onSuccess, onError) {
        this.getDataAsync("api/programma_studente?token=&id=" + programmaId, onSuccess, onError);
    };
    Client.getHtmlAsync = function (t, id, onSuccess, onError) {
        this.getDataAsync("api/html?token=&t=" + t + "&id=" + id, onSuccess, onError);
    };
    Client.getArgomentoAsync = function (argomentoId, onSuccess, onError) {
        this.getDataAsync("api/argomento_studente?token=&id=" + argomentoId, onSuccess, onError);
    };
    Client.modificaAttributoArgomentoAsync = function (argomentoId, attributo, valore, onSuccess, onError) {
        this.getDataAsync("api/gestione_argomento_studente?token=&id=" + argomentoId + "&f=MODIFICA_ATTRIBUTO&p1=" + attributo + "&p2=" + valore, onSuccess, onError);
    };
    /* ---------------------------------------------------------------------------------------------------
     * chiamata Sincrona ajax ad una Web API
       ---------------------------------------------------------------------------------------------------  */
    Client.getData = function (url) {
        var d;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: Client.host + url,
            async: false,
            success: function (data) {
                d = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Page.error(XMLHttpRequest.statusText);
            }
        });
        return d;
    };
    Client.postFile = function (url, file) {
        if (file) {
            var data = new FormData();
            data.append('file', file);
            return C.ajaxPost(url, data);
        }
    };
    Client.postBlob = function (url, blob) {
        if (blob) {
            var data = new FormData();
            data.append('blob', blob);
            return C.ajaxPost(url, data);
        }
    };
    Client.postData = function (url, dati) {
        if (dati instanceof File)
            return this.postFile(url, dati);
        if (dati instanceof Blob)
            return this.postBlob(url, dati);
        var d;
        dati = '{' + dati + '}';
        $.ajax({
            type: "POST",
            data: dati,
            dataType: "json",
            url: Client.host + url,
            async: false,
            success: function (data) { d = data; },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                this.mostraErrore(XMLHttpRequest);
            }
        });
        return d;
    };
    Client.prototype.ajaxPost = function (url, data) {
        var d;
        $.ajax({
            url: Client.host + url,
            processData: false,
            contentType: false,
            data: data,
            async: false,
            type: 'POST'
        }).done(function (result) {
            d = result;
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
        return d;
    };
    Client.getDataAsync = function (url, onSuccess, onError) {
        if (onError == undefined) {
            onError = function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            };
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: Client.host + url,
            async: true,
            success: onSuccess,
            error: onError
        });
    };
    Client.postDataAsync = function (url, data, onSuccess, onError) {
        if (onError == undefined) {
            onError = function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            };
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
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    };
    Client.esc = function (s) {
        return s.replace(/\"/g, "'");
    };
    Client.esc2 = function (s) {
        return s.replace(/\"/g, "\\\"");
    };
    //    protected static host: string = "http://www.pardesca.it:4080/pillole/";
    Client.host = "";
    return Client;
}());
//# sourceMappingURL=Client.js.map