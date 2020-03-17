Imports System.Collections.ObjectModel
Imports System.Data

Public Class Provincia
    Inherits ElementoAnalisi

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

    Public Function province() As ObservableCollection(Of Provincia)
        Dim o As New ObservableCollection(Of Provincia)
        For Each p As Provincia In Me.Values.OrderBy(Function(x) x.denominazioneProvincia)
            o.Add(p)
        Next
        Return o
    End Function

    Public Function provinceSelezionate() As List(Of Provincia)
        Dim o As New List(Of Provincia)
        For Each p As Provincia In Me.Values.Where(Function(x) x.isSelected).OrderBy(Function(x) x.denominazioneProvincia)
            o.Add(p)
        Next
        Return o
    End Function

End Class
