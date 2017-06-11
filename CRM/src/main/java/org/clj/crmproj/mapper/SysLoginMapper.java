package org.clj.crmproj.mapper;

import java.util.List;
import java.util.Map;

public interface SysLoginMapper {
    Map loginByMap(Map map);

    List<Map> menuByMap(Map map);

    List<Map> menuByMap1(Map map);

    List<Map> allByMap(Map map);

    List<Map> allByGuestFP(Map map);

    List<Map> queryPage(Map map);

    int countByMap(Map map);

    int insertBatch(List list);

    int insertSelective(Map map);

    int updateByPrimaryKeySelective(Map map);
}