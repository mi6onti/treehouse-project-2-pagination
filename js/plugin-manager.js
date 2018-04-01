/**
* This object can manage and add custom plugins
* @object PluginManager
*/
const PluginManager = {
	/**
	* Collect all available installed plugins
	* @property catalogue
	* @type {Array} 	
	*/
	catalogue: [],
	
	/**
	* Collect plugin names with their indexes related to catalogue property
	* @property plugin_names
	* @type {Array}
	*/
	plugin_names: [],
	
	/**
	* Load plugin with options
	* @method load
	* @param {String} plugin_name
	* @param {Object} options
	* @return {Object} 
	*/
	load(plugin_name, options) {
		const plug_in = this.getPlugin(plugin_name);
		plug_in.active = true;
		this.pluginExtend(plug_in, options);
		this.init(plug_in);
		return this;
	},
	
	/**
	* Install plugin
	* @method install
	* @param {Object} plug_in
	* @return {Object}
	*/
	install(plug_in){
		plug_in.active = false;
		this.plugin_names.push(plug_in.name);
		this.catalogue.push(plug_in);
		return this;
	},
	
	/**
	* Extend plugin method when is called. 
	* @method on
	* @param {String} event_type The name of plugin nmethod
	* @param {String} plugin_name The name of plugin 
	* @param {Function} handler Method extencion
	* @return {Object}
	*/
	on(event_type, plugin_name, handler){
		const plug_in = this.getPlugin(plugin_name);
		const old_method = plug_in[event_type];
		const options = {};
		const those = this;
		options[event_type] = function() {
			const val = old_method.call(plug_in);
			return handler.call(plug_in, those, val);
		}
		this.pluginExtend(plug_in, options);
		return this;
	},
	
	/**
	* Init plugin
	* @method init
	* @param {Object} plug_in
	* @return {Object}
	*/
	init(plug_in){
		const those = this;
		let plug;
		let current_plugin = plug_in;
		this.setPluginDefaultOptions(plug_in);
		plug_in.parent_element.append(plug_in.dom_object);
		if(typeof plug_in.init !=='undefined'){
			plug_in.init();
		}
		those.refreshPageContent(plug_in);
		this.setPluginHandler(plug_in, plug_in.attach_event_handler);
		this.setPluginHandler(plug_in, function() {
			if(plug_in.showResults()){
				those.refreshPageContent(plug_in, true);
				those.showResultsEffect(plug_in);
			}
		});
		return this;
	},
	
    /**
	* Extend plugin options 
	* @method pluginExtend
	* @param {Object} plug_in
	* @param {Object} options
 	* @return {Object}
	*/	
	pluginExtend(plug_in, options){
		$.extend(plug_in, options);
		return this;
	},
	
	/**
	* Set plugin handler. Each plugin have an event and handler 
	* @method setPluginHandler
	* @param {Object} plug_in
	* @param {Function} handler
	* @return {Object}
	*/
	setPluginHandler(plug_in, handler){
		plug_in.dom_object.on(plug_in.attach_event, plug_in.attach_event_on, {plug_in: plug_in}, handler)
		return this;
	},
	
	/**
	* Get plugin by plugin name
	* @method getPlugin
	* @param {String} plugin_name
 	* @return {Object}
	*/
	getPlugin(plugin_name){
		return this.catalogue[this.plugin_names.indexOf(plugin_name)];
	},
	
	/**
	* Each plugin has a show action and this method refresh page content depends on plugin.
	* @method refreshPageContent
	* @param {Object} plug_in
	* @param {Boolean} is_event Shows if method is called from plugin event or on init.
	* @return {Object}
	*/
	refreshPageContent(plug_in, is_event){
		if(plug_in.showed_list && plug_in.showed_list !== plug_in.result_list){
			plug_in.result_list.css('display', 'none');
			if(is_event){
				plug_in.showed_list.fadeIn(plug_in.fadein_time, function() {
					$(this).css('display', 'block');
				});
			}
			else{
				plug_in.showed_list.css('display', 'block');
			}
		}
		return this;
	},
	
	/**
	* Set plugin default options
	* @method setPluginHandler
	* @param {Object} plug_in
	* @return {Object}
	*/
	setPluginDefaultOptions(plug_in){
		plug_in.dom_object = $(plug_in.html);
		this.setDomObjectBySelector(plug_in, 'parent_element');
		this.setDomObjectBySelector(plug_in, 'result_list');
		plug_in.showed_list = plug_in.result_list;
		return this;
	} ,
	
	/**
	* Set plugin root object
	* @method setDomObjectBySelector
	* @param {Object} plug_in
	* @param {String} property
	* @return {Object}
	*/
	setDomObjectBySelector(plug_in, property){
		if(typeof plug_in[property] === 'string'){
			plug_in[property] = $(plug_in[property]);
		}
		return this;
	},
	
	/**
	* When content is changed by plugin animation effect is added
	* @method showResultsEffect
	* @param {Object} plug_in
	* @return {Object}
	*/
	showResultsEffect(plug_in){
		if(plug_in.scroll_time > 0){
			$('html, body').animate({
				scrollTop: plug_in.parent_element.offset().top
			}, plug_in.scroll_time);
		}
		return this;
	},
};

