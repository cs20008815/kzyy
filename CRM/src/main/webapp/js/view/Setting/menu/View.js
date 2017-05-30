/**
 * Created by Administrator on 2017/3/1.
 */
define(['jquery', 'underscore', 'backbone'
        , 'view/Common/PageView'
        , 'text!templates/Setting/menu/view.html'
        , 'text!templates/Setting/menu/list.html'
        , 'view/Setting/menu/Add'
        , 'view/Setting/menu/Edit'
    ],
    function ($, _, Backbone
        , PageView
        , View
        , List
        , Add
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

                this.$("#name").bind("input",function(){
                    _this.queryDate();
                });

                this.queryDate();
            },
            events: {
                "click #add":"add",
                "click #look":"look",
                "click #change":"change",
                "click #delete":"delete",
                "change #name":"queryDate",
                "click #search":"queryDate"
            },
            search: function(){

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
                    url : 'api/menu/queryPage',
                    success: function (data) {
                        var entity = data.get("output");
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

                if("" != _this.$("#name").val()){
                    pageOpt.attr1 = _this.$("#name").val();
                }

                _this.$("#tbody").empty();
                this.$("#querynoresult").css({"display": "none"});
                var model = new Backbone.Model;
                model.fetchEx(pageOpt,{
                    url : 'api/menu/queryPage',
                    success: function (data) {
                        var entity = data.get("output");
                        this.$("#tbody").html(_this.templates.List(entity.pageData));
                    }
                });
            },
            add: function(){
                var _this = this;
                var add = new Add({callback:_this.queryDate});
                new LayerView({
                    attributes:{
                        type:"view",
                        parentScroll:"body",
                        view:add
                    }
                });
            },
            look: function(){

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
                    url : 'api/menu/remove/'+$(e.currentTarget).attr("sid"),
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