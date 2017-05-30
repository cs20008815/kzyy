package org.clj.crmproj.service.impl;

import org.clj.crmproj.mapper.SysLoginMapper;
import org.clj.crmproj.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/10.
 */
@Service
@Transactional(value="transactionManager")
public class MenuServiceImpl implements MenuService {

    @Autowired
    private SysLoginMapper sysLoginMapper;


    @Override
    public List<Map> menuByMap(Map map){
        return sysLoginMapper.menuByMap(map);
    }

    @Override
    public List<Map> menuByMap1(Map map){
        return sysLoginMapper.menuByMap1(map);
    }

    @Override
    public List<Map> test(Map map){
        return sysLoginMapper.allByMap(map);
    }
}
