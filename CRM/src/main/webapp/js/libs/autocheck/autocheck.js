
;(function($){
	$.fn.autocheck = function(opts){
		var defaults = {
				source:"",
				label:null,
				value:null,
				id:"ID",
				searchParam:"",
				top:30,
				FormData:{}
		};
		var option = $.extend(defaults,opts);
		
		return this.each(function(){
			//存放已选择
			if($(this).nextAll("ul[name=selecteditem]").length>0){
				$(this).nextAll("ul[name=selecteditem]").remove();
			}
			
			$(this).after('<ul name="selecteditem" style="display:none"></ul>');
			
			//值
			var initValue = $.trim($(this).val());
			var initId = $.trim($(this).attr("selectidarray"));
			if(initValue==""){
				initId = "";
			}
			var initValueArray = initValue.split(";");
			var initIdArray = initId.split(";");
			
			//初始化已选择
			var ulselectitem = $(this).nextAll("ul[name=selecteditem]");
			for(inita in initIdArray){
				if($.trim(initIdArray[inita]) != ""){
					var lihtml = "<li selectid={id}>{selectvalue}</li>";
					$(ulselectitem).append(lihtml.replace(/{id}/g,initIdArray[inita]).replace(/{selectvalue}/g, $.trim(initValueArray[inita])));
				}
			}
			
			var cache = [];
			//初始化cache
			for(initb in initIdArray){
				if($.trim(initIdArray[initb]) != ""){
				var item ={
						"label": $.trim(initValueArray[initb]),
						"value": $.trim(initValueArray[initb]),
						"id": $.trim(initIdArray[initb])
					};
				cache.push(item);
				}
			}
			
			var autoinstance = $(this).autocheckcomplete({
				minLength:0,
				delay: 10,
				source:function( request, response ){
					var term = $.trim(request.term);
					var dataStr = $.extend({},option.FormData);
					dataStr["top"] = option.top;
					
					if(term==null || term == ""){
						dataStr[option.searchParam]="";
					}
					dataStr[option.searchParam]=term;
					
					//空  && 缓存存在数据 读缓存
					if($.trim(dataStr[option.searchParam]) == "" && cache.length >=option.top){
						response( cache.slice(0,option.top-1) );
						return;
					}
					
					var selectedDateArray = [];
					//精确匹配缓存数据 获取已选值
					var splitArray = term.split(";");
					var isLastSelect = false;
					for(v in splitArray){
						for(z in cache){
							if($.trim(cache[z].label)==$.trim(splitArray[v])){
								selectedDateArray.push(cache[z]);
								if(v == splitArray.length-1){
									isLastSelect = true;
								}
								break;
							}
						}
					}
					
					
					//最后一个值
					if(isLastSelect){
						dataStr[option.searchParam] = "";
					}else{
						dataStr[option.searchParam] = splitArray[splitArray.length-1];
					}
					
					//模糊匹配最后一个值 缓存
					var matchDate = null;
					if(dataStr[option.searchParam] == ""){
						matchDate = cache;
					}else{
						var valueReg = dataStr[option.searchParam].replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
						var matcher = new RegExp(valueReg, "i" );
						matchDate = $.grep( cache, function( value ) {
							return matcher.test( value.label || value.value || value );
						});
					}
					
					
					//返回rsp 的值
					var rspDate = selectedDateArray;

					//剔除重复的
					if(selectedDateArray.length == 0){
						rspDate = selectedDateArray.concat(matchDate);
					}else{
						for(v in matchDate){
							for(k in selectedDateArray){
								if(matchDate[v].id == selectedDateArray[k].id){
									break;
								}
								if(k == selectedDateArray.length-1){
									rspDate.push(matchDate[v]);
								}
							}
						}
					}
					
					
					if(rspDate.length >= option.top){
						response(rspDate.slice(0,option.top-1));
						return;
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
										labelArray.push($.trim(item[labelitem]));
									});



									if(option.idExt != null){
										var idExt = new Array();
										idExt.push($.trim(item[option.id]));
										$.each(option.idExt,function(i,idExtitem){
											idExt.push(item[idExtitem]);
										});


										return {
											"label":labelArray.join(" "),
											"value":labelArray.join(" "),
											"id":idExt.join(":")
										}
									}else{
										return {
											"label":labelArray.join(" "),
											"value":labelArray.join(" "),
											"id":item[option.id]
										}
									}


								});
								
								var rsponseDate = rspDate;
								if(normData.length == 0){
									normData = cache;
								}
								//剔除重复
								if(rspDate.length == 0){
									rsponseDate = rspDate.concat(normData);
								}else{
									for(z in normData){

										for(k in rspDate){
											if(normData[z].id == rspDate[k].id){
												break;
											}
											if(k == rspDate.length-1){
												rsponseDate.push(normData[z]);
											}
										}
										
									}
								}
								
								
								cache =rsponseDate;
								response( rsponseDate.slice(0,option.top-1) );
	
							}
							
							
							
						},
						error:function(){
							console.log("error");
						}
						
					})
				},
				select:function(event, ui){
					
					var inputTextValue = $.trim(this.value);
					var textvalueArray = inputTextValue.split(";");
					var textvalueArrayTrim = new Array();
					$.each(textvalueArray, function (index,i) {
						textvalueArrayTrim.push($.trim(i));
					})
					//设置id
					var idArray = [];
					
					var _this = this;
					
					//勾选/取消勾选
					var isSelected = false;
					$(this).nextAll("ul[name=selecteditem]").find("li").each(function(){
						
						if($.trim($(this).text()) == $.trim(ui.item.value)){
							isSelected = true;
							return false;
						}
					});
					
					if(isSelected){
						//原：勾选--删除
						var arr = $.grep(textvalueArrayTrim,function(n,i){
							return n== $.trim(ui.item.value)?false:true;
						});
						
						var arr = $.grep(textvalueArrayTrim,function(n,i){
							return n== $.trim(ui.item.value)?false:true;
						});

						this.value = arr.join(";");
						
						$(this).nextAll("ul[name=selecteditem]").find("li").each(function(){
							var val = $.trim($(this).text());
							if($.inArray(val,arr)<0){
								$(this).remove();
							}
							
						});
					}else{
						//原：未勾选--加入
						textvalueArrayTrim.pop();
						//搜索是否有与选中的值一致的值
						var arr = $.grep(textvalueArrayTrim,function(n,i){
							return n== $.trim(ui.item.value)?false:true;
						});
						
						arr.push($.trim(ui.item.value));
						arr.push( "" );
						this.value = arr.join(";");
						var lihtml = "<li selectid={id}>{selectvalue}</li>";
						
						$(this).nextAll("ul[name=selecteditem]").append(lihtml.replace(/{id}/g,ui.item.id).replace(/{selectvalue}/g, $.trim(ui.item.value)));

					}
					
					//设置文档title
					$(this).attr({"title":this.value});
					
					//设置id
					var valueArr = this.value.split(";")
					for(v in valueArr){
						for(k in cache){
							if(valueArr[v] == cache[k].value){
								idArray.push(cache[k].id);
								break;
							}
						}
					}
					
					$(this).attr({"selectidarray":idArray.join(";")});
					
					//触发input
					$(this).trigger("input");
					
					return false;
				}
			
				
			});
			
			return autoinstance;
		});
	}
})(jQuery)