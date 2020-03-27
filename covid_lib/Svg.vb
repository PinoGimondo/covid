
Imports System.Windows

Class Svg
    Public Shared Function str(v As Double) As String
        Return v.ToString.Replace(",", ".")
    End Function

    Public Shared Function rect(cssClass As String, r As Rect) As XElement
        Return rect(cssClass, r.X, r.Y, r.Width, r.Height)
    End Function

    Public Shared Function rect(cssClass As String, x As Double, y As Double, Optional width As Double = -1, Optional height As Double = -1) As XElement
        Dim e As XElement = New XElement("rect")
        e.Add(New XAttribute("class", cssClass))
        e.Add(New XAttribute("x", str(x)))
        e.Add(New XAttribute("y", str(y)))

        If width >= 0 Then
            e.Add(New XAttribute("width", str(width)))
        End If
        If height >= 0 Then
            e.Add(New XAttribute("height", str(height)))
        End If
        Return e
    End Function


    Public Shared Function ellipse(cssClass As String, cx As Double, cy As Double, rx As Double, ry As Double) As XElement
        Dim e As XElement = New XElement("ellipse")
        e.Add(New XAttribute("class", cssClass))
        e.Add(New XAttribute("cx", str(cx)))
        e.Add(New XAttribute("cy", str(cy)))
        e.Add(New XAttribute("rx", str(rx)))
        e.Add(New XAttribute("ry", str(ry)))
        Return e

    End Function

    Public Shared Function circle(cssClass As String, cx As Double, cy As Double, r As Double) As XElement
        Return ellipse(cssClass, cx, cy, r, r)
    End Function

    Public Shared Function linea(cssClass As String, x1 As Double, y1 As Double, x2 As Double, y2 As Double) As XElement

        Dim e As XElement = New XElement("line")
        e.Add(New XAttribute("class", cssClass))
        e.Add(New XAttribute("x1", str(x1)))
        e.Add(New XAttribute("y1", str(y1)))
        e.Add(New XAttribute("x2", str(x2)))
        e.Add(New XAttribute("y2", str(y2)))
        Return e

    End Function
    Public Shared Function use(cssClass As String, id As String, x As Double, y As Double) As XElement
        Dim e As XElement = New XElement("use")
        e.Add(New XAttribute("class", cssClass))
        e.Add(New XAttribute("href", "#" & id.Replace("#", "")))
        e.Add(New XAttribute("x", str(x)))
        e.Add(New XAttribute("y", str(y)))
        Return e
    End Function


    Public Shared Function text(cssClass As String, x As Double, y As Double, testo As String) As XElement
        Dim e As XElement = New XElement("text")
        e.Add(New XAttribute("class", cssClass))
        e.Add(New XAttribute("x", str(x)))
        e.Add(New XAttribute("y", str(y)))
        e.Value = testo
        Return e
    End Function

    Public Shared Function group(cssClass As String, Optional content As XElement = Nothing) As XElement
        Dim e As XElement = New XElement("g")
        e.Add(New XAttribute("class", cssClass))
        If content IsNot Nothing Then
            e.Add(content)
        End If
        Return e
    End Function

    Public Shared Function path(id As String, d As String, Optional scala As Double = 1) As XElement
        Dim e As XElement = New XElement("path")
        If id <> "" Then
            e.Add(New XAttribute("id", id))
        End If
        e.Add(New XAttribute("d", d))
        e.Add(New XAttribute("transform", String.Format("scale({0})", scala.ToString().Replace(",", "."))))
        Return e
    End Function

End Class