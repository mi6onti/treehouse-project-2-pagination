// Load search plugin
PluginManager.load('search',{
	parent_element: '.page-header',
	search_by_selector: '.email',
	result_list: '.student-item',
	min_length: 2,
	fadein_time: 1300
});

// Load pagination plugin
PluginManager.load('pagination', {
	parent_element: '.page',
	result_list: '.student-item',
	count_per_page: 10,
	scroll_time: 1000,
	fadein_time: 1300
});
