Imports System.Net
Imports System.Web.Http
Imports System.Web.Http.Cors
Imports covid_lib

Namespace Controllers
    Public Class WebApiController
        Inherits ApiController


        <EnableCors("*", "*", "*")>
        <Route("api/paesi")>
        <AcceptVerbs({"GET"})>
        Public Function Paesi() As List(Of Paese)
            Try
                Dim lp As New List(Of Paese)
                Dim p As Paese

                p = New Paese
                p.codice = "IT"
                p.label = "Italia"
                lp.Add(p)

                p = New Paese
                p.codice = "FR"
                p.label = "France"
                lp.Add(p)

                Return lp

                'Dim ds As DataSet = da.ListaProgrammiStudente("PROGRAMMA_E_ARGOMENTI", id)
                'Dim p As Programma = Nothing
                'If ds.Tables.Count > 0 Then
                '    Dim lp As ListaProgrammi = Factory.leggiListaProgrammi(ds.Tables(0))
                '    If lp.Count > 0 Then
                '        p = lp.First
                '        p.argomentiStudente = Factory.leggiListaArgomentiStudente(ds.Tables(1))
                '    End If
                'End If

                '                Return p

            Catch ex As Exception
                Throw New Exception("error: " & ex.Message)
            End Try

        End Function




    End Class
End Namespace