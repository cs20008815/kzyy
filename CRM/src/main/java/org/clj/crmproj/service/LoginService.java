package org.clj.crmproj.service;

import org.clj.crmproj.entity.SysUser;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/18.
 */
public interface LoginService {
    Map userLogin(Map map);
    List<Map> allByMap(Map map);
    List<Map> allByGuestFP(Map map);
    List<Map> queryPage(Map map);
    int countByMap(Map map);
    int add(Map map);
    int edit(Map map);
}
