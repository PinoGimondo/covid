Imports System.Collections.ObjectModel
Imports System.Data
Public Class ElementoAnalisi
    Public Property tipo As String
    Public Property codice As String
    Public Property codiceParent As String
    Public Property label As String

    Public Property isExpanded As Boolean = True
    Public Property isSelected As Boolean
    Public Property children As New ObservableCollection(Of ElementoAnalisi)
End Class
