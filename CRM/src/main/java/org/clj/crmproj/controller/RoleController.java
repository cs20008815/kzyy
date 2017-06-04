package org.clj.crmproj.controller;

import org.clj.crmproj.service.LoginService;
import org.clj.crmproj.util.EhcacheUtil;
import org.clj.crmproj.util.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by Administrator on 2017/5/14.
 */
@Controller
@RequestMapping("api/role")
public class RoleController {
    @Resource
    private LoginService loginService;

    @RequestMapping(value = "/queryRoleList")
    @ResponseBody
    public Response queryRoleList() throws Exception{
        Map schoolMap = new HashMap();
        schoolMap.put("tableName", "sys_school");
        List<Map> schools = loginService.allByMap(schoolMap);
        for(Map school : schools){
            school.put("name",school.get("attr1"));
            school.put("id", school.get("sid"));
            school.put("nocheck", true);

            Map deptMap = new HashMap();
            deptMap.put("tableName", "sys_dept");
            deptMap.put("attr2", school.get("code"));
            List<Map> depts = loginService.allByMap(deptMap);

            for(Map dept : depts){
                dept.put("name",dept.get("attr1"));
                dept.put("id", dept.get("sid"));
                dept.put("nocheck", true);

                Map roleMap = new HashMap();
                roleMap.put("tableName", "sys_role");
                roleMap.put("attr2", dept.get("code"));
                List<Map> roles = loginService.allByMap(roleMap);

                for(Map role : roles){
                    role.put("name",role.get("attr1"));
                    role.put("id", role.get("sid"));
                }
                dept.put("children", roles);
            }
            school.put("children", depts);
        }
        return new Response(schools);
    }

    @RequestMapping(value = "/queryMenuByRoleId/{id}")
    @ResponseBody
    public Response queryMenuByRoleId(@PathVariable(value = "id") String id) throws Exception{
        Map roleMap = new HashMap();
        roleMap.put("tableName", "sys_user_role");
        roleMap.put("attr1", id);
        List<Map> roles = loginService.allByMap(roleMap);
        List<Map> responses = new ArrayList<Map>();
        for(Map role : roles){
            Map menuMap = new HashMap();
            menuMap.put("tableName", "sys_menu");
            menuMap.put("sid", role.get("attr2"));
            List<Map> menus = loginService.allByMap(menuMap);
            if(menus.size() > 0){
                responses.add(menus.get(0));
            }

        }
        return new Response(responses);
    }

    @RequestMapping(value = "/queryUserByRoleId/{id}")
    @ResponseBody
    public Response queryUserByRoleId(@PathVariable(value = "id") String id) throws Exception{
        Map userMap = new HashMap();
        userMap.put("tableName", "sys_user");
        userMap.put("attr8", id);
        List<Map> users = loginService.allByMap(userMap);
        return new Response(users);
    }

    @RequestMapping(value = "/removeUserRole/{id}")
    @ResponseBody
    public Response removeUserRole(@PathVariable(value = "id") String id) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        Map userMap = new HashMap();
        userMap.put("tableName", "sys_user");
        userMap.put("sid", id);
        userMap.put("attr4", "");
        userMap.put("attr5", "");
        userMap.put("attr6", "");
        userMap.put("attr7", "");
        userMap.put("attr8", "");
        userMap.put("attr9", "");
        userMap.put("updateby", user.get("sid"));
        userMap.put("updatedate", new Date());
        int i = loginService.edit(userMap);
        if(i > 0){
            return new Response();
        }else{
            return new Response("操作失败！");
        }
    }

    //addUserRole
    @RequestMapping(value = "/addUserRole")
    @ResponseBody
    public Response addUserRole(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        System.out.println(requestMap);
        String roleId = requestMap.get("roleid").toString();
        String userId = requestMap.get("uid").toString();

        Map map = new HashMap();
        map.put("tableName", "sys_role");
        map.put("sid", roleId);
        List<Map> roles = loginService.allByMap(map);

        map.clear();
        map.put("tableName", "sys_dept");
        map.put("code",roles.get(0).get("attr2").toString());
        List<Map> depts = loginService.allByMap(map);

        map.clear();
        map.put("tableName", "sys_school");
        map.put("code",depts.get(0).get("attr2").toString());
        List<Map> schools = loginService.allByMap(map);

        Map userMap = new HashMap();
        userMap.put("tableName", "sys_user");
        userMap.put("sid", userId);
        userMap.put("attr4", schools.get(0).get("sid").toString());
        userMap.put("attr5", schools.get(0).get("attr1").toString());
        userMap.put("attr6", depts.get(0).get("sid").toString());
        userMap.put("attr7", depts.get(0).get("attr1").toString());
        userMap.put("attr8", roles.get(0).get("sid").toString());
        userMap.put("attr9", roles.get(0).get("attr1").toString());
        userMap.put("updateby", user.get("sid"));
        userMap.put("updatedate", new Date());

        System.out.println(roles.toString());
        System.out.println(depts.toString());
        System.out.println(schools.toString());

        int i = loginService.edit(userMap);
        if(i > 0){
            return new Response();
        }else{
            return new Response("操作失败！");
        }
    }

    @RequestMapping(value = "/editRole")
    @ResponseBody
    public Response editRole(@RequestBody Map requestMap) throws Exception{
        Object o = EhcacheUtil.getInstance().get("user");
        if(null == o){
            return new Response("LOGIN_TIME_OUT","登陆超时");
        }
        Map user = (Map)o;

        if(null != requestMap.get("menus")){
            List<Map> menus = (List<Map>) requestMap.get("menus");
            for(Map menu : menus){
                menu.put("tableName","sys_user_role");
                menu.put("attr3", user.get("sid"));
                List<Map> rolemenus = loginService.allByMap(menu);

                if(rolemenus.size() > 0){
                    Map temp = rolemenus.get(0);
                    temp.put("tableName","sys_user_role");
                    temp.put("attr30","0");
                    temp.put("updateby", user.get("sid"));
                    temp.put("updatedate", new Date());
                    loginService.edit(temp);
                }else{
                    menu.put("sid", UUID.randomUUID().toString());
                    menu.put("createby", user.get("sid"));
                    menu.put("createdate", new Date());
                    menu.put("updateby", user.get("sid"));
                    menu.put("updatedate", new Date());
                    loginService.add(menu);
                }
            }
        }
        return new Response();
    }
    //editRole
}
