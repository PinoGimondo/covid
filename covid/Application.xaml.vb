Imports System.Globalization
Imports System.Threading
Imports System.Windows.Markup

Class Application
    Public Shared C As New Casi

    Private Sub Application_Startup(sender As Object, e As StartupEventArgs) Handles Me.Startup
        Thread.CurrentThread.CurrentCulture = New System.Globalization.CultureInfo("it-IT")
        Thread.CurrentThread.CurrentUICulture = New System.Globalization.CultureInfo("it-IT")
        FrameworkElement.LanguageProperty.OverrideMetadata(GetType(FrameworkElement), New FrameworkPropertyMetadata(XmlLanguage.GetLanguage(CultureInfo.CurrentCulture.IetfLanguageTag)))
        caricaDati()
    End Sub

    Public Shared Sub caricaDati()
        C.caricaDati()
    End Sub

    Private Sub Application_Exit(sender As Object, e As ExitEventArgs) Handles Me.[Exit]
    End Sub

End Class
