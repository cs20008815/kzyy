/**
 * Created by Administrator on 2017/2/19.
 */
define(
    ['jquery', 'underscore', 'backbone'
        , 'text!templates/Setting/qx/userRole.html'
        , 'ztreeCore'
        , 'ztreeExcheck'
        , 'view/Common/LayerView'
        , 'view/Main/TaskAddView'],
    function ($, _, Backbone
        , QXSettingTemplate
        , ztreeCore
        , ztreeExcheck
        , LayerView
        , TaskAddView)
    {
        QXSettingView = Backbone.View.extend({
            templates: {
                "qXSettingTemplate": _.template(QXSettingTemplate)
            },
            initialize: function () {
                this.render();

                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.qXSettingTemplate());
                this.queryUser();
                this.queryRole();
                this.queryMenu();
            },
            events: {
                "click #add" : "add",
                "click #userTree li":"getRoleTree",
                "click #roleTree li":"getMenuTree",
                "click #submitRole":"submitRole",
                "click #submitMenu":"submitMenu"
            },
            add:function(){
                var _this = this;
                var taskAddView = new TaskAddView();
                new LayerView({
                    attributes:{
                        type:"view",
                        parentScroll:"body",
                        view:taskAddView
                    }
                });
            },
            submitRole: function(){
                var userTree=$.fn.zTree.getZTreeObj("userTree");
                var userNode = userTree.getCheckedNodes(true);
                var treeObj=$.fn.zTree.getZTreeObj("roleTree");
                var node = treeObj.getCheckedNodes(true);

                var opt = {
                    user: userNode[0],
                    school: node[0].getParentNode().getParentNode(),
                    dept: node[0].getParentNode(),
                    role: node[0]
                }
                var menuModel = new Backbone.Model;
                menuModel.fetchEx(opt,{
                    url : 'api/role/editRole',
                    dataType: 'json',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            //location.reload();
                            iziNotyf.confirm("授权成功");
                        }
                    }
                });
            },
            submitMenu: function(){
                var roleId = "";
                var menus = [];
                var roleTree=$.fn.zTree.getZTreeObj("roleTree");
                var rolenodes = roleTree.getCheckedNodes(true);
                var menuTree=$.fn.zTree.getZTreeObj("menuTree");
                var changeNodes = menuTree.getChangeCheckedNodes();

                for(var i in changeNodes){
                    var obj = {};
                    obj.attr1 = rolenodes[0].sid;
                    obj.attr2 = changeNodes[i].sid;
                    obj.menu2 = changeNodes[i].attr2;
                    obj.level = changeNodes[i].level;
                    if(changeNodes[i].checked){
                        obj.attr20 = 1;
                    }else{
                        obj.attr20 = 0;
                    }

                    menus.push(obj);
                }
                var menuModel = new Backbone.Model;
                menuModel.fetchEx({menus:menus},{
                    url : 'api/menu/editMenuByRoleId/'+rolenodes[0].sid,
                    dataType: 'json',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            menuTree.refresh();
                            //location.reload();
                            iziNotyf.confirm("授权成功");
                        }
                    }
                });
            },
            getRoleTree: function(){
                var _this = this;
                var treeObj=$.fn.zTree.getZTreeObj("userTree");
                var nodes = treeObj.getCheckedNodes(true);
                if(nodes.length > 0){
                    _this.removeAllNodes("roleTree",false);
                    _this.removeAllNodes("menuTree",false);
                    for(var i=0;i<nodes.length;i++){
                        var userModel = new Backbone.Model;
                        userModel.fetchEx({},{
                            url : 'api/user/queryUser/'+nodes[i].id,
                            success: function (data) {
                                if(data && data.get("status") == "S"){
                                    _this.removeAllNodes("roleTree",true,true);
                                    var entity = data.get("output");
                                    var roleTree = $.fn.zTree.getZTreeObj("roleTree");
                                    if(entity.roleId){
                                        var node = roleTree.getNodeByParam("sid", entity.roleId, null);
                                        roleTree.checkNode(node, true, true);
                                        _this.getUserMenuTree(entity.roleId);
                                    }
                                    roleTree.refresh();
                                }
                            }
                        });
                    }
                }else{
                    _this.removeAllNodes("roleTree",true);
                    _this.removeAllNodes("menuTree",true);
                }
            },
            getMenuTree:function(){
                var _this = this;
                var treeObj=$.fn.zTree.getZTreeObj("roleTree");
                var nodes = treeObj.getCheckedNodes(true);
                if(nodes.length > 0){
                    for(var i=0;i<nodes.length;i++){
                        _this.getUserMenuTree(nodes[i].id);
                    }
                }
            },
            getUserMenuTree: function(id){
                var _this = this;
                _this.removeAllNodes("menuTree",true,true);
                var userModel = new Backbone.Model;
                userModel.fetchEx({},{
                    url : 'api/menu/queryMenuByRoleId/'+id,
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            var entity = data.get("output");
                            var menuTree = $.fn.zTree.getZTreeObj("menuTree");
                            for(var i in entity){
                                var node = menuTree.getNodeByParam("sid", entity[i].sid, null);
                                menuTree.checkNode(node, true, true);
                            }
                            menuTree.refresh();
                        }
                    }
                });
            },
            removeAllNodes: function(treeName,disabled,boo){
                if(treeName){
                    var objTree = $.fn.zTree.getZTreeObj(treeName);
                    var objNodes = objTree.transformToArray(objTree.getNodes());
                    for (var i in objNodes) {
                        if(boo){
                            objTree.checkNode(objNodes[i], false, false);
                        }else{
                            objTree.checkNode(objNodes[i], false, false);
                            objTree.setChkDisabled(objNodes[i], disabled);
                        }
                    }
                }else{
                    alert("没有treeName");
                }
            },
            queryUser: function(){
                var roleSetting = {
                    view: {
                        selectedMulti: false,
                        showIcon: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        radioType: "all",
                        chkStyle: "radio",
                        enable: true,
                        chkboxType : { "Y" : "", "N" : "" }
                    }
                };

                var _this = this;

                var roleModel = new Backbone.Model;
                roleModel.fetchEx({},{
                    url : 'api/user/queryUserList',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            $.fn.zTree.init(_this.$("#userTree"), roleSetting, data.get("output"));
                        }
                    }
                });
            },
            queryRole: function(){
                var roleSetting = {
                    view: {
                        selectedMulti: false,
                        showIcon: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        radioType: "all",
                        chkStyle: "radio",
                        enable: true,
                        chkboxType : { "Y" : "", "N" : "" }
                    }
                };

                var _this = this;

                var roleModel = new Backbone.Model;
                roleModel.fetchEx({},{
                    url : 'api/role/queryRoleList',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            $.fn.zTree.init(_this.$("#roleTree"), roleSetting, data.get("output"));
                            var roleTree = $.fn.zTree.getZTreeObj("roleTree");
                            roleTree.expandAll(true);
                            var roleNodes = roleTree.transformToArray(roleTree.getNodes());
                            for (var i=0, l=roleNodes.length; i < l; i++) {
                                roleTree.setChkDisabled(roleNodes[i], true);
                            }
                        }
                    }
                });
            },
            queryMenu: function(){
                var menuSetting = {
                    view: {
                        selectedMulti: false,
                        showIcon: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType : { "Y" : "p", "N" : "ps" }
                    }
                };

                var _this = this;

                var menuModel = new Backbone.Model;
                menuModel.fetchEx({},{
                    url : 'api/menu/queryMenuList',
                    success: function (data) {
                        if(data && data.get("status") == "S"){
                            $.fn.zTree.init(_this.$("#menuTree"), menuSetting, data.get("output"));
                            var menuTree = $.fn.zTree.getZTreeObj("menuTree");
                            menuTree.expandAll(true);
                            var menuNodes = menuTree.transformToArray(menuTree.getNodes());
                            for (var i=0, l=menuNodes.length; i < l; i++) {
                                menuTree.setChkDisabled(menuNodes[i], true);
                            }
                        }
                    }
                });
            }
        });
        return QXSettingView;
    }
);