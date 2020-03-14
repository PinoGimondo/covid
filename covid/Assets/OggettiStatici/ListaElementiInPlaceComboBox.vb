Imports gimondo.WPF.ToolBox.InPlaceComboBox

Public Class ListaElementiInPlaceComboBox
    Inherits List(Of Elemento)

    Public ReadOnly Property getElemento(id As String) As Elemento
        Get
            Return Me.Where(Function(x) x.ID = id).FirstOrDefault
        End Get
    End Property

    Public Sub Fill(tt As Tipologica, Optional filtro As String = "")
        Me.Clear()

        Dim el As Elemento
        Dim words As List(Of String) = Nothing
        Dim sx As String

        If filtro <> "" Then
            words = New List(Of String)
            Dim s As String = filtro.ToUpper
            Dim ss() As String = Nothing
            ss = s.Split(" ")
            For Each w As String In ss
                w = Trim(w)
                If w <> "" Then
                    words.Add(w)
                End If
            Next
        End If

        Dim okToAdd As Boolean

        For Each e As ElementoTipologica In tt.elementi
            okToAdd = True

            If filtro <> "" Then
                sx = e.label.ToUpper

                For Each w As String In words
                    If Not sx.Contains(w) Then
                        okToAdd = False
                        Exit For
                    End If
                Next
            End If

            If okToAdd Then
                el = New Elemento(e.id, e.label, "/PillolEditor;component/Images/noimage.png")
                el.Source = e
                onBeforeAddElement(el)
                Add(el)
            End If

        Next



    End Sub

    Protected Overridable Sub onBeforeAddElement(ByRef e As Elemento)
    End Sub

End Class

