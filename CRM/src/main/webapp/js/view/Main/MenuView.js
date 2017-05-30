/**
 * Created by Administrator on 2017/2/10.
 */
define(
    ['jquery', 'underscore', 'backbone', 'text!templates/Main/menu.html'],
    function ($, _, Backbone, menuTemplate)
    {
        MenuView = Backbone.View.extend({
            templates: {
                "menuTemplate": _.template(menuTemplate)
            },
            initialize: function () {
                _.bindAll(this,"clickMenuNew");
                this.render();

                return this;
            },
            render: function () {
                var _this = this;
                $.ajax({
                    url: 'api/menu/',
                    dataType: 'json',
                    method:'post',
                    success: function(data){
                        if(data.status == "S"){
                            _this.$el.html(_this.templates.menuTemplate(data.output));
                            $("#leftmenu").html(_this.$el);
                            _this.$el.find("[name=menuli]").click(_this.clickMenuNew);//点击展开收起
                        }else{

                        }
                        $("#loadingMain").hide();
                    },
                    error: function(){

                    }
                });
            },
            events: {
                //"click #login" : "login"
            },
            clickMenuNew: function (e) {
                var obj = $(e.currentTarget);
                var ulObj = obj.next("ul");
                var isAct = obj.hasClass("inactives");

                if(isAct){
                    //收起
                    obj.removeClass("inactives");
                    ulObj.slideUp(100);
                }else{
                    var parentMenuli = obj.parents(".nav-li");
                    //展开 ：将其他的收起
                    this.$("#menu").find(".nav-li").not(parentMenuli).each(function () {
                        $(this).find("[name=menuli]").each(function () {
                            $(this).removeClass("inactives");
                            $(this).next("ul").slideUp(100)
                        })

                    })
                    obj.addClass("inactives");
                    ulObj.slideDown(100)
                }


            }
        });
        return MenuView;
    }
);