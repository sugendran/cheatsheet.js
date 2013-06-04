(function(window) {

	// http://stackoverflow.com/a/2117523/22466
	function uuid() {
		return 'cs_xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}

	// order is important!!
	function map(arr, func, scope) {
		if(!scope) scope = null;
		var results = [];
		for(var i=0, ii=arr.length; i<ii; i++) {
			results.push(func.call(scope, arr[i]));
		}
		return results;
	}

	function copy(keys, source, target) {
		for(var i=0, ii=keys.length; i<ii; i++) {
			var key = keys[i];
			if(source[key]) {
				target[key] = source[key];
			}
		}
	}

	function validate(source, keys) {
		for(var i=0, ii=keys.length; i<ii; i++) {
			var key = keys[i];
			if(!source[key]) throw new Error(key + " is missing");
		}
	}

	function CheatSheet(config) {
		this.id = uuid();
		this.title = config.title;
		this.description = config.description;
		this.sections = map(config.sections, CheatSheet.toSection, this);
		this.afterRenderHooks = [];
		this.afterFilterHooks = [];
		this.keyup = "keyup_" + this.id;
		var me = this;
		window[this.keyup] = function(e) {
			me.filter(this.value);
		};
	}

	CheatSheet.prototype.onAfterRender = function(func) {
		this.afterRenderHooks.push(func);
	};
	CheatSheet.prototype.onAfterFilter = function(func) {
		this.afterFilterHooks.push(func);
	};
	CheatSheet.prototype.afterRender = function() {
		var hooks = this.afterRenderHooks;
		for (var i = hooks.length - 1; i >= 0; i--) {
			var hook = hooks[i];
			hook.apply(this);
		}
	};
	CheatSheet.prototype.afterFilter = function() {
		var hooks = this.afterFilterHooks;
		for (var i = hooks.length - 1; i >= 0; i--) {
			var hook = hooks[i];
			hook.apply(this);
		}
	};


	function Section(info) {
		this.id = uuid();
		this.visible = true;
		validate(info, ["title", "items"]);
		if(info.link && !info.linkTitle) {
			info.linkTitle = info.link;
		}
		copy(["title", "description", "link", "linkTitle"], info, this);
		this.items = map(info.items, CheatSheet.toItem, this);
	}
	Section.prototype.show = function() {
		this.visible = true;
	};
	Section.prototype.hide = function() {
		this.visible = false;
	};

	function Item(info) {
		this.id = uuid();
		this.visible = true;
		validate(info, ["title"]);
		if(info.link && !info.linkTitle) {
			info.linkTitle = info.link;
		}
		copy(["title", "description", "link", "linkTitle", "params"], info, this);
	}
	Item.prototype.show = function() {
		this.visible = true;
	};
	Item.prototype.hide = function() {
		this.visible = false;
	};

	CheatSheet.Section = Section;
	CheatSheet.Item = Item;

	CheatSheet.toSection = function(section) {
		return new Section(section);
	};

	CheatSheet.toItem = function(item) {
		return new Item(item);
	};

	window.CheatSheet = CheatSheet;
})(window || module.exports);