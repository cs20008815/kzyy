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

                this.$("#attr9").autoselect({
                    source:"api/list/querySchool",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr10").autoselect({
                    source:"api/list/query/3",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr11").autoselect({
                    source:"api/list/query/4",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr12").autoselect({
                    source:"api/list/query/5",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr14").autoselect({
                    source:"api/list/query/6",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr15").autoselect({
                    source:"api/list/query/7",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr16").autoselect({
                    source:"api/list/query/8",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr4").autoselect({
                    source:"api/list/query/1",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.$("#attr7").autoselect({
                    source:"api/list/query/2",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });
            },
            events: {
                "click #save":"save",
                "focus #attr8":"chooseDate",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;

                var inputs = this.$("input");
                var opt = [];
                for(var i = 0; i < inputs.length; i++){
                    opt[$(inputs[i]).attr('id')] = $(inputs[i]).val();
                }

                var model = new Backbone.Model;
                model.fetchEx(opt,{
                    url : 'api/guest/add',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            _this.option.callback();
                            iziNotyf.confirm("添加成功");
                            _this.onCancel();
                        }else{
                            iziNotyf.alert(data.get("message"));
                            console.log(data.get("message"));
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
                    elem: '#attr8',
                    format:"YYYY-MM-DD hh:MM:ss",
                    istime: true,
                    choose : function(data){
                        _this.$("#attr8").blur();
                    }
                });
            }
        });
        return Add;
    });