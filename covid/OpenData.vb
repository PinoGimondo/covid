

Imports System.Net

Public Class OpenData
    '    Shared ecdc As String = "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-2020-03-14_1.xls"
    Shared ecdc As String = "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-{0}.xls"
    Shared prociv As String = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province-{0}.csv"

    Public Shared Function getDatiGiornoProciv(d As Date) As String
        Dim url As String = String.Format("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province-{0}.csv", d.ToString("yyyMMdd"))
        Dim C As New WebClient()
        Try
            Return C.DownloadString(url)
        Catch ex As Exception
            Return ""
        End Try
    End Function

    Public Shared Function getDatiGiornoECDC(d As Date) As Byte()
        Dim url As String = String.Format(ecdc, d.ToString("yyyy-MM-dd"))
        Dim C As New WebClient()
        Try
            '       C.DownloadFile(url, "c:\data\test\covid.xls")
            Return C.DownloadData(url)
        Catch ex As Exception
            Return Nothing
        End Try
    End Function



End Class


