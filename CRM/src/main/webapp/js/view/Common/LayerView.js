define(
    ['jquery', 'underscore', 'backbone', 'jqueryui'
        , 'text!templates/Common/layer.html'
        , 'text!templates/Common/error.html'
        , 'text!templates/Common/confirm.html'
        , 'text!templates/Common/success.html'
    ],
    function ($, _, Backbone, jqueryui
        , layerTemplate
        , errorTemplate
        , confirmTemplate
        , successTemplate) {


        LayerView = Backbone.View.extend({

            initialize: function (option) {
                _.bindAll(this, "scrollUl", "cancleView");
                this.callBack = option.callBack;
                this.Effect = option.Effect;
                this.hideAuto = option.hideAuto;

                this.render();
                return this;
            },
            templates: {
                "layertemplate": _.template(layerTemplate),
                "errorTemplate": _.template(errorTemplate),
                "confirmTemplate": _.template(confirmTemplate),
                "successTemplate": _.template(successTemplate)

            },
            events: {},
            render: function () {

                var _this = this;


                this.layertype = this.attributes.type;
                this.cancelId = this.attributes.cancelId;
                this.parentScroll = this.attributes.parentScroll;


                this.$el.html(this.templates.layertemplate());

                //绑定滚动事件
                this.$('[name=tancdiv]').bind("scroll", this.scrollUl);


                if (this.layertype == "view") {
                    this.view = this.attributes.view;
                    this.view.layer = this;
                    if ($.trim(this.view.$el.html()) != "") {
                        this.$el.find("[name=bgcontentdiv]").first().append(this.view.el);
                        $("body").append(this.$el);
                    }
                    if (this.Effect == null || this.Effect == "") {
                        this.Effect = "blind";
                    }
                    this.$("[name=bgcontentdiv]").show("blind",500);
                } else if (this.layertype == "error") {

                    this.contentDesc = this.attributes.contentDesc;
                    this.$("[name=bgcontentdiv]").append(this.templates.errorTemplate({"contentDesc": this.contentDesc}));
                    $("body").append(this.$el);


                    this.$("[name=bgcontentdiv]").show( 500);

                    //确定按钮绑定回调

                    this.$("[name=confirmbutton]").bind("click", function () {
                        _this.cancleView();
                        if (_this.callBack != null) {
                            _this.callBack();
                        }
                    });


                } else if (this.layertype == "confirm") {
                    this.contentDesc = this.attributes.contentDesc;

                    this.$("[name=bgcontentdiv]").append(this.templates.confirmTemplate({"contentDesc": this.contentDesc}));
                    $("body").append(this.$el);


                    this.$("#confirmcancel").bind("click", function () {
                        _this.cancleView();
                    });

                    this.$("#confirmbutton").bind("click", function () {
                        _this.cancleView();
                        if (_this.callBack != null) {
                            _this.callBack();
                        }
                    });

                    this.$("[name=bgcontentdiv]").show(500);
                    //默认focus 取消按钮
                    this.$("#confirmcancel").focus();

                    //绑定enter
                    this.$("#confirmbutton,#confirmcancel").bind("keydown", function (e) {
                        if ((e.keyCode || e.which) == 13) {
                            $(this).trigger("click");
                        }
                    });

                    //绑定tab
                    $(document).off("keydown.sureto").on("keydown.sureto", function (event) {

                        if ((event.keyCode || event.which) == '9') {
                            if (_this.$("#confirmcancel").is(":focus")) {
                                _this.$("#confirmbutton").focus();
                            } else {
                                _this.$("#confirmcancel").focus();
                            }
                        }
                        return false;
                    });

                } else if (this.layertype == "success") {
                    var _this = this;
                    this.contentDesc = this.attributes.contentDesc;
                    this.$("[name=bgcontentdiv]").append(this.templates.successTemplate({"contentDesc": this.contentDesc}));
                    $("body").append(this.$el);

                    if (this.hideAuto == null || this.hideAuto == "") {
                        this.hideAuto = 1000;
                    }
                    if (this.hideAuto > 0) {
                        this.$("[name=bgcontentdiv]").show(500, function () {
                            setTimeout(function () {
                                _this.cancleView();
                            }, _this.hideAuto);
                        });
                    } else {
                        this.$("[name=bgcontentdiv]").show(500);
                    }


                    //确定按钮绑定回调

                    this.$("[name=confirmbutton]").bind("click", function () {
                        _this.cancleView();
                        if (_this.callBack != null) {
                            _this.callBack();
                        }

                    });


                }

                //取消按钮
                if (this.cancelId != null && this.cancelId != "") {
                    this.$el.on("click.cancel", this.cancelId, this.cancleView);
                }

                //绑定关闭按钮
                this.$(".close-tc").bind("click", this.cancleView);


                //父级滚动
                if (this.parentScroll != null) {
                    $(this.parentScroll).css("overflow", "hidden");
                }
            },

            cancleView: function () {
                $(document).off("keydown.sureto");

                if (this.parentScroll != null) {
                    $(this.parentScroll).css("overflow", "auto");
                }

                if (this.view != null) {
                    this.view.remove();
                }

                this.remove();

            },
            scrollUl: function () {
                var scrollHeight = this.$el.find('[name=tancdiv]').first().get(0).scrollHeight;
                var bgheight = this.$el.find('[name=bgccdiv]').height();

                if (scrollHeight > bgheight) {
                    this.$el.find('[name=bgccdiv]').css("height", scrollHeight);
                }
                var scrollWidth = this.$el.find('[name=tancdiv]').first().get(0).scrollWidth;
                var bgwidth = this.$el.find('[name=bgccdiv]').width();

                if (scrollWidth > bgwidth) {
                    this.$el.find('[name=bgccdiv]').css("width", scrollWidth);
                }
            }


        });

        return LayerView;
    });
