Imports System.ComponentModel

Class MainWindow
    Dim da As New CovidOpenDataDataAdapter
    Public Sub New()
        InitializeComponent()
        StatoWindow.RipristinaStato(Me)
    End Sub
    Private Sub Button_Click(sender As Object, e As RoutedEventArgs)
        da.ingestProciv()
        da.ingestECDC()
        da.elaboraDati()
        MsgBox("fatto")
    End Sub


    Private Sub MainWindow_Closing(sender As Object, e As CancelEventArgs) Handles Me.Closing
        StatoWindow.SalvaStato(Me)
    End Sub
End Class
