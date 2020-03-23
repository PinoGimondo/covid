Imports System.Web.Http

Public Class Global_asax
    Inherits HttpApplication

    Sub Application_Start(sender As Object, e As EventArgs)
        ' Generato all'avvio dell'applicazione
        GlobalConfiguration.Configure(AddressOf WebApiConfig.Register)
    End Sub
End Class