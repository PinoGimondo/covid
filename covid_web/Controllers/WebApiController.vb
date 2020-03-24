Imports System.Net
Imports System.Web.Http
Imports System.Web.Http.Cors
Imports covid_lib

Namespace Controllers
    Public Class WebApiController
        Inherits ApiController

        <EnableCors("*", "*", "*")>
        <Route("api/ds")>
        <AcceptVerbs({"GET"})>
        Public Function dataset() As CovidDataSet
            Try
                Dim da As New CovidOpenDataDataAdapter(My.Settings.connectionString)
                Dim ds As DataSet = da.getDataset("all")
                Dim cds As New CovidDataSet
                cds.leggi(ds)
                Return cds
            Catch ex As Exception
                Throw New Exception("error: " & ex.Message)
            End Try

        End Function




    End Class
End Namespace