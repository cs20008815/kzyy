(function($){
	$.fn.pagination = function(maxentries, opts) {
		opts = jQuery.extend({
			items_per_page : 10,
			num_display_entries : 10,
			current_page : 0,
			num_edge_entries : 0,
			link_to : "#",
			prev_text : null,
			next_text : null,
			ellipse_text : "...",
			prev_show_always : true,
			next_show_always : false,
			callback : function() {
				return false;
			}
		}, opts || {});

		return this.each(function() {
					/**
					 * Calculate the maximum number of pages
					 */
					function numPages() {
						return Math.ceil(maxentries / opts.items_per_page);
					}

					/**
					 * Calculate start and end point of pagination links depending
					 * on current_page and num_display_entries.
					 * 
					 * @return {Array}
					 */
					function getInterval() {
						var ne_half = Math.ceil(opts.num_display_entries / 2);
						var np = numPages();
						var upper_limit = np - opts.num_display_entries;
						var start = 1;
						if(np<=opts.num_display_entries){
							start = 1;
						}else if(ne_half>=current_page){
							start = 1;
						}else if(np>=current_page+opts.num_display_entries-ne_half){
							start = current_page-ne_half +1;
						}else{
							start = np - opts.num_display_entries+1;
						}
				

						var end = (start + opts.num_display_entries-1)>np?np:start + opts.num_display_entries-1;
						return [ start, end ];
					}

					/**
					 * This is the event handling function for the pagination links.
					 * 
					 * @param {int}
					 *            page_id The new page number
					 */
					function pageSelected(page_id, evt) {
						current_page = page_id;
						drawLinks();
						var startIndex = (page_id-1) *opts.items_per_page;
						var continuePropagation = opts.callback(page_id,startIndex, panel);
						if (!continuePropagation) {
							if (evt.stopPropagation) {
								evt.stopPropagation();
							} else {
								evt.cancelBubble = true;
							}
						}
						return continuePropagation;
					}

					/**
					 * This function inserts the pagination links into the container
					 * element
					 */
					function drawLinks() {
						panel.empty();
						var interval = getInterval();
						var np = numPages();
						// This helper function returns a handler function that
						// calls pageSelected with the right page_id
						var getClickHandler = function(page_id) {
							return function(evt) {
								return pageSelected(page_id, evt);
							}
						}
						// Helper function for generating a single link (or a span
						// tag if it'S the current page)
						var appendItem = function(page_id, appendopts) {
							page_id = page_id < 1 ? 1 : (page_id <= np ? page_id
									: np); // Normalize page id to sane value
							appendopts = jQuery.extend({
								text : page_id
							}, appendopts || {});
							
							var lnk = "";
							var lnkObj = null;
							if(appendopts.type == "prev_text"){
								lnk = opts.prev_text;
								lnkObj = $(lnk);
								if(current_page > 1){
									$(lnkObj).bind("click",getClickHandler(page_id));
								}
								
							}else if(appendopts.type == "next_text"){
								lnk = opts.next_text;
								lnkObj = $(lnk);
								if(current_page < np){
									$(lnkObj).bind("click",getClickHandler(page_id));
								}
							}else if(appendopts.type == "first_page"){
								lnk = opts.first_page;
								lnkObj = $(lnk);
								if(current_page>1){
									$(lnkObj).bind("click",getClickHandler(1));
								}
								
							}else if(appendopts.type == "last_page"){
								lnk = opts.last_page;
								lnkObj = $(lnk);
								if(current_page != np){
									$(lnkObj).bind("click",getClickHandler(np));
								}
								
							}
							else if(appendopts.type == "item"){
								lnk = opts.itemTemp.replace(/{text}/,appendopts.text).replace(/{pagenum}/,page_id);
								lnkObj = $(lnk);
								if(page_id != current_page){
									$(lnkObj).bind("click",getClickHandler(page_id));
								}
								if(page_id == current_page){
									$(lnkObj).addClass("on");
								}
							}else if(appendopts.type == "dote_text"){
								lnk = opts.doteTemp;
								lnkObj = $(lnk);
							}
							
							panel.append($(lnkObj));
							
							
						}
						//first 
						if(opts.first_page){
							appendItem(current_page-1, {
								text : opts.first_page,
								type:"first_page"
							});
						}
						
						// Generate "Previous"-Link 按钮样式
						if (opts.prev_text
								&& (current_page > 1 || opts.prev_show_always)) {
							appendItem(current_page-1, {
								text : opts.prev_text,
								type:"prev_text"
							});
						}
						
						//首页 opts.num_edge_entries
						if(opts.num_edge_entries > 0){
							if(interval[0]>opts.num_edge_entries){
								for(var i=0; i<opts.num_edge_entries;i++){
									appendItem(i+1, {
										text : i+1,
										type:"item"
									});
								}
								
								var lnkObj = opts.doteTemp;
								panel.append($(lnkObj));
							}
							
						}
						
						
						// Generate interval links   数字样式
						for ( var i = interval[0]; i <= interval[1]; i++) {
							appendItem(i,{
								text:i,
								type:"item"
							});
						}

						//dote
						if(interval[1]<np){
							appendItem(current_page,{
								text:opts.doteTemp,
								type:"dote_text"
							});
						}
						// Generate "Next"-Link  按钮样式
						if (opts.next_text
								&& (current_page < np  || opts.next_show_always)) {
							appendItem(current_page + 1, {
								text : opts.next_text,
								type:"next_text"
							});
						}



						//last
						if(opts.last_page){
							appendItem(np, {
								text : opts.last_page,
								type:"last_page"
							});
						}
					}

					// Extract current_page from options
					var current_page = opts.current_page;
					// Create a sane value for maxentries and items_per_page
					maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
					opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1
							: opts.items_per_page;
					// Store DOM element for easy access from all inner functions
					var panel = jQuery(this);
					// Attach control functions to the DOM element
					this.selectPage = function(page_id) {
						pageSelected(page_id);
					}
					this.prevPage = function() {
						if (current_page > 0) {
							pageSelected(current_page - 1);
							return true;
						} else {
							return false;
						}
					}
					this.nextPage = function() {
						if (current_page < numPages() - 1) {
							pageSelected(current_page + 1);
							return true;
						} else {
							return false;
						}
					}
					// When all initialisation is done, draw the links
					drawLinks();
				});
	}
})(jQuery)
