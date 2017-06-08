package org.clj.crmproj.controller;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.exceptions.InvalidOperationException;
import org.apache.poi.ss.usermodel.DateUtil;
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
import java.io.IOException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
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
        requestMap.put("attr28",user.get("sid").toString());
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
        Long uploadFileSize = uploadFile.getSize();
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
            ArrayList errList = new ArrayList();
            try {
                XSSFWorkbook xssfWorkbook = new XSSFWorkbook(tempFile);
                XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(0);
                int rowstart = xssfSheet.getFirstRowNum();
                int rowEnd = xssfSheet.getLastRowNum();
                for(int i=rowstart+1;i<=rowEnd;i++){
                    XSSFRow row = xssfSheet.getRow(i);
                    if(null == row) {
                        errList.add((i+1)+":行错误");
                        continue;
                    }
                    Map mapppp = new HashMap();
                    if(null==row.getCell(0) || "".equals(row.getCell(0).toString())) {
                        errList.add((i+1)+":时间错误:"+getRowData(row));
                        continue;
                    }else{
                        mapppp.put("attr1", row.getCell(0).toString());
                    }
                    mapppp.put("attr2", row.getCell(1).toString());
                    mapppp.put("attr3", row.getCell(2).toString());
                    mapppp.put("attr4", row.getCell(3).toString());
                    mapppp.put("attr5", row.getCell(4).toString());
                    mapppp.put("attr6", row.getCell(5).toString());
                    mapppp.put("attr7", row.getCell(6).toString());
                    mapppp.put("attr8", row.getCell(7).toString());
                    mapppp.put("attr9", row.getCell(8).toString());
                    mapppp.put("attr10", row.getCell(9).toString());
                    XSSFCell cell = row.getCell(10);
                    DecimalFormat df = new DecimalFormat("#");
                    String mobile;
                    switch (cell.getCellType())
                    {
                        case HSSFCell.CELL_TYPE_NUMERIC:// 数字
                            mobile = df.format(cell.getNumericCellValue());
                            break;
                        case HSSFCell.CELL_TYPE_STRING:// 字符串
                            mobile = df.format(Double.parseDouble(cell.toString()));
                            break;
                        default:
                            mobile = cell.toString();
                            break;
                    }

                    mapppp.put("attr11", mobile);
                    mapppp.put("attr12", row.getCell(11).toString());
                    mapppp.put("attr13", row.getCell(12).toString());
                    mapppp.put("attr14", row.getCell(13).toString());
                    mapppp.put("attr15", row.getCell(14).toString());
                    mapppp.put("attr16", row.getCell(15).toString());
                    mapppp.put("attr17", row.getCell(16).toString());
                    mapppp.put("attr18", row.getCell(17).toString());
                    mapppp.put("attr19", row.getCell(18).toString());
                    mapppp.put("attr20", row.getCell(19).toString());
                    mapppp.put("attr21", row.getCell(20).toString());
                    mapppp.put("attr28", user.get("sid").toString());
                    mapppp.put("attr29", user.get("attr3").toString());

                    mapppp.put("attr30", "1");
                    mapppp.put("sid", UUID.randomUUID().toString());
                    mapppp.put("tableName","sys_guest");

                    mapppp.put("createby", user.get("sid").toString());
                    mapppp.put("createdate", new Date());
                    mapppp.put("updateby", user.get("sid").toString());
                    mapppp.put("updatedate", new Date());
//                    for(int k=0;k < row.getLastCellNum();k++){
//                        XSSFCell cell = row.getCell(k);
//                        if(null==cell || "".equals(cell.toString())) {
//                            mapppp.put("attr" + k, "空");
//                        }else{
//                            if(cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA){
//                                mapppp.put("attr" + k, cell.getStringCellValue());
//                            }else{
//                                mapppp.put("attr" + k, cell.toString());
//                            }
//                        }
//                    }
                    loginService.add(mapppp);
                }
                for(int i = 0; i< errList.size(); i++){
                }

            } catch (InvalidFormatException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (InvalidOperationException e) {
                return new Response("无法打开文件，请确认是否有密码！");
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new Response(errList);
        }else{
            return new Response();
        }
    }

    public String getRowData(XSSFRow row){
        String tempStr = "";
        for(int k=0;k < row.getLastCellNum();k++){
            XSSFCell cell = row.getCell(k);
            if(null==cell || "".equals(cell.toString())) {
                tempStr += "空,";
            }else{
                if(cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA){
                    tempStr += cell.getStringCellValue()+",";
                }else{
                    tempStr += cell.toString()+",";
                }
            }
        }
        tempStr = tempStr.substring(0,tempStr.length()-1);
        return tempStr;
    }
}

