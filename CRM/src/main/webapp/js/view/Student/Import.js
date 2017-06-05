/**
 * Created by black on 2017/6/4.
 */
define(['jquery', 'underscore', 'backbone'
        , 'view/Common/PageView'
        , 'text!templates/Student/import.html'
    ],
    function ($, _, Backbone
        , PageView
        , Import
    ) {
        Import = Backbone.View.extend({
            templates: {
                "Import": _.template(Import),
            },
            initialize: function (option) {
                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                this.$el.html(this.templates.Import());
            },
            events: {
                "click #import":"import",
                "change #uploadFile":"fileChange"
            },
            import: function(){
                this.$("#uploadFile").click();
            },
            fileChange: function(){
                var _this = this;
                var filePath = $("#uploadFile").val();
                console.log(filePath);
                var f_content = filePath;
                var fileext=f_content.substring(f_content.lastIndexOf("."),f_content.length)
                fileext=fileext.toLowerCase()
                if (fileext!='.xlsx'){
                    alert("对不起，导入数据格式必须是xls格式文件哦，请您调整格式后重新上传，谢谢 ！");
                    o.file.focus();
                    return false;
                }else{
                    var formData = new FormData($("#exlce")[0]);
                    $.ajax({
                        url: 'api/guest/importFile',
                        type: 'POST',
                        data: formData,
                        async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            console.log(data);
                            if(data && data.status == "S"){
                                console.log(data.message);
                                iziNotyf.confirm(data.message);
                            }
                            $("#uploadFile").after($("#uploadFile").clone().val(""));
                            $("#uploadFile").remove();
                        },
                        error: function (data) {
                            $("#uploadFile").after($("#uploadFile").clone().val(""));
                            $("#uploadFile").remove();
                        }
                    });
                }
            }
        });
        return Import;
    });