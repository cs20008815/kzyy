/**
 * Created by Administrator on 2017/2/8.
 */
define(['jquery', 'underscore', 'backbone'
    , 'view/Login/LoginView'
    , 'view/Main/MainView'
    , 'view/Setting/right/QXSettingView'
    , 'view/Setting/school/View'
    , 'view/Setting/dept/View'
    , 'view/Setting/role/View'
    , 'view/Setting/menu/View'
    , 'view/Guest/View'
    , 'view/GuestFP/View'
    , 'view/MyGuest/View'
], function ($, _, Backbone
    , LoginView
    , MainView
    , QXSettingView
    , SchoolView
    , DeptView
    , RoleView
    , MenuView
    , GuestView
    , GuestFPView
    , MyGuestView
) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "home",
            "5C3579DC-C9D6-5BA1-5D0D-D39FD7EB9D85": "home",
            "index":"home",
            "14D8E344-74EB-809E-9DA1-270F40A77C71":"quanxianSetting",
            "342D9296-968E-D1AA-3A3E-EF54777A83E0":"zhongxinSetting",
            "D3CA6C63-C5CD-0D1B-51AF-82AB20650960":"bumenSetting",
            "23F79F74-67D9-5C4E-6D29-23316AFA41F5":"zhiweiSetting",
            "caidanSetting":"caidanSetting",
            "851DF1D8-64B7-0BF2-EA40-CA0B6EBEAEDF":"guest",
            "FF26A779-81B0-55FB-2CC2-B4DC70D0A2E0":"guestFP",
            "wdkh":"myguest"
        },
        home: function(){
            var view = new MainView();
            $("#rightdiv").html(view.$el);
        },
        quanxianSetting:function(){
            var view = new QXSettingView();
            $("#rightdiv").html(view.$el);
        },
        zhongxinSetting:function(){
            var view = new SchoolView();
            $("#rightdiv").html(view.$el);
        },
        bumenSetting:function(){
            var view = new DeptView();
            $("#rightdiv").html(view.$el);
        },
        zhiweiSetting:function(){
            var view = new RoleView();
            $("#rightdiv").html(view.$el);
        },
        caidanSetting:function(){
            var view = new MenuView();
            $("#rightdiv").html(view.$el);
        },
        guest:function(){
            var view = new GuestView();
            $("#rightdiv").html(view.$el);
        },
        guestFP:function(){
            var view = new GuestFPView();
            $("#rightdiv").html(view.$el);
        },
        myguest:function(){
            var view = new MyGuestView();
            $("#rightdiv").html(view.$el);
        }
    });
    return AppRouter;
});
