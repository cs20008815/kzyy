/**
 * Created by Administrator on 2017/3/2.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast'
        , 'text!templates/Guest/edit.html'
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

                this.$("#attr8").autoselect({
                    source:"api/school/querySchool",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr9").autoselect({
                    source:"api/list/query/1",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr10").autoselect({
                    source:"api/list/query/2",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr11").autoselect({
                    source:"api/list/query/3",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr13").autoselect({
                    source:"api/list/query/4",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr14").autoselect({
                    source:"api/list/query/5",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr15").autoselect({
                    source:"api/list/query/6",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr3").autoselect({
                    source:"api/list/query/7",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1",
                    defaultId: "女",
                    defaultName: "女"
                });

                this.$("#attr6").autoselect({
                    source:"api/list/query/8",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });

                var model = new Backbone.Model;
                model.fetchEx({},{
                    url : 'api/guest/query/'+this.option.id,
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            var entity = data.get("output");
                            console.log(entity);
                            _this.$("#attr1").val(entity.attr1),
                            _this.$("#attr2").val(entity.attr2),
                            _this.$("#attr3").val(entity.attr3),
                            _this.$("#attr4").val(entity.attr4),
                            _this.$("#attr5").val(entity.attr5),
                            _this.$("#attr6").val(entity.attr6),
                            _this.$("#attr7").val(entity.attr7),
                            _this.$("#attr8").val(entity.attr8),
                            _this.$("#attr9").val(entity.attr9),
                            _this.$("#attr10").val(entity.attr10),
                            _this.$("#attr11").val(entity.attr11),
                            _this.$("#attr12").val(entity.attr12),
                            _this.$("#attr13").val(entity.attr13),
                            _this.$("#attr14").val(entity.attr14),
                            _this.$("#attr15").val(entity.attr15)
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
                    attr1:this.$("#attr1").val(),
                    attr2:this.$("#attr2").val(),
                    attr3:this.$("#attr3").val(),
                    attr4:this.$("#attr4").val(),
                    attr5:this.$("#attr5").val(),
                    attr6:this.$("#attr6").val(),
                    attr7:this.$("#attr7").val(),
                    attr8:this.$("#attr8").val(),
                    attr9:this.$("#attr9").val(),
                    attr10:this.$("#attr10").val(),
                    attr11:this.$("#attr11").val(),
                    attr12:this.$("#attr12").val(),
                    attr13:this.$("#attr13").val(),
                    attr14:this.$("#attr14").val(),
                    attr15:this.$("#attr15").val()
                }

                var userModel = new Backbone.Model;
                userModel.fetchEx(opt,{
                    url : 'api/guest/edit',
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