/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone'
        , 'view/Common/PageView'
        , 'text!templates/Student/view.html'
        , 'text!templates/Student/list.html'
        , 'view/Student/Add'
        , 'view/Student/Look'
        , 'view/Student/Edit'
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
                this.pageNum = 1;

                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.View());

                this.$("#attr27").autoselect({
                    source:"api/list/query/9",
                    searchParam:"key",
                    label:["attr1"],
                    id:"attr1"
                });

                this.query();
            },
            events: {
                "click #add":"add",
                "click #look":"look",
                "click #change":"change",
                "click #delete":"delete",
                "click #search":"query",
                "click .gaojisousuo":"search",
                //"input #name":"query",
                "input input":"query",
                "blur input":"query",
                "focus #startDate":"chooseDate",
                "focus #stopDate":"chooseDate"
            },
            search: function(){
                $(".gaoji").toggle(300);
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

                if("" != _this.$("#attr3").val()){
                    pageOpt.attr3 = _this.$("#attr3").val();
                }

                if("" != _this.$("#attr5").val()){
                    pageOpt.attr5 = _this.$("#attr5").val();
                }

                if("" != _this.$("#attr6").val()){
                    pageOpt.attr6 = _this.$("#attr6").val();
                }

                if("" != _this.$("#attr27").val()){
                    pageOpt.attr27 = _this.$("#attr27").val();
                }

                if("" != _this.$("#startDate").val()){
                    pageOpt.startDate = _this.$("#startDate").val();
                }

                if("" != _this.$("#stopDate").val()){
                    pageOpt.stopDate = _this.$("#stopDate").val();
                }

                _this.$("#querynoresult").css({"display": "none"});
                var userModel = new Backbone.Model;
                userModel.fetchEx(pageOpt,{
                    url : 'api/guest/getGuestList',
                    success: function (data) {
                        if(data.get("status") == "S"){
                            var entity = data.get("output");
                            var entityData = entity.data;
                            var entityPage = entity.page;
                            if(!entityData.length > 0){
                                _this.$el.find("#querynoresult").css({"display": "block"});
                                _this.$("#tbody").empty();
                                _this.$("#page").css({"display": "none"});
                                return;
                            }

                            if(pageOpt.pageNum == 1){
                                _this.$("#tbody").html(_this.templates.List(entity));
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
                                _this.$("#page").html(pageView.el);
                            }else{
                                _this.$("#tbody").append(_this.templates.List(entity));
                                _this.$(".qiye-boxx").scrollTop(_this.$("#tbody").height());
                            }
                        }else{

                        }
                    }
                });
            },
            add: function(){
                //window.open("http://localhost:8080/crm/page.html");
                //window.location.href = "/page";
                var _this = this;
                var add = new Add({callback:_this.query});
                new LayerView({
                    attributes:{
                        type:"view",
                        parentScroll:"body",
                        view:add
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
            },
            chooseDate:function(e){
                var id = $(e.currentTarget).attr('id');
                var _this = this;
                laydate({
                    elem: "#"+id,
                    format:"YYYY-MM-DD hh:MM:ss",
                    istime: true,
                    choose : function(data){
                        _this.$("#"+id).blur();
                    }
                });
            }
        });
        return View;
    });