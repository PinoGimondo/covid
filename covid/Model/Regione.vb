Imports System.Collections.ObjectModel
Imports System.Data
Public Class ElementoAnalisi
    Public Property isExpanded As Boolean = True
    Public Property isSelected As Boolean
    Public Property dati As New ListaDati

End Class

Public Class Paese
    Inherits ElementoAnalisi
    Public Property codicePaese
    Public Property denominazionePaese

End Class

Public Class ListaPaesi
    Inherits Dictionary(Of String, Paese)

    Public Sub leggi(dt As DataTable)
        'Dim r As Regione
        'For Each dr As DataRow In dt.Rows
        '    r = New Regione
        '    r.leggi(dr)
        '    Me.Add(r.codiceRegione, r)
        'Next
    End Sub

    Public Function paesiSelezionati() As List(Of Paese)
        Dim o As New List(Of Paese)
        For Each p As Paese In Me.Values.Where(Function(x) x.isSelected).OrderBy(Function(x) x.denominazionePaese)
            o.Add(p)
        Next
        Return o
    End Function

End Class





Public Class Italia
    Inherits Paese
    Public Sub New()
        Me.codicePaese = "it"
        Me.denominazionePaese = "ITALIA"
    End Sub
    Public Property regioni As New List(Of Regione)
End Class

Public Class Regione
    Inherits ElementoAnalisi
    Public Property codiceRegione As String
    Public Property denominazioneRegione As String
    Public Property province As New List(Of Provincia)

    Public Sub New()
        Me.isExpanded = False
    End Sub

    Public Sub leggi(dr As DataRow)
        codiceRegione = dr("codice_regione")
        denominazioneRegione = dr("denominazione_regione")
    End Sub
End Class

Public Class ListaRegioni
    Inherits Dictionary(Of String, Regione)

    Public Sub leggi(dt As DataTable)
        Dim r As Regione
        For Each dr As DataRow In dt.Rows
            r = New Regione
            r.leggi(dr)
            Me.Add(r.codiceRegione, r)
        Next
    End Sub

    Public Function regioniSelezionate() As List(Of Regione)
        Dim o As New List(Of Regione)
        For Each r As Regione In Me.Values.Where(Function(x) x.isSelected).OrderBy(Function(x) x.denominazioneRegione)
            o.Add(r)
        Next
        Return o
    End Function

End Class
