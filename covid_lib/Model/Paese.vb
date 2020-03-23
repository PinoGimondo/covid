Imports System.Data

Public Class Paese
    Inherits ElementoAnalisi
    Public Sub New()
        tipo = "C"
    End Sub

    Public Sub leggi(dr As DataRow)
        codice = Trim(dr("codice_paese"))
        label = dr("denominazione_paese")
    End Sub

    Public ReadOnly Property codicePaese
        Get
            Return codice
        End Get
    End Property

    Public ReadOnly Property denominazionePaese
        Get
            Return label
        End Get
    End Property

End Class

Public Class ListaPaesi
    Public elementi As New Dictionary(Of String, Paese)

    Public Sub leggi(dt As DataTable)
        Dim p As Paese
        Me.elementi.Clear()

        For Each dr As DataRow In dt.Rows
            p = New Paese
            p.leggi(dr)
            Me.elementi.Add(p.codicePaese, p)
        Next
    End Sub

    Public Function paesiSelezionati() As List(Of Paese)
        Dim o As New List(Of Paese)
        For Each p As Paese In Me.elementi.Values.Where(Function(x) x.isSelected).OrderBy(Function(x) x.denominazionePaese)
            o.Add(p)
        Next
        Return o
    End Function

    Public Sub elaboraStime()
        For Each p As Paese In Me.elementi.Values
            p.stime.dati = p.dati
            p.stime.elabora()
        Next
    End Sub


End Class


Public Class Italia
    Inherits Paese
    Public Sub New()
        Me.tipo = "C"
        Me.codice = "it"
        Me.label = "ITALIA"
    End Sub
    Public Property regioni As New List(Of Regione)
End Class
