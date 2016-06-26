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

ReactDOM.render(React.createElement(Nutrit, null), document.getElementById('cont-nutrit'));
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
'use strict';

var Pie = React.createClass({
	displayName: 'Pie',

	componentDidMount: function componentDidMount() {
		var canvas = React.findDOMNode(this.refs.canvas);
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#a0c';
		ctx.fillRect(10, 10, 50, 10);
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'pie' },
			React.createElement(
				'div',
				{ className: 'pie-segment pie-ch' },
				'ch: ',
				this.props.macros.ch
			),
			React.createElement(
				'div',
				{ className: 'pie-segment pie-fat' },
				'fat: ',
				this.props.macros.fat
			),
			React.createElement(
				'div',
				{ className: 'pie-segment pie-protein' },
				'protein: ',
				this.props.macros.protein
			),
			React.createElement('canvas', { id: 'pie-canvas', ref: 'canvas', width: '200', height: '100' })
		);
	}
});

module.exports = Pie;

if (cs.isDevMode('pie')) {
	var macros = {
		ch: 20,
		fat: 20,
		protein: 70
	};

	ReactDOM.render(React.createElement(Pie, { macros: macros }), document.getElementById('cont-pie'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcGFnZXMvbnV0cml0L251dHJpdC5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvZm9vZF9zZWxlY3Rvci9mb29kX3NlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3QuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL3BpZS9waWUuanMiLCJzcmMvc2NyaXB0cy9mb29kX2NhdGVnb3JpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBGb29kU2VsZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2Zvb2Rfc2VsZWN0b3IvZm9vZF9zZWxlY3Rvci5qcycpO1xudmFyIEluZ3JlZGllbnRMaXN0ID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzJyk7XG5cbnZhciBOdXRyaXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTnV0cml0JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdudXRyaXQnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnRMaXN0LCBudWxsKSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vZFNlbGVjdG9yLCBudWxsKVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChOdXRyaXQsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1udXRyaXQnKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuLi8uLi9mb29kX2NhdGVnb3JpZXMuanMnKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vZm9vZF9zZWxlY3Rvcl91dGlscy5qcycpO1xuXG52YXIgRm9vZFNlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0Zvb2RTZWxlY3RvcicsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBmb29kQ2F0ZWdvcmllcyxcblx0XHRcdGZvb2RzOiBbXSxcblx0XHRcdGxvYWRpbmc6IGZhbHNlXG5cdFx0fTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGxpc3Q7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIpIHtcblx0XHRcdGxpc3QgPSBfLm1hcCh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1YiwgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENhdGVnb3J5LCB7IGNhdGVnb3J5OiBjYXRlZ29yeSwga2V5OiBjYXRlZ29yeS5pZCwgc2VsZWN0Q2F0ZWdvcnk6IHRoaXMuc2VsZWN0Q2F0ZWdvcnkgfSk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUuZm9vZHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdHsga2V5OiBpbmdyZWRpZW50LmlkIH0sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50LCB7IGluZ3JlZGllbnQ6IGluZ3JlZGllbnQsIGFkZDogdGhpcy5hZGRJbmdyZWRpZW50IH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9XG5cblx0XHR2YXIgY29udHJvbHMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnJvb3QgPyBudWxsIDogUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNvbnRyb2xzJyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuYmFja0J1dHRvbkNsaWNrIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1wcmV2aW91cycgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0JhY2snXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMucm9vdEJ1dHRvbkNsaWNrIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1yZWZyZXNoJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQWxsIGNhdGVnb3JpZXMnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblxuXHRcdHZhciBjb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItbGlzdCcgfSxcblx0XHRcdFx0bGlzdFxuXHRcdFx0KSxcblx0XHRcdGNvbnRyb2xzXG5cdFx0KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3InIH0sXG5cdFx0XHR0aGlzLnN0YXRlLmxvYWRpbmcgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2xvYWRpbmcuLi4nXG5cdFx0XHQpIDogY29udGVudFxuXHRcdCk7XG5cdH0sXG5cdGFkZEluZ3JlZGllbnQ6IGZ1bmN0aW9uIGFkZEluZ3JlZGllbnQoaWQpIHtcblx0XHR2YXIgYW1vdW50ID0gcHJvbXB0KCdQbGVhc2UgZW50ZXIgdGhlIGFtb3VudCBvZiBmb29kIGluIGdyYW1zIScsICcxMDAnKTtcblxuXHRcdGlmIChhbW91bnQpIHtcblx0XHRcdHZhciBpbmdyZWRpZW50RGF0YSA9IGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuZ2V0KCk7XG5cdFx0XHRpbmdyZWRpZW50RGF0YS5wdXNoKHsgZm9vZDogXy5maW5kKHRoaXMuc3RhdGUuZm9vZHMsIHsgaWQ6IGlkIH0pLCBhbW91bnQ6IHsgcXVhbnRpdHk6IHBhcnNlSW50KGFtb3VudCksIHVuaXQ6ICdnJyB9IH0pO1xuXHRcdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zZXQoaW5ncmVkaWVudERhdGEpO1xuXHRcdH1cblx0fSxcblx0c2VsZWN0Q2F0ZWdvcnk6IGZ1bmN0aW9uIHNlbGVjdENhdGVnb3J5KGNhdGVnb3J5KSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdHZhciBzZWxlY3RlZENhdGVnb3J5ID0gXy5maW5kKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViLCB7IGlkOiBjYXRlZ29yeSB9KTtcblxuXHRcdGlmIChzZWxlY3RlZENhdGVnb3J5LnN1Yikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBzZWxlY3RlZENhdGVnb3J5LFxuXHRcdFx0XHRmb29kczogW11cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcy5nZXQoJy9nZXRmb29kcz9pZD0nICsgc2VsZWN0ZWRDYXRlZ29yeS5pZCwgZnVuY3Rpb24gKHN0YXR1cywgZm9vZHMpIHtcblx0XHRcdFx0aWYgKHN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHNlbGVjdGVkQ2F0ZWdvcnksXG5cdFx0XHRcdFx0XHRmb29kczogZm9vZHMsXG5cdFx0XHRcdFx0XHRsb2FkaW5nOiBmYWxzZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBsb2FkaW5nOiB0cnVlIH0pO1xuXHRcdH1cblx0fSxcblx0YmFja0J1dHRvbkNsaWNrOiBmdW5jdGlvbiBiYWNrQnV0dG9uQ2xpY2soKSB7XG5cdFx0dmFyIHBhcmVudENhdGVnb3J5ID0gVXRpbHMuZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCB0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LmlkKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHBhcmVudENhdGVnb3J5LFxuXHRcdFx0Zm9vZHM6IFtdXG5cdFx0fSk7XG5cdH0sXG5cdHJvb3RCdXR0b25DbGljazogZnVuY3Rpb24gcm9vdEJ1dHRvbkNsaWNrKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IGZvb2RDYXRlZ29yaWVzLFxuXHRcdFx0Zm9vZHM6IFtdXG5cdFx0fSk7XG5cdH1cbn0pO1xuXG52YXIgQ2F0ZWdvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnQ2F0ZWdvcnknLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBpY29uQ2xhc3MgPSAnZmxhdGljb24tJyArIHRoaXMucHJvcHMuY2F0ZWdvcnkuaWQ7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdidXR0b24nLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5jbGljayB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogaWNvbkNsYXNzLnRvTG93ZXJDYXNlKCkgfSlcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHR0aGlzLnByb3BzLmNhdGVnb3J5Lm5hbWVcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcblx0XHR0aGlzLnByb3BzLnNlbGVjdENhdGVnb3J5KHRoaXMucHJvcHMuY2F0ZWdvcnkuaWQpO1xuXHR9XG59KTtcblxudmFyIEluZ3JlZGllbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudCcsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1pbmdyZWRpZW50JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHR0aGlzLnByb3BzLmluZ3JlZGllbnQubmFtZSxcblx0XHRcdFx0JywgJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5pbmdyZWRpZW50LmRlc2NyaXB0aW9uXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuYWRkIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1hZGQnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdBZGQnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0YWRkOiBmdW5jdGlvbiBhZGQoKSB7XG5cdFx0dGhpcy5wcm9wcy5hZGQodGhpcy5wcm9wcy5pbmdyZWRpZW50LmlkKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9vZFNlbGVjdG9yO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdmb29kX3NlbGVjdG9yJykpIHtcblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vZFNlbGVjdG9yLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtZm9vZF9zZWxlY3RvcicpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGZvb2RTZWxlY3RvclV0aWxzID0ge1xuXHRmaW5kQ2F0ZWdvcnk6IGZ1bmN0aW9uIGZpbmRDYXRlZ29yeShmb29kQ2F0ZWdvcmllcywgaWQpIHtcblx0XHR2YXIgY2F0ZWdvcnkgPSBfLmZpbmQoZm9vZENhdGVnb3JpZXMuc3ViLCB7IGlkOiBpZCB9KTtcblxuXHRcdGlmIChjYXRlZ29yeSkgcmV0dXJuIGNhdGVnb3J5O2Vsc2Uge1xuXHRcdFx0aWYgKGNhdGVnb3J5LnN1Yikge1xuXHRcdFx0XHRfLmVhY2goY2F0ZWdvcnkuc3ViLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRcdFx0XHR0aGlzLmZpbmRGb29kQ2F0ZWdvcnkoY2F0ZWdvcnkuc3ViLCBpZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHJldHVybjtcblx0XHR9XG5cdH0sXG5cdGZpbmRQYXJlbnRDYXRlZ29yeTogZnVuY3Rpb24gZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBjaGlsZENhdGVnb3J5SWQpIHtcblx0XHRpZiAoZm9vZENhdGVnb3JpZXMuc3ViKSB7XG5cdFx0XHR2YXIgc2VhcmNoZWRDaGlsZCA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGNoaWxkQ2F0ZWdvcnlJZCB9KTtcblxuXHRcdFx0aWYgKHNlYXJjaGVkQ2hpbGQpIHtcblx0XHRcdFx0cmV0dXJuIGZvb2RDYXRlZ29yaWVzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0Xy5lYWNoKGZvb2RDYXRlZ29yaWVzLnN1YiwgZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gdGhpcy5maW5kUGFyZW50Q2F0ZWdvcnkoY2hpbGQsIGNoaWxkQ2F0ZWdvcnlJZCk7XG5cblx0XHRcdFx0XHRpZiAoZm91bmQpIHJlc3VsdCA9IGZvdW5kO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZFNlbGVjdG9yVXRpbHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2luZ3JlZGllbnRfbGlzdF91dGlscy5qcycpO1xudmFyIFBpZSA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcGllL3BpZS5qcycpO1xuXG52YXIgSW5ncmVkaWVudExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudExpc3QnLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmdyZWRpZW50czogW10sXG5cdFx0XHRtYWNyb3M6IG51bGxcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zdWJzY3JpYmUoZnVuY3Rpb24gKGluZ3JlZGllbnRzKSB7XG5cdFx0XHR2YXIgbWFjcm9zID0gaW5ncmVkaWVudHMubGVuZ3RoID4gMCA/IFV0aWxzLmNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykgOiBudWxsO1xuXG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGluZ3JlZGllbnRzOiBpbmdyZWRpZW50cyxcblx0XHRcdFx0bWFjcm9zOiBtYWNyb3Ncblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgZm9vZHMgPSBfLm1hcCh0aGlzLnN0YXRlLmluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCwga2V5KSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGtleToga2V5IH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHksXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQudW5pdCxcblx0XHRcdFx0XHQnICcsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5mb29kLm5hbWVcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0XHR7IG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIucmVtb3ZlKGtleSk7XG5cdFx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0J1JlbW92ZSdcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9LCB0aGlzKTtcblxuXHRcdHZhciBtYWNyb3MgPSB0aGlzLnN0YXRlLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5jaC50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2ZhdDogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MuZmF0LnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MucHJvdGVpbi50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdClcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2luZ3JlZGllbnQtbGlzdCcgfSxcblx0XHRcdGZvb2RzLFxuXHRcdFx0bWFjcm9zXG5cdFx0KTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdFx0dmFyIGluZ3JlZGllbnRzID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRpbmdyZWRpZW50cy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50cyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZ3JlZGllbnRMaXN0O1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdpbmdyZWRpZW50X2xpc3QnKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWluZ3JlZGllbnRfbGlzdCcpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluZ3JlZGllbnRMaXN0VXRpbHMgPSB7XG5cdGNhbGN1bGF0ZU1hY3JvczogZnVuY3Rpb24gY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSB7XG5cdFx0dmFyIGNocyA9IDA7XG5cdFx0dmFyIGZhdHMgPSAwO1xuXHRcdHZhciBwcm90ZWlucyA9IDA7XG5cblx0XHRfLmVhY2goaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRjaHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuY2hfbSk7XG5cdFx0XHRmYXRzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmZhdF9tKTtcblx0XHRcdHByb3RlaW5zICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLnByb3RlaW5fbSk7XG5cdFx0fSk7XG5cblx0XHR2YXIgc3VtID0gY2hzICsgZmF0cyArIHByb3RlaW5zO1xuXHRcdHZhciBjaFBlcmNlbnQgPSBjaHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIGZhdFBlcmNlbnQgPSBmYXRzIC8gc3VtICogMTAwO1xuXHRcdHZhciBwcm90ZWluUGVyY2VudCA9IHByb3RlaW5zIC8gc3VtICogMTAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoOiBjaFBlcmNlbnQsXG5cdFx0XHRmYXQ6IGZhdFBlcmNlbnQsXG5cdFx0XHRwcm90ZWluOiBwcm90ZWluUGVyY2VudFxuXHRcdH07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5ncmVkaWVudExpc3RVdGlsczsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQaWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUGllJyxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dmFyIGNhbnZhcyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpO1xuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjdHguZmlsbFN0eWxlID0gJyNhMGMnO1xuXHRcdGN0eC5maWxsUmVjdCgxMCwgMTAsIDUwLCAxMCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ3BpZScgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1jaCcgfSxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5jaFxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1mYXQnIH0sXG5cdFx0XHRcdCdmYXQ6ICcsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLmZhdFxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1wcm90ZWluJyB9LFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpblxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycsIHsgaWQ6ICdwaWUtY2FudmFzJywgcmVmOiAnY2FudmFzJywgd2lkdGg6ICcyMDAnLCBoZWlnaHQ6ICcxMDAnIH0pXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAyMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSB7XG5cdGlkOiAncm9vdCcsXG5cdHJvb3Q6IHRydWUsXG5cdHN1YjogW3tcblx0XHRpZDogJ2Jha2VkJyxcblx0XHRuYW1lOiAnYmFrZWQgcHJvZHVjdHMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZ3JhaW5CYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gYmFzZWQgYmFrZWQgcHJvZHVjdHMnLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdncmFpbkZyZWVCYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gZnJlZSBiYWtlZCBwcm9kdWN0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdiZXZlcmFnZXMnLFxuXHRcdG5hbWU6ICdiZXZlcmFnZXMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYWxjb2hvbGljJyxcblx0XHRcdG5hbWU6ICdhbGNvaG9saWMnLFxuXHRcdFx0a2V0bzogZmFsc2UsXG5cdFx0XHRwYWxlbzogZmFsc2UsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnYmVlcicsXG5cdFx0XHRcdG5hbWU6ICdiZWVyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2Rpc3RpbGxlZCcsXG5cdFx0XHRcdG5hbWU6ICdkaXN0aWxsZWQnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnbGlxdW9yJyxcblx0XHRcdFx0bmFtZTogJ2xpcXVvcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd3aW5lJyxcblx0XHRcdFx0bmFtZTogJ3dpbmUnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnY29mZmVlJyxcblx0XHRcdG5hbWU6ICdjb2ZmZWUnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICd0ZWEnLFxuXHRcdFx0bmFtZTogJ3RlYSdcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdjZXJlYWwnLFxuXHRcdG5hbWU6ICdjZXJlYWwgZ3JhaW5zIGFuZCBwYXN0YScsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0cGFsZW86IGZhbHNlXG5cdH0sIHtcblx0XHRpZDogJ2RhaXJ5QW5kRWdnJyxcblx0XHRuYW1lOiAnZGFpcnkgYW5kIGVnZycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdkYWlyeScsXG5cdFx0XHRuYW1lOiAnZGFpcnknLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdlZ2cnLFxuXHRcdFx0bmFtZTogJ2VnZydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmYXRzQW5kT2lscycsXG5cdFx0bmFtZTogJ2ZhdHMgYW5kIG9pbHMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZmF0cycsXG5cdFx0XHRuYW1lOiAnZmF0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmaXNoJyxcblx0XHRuYW1lOiAnZmlzaCBhbmQgc2hlbGxmaXNoJ1xuXHR9LCB7XG5cdFx0aWQ6ICdmcnVpdHMnLFxuXHRcdG5hbWU6ICdmcnVpdHMgYW5kIGp1aWNlcydcblx0fSwge1xuXHRcdGlkOiAnbGVndW1lcycsXG5cdFx0bmFtZTogJ2xlZ3VtZXMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdtZWF0Jyxcblx0XHRuYW1lOiAnbWVhdCcsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdiZWVmJyxcblx0XHRcdG5hbWU6ICdiZWVmJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAncG9yaycsXG5cdFx0XHRuYW1lOiAncG9yaydcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvdWx0cnknLFxuXHRcdFx0bmFtZTogJ3BvdWx0cnknLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2NoaWNrZW4nLFxuXHRcdFx0XHRuYW1lOiAnY2hpY2tlbidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd0dXJrZXknLFxuXHRcdFx0XHRuYW1lOiAndHVya2V5J1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2R1Y2snLFxuXHRcdFx0XHRuYW1lOiAnZHVjaydcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdnb29zZScsXG5cdFx0XHRcdG5hbWU6ICdnb29zZSdcblx0XHRcdH1dXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdsYW1iJyxcblx0XHRcdG5hbWU6ICdsYW1iJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ29hdCcsXG5cdFx0XHRuYW1lOiAnZ29hdCdcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dhbWUnLFxuXHRcdFx0bmFtZTogJ2dhbWUnLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2RlZXInLFxuXHRcdFx0XHRuYW1lOiAnZGVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdib2FyJyxcblx0XHRcdFx0bmFtZTogJ2JvYXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAncmFiYml0Jyxcblx0XHRcdFx0bmFtZTogJ3JhYmJpdCdcblx0XHRcdH1dXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnbnV0cycsXG5cdFx0bmFtZTogJ251dHMgYW5kIHNlZWRzJ1xuXHR9LCB7XG5cdFx0aWQ6ICdzcGljZXMnLFxuXHRcdG5hbWU6ICdzcGljZXMgYW5kIGhlcmJzJ1xuXHR9LCB7XG5cdFx0aWQ6ICd2ZWdldGFibGVzJyxcblx0XHRuYW1lOiAndmVnZXRhYmxlcydcblx0fV1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZENhdGVnb3JpZXM7Il19
