Imports CefSharp
Imports CefSharp.Wpf

Public Class JSConnector
    Protected browser As ChromiumWebBrowser
    Public Event MessageReceived(sender As JSConnector, ByRef e As MessageReceivedEventArgs)

    Public Sub New(br As ChromiumWebBrowser, Optional name As String = "jsc")
        Me.browser = br
        browser.JavascriptObjectRepository.Register(name, Me, True)
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

    Public Async Function execJSAsync(js As String) As Task(Of Object)
        Try
            Dim resp As JavascriptResponse = Await browser.EvaluateScriptAsync(js)
            If resp.Success Then
                Return resp.Result
            Else
                Throw New Exception("Errore eseguendo javascript: " + resp.Message)
            End If
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

End Class

Public Class MessageReceivedEventArgs
    Public message As String
    Public par As Object
    Public returnString As String
End Class