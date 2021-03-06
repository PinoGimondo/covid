﻿class CovidDataSet {
    public paesi: ListaPaesi;
    public regioni: ListaRegioni;
    public province: ListaProvince;

}

class Dato {
    public tipo: string;
    public codice: string;
    public label: string;
    public data: Date;
}

class ElementoAnalisi {
    public tipo: string;
    public codice: string;
    public label: string;
    public dati: Array<Dato>
    public isSelected: boolean;
    public isExpanded: boolean;
    constructor() {}
}

class Paese extends ElementoAnalisi { 
    constructor() {
        super();
        this.tipo="C"
    }
    public get codicePaese(): string {
        return this.codice;
    }
    public get denominazionePaese(): string {
        return this.label;
    }
}

class ListaPaesi extends Array<Paese> {
}


class Regione extends ElementoAnalisi {
    constructor() {
        super();
        this.tipo = "R"
    }
    public get codiceRegione(): string {
        return this.codice;
    }
    public get denominazioneRegione(): string {
        return this.label;
    }
}

class ListaRegioni extends Array<Regione> {
}

class Provincia extends ElementoAnalisi {
    public codiceRegione: string;

    constructor() {
        super();
        this.tipo = "P"
    }
    public get codiceProvincia(): string {
        return this.codice;
    }
    public get denominazioneProvincia(): string {
        return this.label;
    }
}

class ListaProvince extends Array<Provincia> {
}



interface OggettoPillola {
    instanceId: string;
    uid: string;
}

class ProgrammaStudente {
    public instanceId: string;
    public programmaId: string;
    public programma: string;
    public titoloProgramma: string;
    public materiaId: string;
    public materia: string;
    public classeId: string;
    public classe: string;
    public titoloClasse: string;
    public scuolaId: string;
    public scuola: string;
    public note: string;
    public userId: string;
    public editor: string;
    public editorEmail: string;
    public oggettoId: string;
    public uid: string;
    public argomentiStudente: Array<ArgomentoStudente>;
    public canEdit: boolean;
}

class ArgomentoStudente {
    public instanceId: string;
    public argomentoId: string;
    public argomento: string;
    public argomentoPadreId: string;
    public userId: string;
    public statoArgomentoId: string;
    public statoArgomento: string;
    public livelloConoscenzaId: string;
    public livelloConoscenza: string;
    public programmaId: string;
    public ordine: string;
    public oggettoId: string;
    public uid: string;
    public pillole: Array<Pillola>;
    public canEdit: boolean;
}

function getPillola(arg: ArgomentoStudente, pillolaId: string): Pillola {
    let e: Pillola = undefined;
    if (isdef(arg.pillole)) {
        arg.pillole.forEach(function (value: Pillola) {
            if (value.pillolaId === pillolaId) {
                e = value;
            }
        });
    }
    return e;
}


class Pillola {
    public instanceId: string;
    public argomentoId: string;
    public argomento: string;
    public userId: string;
    public titolo: string;
    public contenuto: string;
    public ordine: number;
    public pillolaId: string;
    public programmaId: string;
    public tipoPillola: string;
    public tipoPillolaId: string;
    public tipoContenuto: string;
    public tipoContenutoId: string;
    public importante: boolean;
    public oggettoId: string;
    public uid: string;
    public canEdit: boolean;
}
