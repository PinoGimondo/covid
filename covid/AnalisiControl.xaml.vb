Imports System.Data
Imports CefSharp
Public Class AnalisiControl
    Dim Province As New ListaProvince

    Private Sub AnalisiControl_Loaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
        caricaProvince()
        lvProvince.ItemsSource = Province.province
        MostraSvg()
    End Sub

    Protected Sub caricaProvince()
        Dim da As New CovidOpenDataDataAdapter
        Dim dt As DataTable = da.getDataset("province")
        Province.leggi(dt)
        dt = da.getDataset("casi_italiani")
        Dim ld As New ListaDati
        ld.leggi(dt)
        Dim d As dato
        Dim prov As String = ""
        Dim p As Provincia = Nothing
        For Each d In ld.OrderBy(Function(x) x.codiceProvincia).OrderBy(Function(s) s.data)
            If prov <> d.codiceProvincia Then
                prov = d.codiceProvincia
                p = Province.Item(prov)
            End If
            If p IsNot Nothing Then
                p.dati.Add(d)
            End If
        Next
    End Sub

    Private Sub MostraSvg()
        Dim G As New Grafico
        Dim surl As String = "http://www.pardesca.it:4080/static/pillole/"
        Dim s As String = String.Format(My.Resources.htmlpage, My.Resources.svgstyle, G.generaSvg(Province.provinceSelezionate))
        WB.LoadHtml(s, surl)
    End Sub

    Private Sub ListBox_CheckChanged(sender As System.Object, e As System.Windows.RoutedEventArgs)
        MostraSvg()
    End Sub
End Class
