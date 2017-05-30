package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysListOpt;

public interface SysListOptMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysListOpt record);

    int insertSelective(SysListOpt record);

    SysListOpt selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysListOpt record);

    int updateByPrimaryKey(SysListOpt record);
}