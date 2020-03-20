Imports System.Data
Public Enum tipoDatoEnum
    totaleCasi = 0
    totaleCasi100k = 1
    nuoviCasi = 2
    nuoviCasi100k = 3
    morti = 4
    morti100k = 5
    nuoviMorti = 6
    nuoviMorti100k = 7
End Enum

Public Class Casi
    Public province As New ListaProvince
    Public regioni As New ListaRegioni
    Public paesi As New ListaPaesi
    Public italia As New Italia

    Public Sub caricaDati()
        Dim da As New CovidOpenDataDataAdapter
        Dim dt As DataTable = da.getDataset("province").Tables(0)
        province.leggi(dt)

        dt = da.getDataset("regioni").Tables(0)
        regioni.leggi(dt)

        dt = da.getDataset("paesi").Tables(0)
        paesi.leggi(dt)

        Dim dsDati As DataSet = da.getDataset("casi")

        Dim ld As New ListaDati
        ld.leggi(dsDati.Tables(0))
        Dim d As Dato
        Dim prov As String = ""
        Dim p As Provincia = Nothing

        For Each d In ld.OrderBy(Function(x) x.codice).OrderBy(Function(s) s.data)
            If prov <> d.codice Then
                prov = d.codice
                p = province.Item(prov)
            End If
            If p IsNot Nothing Then
                p.dati.Add(d)
            End If
        Next


        ld = New ListaDati
        ld.leggi(dsDati.Tables(1))
        Dim reg As String = ""
        Dim r As Regione = Nothing

        For Each d In ld.OrderBy(Function(x) x.codice).OrderBy(Function(s) s.data)
            If reg <> d.codice Then
                reg = d.codice
                r = regioni.Item(reg)
            End If
            If r IsNot Nothing Then
                r.dati.Add(d)
            End If
        Next

        ld = New ListaDati
        ld.leggi(dsDati.Tables(2))
        Dim pae As String = ""
        Dim pa As Paese = Nothing

        For Each d In ld.OrderBy(Function(x) x.codice).OrderBy(Function(s) s.data)
            If pae <> d.codice Then
                pae = d.codice
                If paesi.ContainsKey(pae) Then
                    pa = paesi.Item(pae)
                Else
                    pa = Nothing
                End If
            End If

            If pa IsNot Nothing Then
                pa.dati.Add(d)
            End If
        Next

        For Each p In province.Values.OrderBy(Function(x) x.denominazioneProvincia)
            r = regioni.Item(p.codiceRegione)
            r.province.Add(p)
        Next
        italia.regioni.AddRange(regioni.Values)


    End Sub

End Class


Public Class Dato
    Public Property tipo As String
    Public Property codice As String
    Public Property Label As String
    Public Property data As Date

    Public Property totaleCasi As Integer
    Public Property totaleCasiPer100k As Double

    Public Property nuoviCasi As Integer
    Public Property nuoviCasiPer100k As Double

    Public Property totaleMorti As Integer
    Public Property totaleMortiPer100k As Double

    Public Property nuoviMorti As Integer
    Public Property nuoviMortiPer100k As Double

    Public Sub leggi(dr As DataRow)
        tipo = dr("tipo")
        data = dr("data")
        codice = dr("codice")
        Label = dr("label")
        totaleCasi = dr("totale_casi")
        totaleCasiPer100k = dr("totale_casi_x100k")
        nuoviCasi = dr("incremento_casi")
        nuoviCasiPer100k = dr("incremento_casi_x100k")
        If dr.Table.Columns.Contains("totale_morti_x100k") Then
            totaleMorti = dr("totale_morti")
            totaleMortiPer100k = dr("totale_morti_x100k")
            nuoviMorti = dr("incremento_morti")
            nuoviMortiPer100k = dr("incremento_morti_x100k")
        End If
    End Sub

    Public Function getDato(tipo As tipoDatoEnum) As Double
        Select Case tipo
            Case tipoDatoEnum.totaleCasi
                Return totaleCasi
            Case tipoDatoEnum.totaleCasi100k
                Return totaleCasiPer100k
            Case tipoDatoEnum.nuoviCasi
                Return nuoviCasi
            Case tipoDatoEnum.nuoviCasi100k
                Return nuoviCasiPer100k
            Case tipoDatoEnum.morti
                Return totaleMorti
            Case tipoDatoEnum.morti100k
                Return totaleMortiPer100k
            Case tipoDatoEnum.nuoviMorti
                Return nuoviMorti
            Case tipoDatoEnum.nuoviMorti100k
                Return nuoviMortiPer100k
            Case Else
                Return 0
        End Select
    End Function

End Class

Public Class ListaDati
    Inherits List(Of Dato)

    Public Sub leggi(dt As DataTable)
        Dim d As Dato
        For Each dr As DataRow In dt.Rows
            d = New Dato
            d.leggi(dr)
            Me.Add(d)
        Next
    End Sub

End Class
