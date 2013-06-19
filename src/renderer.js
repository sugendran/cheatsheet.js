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

		var search = element.querySelector('.cs-search');
		if(search) {
			var sheet = this;
			var onKeyUp = function(e) {
				sheet.filter(e.target.value);
			};
			if (search.addEventListener) {
				search.addEventListener('keyup', onKeyUp, false);
			} else if (search.attachEvent) {
				search.attachEvent('keyup', onKeyUp);
			}
		}
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
						'<input type="text" value="" placeholder="Filter" class="cs-search-input" />',
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