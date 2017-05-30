<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh">
    <%
        String path = request.getContextPath();
        String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"";
    %>
<base href=<%=basePath%>/>
<head>
    <meta content="webkit" name="renderer"/>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="stylesheet" type="text/css" href="css/index.css" media="all">
    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico" media="screen"/>
    <title>空中英语管理系统</title>
    <script src="js/libs/jquery/jquery.js" type="text/javascript"></script>
</head>
<body>
<div class="login-box">
    <table style="width: 100%; height: 100%;position: absolute; top: 0px; left: 0px;">
        <tr>
            <td align="center">
                <div class="w1200">
                    <!--<img src="img/login-logo.png" class="login-logo" />-->
                    <div class="tip" style="display: none;" id="errormsg"></div>
                    <div class="login-form">
                        <input type="text" class="login-text zhangh" id="username" placeholder="请输入用户名"/>
                        &nbsp;<input type="password" class="login-text mima" id="password" placeholder="请输入密码"/>
                        <input type="button" class="btn" id="loginsubmit" value="登录"/>

                        <div class="rem" id="loginMsg" style=" color: red; font-size: 16px; text-align: left">

                        </div>
                    </div>
                </div>
                <div style="position: fixed;top: 90%;left: 40%;font-size: .9rem;">
                    <div style="display: block;">© 1998-2016 空中英语 版权所有 &nbsp;</div>
                    <div><a href="http://www.miitbeian.gov.cn" target="_blank"></a></div>
                </div>
            </td>
        </tr>
    </table>
</div>
<script>
    var login = function(){
        var opt = {
            "username": $("#username").val(),
            "password": $("#password").val()
        };
        $.ajax({
            url: 'api/login',
            dataType: 'json',
            method:'post',
            data:opt,
            success: function(data){
                if(data.isSucc == "true"){
                    window.location.href = "<%=basePath%>/index";
                }else{
                    $("#loginMsg").html(data.msg);
                }
            },
            error: function(){

            }
        });
    }
    $("#loginsubmit").click(function(){
        login();
    });
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            login();
        }
    }
</script>