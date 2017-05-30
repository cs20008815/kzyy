/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast'
        , 'text!templates/Setting/school/add.html'
    ],
    function ($, _, Backbone, iziToast
        , schoolAddTemplate
    ) {
        Add = Backbone.View.extend({
            templates: {
                "schoolAddTemplate": _.template(schoolAddTemplate)
            },
            initialize: function (option) {
                this.option = option;
                this.render();

                return this;
            },
            render: function () {
                this.$el.html(this.templates.schoolAddTemplate());
            },
            events: {
                "click #save":"save",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;
                var opt = {
                    attr1:this.$("#schoolName").val()
                }

                var userModel = new Backbone.Model;
                userModel.fetchEx(opt,{
                    url : 'api/school/addSchool',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            _this.option.callback();
                            iziNotyf.confirm("添加成功");
                            _this.onCancel();
                        }else{
                            iziNotyf.alert("添加失败");
                        }
                    }
                });
            },
            onCancel: function(){
                this.layer.cancleView();
            }
        });
        return Add;
    });