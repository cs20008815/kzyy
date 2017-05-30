/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast', 'autoselect'
        , 'text!templates/Setting/role/add.html'
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

                this.$("#deptName").autoselect({
                    source:"api/dept/queryDept",
                    searchParam:"attr1",
                    label:["schoolName","deptName"],
                    id:"deptId",
                    searchCallBack: this.deptNameCallBack
                });
            },
            events: {
                "click #save":"save",
                "click .checkbox":"checkboxlabel",
                "click #cancel":"onCancel"
            },
            save: function(){
                var _this = this;
                if(!this.$("#deptName").attr("inputid") || this.$("#deptName").attr("inputid") == ""){
                    return;
                }

                var opt = {
                    attr1:this.$("#roleName").val(),
                    attr2:this.$("#deptName").attr("inputid"),
                }

                if(this.$("#role").attr("inputid") && "" != this.$("#role").attr("inputid")){
                    opt.attr3 = this.$("#role").attr("inputid");
                }else{
                    opt.attr3 = 0;
                }

                console.log(opt);

                var model = new Backbone.Model;
                model.fetchEx(opt,{
                    url : 'api/role/add',
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
            checkboxlabel: function(e){
                if($(e.currentTarget).parent().parent().find('.yes')){
                    $(e.currentTarget).parent().parent().find('.yes').removeClass("yes").addClass("no");
                    $(e.currentTarget).parent().removeClass("no").addClass("yes");
                }
                console.log($(e.currentTarget).val());
                if($(e.currentTarget).val() == "true"){
                    $("#roleLi").hide();
                }else{
                    $("#roleLi").show();
                }
            },
            deptNameCallBack: function(){
                $("#role").autoselect({
                    source:"api/role/queryattr3/" + $("#deptName").attr("inputid"),
                    searchParam:"attr1",
                    label:["schoolName","deptName","attr1"],
                    id:"sid"
                });
            },
            onCancel: function(){
                this.layer.cancleView();
            }
        });
        return Add;
    });