package org.clj.crmproj.controller;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.clj.crmproj.entity.SysGuest;
import org.clj.crmproj.service.LoginService;
import org.clj.crmproj.util.EhcacheUtil;
import org.clj.crmproj.util.Response;
import org.clj.crmproj.util.StringUtility;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.annotation.Resource;
import java.io.File;
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

    @RequestMapping(value = "/importFile")
    @ResponseBody
    public Response importFile(@RequestParam(value = "uploadFile") MultipartFile uploadFile){
        System.out.println("-----------------------------------------------");
        Long uploadFileSize = uploadFile.getSize();
        System.out.println(uploadFileSize);
        if(uploadFileSize > 0){
            Object o = EhcacheUtil.getInstance().get("user");
            if(null == o){
                return new Response("LOGIN_TIME_OUT","登陆超时");
            }
            Map user = (Map)o;

            CommonsMultipartFile cf = (CommonsMultipartFile)uploadFile;
            //这个myfile是MultipartFile的
            DiskFileItem fi = (DiskFileItem) cf.getFileItem();
            File tempFile = fi.getStoreLocation();

            try {
                XSSFWorkbook xssfWorkbook = new XSSFWorkbook(tempFile);
                XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(0);
                int rowstart = xssfSheet.getFirstRowNum();
                int rowEnd = xssfSheet.getLastRowNum();
                for(int i=1;i<=rowEnd;i++){
                    XSSFRow row = xssfSheet.getRow(i);
                    if(null == row) {
                        continue;
                    }
                    Map mapppp = new HashMap();
                    for(int k=1;k<=15;k++){
                        XSSFCell cell = row.getCell(k-1);
                        if(null==cell || "".equals(cell.toString())) {
                            mapppp.put("attr" + k, "空");
                        }else{
                            if(cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA){
                                mapppp.put("attr" + k, cell.getStringCellValue());
                            }else{
                                mapppp.put("attr" + k, cell.toString());
                            }
                        }
                    }
                    System.out.println(mapppp);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new Response();
        }else{
            return new Response();
        }
    }
}

