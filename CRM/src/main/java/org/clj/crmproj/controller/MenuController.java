package org.clj.crmproj.controller;

import org.clj.crmproj.service.MenuService;
import org.clj.crmproj.util.EhcacheUtil;
import org.clj.crmproj.util.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/4/24.
 */
@Controller
@RequestMapping("api/menu")
public class MenuController {

    @Resource
    private MenuService menuService;

    @RequestMapping(value = "")
    @ResponseBody
    public Response getMenu() throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        Map map = new HashMap();
        map.put("attr1", user.get("attr8"));
        map.put("attr3", "0");
        List<Map> menu = menuService.menuByMap(map);
        for(Map temp : menu){
            map.put("attr3", temp.get("sid"));
            List<Map> menu2 = menuService.menuByMap(map);
            temp.put("menu", menu2);
        }
        return new Response(menu);
    }

    @RequestMapping(value = "/queryMenuList")
    @ResponseBody
    public Response queryMenuList() throws Exception{
        Map map = new HashMap();
        map.put("attr2", "0");
        List<Map> menus = menuService.menuByMap1(map);
        for(Map menu : menus){
            System.out.println("menu:------------------->" + menu.toString());
            menu.put("name", menu.get("sname"));
            menu.put("id", menu.get("sid"));
            menu.remove("url");
            Map childrenMap = new HashMap();
            childrenMap.put("attr2", menu.get("sid"));
            List<Map> menuChildrens = menuService.menuByMap1(childrenMap);
            for(Map menuChildren : menuChildrens){
                System.out.println("menuChildren:------------------->" + menuChildren.toString());
                menuChildren.put("name", menuChildren.get("sname"));
                menuChildren.put("id", menuChildren.get("sid"));
                menuChildren.remove("url");
            }
            menu.put("children", menuChildrens);
        }
        return new Response(menus);
    }
}
