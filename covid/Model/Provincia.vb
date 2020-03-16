Imports System.Data

Public Class Provincia
    Public Property codiceProvincia As String
    Public Property codiceRegione As String
    Public Property denominazioneRegione As String
    Public Property siglaProvincia As String
    Public Property denominazioneProvincia As String

    Public Sub leggi(dr As DataRow)
        codiceProvincia = dr("codice_provincia")
        codiceRegione = dr("codice_regione")
        denominazioneRegione = dr("denominazione_regione")
        siglaProvincia = dr("sigla_provincia")
        denominazioneProvincia = dr("denominazione_provincia")
    End Sub
End Class

Public Class ListaProvince
    Inherits Dictionary(Of String, Provincia)

    Public Sub leggi(dt As DataTable)
        Dim p As Provincia
        For Each dr As DataRow In dt.Rows
            p = New Provincia
            p.leggi(dr)
            Me.Add(p.codiceProvincia, p)
        Next
    End Sub

End Class
