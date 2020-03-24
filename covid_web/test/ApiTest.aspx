<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="ApiTest.aspx.vb" Inherits="covid_web.ApiTest" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
<h1>API TEST</h1>
<br />
<hr />
<p>test for: api/paesi</p>
<iframe src="/api/paesi" style="height:100px;width:100%"></iframe>
<br />

<%--<hr />
<p>test for: api/pillola?token=&pillolaId=1000000000</p>
<iframe src="~/api/pillola?token=&pillolaId=1000000000" style="height:200px;width:100%"></iframe>
<br />
<hr />
<p>test for: api/programma_studente?token=&programmaId=9</p>
<iframe src="~/api/programma_studente?token=&programmaId=9" style="height:200px;width:100%"></iframe>
<br />
<hr />
<p>test for: api/argomento_studente?token=&argomentoId=1</p>
<iframe src="~/api/argomento_studente?token=&argomentoId=1" style="height:200px;width:100%"></iframe>
<br />
<hr />--%>
</body>
</html>
