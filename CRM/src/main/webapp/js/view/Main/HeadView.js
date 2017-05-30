/**
 * Created by Administrator on 2017/2/21.
 */
define(
    ['jquery', 'underscore', 'backbone', 'text!templates/Main/head.html'],
    function ($, _, Backbone, headTemplate)
    {
        HeadView = Backbone.View.extend({
            templates: {
                "headTemplate": _.template(headTemplate)
            },
            initialize: function () {
                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                _this.$el.html(_this.templates.headTemplate());
                $("#header").html(_this.$el);

                var userModel = new Backbone.Model;
                userModel.fetchEx({},{
                    url : 'api/login/getNowUser',
                    success: function (data) {
                        var entity = data.get("output");
                        $("#username").html(entity.attr3);
                        $("#userrole").html(entity.attr7);
                    }
                });
            },
            events: {
                "click div[name=xial]":"SignOut",
                "click #loginout":"onSignOut"
            },
            SignOut: function(){
                var _this = this;
                _this.$("div[name=show]").toggle();
            },
            onSignOut: function(){
                window.location.href = 'login';
            }
        });
        return HeadView;
    }
);