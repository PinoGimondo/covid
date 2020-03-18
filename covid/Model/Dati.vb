Imports System.Data
Public Enum tipoDatoEnum
    totaleCasi = 0
    totCasi100k = 1
End Enum

Public Class Casi
    Public province As New ListaProvince
    Public regioni As New ListaRegioni
    Public italia As New Italia

    Public Sub caricaDati()
        Dim da As New CovidOpenDataDataAdapter
        Dim dt As DataTable = da.getDataset("province")
        province.leggi(dt)
        dt = da.getDataset("casi_italiani")
        Dim ld As New ListaDati
        ld.leggi(dt)
        Dim d As Dato
        Dim prov As String = ""
        Dim p As Provincia = Nothing

        For Each d In ld.OrderBy(Function(x) x.codice).OrderBy(Function(s) s.data)
            If prov <> d.codice Then
                prov = d.codice
                p = province.Item(prov)
            End If
            If p IsNot Nothing Then
                p.dati.Add(d)
            End If
        Next

        dt = da.getDataset("regioni")
        regioni.leggi(dt)
        Dim r As Regione
        For Each p In province.Values.OrderBy(Function(x) x.denominazioneProvincia)
            r = regioni.Item(p.codiceRegione)
            r.province.Add(p)
        Next
        italia.regioni.AddRange(regioni.Values)
    End Sub

End Class


Public Class Dato
    Public Property tipo As String
    Public Property codice As String
    Public Property Label As String
    Public Property data As Date
    Public Property totaleCasi As Integer
    Public Property totaleCasiPer100k As Double

    Public Sub leggi(dr As DataRow)
        data = dr("data")
        codice = dr("codice_provincia")
        Label = dr("denominazione_provincia")
        totaleCasi = dr("totale_casi")
        totaleCasiPer100k = dr("totale_casi_x100k")
    End Sub

    Public Function getDato(tipo As tipoDatoEnum) As Double
        Select Case tipo
            Case tipoDatoEnum.totaleCasi
                Return totaleCasi
            Case tipoDatoEnum.totCasi100k
                Return totaleCasiPer100k
            Case Else
                Return 0
        End Select
    End Function

End Class

Public Class ListaDati
    Inherits List(Of Dato)

    Public Sub leggi(dt As DataTable)
        Dim d As Dato
        For Each dr As DataRow In dt.Rows
            d = New Dato
            d.leggi(dr)
            Me.Add(d)
        Next
    End Sub

End Class
