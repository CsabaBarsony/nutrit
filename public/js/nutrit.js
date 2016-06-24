(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var FoodSelector = require('../../components/food_selector/food_selector.js');
var IngredientList = require('../../components/ingredient_list/ingredient_list.js');

var Nutrit = React.createClass({
	displayName: 'Nutrit',

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'nutrit' },
			React.createElement(IngredientList, null),
			React.createElement(FoodSelector, null)
		);
	}
});

ReactDOM.render(React.createElement(Nutrit, null), document.getElementById('cont_nutrit'));
},{"../../components/food_selector/food_selector.js":2,"../../components/ingredient_list/ingredient_list.js":4}],2:[function(require,module,exports){
'use strict';

var foodCategories = require('../../food_categories.js');
var Utils = require('./food_selector_utils.js');

var FoodSelector = React.createClass({
	displayName: 'FoodSelector',

	getInitialState: function getInitialState() {
		return {
			selectedFoodCategory: foodCategories,
			foods: [],
			loading: false
		};
	},
	render: function render() {
		var list;

		if (this.state.selectedFoodCategory.sub) {
			list = _.map(this.state.selectedFoodCategory.sub, function (category) {
				return React.createElement(Category, { category: category, key: category.id, selectCategory: this.selectCategory });
			}, this);
		} else {
			list = _.map(this.state.foods, function (ingredient) {
				return React.createElement(
					'div',
					{ key: ingredient.id },
					React.createElement(Ingredient, { ingredient: ingredient, add: this.addIngredient })
				);
			}, this);
		}

		var controls = this.state.selectedFoodCategory.root ? null : React.createElement(
			'div',
			{ className: 'food_selector-controls' },
			React.createElement(
				'button',
				{ className: 'food_selector-category', onClick: this.backButtonClick },
				React.createElement(
					'div',
					null,
					React.createElement('i', { className: 'flaticon-previous' })
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						'Back'
					)
				)
			),
			React.createElement(
				'button',
				{ className: 'food_selector-category', onClick: this.rootButtonClick },
				React.createElement(
					'div',
					null,
					React.createElement('i', { className: 'flaticon-refresh' })
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						'All categories'
					)
				)
			)
		);

		var content = React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'food_selector-list' },
				list
			),
			controls
		);

		return React.createElement(
			'div',
			{ className: 'food_selector' },
			this.state.loading ? React.createElement(
				'div',
				null,
				'loading...'
			) : content
		);
	},
	addIngredient: function addIngredient(id) {
		var amount = prompt('Please enter the amount of food in grams!', '100');

		if (amount) {
			var ingredientData = bella.data.ingredients.get();
			ingredientData.push({ food: _.find(this.state.foods, { id: id }), amount: { quantity: parseInt(amount), unit: 'g' } });
			bella.data.ingredients.set(ingredientData);
		}
	},
	selectCategory: function selectCategory(category) {
		var _this = this;

		var selectedCategory = _.find(this.state.selectedFoodCategory.sub, { id: category });

		if (selectedCategory.sub) {
			this.setState({
				selectedFoodCategory: selectedCategory,
				foods: []
			});
		} else {
			cs.get('/getfoods?id=' + selectedCategory.id, function (status, foods) {
				if (status === 200) {
					_this.setState({
						selectedFoodCategory: selectedCategory,
						foods: foods,
						loading: false
					});
				}
			});
			this.setState({ loading: true });
		}
	},
	backButtonClick: function backButtonClick() {
		var parentCategory = Utils.findParentCategory(foodCategories, this.state.selectedFoodCategory.id);

		this.setState({
			selectedFoodCategory: parentCategory,
			foods: []
		});
	},
	rootButtonClick: function rootButtonClick() {
		this.setState({
			selectedFoodCategory: foodCategories,
			foods: []
		});
	}
});

