module.exports = {
	pages: {
		nutrit: {
			name: 'nutrit'
		},
		food_selector: {
			name: 'food_selector'
		},
		ingredient_list: {
			name: 'ingredient_list'
		},
		pie: {
			name: 'pie'
		},
		toolkit: {
			name: 'Toolkit',
			sections: [
				{
					title: 'Pages',
					links: [
						'index'
					]
				},
				{
					title: 'Components',
					links: [
						'food_selector',
						'ingredient_list',
						'pie'
					]
				},
				{
					title: 'Style guide',
					links: [
						'style_guide'
					]
				}
			],
			
		}
	},
	styles: [
		'common',
		'food_selector',
		'ingredient_list'
	],
	stylePath: 'css/',
	scripts: [],
	scriptPath: 'js/',
	libs: [
		'react',
		'react-dom',
		'lodash',
		'stativus',
		'async',
		'schema-inspector',
		'cs',
		'bella'
	],
	libPath: 'lib/',
	iconPath: 'icons/'
};