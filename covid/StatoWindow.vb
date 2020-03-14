Imports System.Text
Public Class StatoWindow

    Public Shared Sub SetWindowStateFromString(ByVal w As Window, ByVal ws As String)
        If ws <> String.Empty Then
            Try
                Dim valori() As String = ws.Split("|".Chars(0))
                w.WindowState = DirectCast(CInt(valori(0)), WindowState)

                w.Top = CInt(valori(2))
                w.Left = CInt(valori(1))
                w.Width = CInt(valori(3))
                w.Height = CInt(valori(4))
            Catch ex As Exception
            End Try

        End If
    End Sub

    Public Shared Function WindowStateToString(ByVal w As Window) As String
        Dim t As New StringBuilder(100)
        If w IsNot Nothing Then
            t.Append(CInt(w.WindowState).ToString)
            t.Append("|")
            t.Append(w.Left)
            t.Append("|")
            t.Append(w.Top)
            t.Append("|")
            t.Append(w.Width)
            t.Append("|")
            t.Append(w.Height)
        End If
        Return t.ToString
    End Function

    Public Shared Sub SalvaStato(MainForm As Window)
        Dim t As New StringBuilder(1000)
        Dim wt As New StringBuilder

        t.Append(StatoWindow.WindowStateToString(MainForm))
        If wt.Length > 0 Then wt.Length -= 1
        My.Settings.WindowState = t.ToString
        My.Settings.Save()
    End Sub

    Public Shared Sub RipristinaStato(MainForm As Window)
        Dim sf() As String = My.Settings.WindowState.Split("*".Chars(0))
        SetWindowStateFromString(MainForm, sf(0))
    End Sub

End Class
