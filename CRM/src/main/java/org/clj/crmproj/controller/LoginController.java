package org.clj.crmproj.controller;

import com.alibaba.fastjson.JSON;
import org.clj.crmproj.service.LoginService;
import org.clj.crmproj.util.EhcacheUtil;
import org.clj.crmproj.util.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/18.
 */
@Controller
@RequestMapping("api/login")
public class LoginController {
    @Resource
    private LoginService loginService;

    @RequestMapping(value = "")
    public void userlogin(HttpServletRequest request,
                          HttpServletResponse response) throws Exception{
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if("".equals(username) || "".equals(password)){
            Map jsonMap = new HashMap();
            jsonMap.put("isSucc","false");
            jsonMap.put("msg","请填写账号与密码！");
            String json = JSON.toJSONString(jsonMap);
            response.getWriter().print(json);
        }else{
            Map map = new HashMap();
            map.put("user", username);
            map.put("pwd", password);

            Map<String, String> user = loginService.userLogin(map);
            if(null == user){
                Map jsonMap = new HashMap();
                jsonMap.put("isSucc","false");
                jsonMap.put("msg","账号或密码错误！！！");
                String json = JSON.toJSONString(jsonMap);
                response.getWriter().print(json);
            } else {
                EhcacheUtil.getInstance().put("user", user);
                Map jsonMap = new HashMap();
                jsonMap.put("isSucc","true");
                String json = JSON.toJSONString(jsonMap);
                response.getWriter().print(json);
            }
        }
    }

    @RequestMapping(value = "/isLogin")
    @ResponseBody
    public Response userlogin() throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }else{
            return new Response("S","已登录");
        }
    }

    @RequestMapping(value = "/getNowUser")
    @ResponseBody
    public Response getNowUser() throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        return new Response(user);
    }

    @RequestMapping(value = "/getUserList")
    @ResponseBody
    public Response getUserList(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;
        requestMap.put("tableName","sys_user");
        List<Map> users = loginService.allByMap(requestMap);

        return new Response(users);
    }
}
