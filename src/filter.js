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
		return matched;
	};

	CheatSheet.Item.prototype.unfilter = function() {
		this.show();
	};

})(window || module.exports);