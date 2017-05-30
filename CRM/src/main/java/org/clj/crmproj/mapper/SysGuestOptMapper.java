package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysGuestOpt;

public interface SysGuestOptMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysGuestOpt record);

    int insertSelective(SysGuestOpt record);

    SysGuestOpt selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysGuestOpt record);

    int updateByPrimaryKey(SysGuestOpt record);
}