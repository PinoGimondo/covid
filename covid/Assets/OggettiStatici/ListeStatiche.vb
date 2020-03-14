Imports gimondo.WPF.ToolBox.InPlaceComboBox
Imports gimondo.WPF.ToolBox
Imports gimus.pillole

Public Class ListaTipiPillola
    Inherits ListaElementiInPlaceComboBox
    Public Sub New()
        Dim tt As New Tipologiche
        For Each e As ElementoTipologica In tt.tipoPillola.elementi.OrderBy(Function(x) x.id).ToList
            Add(New Elemento(e.id, e.label, String.Format("/PillolEditor;component/Images/tp-{0}.png", e.id)))
        Next
    End Sub

End Class

Public Class ListaTipiContenuto
    Inherits ListaElementiInPlaceComboBox
    Public Sub New()
        Dim tt As New Tipologiche
        For Each e As ElementoTipologica In tt.tipoContenuto.elementi.OrderBy(Function(x) x.id).ToList
            Add(New Elemento(e.id, e.label, String.Format("/PillolEditor;component/Images/tc-{0}.png", e.id)))
        Next
    End Sub

End Class