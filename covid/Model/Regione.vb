Imports System.Data

Public Class Regione
    Inherits ElementoAnalisi
    Public Property province As New List(Of Provincia)

    Public Sub New()
        tipo = "R"
        Me.isExpanded = False
    End Sub
    Public ReadOnly Property codiceRegione
        Get
            Return codice
        End Get
    End Property
    Public ReadOnly Property denominazioneRegione
        Get
            Return label
        End Get
    End Property

    Public Sub leggi(dr As DataRow)
        codice = dr("codice_regione")
        label = dr("denominazione_regione")
    End Sub
End Class

Public Class ListaRegioni
    Public elementi As New Dictionary(Of String, Regione)

    Public Sub leggi(dt As DataTable)
        Dim r As Regione
        Me.elementi.Clear()
        For Each dr As DataRow In dt.Rows
            r = New Regione
            r.leggi(dr)
            Me.elementi.Add(r.codiceRegione, r)
        Next
    End Sub

    Public Function regioniSelezionate() As List(Of Regione)
        Dim o As New List(Of Regione)
        For Each r As Regione In Me.elementi.Values.Where(Function(x) x.isSelected).OrderBy(Function(x) x.denominazioneRegione)
            o.Add(r)
        Next
        Return o
    End Function
    Public Sub elaboraStime()
        For Each r As Regione In Me.elementi.Values
            r.stime.dati = r.dati
            r.stime.elabora()
        Next
    End Sub

End Class
