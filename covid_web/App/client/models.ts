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
    constructor() {}
}

class Paese extends ElementoAnalisi { 
    constructor() {
        super();
        this.tipo="C"
    }
    public get codice_paese(): string {
        return this.codice;
    }
    public get denominazione_paese(): string {
        return this.label;
    }
}

class ListaPaesi extends Array<Paese> {

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
