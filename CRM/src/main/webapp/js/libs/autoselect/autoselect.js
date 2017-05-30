(function($){
	$.fn.autoselect = function(opts){
		var defaults = {
			source:"",
			label:null,
			value:null,
			id:"id",
			searchParam:"",
			top:50,
			FormData:{},
			searchCallBack:""
		};
		var option = $.extend(defaults,opts);
		this.searchCallBack = null;
		this.each(function(){
			//清空数据
			$(this).val("");
			$(this).removeProp("inputid");
			var autoinstance = $(this).autoselectcomplete({
				minLength:0,
				delay: 10,
				source:function( request, response ){
					var term = request.term;
					var dataStr = $.extend({},option.FormData);
					dataStr["top"] = option.top;

					if(term==null || term == ""){
						dataStr[option.searchParam]="";
					}else{
						dataStr[option.searchParam]=term;
					}

					$.ajax({
						url:option.source,
						type:"POST",
						dataType:"JSON",
						contentType:"application/json",
						data:JSON.stringify(dataStr),
						success:function(data){
							if(data.status == 'S'){
								var entity = data.output;
								var normData = $.map( entity, function( item ){
									var labelArray = new Array();
									$.each(option.label,function(i,labelitem){
										if(item[labelitem]!=null && item[labelitem]!="" ){
											labelArray.push(item[labelitem]);
										}
									});
									var valueArray = new Array();
									if(option.value == null || option.value.length ==0){
										valueArray = labelArray;
									}else{
										$.each(option.value,function(i,valueitem){
											if(item[valueitem]!=null && item[valueitem]!="" ){
												valueArray.push(item[valueitem]);
											}
										});
									}

									return {
										"label":labelArray.join(" "),
										"id":item[option.id],
										"value":valueArray.join(" ")
									}
								});
								response(normData);
							}



						}

					})
				},
				select:function(event, ui){
					$(this).attr("inputid",ui.item.id);
					$(this).attr("name",ui.item.value);
					$(this).val(ui.item.value);
					$(this).trigger("selectevent",ui.item);
					if ((typeof option.searchCallBack) != "undefined"){
						this.searchCallBack = option.searchCallBack;
						if ($.isFunction(this.searchCallBack)){
							this.searchCallBack();
						}
					}
					return true;
				}
			});
		});

	}
})(jQuery);