var Category = React.createClass({
	displayName: 'Category',

	render: function render() {
		var iconClass = 'flaticon-' + this.props.category.id;

		return React.createElement(
			'button',
			{ className: 'food_selector-category', onClick: this.click },
			React.createElement(
				'div',
				null,
				React.createElement('i', { className: iconClass.toLowerCase() })
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'span',
					null,
					this.props.category.name
				)
			)
		);
	},
	click: function click() {
		this.props.selectCategory(this.props.category.id);
	}
});

var Ingredient = React.createClass({
	displayName: 'Ingredient',

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'food_selector-ingredient' },
			React.createElement(
				'span',
				null,
				this.props.ingredient.name,
				', ',
				this.props.ingredient.description
			),
			React.createElement(
				'button',
				{ className: 'food_selector-category', onClick: this.add },
				React.createElement(
					'div',
					null,
					React.createElement('i', { className: 'flaticon-add' })
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						'Add'
					)
				)
			)
		);
	},
	add: function add() {
		this.props.add(this.props.ingredient.id);
	}
});

module.exports = FoodSelector;

if (cs.isDevMode('food_selector')) {
	ReactDOM.render(React.createElement(FoodSelector, null), document.getElementById('cont-food_selector'));
}
},{"../../food_categories.js":7,"./food_selector_utils.js":3}],3:[function(require,module,exports){
"use strict";

var foodSelectorUtils = {
	findCategory: function findCategory(foodCategories, id) {
		var category = _.find(foodCategories.sub, { id: id });

		if (category) return category;else {
			if (category.sub) {
				_.each(category.sub, function (category) {
					this.findFoodCategory(category.sub, id);
				});
			} else return;
		}
	},
	// This is the description of the findParentCategory function
	findParentCategory: function findParentCategory(foodCategories, childCategoryId) {
		if (foodCategories.sub) {
			var searchedChild = _.find(foodCategories.sub, { id: childCategoryId });

			if (searchedChild) {
				return foodCategories;
			} else {
				var result = null;

				_.each(foodCategories.sub, function (child) {
					var found = this.findParentCategory(child, childCategoryId);

					if (found) result = found;
				}, this);

				return result;
			}
		} else {
			return null;
		}
	}
};

module.exports = foodSelectorUtils;
},{}],4:[function(require,module,exports){
'use strict';

var Utils = require('./ingredient_list_utils.js');
var Pie = require('../../components/pie/pie.js');

var IngredientList = React.createClass({
	displayName: 'IngredientList',

	getInitialState: function getInitialState() {
		return {
			ingredients: [],
			macros: null
		};
	},
	componentWillMount: function componentWillMount() {
		var _this = this;

		bella.data.ingredients.subscribe(function (ingredients) {
			var macros = ingredients.length > 0 ? Utils.calculateMacros(ingredients) : null;

			_this.setState({
				ingredients: ingredients,
				macros: macros
			});
		});
	},
	render: function render() {
		var foods = _.map(this.state.ingredients, function (ingredient, key) {
			var _this2 = this;

			return React.createElement(
				'div',
				{ key: key },
				React.createElement(
					'span',
					null,
					ingredient.amount.quantity,
					ingredient.amount.unit,
					' ',
					ingredient.food.name
				),
				React.createElement(
					'button',
					{ onClick: function onClick() {
							return _this2.remove(key);
						} },
					'Remove'
				)
			);
		}, this);

		var macros = this.state.macros ? React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				null,
				'ch: ',
				this.state.macros.ch.toFixed(0),
				'%'
			),
			React.createElement(
				'div',
				null,
				'fat: ',
				this.state.macros.fat.toFixed(0),
				'%'
			),
			React.createElement(
				'div',
				null,
				'protein: ',
				this.state.macros.protein.toFixed(0),
				'%'
			)
		) : null;

		return React.createElement(
			'div',
			{ className: 'ingredient-list' },
			foods,
			macros
		);
	},
	remove: function remove(key) {
		var ingredients = bella.data.ingredients.get();
		ingredients.splice(key, 1);
		bella.data.ingredients.set(ingredients);
	}
});

