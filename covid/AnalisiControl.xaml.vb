Imports System.Collections.ObjectModel
Imports System.Data
Imports System.Windows.Threading
Imports CefSharp
Public Class AnalisiControl
    Dim C As Casi = Application.C
    Public WithEvents jsc As JSConnector
    Protected WithEvents renderTimer As DispatcherTimer
    Dim surl As String = "http://www.pardesca.it:4080/static/pillole/"
    Dim G As Grafico

    Private Sub AnalisiControl_Loaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
        Dim oc As New ObservableCollection(Of ElementoAnalisi)
        Dim p As New Paese
        p.codicePaese = "fr"
        p.denominazionePaese = "Francia"
        Dim d As New Paese
        d.codicePaese = "de"
        d.denominazionePaese = "Germany"

        oc.Add(C.italia)
        oc.Add(p)
        oc.Add(d)

        TV.ItemsSource = oc

        renderTimer = New DispatcherTimer()
        renderTimer.Interval = New TimeSpan(0, 0, 0, 0, 200)

        jsc = New JSConnector(Me.WB)

        G = New Grafico

        MostraSvg()

    End Sub


    Private Sub MostraSvg()
        If WB IsNot Nothing And G IsNot Nothing Then
            G.MaxVertical = slScalaValori.Value
            Dim s As String = String.Format(My.Resources.htmlpage, surl, My.Resources.svgstyle, My.Resources.svgScript, G.generaSvg(C.province.provinceSelezionate))
            WB.LoadHtml(s, surl)
        End If
    End Sub

    Private Sub TV_CheckChanged(sender As Object, e As RoutedEventArgs)
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
            Dim s As String = G.generaSvg(C.province.provinceSelezionate).Replace(vbCr, "").Replace(vbLf, "")
            ' s = "PIPPO"
            Dim res As Object = Await jsc.execJSAsync(String.Format("pageCommand('new_svg','{0}' );", s))
        End If


    End Sub
End Class
