<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/2/19
  Time: 9:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="css/index.css">
    <link href="css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css"/>
    <link href="css/iziToast.css" rel="stylesheet" type="text/css"/>
    <link href="css/notyf.min.css" rel="stylesheet" type="text/css"/>

    <style>
        .load1 .loader,
        .load1 .loader:before,
        .load1 .loader:after {
            background: #FFF;
            -webkit-animation: load1 1s infinite ease-in-out;
            animation: load1 1s infinite ease-in-out;
            width: 1em;
            height: 4em;
        }
        .load1 .loader:before,
        .load1 .loader:after {
            position: absolute;
            top: 0;
            content: '';
        }
        .load1 .loader:before {
            left: -1.5em;
            -webkit-animation-delay: -0.32s;
            animation-delay: -0.32s;
        }
        .load1 .loader {
            text-indent: -9999em;
            margin: 8em auto;
            position: relative;
            font-size: 11px;
            -webkit-animation-delay: -0.16s;
            animation-delay: -0.16s;
        }
        .load1 .loader:after {
            left: 1.5em;
        }
        @-webkit-keyframes load1 {
            0%,
            80%,
            100% {
                box-shadow: 0 0 #FFF;
                height: 4em;
            }
            40% {
                box-shadow: 0 -2em #ffffff;
                height: 5em;
            }
        }
        @keyframes load1 {
            0%,
            80%,
            100% {
                box-shadow: 0 0 #FFF;
                height: 4em;
            }
            40% {
                box-shadow: 0 -2em #ffffff;
                height: 5em;
            }
        }

        #loadingMain{
            width: 100%;
            height: 100%;
            position:relative;
            top: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: block;
            text-align: center;
            z-index: 999;
        }
    </style>

</head>
<body style="width: 100%; height: 100%">
<div id="header" style=" z-index: 999; width: 100%; position: fixed; top: 0px; left: 0px;">

</div>

<!--菜单展示-->
<div class="body" style="position: fixed; top: 48px; left: 0px;overflow: hidden;">
    <!--左侧菜单显示-->
    <div id="leftmenu" style="float: left;">

    </div>
    <div style="overflow: hidden;"><!--右侧各业务内容-->
        <div id="rightdiv" style="">

        </div>
    </div>


</div>

<div id="mainbotton" style="position: fixed;bottom:0px;overflow: hidden;width: 100%;
    min-width: 1024px;
    background-color: #3E5775;
    height: 48px; clear: both;">
    <div style="bottom: 10px;position: absolute;left: 40%;">
        <table style="width:100%;">

        </table>
        <div style="display: block;color: #FFF;font-size: 16px;">© 1998-2016 空中英语 版权所有 &nbsp;</div>
        <div style=" text-align: center;"><a style="color: #FFF;" href="http://www.miitbeian.gov.cn"
                                             target="_blank"></a></div>
    </div>
</div>

<div id="loadingMain">
    <div style="width: 100%; height: 100%;position: relative;top: 30%;">
        <div class="load-container load1">
            　　<div class="loader">Loading...</div>
        </div>
    </div>
</div>

</body>
</html>
<script data-main="js/main" src="js/libs/require/require.js"></script>