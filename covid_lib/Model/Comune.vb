Imports System.Data

Public Class Comune
    Inherits ElementoAnalisi

    Public Sub New()
        tipo = "C"
        Me.isExpanded = False
    End Sub
    Public ReadOnly Property codiceComune
        Get
            Return codice
        End Get
    End Property
    Public ReadOnly Property denominazioneComune
        Get
            Return label
        End Get
    End Property

    Public Sub leggi(dr As DataRow)
        codiceParent = dr("PROV")
        codice = dr("COD_PROVCOM")
        label = dr("comune")
    End Sub
End Class

Public Class ListaComuni
    Public elementi As New Dictionary(Of String, Comune)

    Public Sub leggi(dt As DataTable)
        Dim o As Comune
        Me.elementi.Clear()
        For Each dr As DataRow In dt.Rows
            o = New Comune
            o.leggi(dr)
            Me.elementi.Add(o.codice, o)
        Next
    End Sub

    Public Function comuniSelezionati() As List(Of Comune)
        Dim o As New List(Of Comune)
        For Each c As Comune In Me.elementi.Values.Where(Function(x) x.isSelected).OrderBy(Function(x) x.denominazioneComune)
            o.Add(c)
        Next
        Return o
    End Function

End Class
