Imports System.Windows

Public Class Grafico
    Dim RViewPort As Rect
    Dim xDay As Double
    Dim ndays As Integer
    Dim altMese As Integer = 30
    Dim altGiorno As Integer = 20
    Dim dataInizio As Date = "20/2/2020"
    Dim min As Double
    Public MaxVertical As Double = 2000
    Dim s0 As Double = 1000
    Dim s1 As Double = 100
    Dim dy As Double = 1
    Dim range As Double
    Dim sDot As Double = 10
    Dim xdSpace As Double
    Dim distLegenda As Double = 20
    Public Sub New()
    End Sub

    Public Function generaSvg(serieSelezionate As List(Of ElementoAnalisi), tipoDati As tipoDatoEnum, mostraValori As Boolean, autoscala As Boolean) As String

        Dim automax As Double = 0
        If autoscala Then
            For Each p As ElementoAnalisi In serieSelezionate
                For Each c As Dato In p.dati
                    automax = Math.Max(automax, c.getDato(tipoDati))
                Next
            Next
            If automax = 0 Then
                automax = MaxVertical
            End If
        Else
            automax = MaxVertical
        End If

        range = CInt(automax * 1.12 - min)


        RViewPort = New Rect(0, 0, 1500, 900)
        xDay = 21
        ndays = RViewPort.Width / xDay
        min = 0
        dy = RViewPort.Height / range
        xdSpace = (xDay - sDot) / 2

        Dim xd As XDocument = XDocument.Parse("<svg viewBox=""0 0 1500 900"" width=""100%"" height=""100%"" ></svg>")
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
        Dim serie As Integer = 0

        Dim boxLegenda As XElement = Svg.group("")
        boxLegenda.Add(New XAttribute("transform", String.Format("translate({0},{1}) rotate(0)", Svg.str(xDay / 2), Svg.str(altGiorno + altMese + 14))))
        If serieSelezionate.Count > 0 Then
            boxLegenda.Add(Svg.rect("boxLegenda shadow", xDay / 0, 0, 240, (serieSelezionate.Count - 1) * distLegenda + 40))
        End If

        For Each p As ElementoAnalisi In serieSelezionate

            dprov = Svg.group("")
            boxLegenda.Add(generaLegenda(serie, p.label.Replace("'", "\'")))

            Dim pp As Dato = Nothing
            For Each c As Dato In p.dati
                If c.totaleCasi > 0 Then
                    If pp IsNot Nothing Then
                        dprov.Add(generaLinea(serie, pp, c, tipoDati))
                    End If
                    pp = c
                End If
            Next
            Dim ld As Dato = Nothing
            For Each c As Dato In p.dati
                c.Label = p.label.Replace("'", "")

                If c.totaleCasi > 0 Then
                    dprov.Add(generaPunto(serie, c, tipoDati, mostraValori))
                End If
                ld = c
            Next
            If ld IsNot Nothing Then
                dprov.Add(Svg.text("LLS S" + serie.ToString, vToX(ld.data) + 10, vToY(ld.getDato(tipoDati)), p.label.Replace("'", "\'")))
            End If

            dati.Add(dprov)
            serie += 1
        Next
        dati.Add(boxLegenda)
        xd.Root.Add(dati)
        Return xd.ToString
    End Function

    Protected Function generaLegenda(serie As Integer, label As String) As XElement
        Dim e As XElement = Svg.group("")
        e.Add(Svg.text("S S" & serie.ToString, 10, (serie + 1) * distLegenda, "\uf055"))
        e.Add(Svg.text("LL S" & serie.ToString, 10 + xDay, (serie + 1) * distLegenda, label))
        Return e
    End Function

    Protected Function generaLinea(serie As Integer, d1 As Dato, d2 As Dato, tipoDato As tipoDatoEnum) As XElement
        Dim e As XElement = Svg.linea("LS S" & serie.ToString, vToX(d1.data), vToY(d1.getDato(tipoDato)), vToX(d2.data), vToY(d2.getDato(tipoDato)))
        Return e
    End Function

    Protected Function generaPunto(serie As Integer, d As Dato, tipoDato As tipoDatoEnum, visualizzaValore As Boolean) As XElement
        Dim g As XElement = Svg.group("")
        Dim x As Double = vToX(d.data)
        Dim y As Double = vToY(d.getDato(tipoDato))
        Dim v As String = Math.Round(d.getDato(tipoDato)).ToString
        Dim e As XElement = Svg.text("S S" & serie.ToString, x, y, "\uf055")
        e.Add(New XElement("title", String.Format("{0}|{1}|{2}", d.data.ToString("dd/MM/yyyy"), d.Label, v)))
        g.Add(e)
        If visualizzaValore Then
            g.Add(Svg.text("testoValore S" + serie.ToString, x, y - 10, v))
        End If

        Return g
    End Function

    Public Function vToY(value As Double) As Double
        Return RViewPort.Bottom - altGiorno - dy * value - 4
    End Function

    Public Function vToX(data As Date) As Double
        Return RViewPort.Left + (data.Subtract(dataInizio).TotalDays) * xDay + xDay / 2
    End Function

End Class
