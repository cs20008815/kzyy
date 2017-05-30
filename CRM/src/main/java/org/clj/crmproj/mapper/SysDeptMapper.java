package org.clj.crmproj.mapper;

import org.clj.crmproj.entity.SysDept;

public interface SysDeptMapper {
    int deleteByPrimaryKey(String sid);

    int insert(SysDept record);

    int insertSelective(SysDept record);

    SysDept selectByPrimaryKey(String sid);

    int updateByPrimaryKeySelective(SysDept record);

    int updateByPrimaryKey(SysDept record);
}