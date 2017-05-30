package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysMenuOpt;

public interface SysMenuOptMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysMenuOpt record);

    int insertSelective(SysMenuOpt record);

    SysMenuOpt selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysMenuOpt record);

    int updateByPrimaryKey(SysMenuOpt record);
}