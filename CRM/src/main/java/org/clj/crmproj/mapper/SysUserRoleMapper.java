package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysUserRole;

public interface SysUserRoleMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysUserRole record);

    int insertSelective(SysUserRole record);

    SysUserRole selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysUserRole record);

    int updateByPrimaryKey(SysUserRole record);
}