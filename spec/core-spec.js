describe("CheatSheet", function() {
	it("should parse configs properly", function() {
		var config = {
			title: "thing",
			description: "It's a thing",
			sections: [{
				title: "Some functions",
				description: "The thing",
				link: "http://git/things.js",
				items: [{
					title: ".magic(alpha [,beta])",
					description: "Performs magic",
					link: "http://git/things.js#13",
					linkTitle: ":13",
					params: [{
						name: "alpha",
						type: "String or Object",
						description: "The magic word or thing"
					}, {
						name: "beta",
						type: "String",
						description: "Optional catch phrase"
					}]
				}]
			}, {
				title: "Other functions",
				description: "Other things",
				items: [{
					title: "Fill me in",
					link: "http://git/"
				}]
			}, {
				title: "More functions",
				link: "http://git/more",
				items: [ ]
			}]
		};
		var expectedSections = [{
			title: "Some functions",
			description: "The thing",
			link: "http://git/things.js",
			linkTitle: "http://git/things.js",
			items: [{
				title: ".magic(alpha [,beta])",
				description: "Performs magic",
				link: "http://git/things.js#13",
				linkTitle: ":13",
				params: [{
					name: "alpha",
					type: "String or Object",
					description: "The magic word or thing"
				}, {
					name: "beta",
					type: "String",
					description: "Optional catch phrase"
				}]
			}]
		}, {
			title: "Other functions",
			description: "Other things",
			items: [{
				title: "Fill me in",
				link: "http://git/",
				linkTitle: "http://git/"
			}]
		}, {
			title: "More functions",
			link: "http://git/more",
			linkTitle: "http://git/more",
			items: [ ]
		}];

		var cheatSheet = new CheatSheet(config);
		expect(cheatSheet.title).toEqual(config.title);
		expect(cheatSheet.description).toEqual(config.description);
		expect(cheatSheet.sections.length).toEqual(expectedSections.length);

		function checkItems(expected, actual) {
			expect(actual.title).toEqual(expected.title);
			if(expected.description) {
				expect(actual.description).toEqual(expected.description);
			}
			if(expected.link) {
				expect(actual.link).toEqual(expected.link);
				expect(actual.linkTitle).toEqual(expected.linkTitle);
			}
			if(expected.params) {
				expect(actual.params).toEqual(expected.params);
			}
		}

		function checkSection(expected, actual) {
			expect(actual.title).toEqual(expected.title);
			expect(actual.description).toEqual(expected.description);
			if(expected.link) {
				expect(actual.link).toEqual(expected.link);
				expect(actual.linkTitle).toEqual(expected.linkTitle);
			}
			for(var j=0, jj=expected.items.length; j<jj; j++) {
				checkItems(actual.items[j], expected.items[j]);
			}
		}
		for(var i=0, ii=cheatSheet.sections.length; i<ii; i++) {
			checkSection(cheatSheet.sections[i], expectedSections[i]);
		}
	});
});