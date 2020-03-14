

Friend Class SubjectNameFromIdConverter
    Implements IValueConverter

    Public Function Convert(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.Convert
        Try
            If value Is System.DBNull.Value Then
                Return " "
            Else
                'Dim s As Subject = ClientBlockChain.C.subjects.getElementById(value)
                'If s IsNot Nothing Then
                '    Return s.name
                'Else
                '    Return ""
                'End If
            End If
        Catch ex As Exception
            Return " "
        End Try
        Return parameter
    End Function

    Public Function ConvertBack(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.ConvertBack
        Return value
    End Function

End Class

