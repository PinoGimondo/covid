Imports Microsoft.Web.WebView2.Wpf

Public Class JSConnector
    Protected browser As WebView2
    Public Event MessageReceived(sender As JSConnector, ByRef e As MessageReceivedEventArgs)

    Public Sub New(br As WebView2, Optional name As String = "jsc")
        Me.browser = br
    End Sub

    Public Overridable Function msg(messaggio As String, par As Object) As String
        Dim mre As New MessageReceivedEventArgs
        mre.message = messaggio
        mre.par = par
        mre.returnString = ""
        Try
            RaiseEvent MessageReceived(Me, mre)
            Return mre.returnString
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    Public Async Function execJSAsync(js As String) As Task(Of String)
        Try
            Dim RES As String = Await browser.CoreWebView2.ExecuteScriptAsync(js)
            Return RES
        Catch ex As Exception
            Return ""
        End Try
    End Function

End Class

Public Class MessageReceivedEventArgs
    Public message As String
    Public par As Object
    Public returnString As String
End Class