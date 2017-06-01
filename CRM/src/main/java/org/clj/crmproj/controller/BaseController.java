package org.clj.crmproj.controller;

import com.github.pagehelper.Page;
import org.clj.crmproj.controller.BaseClass;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import sun.misc.BASE64Decoder;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by 6418000384 on 2016/7/18.
 */
public class BaseController extends BaseClass {
    /***
     * 生成分页返回
     * @param entity
     * @return
     */
    public Object buildPaginationResult(Object entity)
    {
        if(entity == null || !(entity instanceof Page)){
            return entity;
        }
        else{
            Map resultMap = new HashMap();
            resultMap.put("data", entity);
            Map pagination = new HashMap();
            Page page = ((Page) entity);
            pagination.put("pageNum", page.getPageNum());
            pagination.put("pageSize", page.getPageSize());
            pagination.put("total", page.getTotal());
            resultMap.put("page", pagination);
            return resultMap;
        }
    }

    /**
     * 解密
     * @param s
     * @return
     */
    public static String getFromBase64(String s) {
        byte[] b = null;
        String result = null;
        if (s != null) {
            BASE64Decoder decoder = new BASE64Decoder();
            try {
                b = decoder.decodeBuffer(s);
                result = new String(b);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return result;
    }
}