module.exports = IngredientList;

if (cs.isDevMode('ingredient_list')) {
	ReactDOM.render(React.createElement(IngredientList, null), document.getElementById('cont-ingredient_list'));
}
},{"../../components/pie/pie.js":6,"./ingredient_list_utils.js":5}],5:[function(require,module,exports){
"use strict";

var ingredientListUtils = {
	calculateMacros: function calculateMacros(ingredients) {
		var chs = 0;
		var fats = 0;
		var proteins = 0;

		_.each(ingredients, function (ingredient) {
			chs += ingredient.amount.quantity * parseInt(ingredient.food.ch_m);
			fats += ingredient.amount.quantity * parseInt(ingredient.food.fat_m);
			proteins += ingredient.amount.quantity * parseInt(ingredient.food.protein_m);
		});

		var sum = chs + fats + proteins;
		var chPercent = chs / sum * 100;
		var fatPercent = fats / sum * 100;
		var proteinPercent = proteins / sum * 100;

		return {
			ch: chPercent,
			fat: fatPercent,
			protein: proteinPercent
		};
	}
};

module.exports = ingredientListUtils;
},{}],6:[function(require,module,exports){
"use strict";

var Pie = React.createClass({
	displayName: "Pie",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "pie" },
			React.createElement(
				"h2",
				null,
				"Pie"
			),
			React.createElement(
				"div",
				{ className: "pie-segment" },
				"a"
			),
			React.createElement(
				"div",
				{ className: "pie-segment" },
				"b"
			),
			React.createElement(
				"div",
				{ className: "pie-segment" },
				"c"
			)
		);
	}
});

module.exports = Pie;

