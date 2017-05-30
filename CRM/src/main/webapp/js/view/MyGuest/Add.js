/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast', 'autoselect', 'laydate'
        , 'text!templates/Guest/add.html'
    ],
    function ($, _, Backbone, iziToast, autoselect, laydate
        , addTemplate
    ) {
        Add = Backbone.View.extend({
            templates: {
                "addTemplate": _.template(addTemplate)
            },
            initialize: function (option) {
                this.option = option;
                this.render();

                return this;
            },
            render: function () {
                this.$el.html(this.templates.addTemplate());

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
                    id:"attr1"
                });

                this.$("#attr6").autoselect({
                    source:"api/list/query/8",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"attr1"
                });
            },
            events: {
                "click #save":"save",
                "focus #attr7":"chooseDate",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;
                var opt = {
                    attr1:this.$("#attr1").val(),
                    attr2:this.$("#attr2").val(),
                    attr3:this.$("#attr3").attr("inputid"),
                    attr4:this.$("#attr4").val(),
                    attr5:this.$("#attr5").val(),
                    attr6:this.$("#attr6").attr("inputid"),
                    attr7:this.$("#attr7").val(),
                    attr8:this.$("#attr8").attr("inputid"),
                    attr9:this.$("#attr9").attr("inputid"),
                    attr10:this.$("#attr10").attr("inputid"),
                    attr11:this.$("#attr11").attr("inputid"),
                    attr12:this.$("#attr12").val(),
                    attr13:this.$("#attr13").attr("inputid"),
                    attr14:this.$("#attr14").attr("inputid"),
                    attr15:this.$("#attr15").attr("inputid")
                };

                var model = new Backbone.Model;
                model.fetchEx(opt,{
                    url : 'api/guest/add',
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
            },
            chooseDate:function(e){
                var _this = this;
                laydate({
                    elem: '#attr7',
                    format:"YYYY-MM-DD hh:MM:ss",
                    istime: true,
                    choose : function(data){
                        _this.$("#attr7").blur();
                    }
                });
            }
        });
        return Add;
    });