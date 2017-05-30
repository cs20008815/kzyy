package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysLog;

public interface SysLogMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysLog record);

    int insertSelective(SysLog record);

    SysLog selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysLog record);

    int updateByPrimaryKey(SysLog record);
}