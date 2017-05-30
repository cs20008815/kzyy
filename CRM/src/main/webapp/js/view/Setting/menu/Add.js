/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast', 'autoselect'
        , 'text!templates/Setting/menu/add.html'
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
            },
            events: {
                "click #save":"save",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;
                var opt = {
                    attr1:this.$("#attr1").val(),
                    attr2:this.$("#attr2").val(),
                    attr3:this.$("#attr3").val()
                }

                var model = new Backbone.Model;
                model.fetchEx(opt,{
                    url : 'api/menu/add',
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