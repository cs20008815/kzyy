package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysSchool;

public interface SysSchoolMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysSchool record);

    int insertSelective(SysSchool record);

    SysSchool selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysSchool record);

    int updateByPrimaryKey(SysSchool record);
}