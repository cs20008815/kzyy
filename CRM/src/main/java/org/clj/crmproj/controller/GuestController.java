package org.clj.crmproj.controller;

import org.clj.crmproj.service.LoginService;
import org.clj.crmproj.util.EhcacheUtil;
import org.clj.crmproj.util.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/22.
 */
@Controller
@RequestMapping("api/guest")
public class GuestController {

    @Resource
    private LoginService loginService;

    @RequestMapping(value = "/getGuestList")
    @ResponseBody
    public Response getUserList(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        requestMap.put("tableName","sys_guest");
        Map resMap = new HashMap();
        resMap.put("pageCount", loginService.countByMap(requestMap));
        resMap.put("pageData", loginService.allByMap(requestMap));
        System.out.println(resMap.toString());
        return new Response(resMap);
    }

    @RequestMapping(value = "/add")
    @ResponseBody
    public Response add(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        System.out.println(requestMap.toString());
        return new Response();
    }
}
