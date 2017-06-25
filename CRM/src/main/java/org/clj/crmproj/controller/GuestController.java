package org.clj.crmproj.controller;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.exceptions.InvalidOperationException;
import org.apache.poi.ss.usermodel.CellStyle;
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

    private Map nums = new HashMap();

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
                for(int xssfi = 0; xssfi < xssfWorkbook.getNumberOfSheets(); xssfi++){
                    ArrayList importList = new ArrayList();
                    XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(xssfi);
                    if("大班".equals(xssfSheet.getSheetName()) || "一对一".equals(xssfSheet.getSheetName())){
                        XSSFRow title = xssfSheet.getRow(0);
                        String sheetName = xssfSheet.getSheetName();
                        System.out.println(sheetName);
                        nums = new HashMap();

                        for(int i = 0; i < title.getLastCellNum(); i++){
                            if(null != title.getCell(i) && !"".equals(title.getCell(i).toString())){
                                String cellName = title.getCell(i).toString();
                                if(cellName.equals("日期")){
                                    nums.put("日期", i);
                                }else if(cellName.equals("收据")){
                                    nums.put("收据", i);
                                }else if(cellName.equals("姓名") || cellName.equals("学员姓名")){
                                    nums.put("姓名", i);
                                }else if(cellName.equals("性别")){
                                    nums.put("性别", i);
                                }else if(cellName.equals("学校")){
                                    nums.put("学校", i);
                                }else if(cellName.equals("年级")){
                                    nums.put("年级", i);
                                }else if(cellName.equals("电话")){
                                    nums.put("电话", i);
                                }else if(cellName.equals("备注")){
                                    nums.put("备注", i);
                                }else if(cellName.equals("语")){
                                    nums.put("语", i);
                                }else if(cellName.equals("数")){
                                    nums.put("数", i);
                                }else if(cellName.equals("理")){
                                    nums.put("理", i);
                                }else if(cellName.equals("化")){
                                    nums.put("化", i);
                                }else if(cellName.equals("英")){
                                    nums.put("英", i);
                                }else if(cellName.equals("其它")){
                                    nums.put("其它", i);
                                }else if(cellName.equals("培训费") || cellName.equals("单价")){
                                    nums.put("培训费", i);
                                }else if(cellName.equals("教材费") || cellName.equals("服务费")){
                                    nums.put("教材费", i);
                                }else if(cellName.equals("合计")){
                                    nums.put("合计", i);
                                }else if(cellName.equals("签单类型")){
                                    nums.put("签单类型", i);
                                }else if(cellName.equals("辅导方式")){
                                    nums.put("辅导方式", i);
                                }else if(cellName.equals("咨询师")){
                                    nums.put("咨询师", i);
                                }else if(cellName.equals("班主任")){
                                    nums.put("班主任", i);
                                }else if(cellName.equals("辅导学科")){
                                    nums.put("辅导学科", i);
                                }else if(cellName.equals("总课时")){
                                    nums.put("总课时", i);
                                }else if(cellName.equals("收款收据")){
                                    nums.put("收款收据", i);
                                }

                            }
                        }

                        int rowstart = xssfSheet.getFirstRowNum();
                        int rowEnd = xssfSheet.getLastRowNum();
                        for(int i=rowstart+1;i<=rowEnd;i++){
                            XSSFRow row = xssfSheet.getRow(i);
                            if(null == row) {
                                errList.add((i + 1) + ":行错误");
                                continue;
                            }
                            Map mapppp = new HashMap();
                            mapppp.put("sid", UUID.randomUUID().toString());
                            mapppp.put("tableName","sys_guest");

                            mapppp.put("createby", user.get("sid").toString());
                            mapppp.put("createdate", new Date());
                            mapppp.put("updateby", user.get("sid").toString());
                            mapppp.put("updatedate", new Date());

                            mapppp.put("attr2", getCellData(row, "收据"));
                            mapppp.put("attr3", getCellData(row, "姓名"));
                            mapppp.put("attr4", getCellData(row, "性别"));
                            mapppp.put("attr5", getCellData(row, "学校"));
                            mapppp.put("attr6", getCellData(row, "年级"));
                            mapppp.put("attr7", getCellData(row, "电话"));
                            mapppp.put("attr8", getCellData(row, "备注"));
                            mapppp.put("attr9", getCellData(row, "语"));
                            mapppp.put("attr10", getCellData(row, "数"));
                            mapppp.put("attr11", getCellData(row, "理"));
                            mapppp.put("attr12", getCellData(row, "化"));
                            mapppp.put("attr13", getCellData(row, "英"));
                            mapppp.put("attr14", getCellData(row, "其它"));
                            mapppp.put("attr15", getCellData(row, "培训费"));
                            mapppp.put("attr16", getCellData(row, "教材费"));
                            mapppp.put("attr17", getCellData(row, "合计"));
                            mapppp.put("attr18", getCellData(row, "签单类型"));
                            mapppp.put("attr19", getCellData(row, "辅导方式"));
                            mapppp.put("attr20", getCellData(row, "咨询师"));
                            mapppp.put("attr21", getCellData(row, "班主任"));
                            mapppp.put("attr22", getCellData(row, "辅导学科"));
                            mapppp.put("attr23", getCellData(row, "总课时"));
                            mapppp.put("attr24", getCellData(row, "收款收据"));
                            mapppp.put("attr25", "");
                            mapppp.put("attr26", "");
                            mapppp.put("attr27", sheetName);
                            mapppp.put("attr28", user.get("sid").toString());
                            mapppp.put("attr29", user.get("attr3").toString());
                            mapppp.put("attr30", "1");

                            if(null==row.getCell(Integer.parseInt(nums.get("日期").toString()))
                                    || "".equals(row.getCell(Integer.parseInt(nums.get("日期").toString())))) {
                                mapppp.put("attr1", getCellData(row, "日期"));
                                mapppp.put("err", (i+1)+":时间错误");
                                errList.add(mapppp);
                                continue;
                            }else{

                                mapppp.put("attr1", getCellData(row, "日期"));
                                Map queryMap = new HashMap();
                                queryMap.put("tableName","sys_guest");
                                queryMap.put("attr7", getCellData(row, "电话"));
                                List l = loginService.allByMap(queryMap);
                                if(l.size() > 0){
                                    mapppp.put("err",(i+1)+":号码存在");
                                    errList.add(mapppp);
                                }else{
                                    importList.add(mapppp);
                                }
                            }
                        }
                        if(importList.size() > 0){
                            loginService.addList(importList);
                        }
                    }
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

    public String getCellData(XSSFRow row, String str){
        String tempStr = "空";

        if(null == nums.get(str)){
            return tempStr;
        }
        XSSFCell cell = row.getCell(Integer.parseInt(nums.get(str).toString()));

        if(null== cell || "".equals(cell.toString())) {
            return tempStr;
        }

        DecimalFormat df = new DecimalFormat("#");
        switch (cell.getCellType())
        {
            case HSSFCell.CELL_TYPE_NUMERIC:// 数字
                tempStr = parseExcel(cell);
                break;
            case HSSFCell.CELL_TYPE_STRING:// 字符串
                tempStr = cell.toString();
                break;
            default:
                tempStr = cell.toString();
                break;
        }
        return tempStr;
    }

    private String parseExcel(XSSFCell cell) {
        String result = new String();
        switch (cell.getCellType()) {
            case HSSFCell.CELL_TYPE_NUMERIC:// 数字类型
                if (HSSFDateUtil.isCellDateFormatted(cell)) {// 处理日期格式、时间格式
                    SimpleDateFormat sdf = null;
                    if (cell.getCellStyle().getDataFormat() == HSSFDataFormat
                            .getBuiltinFormat("h:mm")) {
                        sdf = new SimpleDateFormat("HH:mm");
                    } else {// 日期
                        sdf = new SimpleDateFormat("yyyy年MM月dd");
                    }
                    Date date = cell.getDateCellValue();
                    result = sdf.format(date);
                } else if (cell.getCellStyle().getDataFormat() == 58) {
                    // 处理自定义日期格式：m月d日(通过判断单元格的格式id解决，id的值是58)
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd");
                    double value = cell.getNumericCellValue();
                    Date date = org.apache.poi.ss.usermodel.DateUtil
                            .getJavaDate(value);
                    result = sdf.format(date);
                } else {
                    double value = cell.getNumericCellValue();
                    DecimalFormat df = new DecimalFormat("#");
                    result = df.format(value);
                }
                break;
            case HSSFCell.CELL_TYPE_STRING:// String类型
                result = cell.getRichStringCellValue().toString();
                break;
            case HSSFCell.CELL_TYPE_BLANK:
                result = "";
            default:
                result = "";
                break;
        }
        return result;
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

