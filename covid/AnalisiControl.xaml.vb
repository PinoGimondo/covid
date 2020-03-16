Imports System.Data
Imports CefSharp
Public Class AnalisiControl
    Dim P As New ListaProvince

    Private Sub AnalisiControl_Loaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
        caricaProvince()
        lvProvince.ItemsSource = P.Values.OrderBy(Function(x) x.denominazioneProvincia)
        MostraSvg()
    End Sub

    Protected Sub caricaProvince()
        Dim da As New CovidOpenDataDataAdapter
        Dim dt As DataTable = da.getDataset("province")
        P.leggi(dt)
    End Sub

    Private Sub MostraSvg()
        Dim G As New Grafico
        Dim surl As String = "http://www.pardesca.it:4080/static/pillole/"
        Dim s As String = String.Format(My.Resources.htmlpage, My.Resources.svgstyle, G.generaSvg())
        WB.LoadHtml(s, surl)
    End Sub

    Private Sub tvProvince_SelectedItemChanged(sender As Object, e As RoutedPropertyChangedEventArgs(Of Object))

    End Sub

    Private Sub tvProvince_MouseRightButtonDown(sender As Object, e As MouseButtonEventArgs)

    End Sub
End Class
