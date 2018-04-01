/**
* Install search plugin. 
* Plugin is reusable and can work with other pages but some of properties has default values
* related to student list page
*/
PluginManager.install({
	
	/**
	* Name of plugin 
	* @property name
	* @type {String}
	*/
	name: 'search',
	
    /**
	* Plugin html
	* @property html
	* @type {String}
	*/
	html: `<div class="student-search">
						<form id="search-form">
							<input placeholder="Search for students...">
							<button type="submit">Search</button>
						</form>
						<form action="`+document.location.href+`">
							<button type="submit">Reset results</button>
						</form>
					</div>`,
	
	/**
    * Store dom object of plugin. It is set from PluginManager automatically based on plugin html
    * @property dom_object
	* @type {Object}
	*/	
	dom_object: null,
	
	/**
	* Plugin html is append to parent_element
	* @property parent_element
	* @type {String}
	*/
	parent_element: '.page-header',
	
	/**
	* Define where is located searched value
	* @property search_by_selector
	* @type {String}
	*/
	search_by_selector: '.email',
	
	/**
	* Define searched value. It is changed by text field
	* @property searched_string
	* @type {String}
	*/
	searched_string: '',
	
	/**
	* Define all elements
	* @property result_list
	* @type {String}
	*/
	result_list: '.student-item',
	
	/**
	* Which event should activate the search
	* @property attach_event
	* @type {String}
	*/
	attach_event: 'submit',
	
	/**
	* Which element controll the plugin
	* @property attach_event_on
	* @type {String}
	*/
	attach_event_on: 'form#search-form',
	
	/**
	* Searched string min length
	* @property min_length
	* @type {Number}
	*/
	min_length: 2,
	
	/**
	* Scroll animation effect time in miliseconds. Search plugin does not have such effect
	* @property scroll_time
	* @type {Number}
	*/
	scroll_time: 0,
	
	/**
	* Animation fadein time in miliseconds
	* @property fadein_time
	* @type {String}
	*/
	fadein_time: 1300,
	
	/**
	* Event handler. It is execute on submit search form
	* @method attach_event_handler
	* @param {Object} Event
	* @return {Object}
	*/
	attach_event_handler(e){
		e.preventDefault();
		e.data.plug_in.searched_string = e.data.plug_in.dom_object.find('INPUT').val();
		return this;
	},
	
	/**
	* Show results logic 
	* @method showResults
	* @return {Object|null}
	*/
	showResults(){
		let list;
		if(this.searched_string.length >= this.min_length){
			const those = this;
			list = this.result_list.filter(function(){
				return parseInt($(this).find(those.search_by_selector + ':contains("'+those.searched_string+'")').length) > 0;
			});
			if(parseInt(list.length) === 0){
				alert('Not found results by search criteria');
			}
			else{
				 this.showed_list = list;
				 return this.showed_list;
			}
		}
		else{
			alert('Please enter a string with more than '+ this.min_length + ' characters!');
		}
		return null;
	}
});

/**
* Install pagination plugin 
*/
PluginManager.install({
	/**
	* Name of plugin 
	* @property name
	* @type {String}
	*/
	name: 'pagination',
	
	/**
	* Plugin html
	* @property html
	* @type {String}
	*/
	html: `<div class="pagination">
					<ul>
					</ul>
				</div>`,
				
	/**
	* Plugin html is append to parent_element
	* @property parent_element
	* @type {String}
	*/
	parent_element: '.page',
	
	/**
	* Define all elements
	* @property result_list
	* @type {String}
	*/
	result_list: '.student-item',
	
	/**
	* Define how many results to be showed for each page
	* @property count_per_page
	* @type {Number}
	*/
	count_per_page: 10,
	
	/**
	* Define class of active page 
	* @property current_link_class
	* @type {String}
	*/
	current_link_class: 'active',
	
    /**
	* Scroll animation effect time in miliseconds.
	* @property scroll_time
	* @type {Number}
	*/
	scroll_time: 1000,
    
	/**
	* Animation fadein time in miliseconds
	* @property fadein_time
	* @type {String}
	*/
	fadein_time: 1300,
	
	/**
	* Init pagination
	* @method init
	* @return {Object}
	*/
	init(){
		this.refreshLinks();
		this.showResults();
		return this;
	},
	
	/**
	* Which event should activate the search
	* @property attach_event
	* @type {String}
	*/
	attach_event: 'click',
	
	/**
	* Which element controll the plugin
	* @property attach_event_on
	* @type {String}
	*/
	attach_event_on: 'a',
	
	/**
	* Event handler. It is execute when page link in navigation is clicked
	* @method attach_event_handler
	* @param {Object} Event
	* @return {Object}
	*/
	attach_event_handler(e){
		const current_link = $(this);
		e.preventDefault();
		e.data.plug_in.getCurrentPageObject().removeClass(e.data.plug_in.current_link_class);
		current_link.addClass(e.data.plug_in.current_link_class);
	},
	
	/**
	* Show results logic 
	* @method showResults
	* @return {Object}
	*/
	showResults(){
		const last_row = parseInt(this.getCurrentPageNumber()) * parseInt(this.count_per_page);
		const row_begin_after = (last_row - this.count_per_page);
		return this.showed_list = this.result_list.slice(row_begin_after, last_row);
	},
	
	/**
	* Get current page number 
	* @method getCurrentPageNumber
	* @return {Number}
	*/
	getCurrentPageNumber(){
		return parseInt(this.getCurrentPageObject().text());
	},
	
	/**
	* Get current page object 
	* @method getCurrentPageObject
	* @return {Object}
	*/
	getCurrentPageObject(){
		return this.dom_object.find('.' + this.current_link_class);
	},
	
	/**
	* Refresh or generate pagination links
	* @method refreshLinks
	* @return {Object}
	*/
	refreshLinks(){
		const count_links = Math.ceil(parseInt(this.result_list.length) / parseInt(this.count_per_page));
		let child_elements = '';
		let active;
		for(let i = 1; i <= parseInt(count_links); i++){
			active = (i === 1) ? this.current_link_class : '';
			child_elements+= `
			<li>
				<a class="`+active+`" href="#">`+i+`</a>
			</li>`;
		}
		this.dom_object.html(child_elements);
		return this;
	}
});

// Connect search and pagination plugins
PluginManager.on('showResults', 'search', function(PluginManager, found_result) {
	const pagination = PluginManager.getPlugin('pagination');
	if(pagination.active && found_result){
		pagination.result_list = this.showed_list;
		pagination.init();
		this.showed_list = pagination.showed_list;
	}
	return this.showed_list;
});