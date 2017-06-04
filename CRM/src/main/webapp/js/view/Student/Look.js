/**
 * Created by Administrator on 2017/3/2.
 */
define(['jquery', 'underscore', 'backbone', 'iziToast'
        , 'text!templates/Guest/look.html'
    ],
    function ($, _, Backbone, iziToast
        , look
    ) {
        Look = Backbone.View.extend({
            templates: {
                "look": _.template(look)
            },
            initialize: function (option) {
                this.option = option;
                this.render();

                return this;
            },
            render: function () {
                var _this = this;
                var model = new Backbone.Model;
                model.fetchEx({},{
                    url : 'api/guest/query/'+this.option.id,
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if(data && data.get("status") == "S"){
                            var entity = data.get("output");
                            console.log(entity);
                            _this.$el.html(_this.templates.look(entity[0]));
                        }else{
                            iziNotyf.alert("查询失败");
                        }
                    }
                });
            },
            events: {
                "click #cancel":"onCancel"
            },
            onCancel: function(){
                this.layer.cancleView();
            }
        });
        return Look;
    });