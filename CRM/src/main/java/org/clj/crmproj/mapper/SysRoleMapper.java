package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysRole;

public interface SysRoleMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysRole record);

    int insertSelective(SysRole record);

    SysRole selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysRole record);

    int updateByPrimaryKey(SysRole record);
}