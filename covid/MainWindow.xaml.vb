Class MainWindow
    Dim da As New ProcivDataAdapter

    Private Sub Button_Click(sender As Object, e As RoutedEventArgs)
        ingest()
        MsgBox("fatto")
    End Sub

    Public Sub ingest()
        Dim d As Date = "24/2/2020"
        For i As Integer = 0 To Now().Subtract(d).Days
            Dim s As String = Prociv.getDatiGiorno(d.AddDays(i))
            If s <> "" Then
                da.ingestFile(s)
            End If
        Next
    End Sub

End Class
