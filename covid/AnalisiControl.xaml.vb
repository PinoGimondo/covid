Imports System.Collections.ObjectModel
Imports System.Data
Imports System.Windows.Threading
Imports CefSharp
Public Class AnalisiControl
    ReadOnly C As Casi = Application.C
    Public WithEvents jsc As JSConnector
    Protected WithEvents renderTimer As DispatcherTimer
    Dim surl As String = "http://www.pardesca.it:4080/static/pillole/"
    Dim G As Grafico
    Dim l As New List(Of ElementoAnalisi)

    Public Sub New()
        InitializeComponent()

        Dim oc As New ObservableCollection(Of ElementoAnalisi)

        oc.Add(C.italia)
        For Each ea As ElementoAnalisi In C.paesi.Values.Where(Function(x) x.codicePaese <> "IT").OrderBy(Function(x) x.denominazionePaese)
            oc.Add(ea)
        Next
        TV.ItemsSource = oc

        renderTimer = New DispatcherTimer()
        renderTimer.Interval = New TimeSpan(0, 0, 0, 0, 200)

        jsc = New JSConnector(Me.WB)

        G = New Grafico

    End Sub

    Private Sub AnalisiControl_Loaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
        MostraSvg()
    End Sub

    Private Sub MostraSvg()
        If WB IsNot Nothing And G IsNot Nothing Then
            G.MaxVertical = slScalaValori.Value
            Dim s As String = String.Format(My.Resources.htmlpage, surl, My.Resources.svgstyle, My.Resources.svgScript, G.generaSvg(l, TipoDati.SelectedIndex, False, False))
            WB.LoadHtml(s, surl)
        End If
    End Sub

    Private Sub TV_UnChecked(sender As Object, e As RoutedEventArgs)
        InvalidateSvg()
    End Sub
    Private Sub TV_Checked(sender As Object, e As RoutedEventArgs)
        InvalidateSvg()
    End Sub

    Private Sub slScalaValori_ValueChanged(sender As Object, e As RoutedPropertyChangedEventArgs(Of Double))
        InvalidateSvg()
    End Sub

    Private Sub InvalidateSvg()
        If renderTimer IsNot Nothing Then
            renderTimer.Stop()
            renderTimer.Start()
        End If
    End Sub

    Private Async Sub renderTimer_TickAsync(sender As Object, e As EventArgs) Handles renderTimer.Tick

        renderTimer.Stop()
        If jsc IsNot Nothing And G IsNot Nothing Then
            G.MaxVertical = slScalaValori.Value
            l.Clear()
            l.AddRange(C.paesi.paesiSelezionati)
            l.AddRange(C.regioni.regioniSelezionate)
            l.AddRange(C.province.provinceSelezionate)

            Dim s As String = G.generaSvg(l, TipoDati.SelectedIndex, cbLabels.IsChecked, cbAutoScale.IsChecked).Replace(vbCr, "").Replace(vbLf, "")
            Dim res As Object = Await jsc.execJSAsync(String.Format("pageCommand('new_svg','{0}' );", s))
        End If

    End Sub

    Private Sub TipoDati_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)
        InvalidateSvg()
    End Sub

    Private Sub cbLabels_checkChanged(sender As Object, e As RoutedEventArgs)
        InvalidateSvg()
    End Sub
End Class
