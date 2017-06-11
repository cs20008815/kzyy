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
        return sysLoginMapper.allByMap(map);
    }

    @Override
    public List<Map> allByGuestFP(Map map){
        int pageNum = Integer.parseInt(map.get("pageNum").toString());
        int pageSize = Integer.parseInt(map.get("pageSize").toString());
        PageHelper.startPage(pageNum, pageSize); // 核心分页代码
        return sysLoginMapper.allByGuestFP(map);
    }

    @Override
    public List<Map> queryPage(Map map){
        int pageNum = Integer.parseInt(map.get("pageNum").toString());
        int pageSize = Integer.parseInt(map.get("pageSize").toString());
        PageHelper.startPage(pageNum, pageSize); // 核心分页代码
        return sysLoginMapper.queryPage(map);
    }

    @Override
    public int countByMap(Map map){
        return sysLoginMapper.countByMap(map);
    }

    @Override
    public int addList(List list){
        return sysLoginMapper.insertBatch(list);
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
