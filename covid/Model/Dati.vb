Imports System.Data

Public Class dato
    Public Property data As Date
    Public Property codiceProvincia As String
    Public Property totaleCasi As Integer

    Public Sub leggi(dr As DataRow)
        data = dr("data")
        codiceProvincia = dr("codice_provincia")
        totaleCasi = dr("totale_casi")
    End Sub
End Class

Public Class ListaDati
    Inherits List(Of dato)

    Public Sub leggi(dt As DataTable)
        Dim d As dato
        For Each dr As DataRow In dt.Rows
            d = New dato
            d.leggi(dr)
            Me.Add(d)
        Next
    End Sub

End Class
