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
                _.bindAll(this, "queryDate", "PageCallback");
                this.pageSize = 10;//每页显示条数

                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.View());

                this.$("#name").bind("change",function(){
                    _this.queryDate();
                });

                this.$("#user").autoselect({
                    source:"api/user/queryUserByDept",
                    searchParam:"attr1",
                    label:["attr3"],
                    id:"sid"
                });

                this.queryDate();
            },
            events: {
                "click #add":"add",
                "click span[sid]":"checkboxlabel",
                "click #look":"look",
                "click #change":"change",
                "click #delete":"delete",
                "input #name":"queryDate",
                "click #search":"queryDate",
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
            queryDate: function(){
                var _this = this;

                //传递分页参数
                var pageOpt = {
                    "pageNum": 1,
                    "pageSize": this.pageSize,
                    pageStart:0
                };

                if("" != _this.$("#name").val()){
                    pageOpt.attr1 = _this.$("#name").val();
                }

                this.$("#querynoresult").css({"display": "none"});
                var userModel = new Backbone.Model;
                userModel.fetchEx(pageOpt,{
                    url : 'api/guest/queryPageTMK',
                    success: function (data) {
                        var entity = data.get("output");
                        console.log(entity);
                        this.$("#tbody").html(_this.templates.List(entity.pageData));
                        var totalNum = entity.pageCount;  //总页数
                        var pageView = new PageView({
                            callBack: _this.PageCallback,
                            model: {
                                "totalNum": totalNum,
                                "pageSize": _this.pageSize,
                                "pageIndex": 1
                            }
                        });
                        this.$("#page").html(pageView.el);
                        if(!entity.pageData.length > 0){
                            _this.$el.find("#querynoresult").css({"display": "block"});
                            return;
                        }
                    }
                });
            },
            PageCallback: function(page_id, panel){
                var _this = this;

                //传递分页参数
                var pageOpt = {
                    "pageNum": page_id,
                    "pageSize": this.pageSize,
                    pageStart:((page_id-1)*this.pageSize)
                };

                _this.$("#tbody").empty();
                this.$("#querynoresult").css({"display": "none"});
                var model = new Backbone.Model;
                model.fetchEx(pageOpt,{
                    url : 'api/guest/queryPage',
                    success: function (data) {
                        var entity = data.get("output");
                        this.$("#tbody").html(_this.templates.List(entity.pageData));
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