package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysList;

public interface SysListMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysList record);

    int insertSelective(SysList record);

    SysList selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysList record);

    int updateByPrimaryKey(SysList record);
}