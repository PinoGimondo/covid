Imports System.Globalization
Imports System.Threading
Imports System.Windows.Markup
Imports covid_lib

Class Application
    Public Shared C As New Casi(My.Settings.connectionString)

    Private Sub Application_Startup(sender As Object, e As StartupEventArgs) Handles Me.Startup
        Thread.CurrentThread.CurrentCulture = New System.Globalization.CultureInfo("it-IT")
        Thread.CurrentThread.CurrentUICulture = New System.Globalization.CultureInfo("it-IT")
        FrameworkElement.LanguageProperty.OverrideMetadata(GetType(FrameworkElement), New FrameworkPropertyMetadata(XmlLanguage.GetLanguage(CultureInfo.CurrentCulture.IetfLanguageTag)))
        caricaDati()
    End Sub

    Public Shared Sub ingestDati()
        C.da.ingestProciv()
        C.da.ingestECDC()
        C.da.elaboraDati()
        Application.caricaDati()
    End Sub


    Public Shared Sub caricaDati()
        C.caricaDati(My.Settings.connectionString)
    End Sub

    Private Sub Application_Exit(sender As Object, e As ExitEventArgs) Handles Me.[Exit]
    End Sub

End Class
