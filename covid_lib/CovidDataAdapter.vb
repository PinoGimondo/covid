Imports System.Data
Imports System.Data.SqlClient
Imports Microsoft.Office.Interop
Imports ServiziDB

Public Class CovidDataAdapter
    Dim DB As SERVIZI_DB

    Public Sub New(cs As String)
        DB = New SERVIZI_DB
        DB.ConnectionString = cs
    End Sub

    Public Function getNomi() As DataSet
        Dim cmd As New SqlCommand("getNomi")
        cmd.CommandType = System.Data.CommandType.StoredProcedure
        Dim ds As New DataSet
        DB.CaricaDati(cmd, ds)
        Return ds
    End Function
    Public Function getDati(aggregazione As String, id As String, anno As Integer, sesso As String, fasce As String) As DataSet
        Dim cmd As New SqlCommand("GetDatiAnno")
        cmd.CommandType = System.Data.CommandType.StoredProcedure
        cmd.Parameters.AddWithValue("@aggregazione", aggregazione)
        cmd.Parameters.AddWithValue("@id", id)
        cmd.Parameters.AddWithValue("@anno", anno)
        cmd.Parameters.AddWithValue("@sesso", sesso)
        cmd.Parameters.AddWithValue("@fasce", fasce)
        Dim ds As New DataSet
        DB.CaricaDati(cmd, ds)
        Return ds
    End Function

End Class
