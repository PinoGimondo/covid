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


        <EnableCors("*", "*", "*")>
        <Route("api/grafico")>
        <AcceptVerbs({"GET"})>
        Public Function getGrafico(t As String, p As String) As String
            Try
                Dim lea As New List(Of ElementoAnalisi)
                If p IsNot Nothing Then
                    Dim C As New Casi(My.Settings.connectionString)
                    C.caricaDati()

                    Dim ss() As String = p.Split(",")
                    Dim tipo As String
                    Dim code As String

                    For Each s As String In ss
                        If s.Length > 2 Then
                            tipo = Left(s, 1)
                            code = Right(s, s.Length - 1)
                            If tipo = "C" Then
                                lea.Add(C.paesi.elementi.Item(code))
                            End If
                            If tipo = "R" Then
                                lea.Add(C.regioni.elementi.Item(code))
                            End If
                            If tipo = "P" Then
                                lea.Add(C.province.elementi.Item(code))
                            End If
                        End If
                    Next
                End If

                Dim G = New Grafico
                Return G.generaSvg(lea, 0, True, True)
            Catch ex As Exception
                Throw New Exception("error: " & ex.Message)
            End Try

        End Function




    End Class
End Namespace