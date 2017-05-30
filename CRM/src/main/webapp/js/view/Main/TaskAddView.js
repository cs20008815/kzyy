/**
 * Created by Administrator on 2017/1/16.
 */
define(['jquery', 'underscore', 'backbone'
        , 'text!templates/Main/taskadd.html'
    ],
    function ($, _, Backbone
        , taskaddTemplate) {
        TaskAddView = Backbone.View.extend({
            templates: {
                "taskaddTemplate": _.template(taskaddTemplate)
            },
            initialize: function (option) {
                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.taskaddTemplate());
            },
            events: {
                "click button[name = btncancel]": "cancel"
            },
            cancel:function(){
                this.layer.cancleView();
            }
        });
        return TaskAddView;
    });