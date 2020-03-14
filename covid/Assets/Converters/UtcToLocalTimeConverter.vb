Friend Class UtcToLocalTimeConverter
    Implements IValueConverter

    Public Function Convert(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.Convert
        Try
            If value Is System.DBNull.Value Then
                Return Nothing
            Else
                Dim d As DateTime = DateTime.SpecifyKind(value, DateTimeKind.Utc)
                Return d.ToLocalTime
            End If
        Catch ex As Exception
            Return Nothing
        End Try
        Return parameter
    End Function

    Public Function ConvertBack(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.ConvertBack
        Return value
    End Function

End Class
