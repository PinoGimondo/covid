Public Class Grafico
    Dim RViewPort As Rect
    Dim xDay As Double
    Dim ndays As Integer
    Dim altMese As Integer
    Dim altGiorno As Integer
    Dim dataInizio As Date
    Dim min As Double
    Dim max As Double
    Dim s0 As Double = 1000
    Dim s1 As Double = 100
    Dim dy As Double = 1
    Dim range As Double
    Dim sDot As Double = 10
    Dim xdSpace As Double

    Public Sub New()
        init()
    End Sub

    Sub init()
        RViewPort = New Rect(0, 0, 2200, 1170)
        xDay = 21
        ndays = RViewPort.Width / xDay
        altMese = 30
        altGiorno = 20
        dataInizio = "20/2/2020"
        min = 0
        max = 2000
        range = max - min
        dy = RViewPort.Height / range
        xdSpace = (xDay - sDot) / 2
    End Sub

    Public Function generaSvg(provinceSelezionate As List(Of Provincia)) As String
        Dim xd As XDocument = XDocument.Parse("<svg width=""100%"" height=""100%"" ></svg>")
        Dim sf As XElement = Svg.group("")
        sf.Add(Svg.rect("sfondo", RViewPort))
        sf.Add(Svg.linea("rigaMese", RViewPort.Left, RViewPort.Top + altMese, RViewPort.Right, RViewPort.Top + altMese))
        sf.Add(Svg.linea("rigaMese", RViewPort.Left, RViewPort.Top + altMese + altGiorno, RViewPort.Right, RViewPort.Top + altMese + altGiorno))
        sf.Add(Svg.linea("rigaMese", RViewPort.Left, RViewPort.Bottom - altGiorno, RViewPort.Right, RViewPort.Bottom - altGiorno))
        Dim x As Double
        Dim d As Date
        Dim ma As Integer = dataInizio.Month

        Dim somma_xDay = 0

        For i As Integer = 1 To ndays
            d = dataInizio.AddDays(i - 1)
            x = i * xDay + RViewPort.Left

            somma_xDay = somma_xDay + xDay

            If ma = d.AddDays(1).Month Then
                sf.Add(Svg.linea("rigaGiorno", x, RViewPort.Top + altMese, x, RViewPort.Bottom))
            Else
                sf.Add(Svg.linea("rigaMese", x, RViewPort.Top, x, RViewPort.Bottom))
                sf.Add(Svg.text("testoMese", x - somma_xDay / 2, altMese + RViewPort.Top - 7, d.ToString("MMMM yyy").ToUpper()))
                somma_xDay = 0
                ma = d.AddDays(1).Month
            End If
            sf.Add(Svg.text("testoGiorno", x - xDay / 2, altMese + altGiorno + RViewPort.Top - 6, d.ToString("dd")))
            sf.Add(Svg.text("testoGiorno", x - xDay / 2, RViewPort.Bottom - 6, d.ToString("dd")))
        Next
        xd.Root.Add(sf)

        Dim dati As XElement = Svg.group("")
        Dim dprov As XElement
        For Each p As Provincia In provinceSelezionate
            dprov = Svg.group("")
            For Each c As dato In p.dati
                dprov.Add(Svg.rect("S0", vToX(c.data), vToY(c.totaleCasi), sDot, sDot))
            Next
            dati.Add(dprov)
        Next
        xd.Root.Add(dati)
        Return xd.ToString
    End Function

    Public Function vToY(value As Double) As Double
        Return RViewPort.Bottom - altGiorno - dy * value - sDot - 2
    End Function

    Public Function vToX(data As Date) As Double
        Return RViewPort.Left + (data.Subtract(dataInizio).TotalDays) * xDay + xdSpace
    End Function

End Class
