package org.clj.crmproj.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Administrator on 2017/2/19.
 */
@Controller
@RequestMapping("/")
public class RouterController {
    /**
     * 默认首页控制器
     */
    @RequestMapping("")
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response){
        System.out.println("login");
        return new ModelAndView("login");
    }

    @RequestMapping("/login")
    public ModelAndView login1(HttpServletRequest request, HttpServletResponse response){
        System.out.println("login");
        return new ModelAndView("login");
    }

    @RequestMapping("/index")
    public ModelAndView index(HttpServletRequest request, HttpServletResponse response){
        System.out.println("index");
        return new ModelAndView("index");
    }
}
