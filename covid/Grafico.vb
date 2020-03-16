Public Class Grafico
    Dim RViewPort As Rect
    Dim xDay As Double
    Dim ndays As Integer
    Dim altMese As Integer
    Dim altGiorno As Integer
    Dim dataInizio As Date

    Public Sub New()
        init()
    End Sub

    Sub init()
        RViewPort = New Rect(0, 0, 2200, 1170)
        xDay = 20
        ndays = RViewPort.Width / xDay
        altMese = 30
        altGiorno = 20
        dataInizio = "20/2/2020"
    End Sub

    Public Function generaSvg() As String
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
        Return xd.ToString
    End Function

End Class
