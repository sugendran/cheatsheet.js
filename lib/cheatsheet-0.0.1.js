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
(function(window) {
	var CheatSheet = window.CheatSheet;

	var domAvailable = !!window.document;

	CheatSheet.prototype.render = function(element) {
		var html = [];
		html.push(this.headerHTML());
		for(var i=0, ii=this.sections.length; i<ii; i++) {
			var section = this.sections[i];
			html.push(section.headerHTML());
			html.push(section.contentHTML());
			html.push(section.footerHTML());
		}
		html.push(this.footerHTML());
		element.innerHTML = html.join("");
		this.afterRender();
	};
	CheatSheet.prototype.headerHTML = function() {
		var width = window.innerWidth || document.documentElement.clientWidth;
		width = Math.floor(width / 482) * 482;
		var html = [
			'<div class="cs-container" style="width:', width,'px">',
				'<div class="cs-header">',
					'<h1 class="cs-title">', this.title, '</h1>',
				'</div>'];
		if(domAvailable) {
			html.splice(7, 0,
					'<div class="cs-search">',
						'<input type="text" value="" placeholder="Filter" class="cs-search-input" onKeyUp="', this.keyup,'" />',
					'</div>');
		}
		if(this.description) {
			html.splice(7,0,'<p class="cs-description">', this.description, '</p>');
		}
		return html.join('');
	};
	CheatSheet.prototype.footerHTML = function() {
		return '</div>';
	};

	var Section = CheatSheet.Section;
	Section.prototype.headerHTML = function() {
		var html = [
			'<section class="cs-section" id="', this.id, '">',
				'<div class="cs-section-inner">',
					'<header class="cs-section-header">',
						'<h4 class="cs-title">', this.title, '</h4>'];
			if(this.description) {
				html = html.concat('<p class="cs-description">', this.description, '</p>');
			}
			html.push('</header>');
		return html.join('');
	};
	Section.prototype.contentHTML = function() {
		var html = [];
		for(var i=0, ii=this.items.length; i<ii; i++) {
			var item = this.items[i];
			html.push(item.headerHTML());
			html.push(item.contentHTML());
			html.push(item.footerHTML());
		}
		return html.join('');
	};
	Section.prototype.footerHTML = function() {
		return '</div></section>';
	};

	var Item = CheatSheet.Item;
	Item.prototype.headerHTML = function() {
		var html = [
			'<div class="cs-item" id="', this.id,'">',
				'<div class="cs-title">', this.title, '</div>'];
		return html.join('');
	};
	Item.prototype.contentHTML = function() {
		var html = [];
		if(this.description) {
			html = html.concat(
				'<div class="cs-description">', this.description, "</div>");
		}
		if(this.link) {
			html = html.concat(
				'<div class="cs-link">',
					'<a href="', this.link, '">', this.linkTitle, '</a>',
				'</div>');
		}
		if(this.params) {
			var params = this.params;
			for(var i=0, ii=params.length; i<ii; i++) {
				var param = params[i];
				html = html.concat(
					'<div class="cs-param">',
						'<dl>',
							'<dt class="cs-param-name">', param.name ,'</dt>',
							'<dd class="cs-param-desc">', param.description,'</dd>',
						'</dl>',
					'</div>');
			}
		}
		return html.join('');
	};
	Item.prototype.footerHTML = function() {
		return '</div>';
	};

	function configureDOMHide() {
		function toggle(id, show) {
			var elem = window.document.getElementById(id);
			if(elem) {
				elem.style.display = show ? "" : "none";
			}
		}
		Section.prototype.show = function() {
			this.visible = true;
			toggle(this.id, true);
		};
		Section.prototype.hide = function() {
			this.visible = false;
			toggle(this.id, false);
		};
		Item.prototype.show = function() {
			this.visible = true;
			toggle(this.id, true);
		};
		Item.prototype.hide = function() {
			this.visible = false;
			toggle(this.id, false);
		};
	}

	if(domAvailable) {
		configureDOMHide();
	}

})(window || module.exports);
(function(window) {
	var CheatSheet = window.CheatSheet;

	function every(arr, func, arg) {
		var ret = [];
		for(var i=0, ii=arr.length; i<ii; i++) {
			ret.push(arr[i][func](arg || null));
		}
		return ret;
	}

	function isMatch(obj, keys, rx) {
		var matched = false;
		for(var i=0, ii=keys.length; i<ii && !matched; i++) {
			var key = keys[i];
			if(obj[key]) {
				matched = rx.exec(obj[key]) !== null;
			}
		}
		return matched;
	}

	CheatSheet.prototype.filter = function(term) {
		var rx = new RegExp(term, 'i');
		every(this.sections, 'filter', rx);
		this.afterFilter();
	};

	CheatSheet.prototype.unfilter = function() {
		every(this.sections, 'unfilter');
		this.afterFilter();
	};

	CheatSheet.Section.prototype.filter = function(rx) {
		var matched = isMatch(this, ['title', 'description', 'linkTitle'], rx);
		if(matched) {
			this.unfilter();
			return matched;
		}
		var visibles = every(this.items, 'filter', rx);
		while(!matched && visibles.length) {
			matched = visibles.pop();
		}
		if(matched) {
			this.show();
		} else {
			this.hide();
		}
		return matched;
	};

	CheatSheet.Section.prototype.unfilter = function() {
		every(this.items, 'unfilter');
		this.show();
	};

	CheatSheet.Item.prototype.filter = function(rx) {
		var matched = isMatch(this, ['title', 'description', 'linkTitle'], rx);
		if(!matched && this.params) {
			var params = this.params;
			for(var i=0, ii=params.length; i<ii && !matched; i++) {
				matched = isMatch(params[i], ['name', 'description'], rx);
			}
		}
		if(matched) {
			this.show();
		} else {
			this.hide();
		}
		console.log(matched);
		return matched;
	};

	CheatSheet.Item.prototype.unfilter = function() {
		this.show();
	};

})(window || module.exports);