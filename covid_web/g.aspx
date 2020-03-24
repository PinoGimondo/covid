<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="g.aspx.vb" Inherits="covid_web.g" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <!-- Bootstrap CSS -->
    <link href="content/bootstrap.min.css" rel="stylesheet" />
     <link href="Content/font-awesome.css" rel="stylesheet" />
     <link href="Content/themes/base/jquery-ui.min.css" rel="stylesheet" />
     <link href="content/site.css" rel="stylesheet" />
     <link href="app/css/lib.css" rel="stylesheet" />
     <link href="app/css/g.css" rel="stylesheet" />
    <link href="Content/svgstyle.css" rel="stylesheet" />
    <title>Programma</title>
  </head>
  <body>
       <div id="page" class="fill-viewport vertical" style="padding-top:60px" >
           <div id="header">
                   <nav style="z-index:99999" class="navbar navbar-expand-sm navbar-dark fixed-top bg-dark">
                    <div class="container">
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <a title="go to home page" class="navbar-brand" href="p.aspx">
                            <img class="logo-small" src="img/logo.png" />
                        </a>
                        <div class="navbar-collapse collapse" id="navbarSupportedContent">

                            <ul class="nav navbar-nav mr-auto">
                                <li> <a class="nav-link" title="API BIT" href="test/apitest.aspx">API BIT</a></li>
                                <li> <a class="nav-link" title="test" href="g?id=9">Filosofia</a></li>
                            </ul>
                        </div>
                    </div>
                 </nav>
           </div>

           <div class="horizontal v-fill" >
               <div class="vertical" style="min-width:300px;" >
                    <div id="titoloTV">Paesi</div>
                    <div id="tvEA" class="v-fill">
                        <TVEA name="tv" id="TVP" templateId="tvEA"></TVEA>
                    </div>
                </div>
                
               <div id="boxViewData" class="vertical h-fill " style="background-color:red" >
                   <%=svg %>
               </div>
           </div>

           <div class="horizontal" id="footer" >
               <div id="ajax-loader"><img style="width:24px;visibility:hidden" src="img/ajax-loader-azure.gif" /></div>
               <div id="ajax-loading-message">ready!</div>
           </div>
      </div>

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->

      <script src="scripts/jquery-3.4.1.min.js"></script>
      <script src="Scripts/jquery-ui-1.12.1.min.js"></script>
      <script src="plugins/jquery-te/jquery-te-1.4.0.min.js"></script>

      <script src="scripts/popper.min.js"></script>
      <script src="scripts/bootstrap.min.js"></script>

      <script src="App/lib/collections.js"></script>
      <script src="App/lib/lib.js"></script>
      <script src="App/client/models.js"></script>
      <script src="App/client/client.js"></script>
      <script src="app/g.js"></script>
      <script src="Scripts/svgScript.js"></script>

      <PopUp templateId="pupMenuArgomento" name="pup" id="pup" ></PopUp>
  </body>
</html>