/**
 * Created by Administrator on 2017/3/2.
 */
/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast'
        , 'text!templates/Setting/school/edit.html'
    ],
    function ($, _, Backbone, iziToast
        , edit
    ) {
        Add = Backbone.View.extend({
            templates: {
                "edit": _.template(edit)
            },
            initialize: function (option) {
                this.option = option;
                this.render();

                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.edit());
                var model = new Backbone.Model;
                model.fetchEx({},{
                    url : 'api/school/query/'+this.option.id,
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            var entity = data.get("output");
                            _this.$("#schoolName").val(entity[0].attr1);
                        }else{
                            iziNotyf.alert("查询失败");
                        }
                    }
                });
            },
            events: {
                "click #save":"save",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;
                var opt = {
                    sid:this.option.id,
                    attr1:this.$("#schoolName").val()
                }

                var userModel = new Backbone.Model;
                userModel.fetchEx(opt,{
                    url : 'api/school/edit',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            _this.option.callback();
                            iziNotyf.confirm("修改成功");
                            _this.onCancel();
                        }else{
                            iziNotyf.alert("修改失败");
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