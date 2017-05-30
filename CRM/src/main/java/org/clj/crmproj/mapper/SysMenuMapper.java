package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysMenu;

public interface SysMenuMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysMenu record);

    int insertSelective(SysMenu record);

    SysMenu selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysMenu record);

    int updateByPrimaryKey(SysMenu record);
}