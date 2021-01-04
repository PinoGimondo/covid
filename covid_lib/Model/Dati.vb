Imports System.Data
Public Class Casi
    Public Property Italia As New ElementoAnalisi
    Public Property comuni As New ListaComuni
    Public Property province As New ListaProvince
    Public Property regioni As New ListaRegioni
    Public Property dati As New List(Of ListaDati)

    Public min As Integer = Integer.MaxValue
    Public max As Integer = Integer.MinValue
    Public tot As Integer = 0
    Public maxTot As Integer = 0
    Public da As CovidDataAdapter

    Public Sub New(cs As String)
        Italia.label = "Italia"
        Italia.isExpanded = True
        Italia.tipo = "I"
        Italia.codice = ""
        da = New CovidDataAdapter(cs)
    End Sub

    Public Sub caricaLuoghi()
        Dim ds As DataSet = da.getNomi()
        regioni.leggi(ds.Tables(0))
        province.leggi(ds.Tables(1))
        comuni.leggi(ds.Tables(2))

        For Each p As Provincia In province.elementi.Values
            For Each c As Comune In comuni.elementi.Values.Where(Function(x) x.codiceParent = p.codice)
                p.children.Add(c)
            Next
        Next


        For Each r As Regione In regioni.elementi.Values
            For Each p As Provincia In province.elementi.Values.Where(Function(x) x.codiceParent = r.codice)
                r.children.Add(p)
            Next
            Italia.children.Add(r)
        Next
    End Sub

    Public Sub caricaDati(aggregazione As String, id As String, sesso As String, fasce As String, anni As String)
        Dim a() As String = anni.Split(",")
        dati.Clear()
        max = 0
        min = 1000000
        tot = 0
        maxTot = 0
        For Each anno As String In a
            If Trim(anno) <> "" Then
                Dim ds As DataSet = da.getDati(aggregazione, id, anno, sesso, fasce)
                If ds.Tables.Count > 0 Then
                    Dim s As New ListaDati
                    s.leggi(ds.Tables(0))
                    s.anno = anno

                    min = Math.Min(min, s.min)
                    max = Math.Max(max, s.max)
                    tot += s.tot
                    maxTot = Math.Max(maxTot, s.tot)
                    dati.Add(s)
                End If
            End If
        Next
    End Sub

End Class



Public Class Dato
    Public Property id As String
    Public Property data As Date
    Public Property morti As Integer = 0
    Public Property mortiAnno As Integer = 0
    Public Sub leggi(dr As DataRow)
        data = dr("data")
        id = data.ToString("dd-MM-yyyy")
        morti = dr("morti")
    End Sub

End Class

Public Class ListaDati
    Public elementi As New List(Of Dato)
    Public anno As String = "..."
    Public min As Integer = Integer.MaxValue
    Public max As Integer = Integer.MinValue
    Public tot As Integer = 0
    Public Sub leggi(dt As DataTable)
        Dim d As Dato
        For Each dr As DataRow In dt.Rows
            d = New Dato
            d.leggi(dr)
            min = Math.Min(min, d.morti)
            max = Math.Max(max, d.morti)
            tot += d.morti
            d.mortiAnno = tot
            Me.elementi.Add(d)
        Next
    End Sub

End Class
