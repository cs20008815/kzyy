package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysGuest;

public interface SysGuestMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysGuest record);

    int insertSelective(SysGuest record);

    SysGuest selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysGuest record);

    int updateByPrimaryKey(SysGuest record);
}