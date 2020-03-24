Imports System.Collections.ObjectModel
Imports System.Data
Public Class ElementoAnalisi
    Public Property tipo As String
    Public Property codice As String
    Public Property label As String

    Public Property isExpanded As Boolean = True
    Public Property isSelected As Boolean
    Public Property dati As New ListaDati
    Public Property stime As New ListaStime

End Class

Public Class CovidDataSet
    Public Property paesi As New List(Of Paese)
    Public Property regioni As New List(Of Regione)
    Public Property province As New List(Of Provincia)

    Public Sub leggi(ds As DataSet)
        Dim lp As New ListaPaesi
        lp.leggi(ds.Tables(0))
        paesi.Add(lp.elementi("IT"))
        paesi.AddRange(lp.elementi.Values.Where(Function(x) x.codice <> "IT"))
        Dim lr As New ListaRegioni
        lr.leggi(ds.Tables(1))
        regioni.AddRange(lr.elementi.Values)
        Dim lpr As New ListaProvince
        lpr.leggi(ds.Tables(2))
        province.AddRange(lpr.elementi.Values)

    End Sub

End Class
