package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysUser;

public interface SysUserMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysUser record);

    int insertSelective(SysUser record);

    SysUser selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysUser record);

    int updateByPrimaryKey(SysUser record);
}