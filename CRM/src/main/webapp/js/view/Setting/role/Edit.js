/**
 * Created by Administrator on 2017/3/2.
 */
/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast'
        , 'text!templates/Setting/role/edit.html'
    ],
    function ($, _, Backbone, iziToast
        , edit
    ) {
        Edit = Backbone.View.extend({
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

                this.$("#deptName").autoselect({
                    source:"api/dept/queryDept",
                    searchParam:"attr1",
                    label:["schoolName","deptName"],
                    id:"deptId"
                });

                var model = new Backbone.Model;
                model.fetchEx({},{
                    url : 'api/role/query/'+this.option.id,
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            var entity = data.get("output");
                            _this.$("#roleName").val(entity[0].attr1);

                            var schoolModel = new Backbone.Model;
                            schoolModel.fetchEx({sid:entity[0].attr2},{
                                url : 'api/dept/queryDept',
                                success: function (data) {
                                    if(data && data.get("status") == "S"){
                                        var entity = data.get("output");
                                        _this.$("#deptName").attr("inputid",entity[0].deptId);
                                        _this.$("#deptName").val(entity[0].schoolName + " " +entity[0].deptName);
                                    }else{
                                        iziNotyf.alert("查询失败");
                                    }
                                }
                            });

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
                    attr1:this.$("#roleName").val(),
                    attr2:this.$("#deptName").attr("inputid")
                }

                var userModel = new Backbone.Model;
                userModel.fetchEx(opt,{
                    url : 'api/role/edit',
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
        return Edit;
    });