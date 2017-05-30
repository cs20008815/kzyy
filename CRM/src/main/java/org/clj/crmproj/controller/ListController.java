package org.clj.crmproj.controller;

import org.clj.crmproj.entity.SysDept;
import org.clj.crmproj.service.LoginService;
import org.clj.crmproj.util.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by black on 2017/5/28.
 */
@Controller
@RequestMapping("api/list")
public class ListController {
    @Resource
    private LoginService loginService;

    @RequestMapping(value = "/query/{id}")
    @ResponseBody
    public Response query(@PathVariable(value = "id") String id, @RequestBody Map requestMap) throws Exception{
        Map listMap = new HashMap();
        listMap.put("tableName", "sys_list");
        listMap.put("code", id);
        listMap.put("key", requestMap.get("key"));
        List<Map> lists = loginService.allByMap(listMap);
        return new Response(lists);
    }

    @RequestMapping(value = "/querySchool")
    @ResponseBody
    public Response querySchool(@RequestBody Map requestMap) throws Exception{
        Map listMap = new HashMap();
        listMap.put("tableName", "sys_school");
        listMap.put("key", requestMap.get("key"));
        List<Map> lists = loginService.allByMap(listMap);
        return new Response(lists);
    }
}