if (cs.isDevMode('pie')) {
	ReactDOM.render(React.createElement(Pie, null), document.getElementById('cont-pie'));
}
},{}],7:[function(require,module,exports){
'use strict';

var foodCategories = {
	id: 'root',
	root: true,
	sub: [{
		id: 'baked',
		name: 'baked products',
		keto: false,
		sub: [{
			id: 'grainBaked',
			name: 'grain based baked products',
			paleo: false
		}, {
			id: 'grainFreeBaked',
			name: 'grain free baked products'
		}]
	}, {
		id: 'beverages',
		name: 'beverages',
		sub: [{
			id: 'alcoholic',
			name: 'alcoholic',
			keto: false,
			paleo: false,
			sub: [{
				id: 'beer',
				name: 'beer'
			}, {
				id: 'distilled',
				name: 'distilled'
			}, {
				id: 'liquor',
				name: 'liquor'
			}, {
				id: 'wine',
				name: 'wine'
			}]
		}, {
			id: 'coffee',
			name: 'coffee'
		}, {
			id: 'tea',
			name: 'tea'
		}]
	}, {
		id: 'cereal',
		name: 'cereal grains and pasta',
		keto: false,
		paleo: false
	}, {
		id: 'dairyAndEgg',
		name: 'dairy and egg',
		sub: [{
			id: 'dairy',
			name: 'dairy',
			paleo: false
		}, {
			id: 'egg',
			name: 'egg'
		}]
	}, {
		id: 'fatsAndOils',
		name: 'fats and oils',
		sub: [{
			id: 'fats',
			name: 'fats'
		}]
	}, {
		id: 'fish',
		name: 'fish and shellfish'
	}, {
		id: 'fruits',
		name: 'fruits and juices'
	}, {
		id: 'legumes',
		name: 'legumes',
		keto: false,
		paleo: false
	}, {
		id: 'meat',
		name: 'meat',
		sub: [{
			id: 'beef',
			name: 'beef'
		}, {
			id: 'pork',
			name: 'pork'
		}, {
			id: 'poultry',
			name: 'poultry',
			sub: [{
				id: 'chicken',
				name: 'chicken'
			}, {
				id: 'turkey',
				name: 'turkey'
			}, {
				id: 'duck',
				name: 'duck'
			}, {
				id: 'goose',
				name: 'goose'
			}]
		}, {
			id: 'lamb',
			name: 'lamb'
		}, {
			id: 'goat',
			name: 'goat'
		}, {
			id: 'game',
			name: 'game',
			sub: [{
				id: 'deer',
				name: 'deer'
			}, {
				id: 'boar',
				name: 'boar'
			}, {
				id: 'rabbit',
				name: 'rabbit'
			}]
		}]
	}, {
		id: 'nuts',
		name: 'nuts and seeds'
	}, {
		id: 'spices',
		name: 'spices and herbs'
	}, {
		id: 'vegetables',
		name: 'vegetables'
	}]
};

module.exports = foodCategories;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcGFnZXMvbnV0cml0L251dHJpdC5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvZm9vZF9zZWxlY3Rvci9mb29kX3NlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3QuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL3BpZS9waWUuanMiLCJzcmMvc2NyaXB0cy9mb29kX2NhdGVnb3JpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9vZFNlbGVjdG9yID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3IuanMnKTtcbnZhciBJbmdyZWRpZW50TGlzdCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaW5ncmVkaWVudF9saXN0L2luZ3JlZGllbnRfbGlzdC5qcycpO1xuXG52YXIgTnV0cml0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ051dHJpdCcsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnbnV0cml0JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEZvb2RTZWxlY3RvciwgbnVsbClcblx0XHQpO1xuXHR9XG59KTtcblxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTnV0cml0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRfbnV0cml0JykpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvb2RDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi4vLi4vZm9vZF9jYXRlZ29yaWVzLmpzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMnKTtcblxudmFyIEZvb2RTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdGb29kU2VsZWN0b3InLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogZm9vZENhdGVnb3JpZXMsXG5cdFx0XHRmb29kczogW10sXG5cdFx0XHRsb2FkaW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBsaXN0O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHRsaXN0ID0gXy5tYXAodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDYXRlZ29yeSwgeyBjYXRlZ29yeTogY2F0ZWdvcnksIGtleTogY2F0ZWdvcnkuaWQsIHNlbGVjdENhdGVnb3J5OiB0aGlzLnNlbGVjdENhdGVnb3J5IH0pO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxpc3QgPSBfLm1hcCh0aGlzLnN0YXRlLmZvb2RzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCkge1xuXHRcdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHR7IGtleTogaW5ncmVkaWVudC5pZCB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5ncmVkaWVudCwgeyBpbmdyZWRpZW50OiBpbmdyZWRpZW50LCBhZGQ6IHRoaXMuYWRkSW5ncmVkaWVudCB9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRyb2xzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5yb290ID8gbnVsbCA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jb250cm9scycgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmJhY2tCdXR0b25DbGljayB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tcHJldmlvdXMnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdCYWNrJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLnJvb3RCdXR0b25DbGljayB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tcmVmcmVzaCcgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0FsbCBjYXRlZ29yaWVzJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cblx0XHR2YXIgY29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWxpc3QnIH0sXG5cdFx0XHRcdGxpc3Rcblx0XHRcdCksXG5cdFx0XHRjb250cm9sc1xuXHRcdCk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yJyB9LFxuXHRcdFx0dGhpcy5zdGF0ZS5sb2FkaW5nID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdsb2FkaW5nLi4uJ1xuXHRcdFx0KSA6IGNvbnRlbnRcblx0XHQpO1xuXHR9LFxuXHRhZGRJbmdyZWRpZW50OiBmdW5jdGlvbiBhZGRJbmdyZWRpZW50KGlkKSB7XG5cdFx0dmFyIGFtb3VudCA9IHByb21wdCgnUGxlYXNlIGVudGVyIHRoZSBhbW91bnQgb2YgZm9vZCBpbiBncmFtcyEnLCAnMTAwJyk7XG5cblx0XHRpZiAoYW1vdW50KSB7XG5cdFx0XHR2YXIgaW5ncmVkaWVudERhdGEgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdFx0aW5ncmVkaWVudERhdGEucHVzaCh7IGZvb2Q6IF8uZmluZCh0aGlzLnN0YXRlLmZvb2RzLCB7IGlkOiBpZCB9KSwgYW1vdW50OiB7IHF1YW50aXR5OiBwYXJzZUludChhbW91bnQpLCB1bml0OiAnZycgfSB9KTtcblx0XHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnREYXRhKTtcblx0XHR9XG5cdH0sXG5cdHNlbGVjdENhdGVnb3J5OiBmdW5jdGlvbiBzZWxlY3RDYXRlZ29yeShjYXRlZ29yeSkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHR2YXIgc2VsZWN0ZWRDYXRlZ29yeSA9IF8uZmluZCh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1YiwgeyBpZDogY2F0ZWdvcnkgfSk7XG5cblx0XHRpZiAoc2VsZWN0ZWRDYXRlZ29yeS5zdWIpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogc2VsZWN0ZWRDYXRlZ29yeSxcblx0XHRcdFx0Zm9vZHM6IFtdXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3MuZ2V0KCcvZ2V0Zm9vZHM/aWQ9JyArIHNlbGVjdGVkQ2F0ZWdvcnkuaWQsIGZ1bmN0aW9uIChzdGF0dXMsIGZvb2RzKSB7XG5cdFx0XHRcdGlmIChzdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBzZWxlY3RlZENhdGVnb3J5LFxuXHRcdFx0XHRcdFx0Zm9vZHM6IGZvb2RzLFxuXHRcdFx0XHRcdFx0bG9hZGluZzogZmFsc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9KTtcblx0XHR9XG5cdH0sXG5cdGJhY2tCdXR0b25DbGljazogZnVuY3Rpb24gYmFja0J1dHRvbkNsaWNrKCkge1xuXHRcdHZhciBwYXJlbnRDYXRlZ29yeSA9IFV0aWxzLmZpbmRQYXJlbnRDYXRlZ29yeShmb29kQ2F0ZWdvcmllcywgdGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5pZCk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBwYXJlbnRDYXRlZ29yeSxcblx0XHRcdGZvb2RzOiBbXVxuXHRcdH0pO1xuXHR9LFxuXHRyb290QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIHJvb3RCdXR0b25DbGljaygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBmb29kQ2F0ZWdvcmllcyxcblx0XHRcdGZvb2RzOiBbXVxuXHRcdH0pO1xuXHR9XG59KTtcblxudmFyIENhdGVnb3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0NhdGVnb3J5JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgaWNvbkNsYXNzID0gJ2ZsYXRpY29uLScgKyB0aGlzLnByb3BzLmNhdGVnb3J5LmlkO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnYnV0dG9uJyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuY2xpY2sgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6IGljb25DbGFzcy50b0xvd2VyQ2FzZSgpIH0pXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5jYXRlZ29yeS5uYW1lXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHRjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG5cdFx0dGhpcy5wcm9wcy5zZWxlY3RDYXRlZ29yeSh0aGlzLnByb3BzLmNhdGVnb3J5LmlkKTtcblx0fVxufSk7XG5cbnZhciBJbmdyZWRpZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0luZ3JlZGllbnQnLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItaW5ncmVkaWVudCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0dGhpcy5wcm9wcy5pbmdyZWRpZW50Lm5hbWUsXG5cdFx0XHRcdCcsICcsXG5cdFx0XHRcdHRoaXMucHJvcHMuaW5ncmVkaWVudC5kZXNjcmlwdGlvblxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmFkZCB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tYWRkJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQWRkJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdGFkZDogZnVuY3Rpb24gYWRkKCkge1xuXHRcdHRoaXMucHJvcHMuYWRkKHRoaXMucHJvcHMuaW5ncmVkaWVudC5pZCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb2RTZWxlY3RvcjtcblxuaWYgKGNzLmlzRGV2TW9kZSgnZm9vZF9zZWxlY3RvcicpKSB7XG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEZvb2RTZWxlY3RvciwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWZvb2Rfc2VsZWN0b3InKSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmb29kU2VsZWN0b3JVdGlscyA9IHtcblx0ZmluZENhdGVnb3J5OiBmdW5jdGlvbiBmaW5kQ2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIGlkKSB7XG5cdFx0dmFyIGNhdGVnb3J5ID0gXy5maW5kKGZvb2RDYXRlZ29yaWVzLnN1YiwgeyBpZDogaWQgfSk7XG5cblx0XHRpZiAoY2F0ZWdvcnkpIHJldHVybiBjYXRlZ29yeTtlbHNlIHtcblx0XHRcdGlmIChjYXRlZ29yeS5zdWIpIHtcblx0XHRcdFx0Xy5lYWNoKGNhdGVnb3J5LnN1YiwgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0XHRcdFx0dGhpcy5maW5kRm9vZENhdGVnb3J5KGNhdGVnb3J5LnN1YiwgaWQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSByZXR1cm47XG5cdFx0fVxuXHR9LFxuXHQvLyBUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZmluZFBhcmVudENhdGVnb3J5IGZ1bmN0aW9uXG5cdGZpbmRQYXJlbnRDYXRlZ29yeTogZnVuY3Rpb24gZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBjaGlsZENhdGVnb3J5SWQpIHtcblx0XHRpZiAoZm9vZENhdGVnb3JpZXMuc3ViKSB7XG5cdFx0XHR2YXIgc2VhcmNoZWRDaGlsZCA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGNoaWxkQ2F0ZWdvcnlJZCB9KTtcblxuXHRcdFx0aWYgKHNlYXJjaGVkQ2hpbGQpIHtcblx0XHRcdFx0cmV0dXJuIGZvb2RDYXRlZ29yaWVzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0Xy5lYWNoKGZvb2RDYXRlZ29yaWVzLnN1YiwgZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gdGhpcy5maW5kUGFyZW50Q2F0ZWdvcnkoY2hpbGQsIGNoaWxkQ2F0ZWdvcnlJZCk7XG5cblx0XHRcdFx0XHRpZiAoZm91bmQpIHJlc3VsdCA9IGZvdW5kO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZFNlbGVjdG9yVXRpbHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2luZ3JlZGllbnRfbGlzdF91dGlscy5qcycpO1xudmFyIFBpZSA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcGllL3BpZS5qcycpO1xuXG52YXIgSW5ncmVkaWVudExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudExpc3QnLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmdyZWRpZW50czogW10sXG5cdFx0XHRtYWNyb3M6IG51bGxcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zdWJzY3JpYmUoZnVuY3Rpb24gKGluZ3JlZGllbnRzKSB7XG5cdFx0XHR2YXIgbWFjcm9zID0gaW5ncmVkaWVudHMubGVuZ3RoID4gMCA/IFV0aWxzLmNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykgOiBudWxsO1xuXG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGluZ3JlZGllbnRzOiBpbmdyZWRpZW50cyxcblx0XHRcdFx0bWFjcm9zOiBtYWNyb3Ncblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgZm9vZHMgPSBfLm1hcCh0aGlzLnN0YXRlLmluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCwga2V5KSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGtleToga2V5IH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHksXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQudW5pdCxcblx0XHRcdFx0XHQnICcsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5mb29kLm5hbWVcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0XHR7IG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIucmVtb3ZlKGtleSk7XG5cdFx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0J1JlbW92ZSdcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9LCB0aGlzKTtcblxuXHRcdHZhciBtYWNyb3MgPSB0aGlzLnN0YXRlLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5jaC50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2ZhdDogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MuZmF0LnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MucHJvdGVpbi50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdClcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2luZ3JlZGllbnQtbGlzdCcgfSxcblx0XHRcdGZvb2RzLFxuXHRcdFx0bWFjcm9zXG5cdFx0KTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdFx0dmFyIGluZ3JlZGllbnRzID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRpbmdyZWRpZW50cy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50cyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZ3JlZGllbnRMaXN0O1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdpbmdyZWRpZW50X2xpc3QnKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWluZ3JlZGllbnRfbGlzdCcpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluZ3JlZGllbnRMaXN0VXRpbHMgPSB7XG5cdGNhbGN1bGF0ZU1hY3JvczogZnVuY3Rpb24gY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSB7XG5cdFx0dmFyIGNocyA9IDA7XG5cdFx0dmFyIGZhdHMgPSAwO1xuXHRcdHZhciBwcm90ZWlucyA9IDA7XG5cblx0XHRfLmVhY2goaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRjaHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuY2hfbSk7XG5cdFx0XHRmYXRzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmZhdF9tKTtcblx0XHRcdHByb3RlaW5zICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLnByb3RlaW5fbSk7XG5cdFx0fSk7XG5cblx0XHR2YXIgc3VtID0gY2hzICsgZmF0cyArIHByb3RlaW5zO1xuXHRcdHZhciBjaFBlcmNlbnQgPSBjaHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIGZhdFBlcmNlbnQgPSBmYXRzIC8gc3VtICogMTAwO1xuXHRcdHZhciBwcm90ZWluUGVyY2VudCA9IHByb3RlaW5zIC8gc3VtICogMTAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoOiBjaFBlcmNlbnQsXG5cdFx0XHRmYXQ6IGZhdFBlcmNlbnQsXG5cdFx0XHRwcm90ZWluOiBwcm90ZWluUGVyY2VudFxuXHRcdH07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5ncmVkaWVudExpc3RVdGlsczsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUGllXCIsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcImRpdlwiLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwicGllXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiaDJcIixcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XCJQaWVcIlxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZS1zZWdtZW50XCIgfSxcblx0XHRcdFx0XCJhXCJcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcImRpdlwiLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogXCJwaWUtc2VnbWVudFwiIH0sXG5cdFx0XHRcdFwiYlwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0eyBjbGFzc05hbWU6IFwicGllLXNlZ21lbnRcIiB9LFxuXHRcdFx0XHRcImNcIlxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcblxuaWYgKGNzLmlzRGV2TW9kZSgncGllJykpIHtcblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcGllJykpO1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvb2RDYXRlZ29yaWVzID0ge1xuXHRpZDogJ3Jvb3QnLFxuXHRyb290OiB0cnVlLFxuXHRzdWI6IFt7XG5cdFx0aWQ6ICdiYWtlZCcsXG5cdFx0bmFtZTogJ2Jha2VkIHByb2R1Y3RzJyxcblx0XHRrZXRvOiBmYWxzZSxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2dyYWluQmFrZWQnLFxuXHRcdFx0bmFtZTogJ2dyYWluIGJhc2VkIGJha2VkIHByb2R1Y3RzJyxcblx0XHRcdHBhbGVvOiBmYWxzZVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ3JhaW5GcmVlQmFrZWQnLFxuXHRcdFx0bmFtZTogJ2dyYWluIGZyZWUgYmFrZWQgcHJvZHVjdHMnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnYmV2ZXJhZ2VzJyxcblx0XHRuYW1lOiAnYmV2ZXJhZ2VzJyxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2FsY29ob2xpYycsXG5cdFx0XHRuYW1lOiAnYWxjb2hvbGljJyxcblx0XHRcdGtldG86IGZhbHNlLFxuXHRcdFx0cGFsZW86IGZhbHNlLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2JlZXInLFxuXHRcdFx0XHRuYW1lOiAnYmVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdkaXN0aWxsZWQnLFxuXHRcdFx0XHRuYW1lOiAnZGlzdGlsbGVkJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2xpcXVvcicsXG5cdFx0XHRcdG5hbWU6ICdsaXF1b3InXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnd2luZScsXG5cdFx0XHRcdG5hbWU6ICd3aW5lJ1xuXHRcdFx0fV1cblx0XHR9LCB7XG5cdFx0XHRpZDogJ2NvZmZlZScsXG5cdFx0XHRuYW1lOiAnY29mZmVlJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAndGVhJyxcblx0XHRcdG5hbWU6ICd0ZWEnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnY2VyZWFsJyxcblx0XHRuYW1lOiAnY2VyZWFsIGdyYWlucyBhbmQgcGFzdGEnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdkYWlyeUFuZEVnZycsXG5cdFx0bmFtZTogJ2RhaXJ5IGFuZCBlZ2cnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZGFpcnknLFxuXHRcdFx0bmFtZTogJ2RhaXJ5Jyxcblx0XHRcdHBhbGVvOiBmYWxzZVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnZWdnJyxcblx0XHRcdG5hbWU6ICdlZ2cnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnZmF0c0FuZE9pbHMnLFxuXHRcdG5hbWU6ICdmYXRzIGFuZCBvaWxzJyxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2ZhdHMnLFxuXHRcdFx0bmFtZTogJ2ZhdHMnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnZmlzaCcsXG5cdFx0bmFtZTogJ2Zpc2ggYW5kIHNoZWxsZmlzaCdcblx0fSwge1xuXHRcdGlkOiAnZnJ1aXRzJyxcblx0XHRuYW1lOiAnZnJ1aXRzIGFuZCBqdWljZXMnXG5cdH0sIHtcblx0XHRpZDogJ2xlZ3VtZXMnLFxuXHRcdG5hbWU6ICdsZWd1bWVzJyxcblx0XHRrZXRvOiBmYWxzZSxcblx0XHRwYWxlbzogZmFsc2Vcblx0fSwge1xuXHRcdGlkOiAnbWVhdCcsXG5cdFx0bmFtZTogJ21lYXQnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYmVlZicsXG5cdFx0XHRuYW1lOiAnYmVlZidcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvcmsnLFxuXHRcdFx0bmFtZTogJ3BvcmsnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdwb3VsdHJ5Jyxcblx0XHRcdG5hbWU6ICdwb3VsdHJ5Jyxcblx0XHRcdHN1YjogW3tcblx0XHRcdFx0aWQ6ICdjaGlja2VuJyxcblx0XHRcdFx0bmFtZTogJ2NoaWNrZW4nXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAndHVya2V5Jyxcblx0XHRcdFx0bmFtZTogJ3R1cmtleSdcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdkdWNrJyxcblx0XHRcdFx0bmFtZTogJ2R1Y2snXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnZ29vc2UnLFxuXHRcdFx0XHRuYW1lOiAnZ29vc2UnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnbGFtYicsXG5cdFx0XHRuYW1lOiAnbGFtYidcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dvYXQnLFxuXHRcdFx0bmFtZTogJ2dvYXQnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdnYW1lJyxcblx0XHRcdG5hbWU6ICdnYW1lJyxcblx0XHRcdHN1YjogW3tcblx0XHRcdFx0aWQ6ICdkZWVyJyxcblx0XHRcdFx0bmFtZTogJ2RlZXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnYm9hcicsXG5cdFx0XHRcdG5hbWU6ICdib2FyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ3JhYmJpdCcsXG5cdFx0XHRcdG5hbWU6ICdyYWJiaXQnXG5cdFx0XHR9XVxuXHRcdH1dXG5cdH0sIHtcblx0XHRpZDogJ251dHMnLFxuXHRcdG5hbWU6ICdudXRzIGFuZCBzZWVkcydcblx0fSwge1xuXHRcdGlkOiAnc3BpY2VzJyxcblx0XHRuYW1lOiAnc3BpY2VzIGFuZCBoZXJicydcblx0fSwge1xuXHRcdGlkOiAndmVnZXRhYmxlcycsXG5cdFx0bmFtZTogJ3ZlZ2V0YWJsZXMnXG5cdH1dXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZvb2RDYXRlZ29yaWVzOyJdfQ==
