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
		components: {
			name: 'components',
			links: [
				'food_selector',
				'ingredient_list',
				'pie'
			]
		}
	},
	styles: [
		'common',
		'food_selector',
		'ingredient_list'
	],
	stylePath: 'css/',
	styleDevPath: '../css/',
	scripts: [],
	scriptPath: 'js/',
	scriptDevPath: '../js/',
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
	libDevPath: '../lib/'
};