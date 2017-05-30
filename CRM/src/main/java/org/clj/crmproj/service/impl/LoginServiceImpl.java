package org.clj.crmproj.service.impl;

import com.github.pagehelper.PageHelper;
import org.clj.crmproj.mapper.SysLoginMapper;
import org.clj.crmproj.service.LoginService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/2/18.
 */
@Service("loginService")
public class LoginServiceImpl implements LoginService {

    @Resource
    private SysLoginMapper sysLoginMapper;

    @Override
    public Map userLogin(Map map){
        return sysLoginMapper.loginByMap(map);
    }

    @Override
    public List<Map> allByMap(Map map){
//        PageHelper.startPage(1, 20); // ºËÐÄ·ÖÒ³´úÂë
        return sysLoginMapper.allByMap(map);
    }

    @Override
    public int countByMap(Map map){
        return sysLoginMapper.countByMap(map);
    }

    @Override
    public int add(Map map){
        return sysLoginMapper.insertSelective(map);
    }

    @Override
    public int edit(Map map){
        return sysLoginMapper.updateByPrimaryKeySelective(map);
    }
}
