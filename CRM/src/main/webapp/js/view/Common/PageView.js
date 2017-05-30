define([ 'jquery', 'underscore', 'backbone'
         ,'pagination'
         ,'text!templates/Common/pagebutton.html'
         ,'text!templates/Common/pagedote.html'
         ,'text!templates/Common/pageitem.html'],
		function($, _, Backbone
				,pagination
				,pagebuttonTemplate
				,pagedoteTemplate
				,pageitemTemplate){
	
	PageView = Backbone.View.extend({
		tagName:"div",
		className:"page",
		templates : {
			"pagebuttonTemplate":_.template(pagebuttonTemplate),
			"pagedoteTemplate":_.template(pagedoteTemplate),
			"pageitemTemplate":_.template(pageitemTemplate)
		},
		initialize : function(option){
			this.callBack = option.callBack;
			this.pageType = option.pageType;
			this.render();
			return this;
		},
		render : function(){
			var _this = this;
			var totalNum = this.model.totalNum;
			var pageSize = this.model.pageSize;
			var pageIndex = this.model.pageIndex;
			var prev_text = null;
			var next_text = '<span>下一页</span>';
			var first_page = '<span>首页</span>';
			var last_page = '<span>末页</span>';
			var num_display_entries = 5;
			if(this.pageType=="small"){

				 next_text = '<i class="icon icon-next"></i>';
				 first_page = '<i class="icon icon-first"></i>';
				 last_page = '<i class="icon icon-last"></i>';
				num_display_entries = 3;
			}

			
			this.$el.pagination(totalNum, {
				callback: _this.callBack,  
				prev_text:prev_text,
				next_text:next_text,
				first_page:first_page,
				last_page:last_page,
                itemTemp:_this.templates.pageitemTemplate(),
				doteTemp:_this.templates.pagedoteTemplate(),
                items_per_page:pageSize,  //每页显示
                num_display_entries: num_display_entries,    //连续分页主体部分分页条目�?
                current_page: pageIndex ,  //当前页索�?
                num_edge_entries:0	//替代首页
            });
			
		},
		events : {
			
		}
	});
	
	return PageView;
});