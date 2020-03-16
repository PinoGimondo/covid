Imports System.Data
Imports System.Data.SqlClient
Imports Microsoft.Office.Interop
Imports ServiziDB

Public Class CovidOpenDataDataAdapter
    Dim DB As SERVIZI_DB

    Public Sub New()
        DB = New SERVIZI_DB
        DB.ConnectionString = My.Settings.connectionString
    End Sub

    Public Function elaboraDati() As Boolean
        Dim cmd As New SqlCommand("elaboraDati")
        cmd.CommandType = System.Data.CommandType.StoredProcedure
        DB.EseguiComando(cmd)
        Return DB.LastActionSuccess
    End Function

    Protected Function ingestFile(s As String, tipo As String) As Boolean
        Dim cmd As New SqlCommand("ingestFile")
        cmd.CommandType = System.Data.CommandType.StoredProcedure
        cmd.Parameters.AddWithValue("@file", s)
        cmd.Parameters.AddWithValue("@tipo", tipo)
        DB.EseguiComando(cmd)
        Return DB.LastActionSuccess
    End Function

    Public Sub ingestProciv()
        Dim d As Date = "24/2/2020"
        For i As Integer = 0 To Now().Subtract(d).Days
            Dim s As String = OpenData.getDatiGiornoProciv(d.AddDays(i))
            If s <> "" Then
                ingestFile(s, "prociv")
            End If
        Next
    End Sub

    Public Sub ingestECDC()
        Dim nf As String = "c:\data\test\covid_world.xls"
        Dim nfc As String = "c:\data\test\covid_world.csv"
        Dim buf() As Byte = OpenData.getDatiGiornoECDC(Now().Date)
        If buf Is Nothing Then
            buf = OpenData.getDatiGiornoECDC(Now().Date.AddDays(-1))
        End If
        IO.File.WriteAllBytes(nf, buf)
        Dim xlApp As New Excel.ApplicationClass
        xlApp.DisplayAlerts = False

        Dim xlWorkBook As Microsoft.Office.Interop.Excel.Workbook = xlApp.Workbooks.Open(nf)
        Dim xlWorkSheet As Microsoft.Office.Interop.Excel.Worksheet = xlWorkBook.Worksheets("CSV_4_COMS")
        Try
            xlWorkSheet.SaveAs(nfc, Microsoft.Office.Interop.Excel.XlFileFormat.xlCSVWindows)
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
        xlApp.Workbooks.Close()

        xlApp.DisplayAlerts = True
        xlApp.Quit()

        Dim s As String = IO.File.ReadAllText(nfc)
        ingestFile(s, "ecdc")

    End Sub

    Public Function getDataset(tipo As String) As DataTable
        Dim cmd As New SqlCommand("getDataset")
        cmd.CommandType = System.Data.CommandType.StoredProcedure
        cmd.Parameters.AddWithValue("@tipo", tipo)
        Dim dt As DataTable = Nothing
        DB.CaricaDati(cmd, dt)
        Return dt
    End Function




End Class
