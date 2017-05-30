/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast', 'autoselect'
        , 'text!templates/Setting/dept/add.html'
    ],
    function ($, _, Backbone, iziToast, autoselect
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

                this.$("#schoolName").autoselect({
                    source:"api/school/querySchool",
                    searchParam:"attr1",
                    label:["attr1"],
                    id:"sid"
                });
            },
            events: {
                "click #save":"save",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;
                var opt = {
                    attr1:this.$("#deptName").val(),
                    attr2:this.$("#schoolName").attr("inputid")
                }

                var model = new Backbone.Model;
                model.fetchEx(opt,{
                    url : 'api/dept/add',
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