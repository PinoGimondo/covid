

Imports System.Net

Public Class Prociv
    Public Shared Function getDatiGiorno(d As Date) As String
        Dim url As String = String.Format("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province-{0}.csv", d.ToString("yyyMMdd"))
        Dim C As New WebClient()
        Try
            Return C.DownloadString(url)
        Catch ex As Exception
            Return ""
        End Try
    End Function


End Class


