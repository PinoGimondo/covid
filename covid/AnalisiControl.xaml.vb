Imports System.Collections.ObjectModel
Imports System.Windows.Threading
Imports covid_lib
Imports Microsoft.Web.WebView2.Core

Public Class AnalisiControl
    ReadOnly C As Casi = Application.C
    Public WithEvents jsc As JSConnector
    Protected WithEvents renderTimer As DispatcherTimer
    Dim surl As String = "http://www.pardesca.it:5080/static/pillole/"
    Dim G As Grafico
    Dim tipoElemento As String = ""
    Dim codiceElemento As String = ""
    Dim svg_toshow As String = ""
    Dim spaLoaded As Boolean = False
    Dim pageEmpty As String = ""
    Public Sub New()
        InitializeComponent()
        jsc = New JSConnector(Me.WV)
    End Sub

    Public Sub init()
        Dim oc As New ObservableCollection(Of ElementoAnalisi)
        oc.Add(C.Italia)
        TV.ItemsSource = oc
        renderTimer = New DispatcherTimer()
        renderTimer.Interval = New TimeSpan(0, 0, 0, 0, 100)
        WV.Source = New Uri("about:blank")
        G = New Grafico
        pageEmpty = String.Format(My.Resources.htmlpage, surl, My.Resources.svgScript, G.generaSvg(C, "G", False), My.Resources.svgstyle)
    End Sub

    Private Sub AnalisiControl_Loaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
        init()
    End Sub

    Private Sub MostraSvg()
        If WV IsNot Nothing And G IsNot Nothing Then
            WV.NavigateToString(String.Format(My.Resources.htmlpage, surl, My.Resources.svgScript, svg_toshow, My.Resources.svgstyle))
            ' WV.NavigateToString(pageEmpty)
        End If
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

    Private Sub renderTimer_TickAsync(sender As Object, e As EventArgs) Handles renderTimer.Tick

        renderTimer.Stop()
        If jsc IsNot Nothing And G IsNot Nothing And tipoElemento <> "" Then
            Dim tipoDati As String = ""
            If cbDati_C.IsChecked Then
                tipoDati = "C"
            Else
                tipoDati = "G"
            End If

            Dim sFasce As String = ""
            If cbFascia_1.IsChecked Then sFasce &= "1,"
            If cbFascia_2.IsChecked Then sFasce &= "2,"
            If cbFascia_3.IsChecked Then sFasce &= "3,"
            If cbFascia_4.IsChecked Then sFasce &= "4,"
            If cbFascia_5.IsChecked Then sFasce &= "5,"
            If cbFascia_6.IsChecked Then sFasce &= "6,"
            If cbFascia_7.IsChecked Then sFasce &= "7,"
            If cbFascia_8.IsChecked Then sFasce &= "8,"
            If cbFascia_9.IsChecked Then sFasce &= "9,"
            If cbFascia_10.IsChecked Then sFasce &= "10,"
            If cbFascia_11.IsChecked Then sFasce &= "11,"
            If cbFascia_12.IsChecked Then sFasce &= "12,"
            If cbFascia_13.IsChecked Then sFasce &= "13,"
            If cbFascia_14.IsChecked Then sFasce &= "14,"
            If cbFascia_15.IsChecked Then sFasce &= "15,"
            If cbFascia_16.IsChecked Then sFasce &= "16,"
            If cbFascia_17.IsChecked Then sFasce &= "17,"
            If cbFascia_18.IsChecked Then sFasce &= "18,"
            If cbFascia_19.IsChecked Then sFasce &= "19,"
            If cbFascia_20.IsChecked Then sFasce &= "20,"
            If cbFascia_21.IsChecked Then sFasce &= "21,"

            If sFasce.Length > 0 Then
                sFasce = Left(sFasce, sFasce.Length - 1)
            End If

            Dim sAnni As String = ""
            If cbAnno_2011.IsChecked Then sAnni &= "2011,"
            If cbAnno_2012.IsChecked Then sAnni &= "2012,"
            If cbAnno_2013.IsChecked Then sAnni &= "2013,"
            If cbAnno_2014.IsChecked Then sAnni &= "2014,"
            If cbAnno_2015.IsChecked Then sAnni &= "2015,"
            If cbAnno_2016.IsChecked Then sAnni &= "2016,"
            If cbAnno_2017.IsChecked Then sAnni &= "2017,"
            If cbAnno_2018.IsChecked Then sAnni &= "2018,"
            If cbAnno_2019.IsChecked Then sAnni &= "2019,"
            If cbAnno_2020.IsChecked Then sAnni &= "2020,"

            If sAnni.Length > 0 Then
                sAnni = Left(sAnni, sAnni.Length - 1)
            End If
            Dim sesso As String = "T"
            If cbSesso_F.IsChecked Then sesso = "F"
            If cbSesso_M.IsChecked Then sesso = "M"
            C.caricaDati(Me.tipoElemento, Me.codiceElemento, sesso, sFasce, sAnni)
            svg_toshow = G.generaSvg(C, tipoDati, True).Replace(vbCr, "").Replace(vbLf, "")
            MostraSvg()
        End If

    End Sub

    Private Sub TV_SelectedItemChanged(sender As Object, e As RoutedPropertyChangedEventArgs(Of Object))
        If e.NewValue IsNot Nothing AndAlso TypeOf e.NewValue Is ElementoAnalisi Then
            Dim ea As ElementoAnalisi = e.NewValue
            Me.tipoElemento = ea.tipo
            Me.codiceElemento = ea.codice
            InvalidateSvg()
        End If

    End Sub

    Private Sub cbLabels_checkChanged(sender As Object, e As RoutedEventArgs)
        InvalidateSvg()
    End Sub

    Private Sub cbTutti_Click(sender As Object, e As RoutedEventArgs)
        selezionaTutte(True)
    End Sub

    Private Sub cbNessuna_Click(sender As Object, e As RoutedEventArgs)
        selezionaTutte(False)
    End Sub

    Private Sub selezionaTutte(val As Boolean)
        cbFascia_1.IsChecked = val
        cbFascia_2.IsChecked = val
        cbFascia_3.IsChecked = val
        cbFascia_4.IsChecked = val
        cbFascia_5.IsChecked = val
        cbFascia_6.IsChecked = val
        cbFascia_7.IsChecked = val
        cbFascia_8.IsChecked = val
        cbFascia_9.IsChecked = val
        cbFascia_10.IsChecked = val
        cbFascia_11.IsChecked = val
        cbFascia_12.IsChecked = val
        cbFascia_13.IsChecked = val
        cbFascia_14.IsChecked = val
        cbFascia_15.IsChecked = val
        cbFascia_16.IsChecked = val
        cbFascia_17.IsChecked = val
        cbFascia_18.IsChecked = val
        cbFascia_19.IsChecked = val
        cbFascia_20.IsChecked = val
        cbFascia_21.IsChecked = val
    End Sub

    Private Sub WV_CoreWebView2Ready(sender As Object, e As EventArgs) Handles WV.CoreWebView2Ready
        Try
            WV.NavigateToString(pageEmpty)
            spaLoaded = True
        Catch ex2 As Exception
        End Try
    End Sub

    Private Async Sub WV_NavigationCompleted(sender As Object, e As CoreWebView2NavigationCompletedEventArgs) Handles WV.NavigationCompleted
        If spaLoaded Then
            Dim res2 As Object = Await jsc.execJSAsync(String.Format("pageCommand('new_svg','{0}' );", Me.svg_toshow))
        Else
            WV.NavigateToString(pageEmpty)
            spaLoaded = True
        End If
    End Sub
End Class
