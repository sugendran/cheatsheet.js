describe("CheatSheet", function() {
	it("should filter correctly", function() {
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
				title: "Coffee",
				link: "http://git/more",
				items: [ ]
			}]
		};

		var cheatSheet = new CheatSheet(config);
		cheatSheet.filter('coffee');
		expect(cheatSheet.sections[1].visible).toBe(false);
		expect(cheatSheet.sections[2].visible).toBe(true);
		cheatSheet.unfilter();
		expect(cheatSheet.sections[2].visible).toBe(true);
		cheatSheet.filter('tea');
		expect(cheatSheet.sections[2].visible).toBe(false);
		cheatSheet.unfilter();
		cheatSheet.filter('beta');
		expect(cheatSheet.sections[0].visible).toBe(true);
	});
});