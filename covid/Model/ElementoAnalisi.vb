Imports System.Collections.ObjectModel
Imports System.Data
Public Class ElementoAnalisi
    Public Property tipo As String
    Public Property codice As String
    Public Property label As String

    Public Property isExpanded As Boolean = True
    Public Property isSelected As Boolean
    Public Property dati As New ListaDati
    Public Property stime As New ListaStime

End Class
