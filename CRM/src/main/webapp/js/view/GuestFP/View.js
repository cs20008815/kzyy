/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone'
        , 'view/Common/PageView'
        , 'text!templates/GuestFP/view.html'
        , 'text!templates/GuestFP/list.html'
        , 'view/GuestFP/Add'
        , 'view/GuestFP/Look'
        , 'view/GuestFP/Edit'
    ],
    function ($, _, Backbone
        , PageView
        , View
        , List
        , Add
        , Look
        , Edit
    ) {
        View = Backbone.View.extend({
            templates: {
                "View": _.template(View),
                "List": _.template(List)
            },
            initialize: function (option) {
                _.bindAll(this, "query", "queryDate", "PageCallback");
                this.pageSize = 10;//每页显示条数

                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.View());

                this.$("#name").bind("change",function(){
                    _this.query();
                });

                this.$("#user").autoselect({
                    source:"api/user/queryUserByDept",
                    searchParam:"attr1",
                    label:["attr3"],
                    id:"sid"
                });

                this.query();
            },
            events: {
                "click #add":"add",
                "click span[sid]":"checkboxlabel",
                "click #look":"look",
                "click #change":"change",
                "click #delete":"delete",
                "input #name":"query",
                "click #search":"query",
                "click #all":"all"
            },
            checkboxlabel: function(e){
                this.$(e.currentTarget).hasClass("yes") ?
                    this.$(e.currentTarget).removeClass("yes") :
                    this.$(e.currentTarget).addClass("yes");
                if(this.$(".yes").length == this.$("span[sid]").length){
                    this.$("#all").addClass("allyes");
                }else{
                    this.$("#all").removeClass("allyes")
                }
            },
            search: function(){

            },
            all:function(e){
                if(this.$(e.currentTarget).hasClass("allyes")){
                    this.$(e.currentTarget).removeClass("allyes");
                    this.$("span[sid]").removeClass("yes");
                }else{
                    this.$(e.currentTarget).addClass("allyes");
                    this.$("span[sid]").addClass("yes");
                }
            },
            query: function(){
                var _this = this;
                //传递分页参数
                var pageOpt = {
                    pageNum: 1,
                    pageSize: _this.pageSize
                };
                _this.queryDate(pageOpt);
            },
            PageCallback: function(page_id, panel){
                var _this = this;
                console.log(page_id);
                //传递分页参数
                var pageOpt = {
                    pageNum: page_id,
                    pageSize: _this.pageSize
                };
                _this.queryDate(pageOpt);
            },
            queryDate: function(pageOpt){
                var _this = this;
                if("" != _this.$("#name").val()){
                    pageOpt.key = _this.$("#name").val();
                }
                _this.$("#querynoresult").css({"display": "none"});
                var userModel = new Backbone.Model;
                userModel.fetchEx(pageOpt,{
                    url : 'api/guest/getGuestFPList',
                    success: function (data) {
                        if(data.get("status") == "S"){
                            var entity = data.get("output");
                            var entityData = entity.data;
                            var entityPage = entity.page;

                            if(!entityData.length > 0){
                                _this.$el.find("#querynoresult").css({"display": "block"});
                                _this.$("#tbody").html("");
                                _this.$("#page").css({"display": "none"});
                                return;
                            }

                            if(pageOpt.pageNum == 1){
                                _this.$("#tbody").html(_this.templates.List(entityData));
                                var totalNum = entityPage.total;  //总页数
                                var pageView = new PageView({
                                    callBack: _this.PageCallback,
                                    model: {
                                        "totalNum": totalNum,
                                        "pageSize": _this.pageSize,
                                        "pageIndex": _this.pageNum
                                    }
                                });
                                _this.$("#page").css({"display": "block"});
                                this.$("#page").html(pageView.el);
                            }else{
                                this.$("#tbody").html(_this.templates.List(entityData));
                            }
                        }else{

                        }
                    }
                });
            },
            add: function(){
                var _this = this;
                var user = _this.$("#user").attr("inputid");
                var list = _this.$(".yes");
                var guestList = "";
                for(var i = 0; i < list.length; i++){
                    guestList += $(list[i]).attr("sid");
                    if(i != list.length-1){
                        guestList += ",";
                    }
                }
                if(typeof user == "undefined"){
                    iziNotyf.alert("请选择TMK");
                    return;
                }

                if(guestList == ""){
                    iziNotyf.alert("请选择客户");
                    return;
                }

                var model = new Backbone.Model;
                model.fetchEx({data:guestList,user:user},{
                    url : 'api/guest/addGuestForTMK',
                    success: function (data) {
                        var entity = data.get("output");
                        if(data && data.get("status") == "S"){
                            iziNotyf.confirm("分配成功");
                            _this.$("#all").removeClass("allyes");
                            _this.queryDate();
                        }
                    }
                });
            },
            look: function(e){
                var view = new Look({id:$(e.currentTarget).attr("sid")});
                new LayerView({
                    attributes:{
                        type:"view",
                        parentScroll:"body",
                        view:view
                    }
                });
            },
            change: function(e){
                var _this = this;
                var edit = new Edit({id:$(e.currentTarget).attr("sid"),callback:_this.queryDate});
                new LayerView({
                    attributes:{
                        type:"view",
                        parentScroll:"body",
                        view:edit
                    }
                });
            },
            delete: function(e){
                var _this = this;
                var model = new Backbone.Model;
                model.fetchEx({},{
                    url : 'api/guest/remove/'+$(e.currentTarget).attr("sid"),
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            iziNotyf.confirm("删除成功");
                            _this.queryDate();
                        }else{
                            iziNotyf.alert("删除失败");
                        }
                    }
                });
            }
        });
        return View;
    });