Imports covid_lib

Public Class g
    Inherits System.Web.UI.Page
    Public svg As String = ""
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim G = New Grafico
        '  svg = G.generaSvg(New List(Of ElementoAnalisi), 0, False, False)
    End Sub

End Class