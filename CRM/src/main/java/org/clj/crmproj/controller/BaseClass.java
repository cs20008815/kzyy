package org.clj.crmproj.controller;

import org.clj.crmproj.util.StringUtility;
import com.google.gson.Gson;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by 6418000384 on 2016/7/18.
 */
public class BaseClass {

    private Gson mGson= new Gson();

    protected String ConvertObjectToJson(Object object)
    {
        return mGson.toJson(object);
    }

    /***
     * 根据KEY值获取MAP中的对应数据并转化成Long类型
     * @param map
     * @param key
     * @return
     */
    public Long getMapLong(Map map, String key)
    {
        return  (map.get(key) == null || StringUtility.isEmpty(String.valueOf(map.get(key)))) ? null : Long.parseLong(String.valueOf(map.get(key)));
    }

    /***
     * 根据KEY值获取MAP中的对应数据并转化成String类型
     * @param map
     * @param key
     * @return
     */
    public String getMapString(Map map, String key)
    {
        return  (map.get(key) == null || StringUtility.isEmpty(String.valueOf(map.get(key)))) ? null : String.valueOf(map.get(key));
    }

    /***
     * 根据KEY值获取MAP中的对应数据是否为空
     * @param map
     * @param key
     * @return
     */
    public boolean isMapKeyNull(Map map, String key)
    {
        return map.get(key) == null || map.get(key) == "";
    }

    /***
     * 根据KEY值获取MAP中的对应数据并转化成String的List
     * @param map
     * @param key
     * @return
     */
    public List<String> getMapStringList(Map map, String key)
    {
        if (!this.isMapKeyNull(map,key))
        {
            return (List<String>)map.get(key);
        }
        return null;
    }

    /***
     * 根据KEY值获取MAP中的对应数据并转化成Long的List
     * @param map
     * @param key
     * @return
     */
    public List<Long> getMapLongList(Map map, String key)
    {
        if (!this.isMapKeyNull(map,key))
        {
            return (List<Long>)map.get(key);
        }
        return null;
    }

    public boolean isListNull(List<String> list)
    {
        if (list == null)
        {
            return true;
        }
        if (list.size() <= 0)
        {
            return true;
        }
        if (list.size() == 1 && StringUtility.isEmpty(list.get(0)))
        {
            return true;
        }
        return false;
    }

    /**
     * 手机号验�?
     *
     * @param  str
     * @return 验证通过返回true
     */
    public boolean isMobile(String str) {
        Pattern p = null;
        Matcher m = null;
        boolean b = false;
        p = Pattern.compile("^[1][3,4,5,7,8][0-9]{9}$"); // 验证手机�?
        m = p.matcher(str);
        b = m.matches();
        return b;
    }
    /**
     * 电话号码验证
     *
     * @param  str
     * @return 验证通过返回true
     */
    public boolean isPhone(String str) {
        Pattern p1 = null,p2 = null;
        Matcher m = null;
        boolean b = false;
        p1 = Pattern.compile("((d{3,4})|d{3,4}|d{3,4}-|s)?d{5,8}");// 验证带区号的
        p2 = Pattern.compile("^[1-9]{1}[0-9]{5,8}$"); // 验证没有区号�?
        if(str.length() >9)
        {   m = p1.matcher(str);
            b = m.matches();
        }else{
            m = p2.matcher(str);
            b = m.matches();
        }
        return b;
    }

    /**
     * 邮箱验证
     *
     * @param  email
     * @return 验证通过返回true
     */
    public static boolean isEmail(String email){
        String str="^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$";
        Pattern p = Pattern.compile(str);
        Matcher m = p.matcher(email);
        return m.matches();
    }

    /***
     * 判断字符串是否为空或空白字符
     * @param key
     * @return
     */
    public boolean isNullOrWhiteSpace(String key)
    {
        return key == null || key.equals("") || key.trim().equals("");
    }

    /***
     * 判断字符串是否为空或""
     * @param key
     * @return
     */
    public boolean isNullOrEmpty(String key) { return key == null || key.equals(""); }
    public boolean isNullOrEmpty(Object key) { return key == null || key.toString().equals(""); }
}
