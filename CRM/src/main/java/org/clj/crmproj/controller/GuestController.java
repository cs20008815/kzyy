package org.clj.crmproj.controller;

import org.apache.commons.beanutils.BeanUtils;
import org.clj.crmproj.entity.SysGuest;
import org.clj.crmproj.service.LoginService;
import org.clj.crmproj.util.EhcacheUtil;
import org.clj.crmproj.util.Response;
import org.clj.crmproj.util.StringUtility;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by Administrator on 2017/5/22.
 */
@Controller
@RequestMapping("api/guest")
public class GuestController extends BaseController {

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
        requestMap.put("tableName", "sys_guest");
        requestMap.put("attr17",user.get("sid").toString());
        List<Map> result = loginService.queryPage(requestMap);
        return new Response(this.buildPaginationResult(result));
    }

    @RequestMapping(value = "/getGuestFPList")
    @ResponseBody
    public Response getGuestFPList(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }

        Map user = (Map)o;
        requestMap.put("tableName", "sys_guest");
        List<Map> result = loginService.allByGuestFP(requestMap);
        return new Response(this.buildPaginationResult(result));
    }

    @RequestMapping(value = "/query/{id}")
    @ResponseBody
    public Response query(@PathVariable(value = "id") String id) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        Map queryMap = new HashMap();
        queryMap.put("tableName","sys_guest");
        queryMap.put("sid",id);
        List<Map> result = loginService.allByMap(queryMap);
        return new Response(result);
    }

    @RequestMapping(value = "/add")
    @ResponseBody
    public Response add(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        String phone = requestMap.get("attr2").toString();
        if(StringUtility.isMobileNO(phone)){
            phone = phone.replaceAll("(\\d{3})\\d{4}(\\d{4})","$1****$2");
            System.out.println(phone);
            requestMap.put("tableName","sys_guest");
            requestMap.put("sid", UUID.randomUUID().toString());
            requestMap.put("attr3", phone);
            requestMap.put("attr17", user.get("sid").toString());
            requestMap.put("attr18", user.get("attr3").toString());
            requestMap.put("attr30", "1");
            requestMap.put("createby", user.get("sid").toString());
            requestMap.put("createdate", new Date());
            requestMap.put("updateby", user.get("sid").toString());
            requestMap.put("updatedate", new Date());
            int i = loginService.add(requestMap);
            if(i > 0){
                return new Response();
            }else{
                return new Response("添加失败");
            }
        }else{
            return new Response("添加失败,手机号码错误！");
        }
    }
}
