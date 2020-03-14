Imports System.Data.SqlClient
Imports ServiziDB

Public Class ProcivDataAdapter
    Dim DB As SERVIZI_DB

    Public Sub New()
        DB = New SERVIZI_DB
        DB.ConnectionString = My.Settings.connectionString
    End Sub

    Public Function ingestFile(s As String) As Boolean
        Dim cmd As New SqlCommand("ingestFile")
        cmd.CommandType = System.Data.CommandType.StoredProcedure
        cmd.Parameters.AddWithValue("@file", s)
        DB.EseguiComando(cmd)
        Return DB.LastActionSuccess
    End Function
End Class
