﻿Imports covid_lib

Public Class FlagConverter

    Implements IValueConverter

    Public Function Convert(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.Convert
        Try
            If value Is Nothing Then
                Return "/covid;component/Images/noimage.png"
            Else
                Return "/covid;component/Images/noimage.png"
            End If
        Catch ex As Exception
            Return "/covid;component/Images/noimage.png"
        End Try
        Return parameter
    End Function

    Public Function ConvertBack(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.ConvertBack
        Return value
    End Function

End Class