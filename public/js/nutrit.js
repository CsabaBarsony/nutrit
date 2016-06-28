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
			React.createElement(Pie, { macros: this.state.macros }),
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

	componentDidMount: function componentDidMount() {
		this.drawPie();
	},
	componentDidUpdate: function componentDidUpdate() {
		this.drawPie();
	},
	render: function render() {
		var canvas = this.props.macros ? React.createElement("canvas", { id: "pie-canvas", ref: "canvas", width: "200", height: "200" }) : null;

		return React.createElement(
			"div",
			{ className: "pie" },
			"canvas"
		);
	},
	drawPie: function drawPie() {
		if (this.props.macros) {
			// Error, did not draw canvas yet
			var canvas = ReactDOM.findDOMNode(this.refs.canvas);
			var ctx = canvas.getContext('2d');
			var centerX = 100;
			var centerY = 100;
			var angleZeroX = 200;
			var angleZeroY = 100;
			var radius = 100;
			var angleFat = this.props.macros.fat / 50;
			var angleProtein = this.props.macros.protein / 50;

			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'green';
			ctx.fill();
			ctx.closePath();

			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.lineTo(angleZeroX, angleZeroY);
			ctx.arc(centerX, centerY, radius, 0, angleFat * Math.PI);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius, angleFat * Math.PI, (angleFat + angleProtein) * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}
});

module.exports = Pie;

if (cs.isDevMode('pie')) {
	var macros = {
		ch: 10,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcGFnZXMvbnV0cml0L251dHJpdC5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvZm9vZF9zZWxlY3Rvci9mb29kX3NlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3QuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL3BpZS9waWUuanMiLCJzcmMvc2NyaXB0cy9mb29kX2NhdGVnb3JpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9vZFNlbGVjdG9yID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3IuanMnKTtcbnZhciBJbmdyZWRpZW50TGlzdCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvaW5ncmVkaWVudF9saXN0L2luZ3JlZGllbnRfbGlzdC5qcycpO1xuXG52YXIgTnV0cml0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ051dHJpdCcsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnbnV0cml0JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEZvb2RTZWxlY3RvciwgbnVsbClcblx0XHQpO1xuXHR9XG59KTtcblxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTnV0cml0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtbnV0cml0JykpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvb2RDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi4vLi4vZm9vZF9jYXRlZ29yaWVzLmpzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMnKTtcblxudmFyIEZvb2RTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdGb29kU2VsZWN0b3InLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogZm9vZENhdGVnb3JpZXMsXG5cdFx0XHRmb29kczogW10sXG5cdFx0XHRsb2FkaW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBsaXN0O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHRsaXN0ID0gXy5tYXAodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDYXRlZ29yeSwgeyBjYXRlZ29yeTogY2F0ZWdvcnksIGtleTogY2F0ZWdvcnkuaWQsIHNlbGVjdENhdGVnb3J5OiB0aGlzLnNlbGVjdENhdGVnb3J5IH0pO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxpc3QgPSBfLm1hcCh0aGlzLnN0YXRlLmZvb2RzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCkge1xuXHRcdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHR7IGtleTogaW5ncmVkaWVudC5pZCB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5ncmVkaWVudCwgeyBpbmdyZWRpZW50OiBpbmdyZWRpZW50LCBhZGQ6IHRoaXMuYWRkSW5ncmVkaWVudCB9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRyb2xzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5yb290ID8gbnVsbCA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jb250cm9scycgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmJhY2tCdXR0b25DbGljayB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tcHJldmlvdXMnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdCYWNrJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLnJvb3RCdXR0b25DbGljayB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tcmVmcmVzaCcgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0FsbCBjYXRlZ29yaWVzJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cblx0XHR2YXIgY29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWxpc3QnIH0sXG5cdFx0XHRcdGxpc3Rcblx0XHRcdCksXG5cdFx0XHRjb250cm9sc1xuXHRcdCk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yJyB9LFxuXHRcdFx0dGhpcy5zdGF0ZS5sb2FkaW5nID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdsb2FkaW5nLi4uJ1xuXHRcdFx0KSA6IGNvbnRlbnRcblx0XHQpO1xuXHR9LFxuXHRhZGRJbmdyZWRpZW50OiBmdW5jdGlvbiBhZGRJbmdyZWRpZW50KGlkKSB7XG5cdFx0dmFyIGFtb3VudCA9IHByb21wdCgnUGxlYXNlIGVudGVyIHRoZSBhbW91bnQgb2YgZm9vZCBpbiBncmFtcyEnLCAnMTAwJyk7XG5cblx0XHRpZiAoYW1vdW50KSB7XG5cdFx0XHR2YXIgaW5ncmVkaWVudERhdGEgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdFx0aW5ncmVkaWVudERhdGEucHVzaCh7IGZvb2Q6IF8uZmluZCh0aGlzLnN0YXRlLmZvb2RzLCB7IGlkOiBpZCB9KSwgYW1vdW50OiB7IHF1YW50aXR5OiBwYXJzZUludChhbW91bnQpLCB1bml0OiAnZycgfSB9KTtcblx0XHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnREYXRhKTtcblx0XHR9XG5cdH0sXG5cdHNlbGVjdENhdGVnb3J5OiBmdW5jdGlvbiBzZWxlY3RDYXRlZ29yeShjYXRlZ29yeSkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHR2YXIgc2VsZWN0ZWRDYXRlZ29yeSA9IF8uZmluZCh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1YiwgeyBpZDogY2F0ZWdvcnkgfSk7XG5cblx0XHRpZiAoc2VsZWN0ZWRDYXRlZ29yeS5zdWIpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogc2VsZWN0ZWRDYXRlZ29yeSxcblx0XHRcdFx0Zm9vZHM6IFtdXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3MuZ2V0KCcvZ2V0Zm9vZHM/aWQ9JyArIHNlbGVjdGVkQ2F0ZWdvcnkuaWQsIGZ1bmN0aW9uIChzdGF0dXMsIGZvb2RzKSB7XG5cdFx0XHRcdGlmIChzdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBzZWxlY3RlZENhdGVnb3J5LFxuXHRcdFx0XHRcdFx0Zm9vZHM6IGZvb2RzLFxuXHRcdFx0XHRcdFx0bG9hZGluZzogZmFsc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9KTtcblx0XHR9XG5cdH0sXG5cdGJhY2tCdXR0b25DbGljazogZnVuY3Rpb24gYmFja0J1dHRvbkNsaWNrKCkge1xuXHRcdHZhciBwYXJlbnRDYXRlZ29yeSA9IFV0aWxzLmZpbmRQYXJlbnRDYXRlZ29yeShmb29kQ2F0ZWdvcmllcywgdGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5pZCk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBwYXJlbnRDYXRlZ29yeSxcblx0XHRcdGZvb2RzOiBbXVxuXHRcdH0pO1xuXHR9LFxuXHRyb290QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIHJvb3RCdXR0b25DbGljaygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBmb29kQ2F0ZWdvcmllcyxcblx0XHRcdGZvb2RzOiBbXVxuXHRcdH0pO1xuXHR9XG59KTtcblxudmFyIENhdGVnb3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0NhdGVnb3J5JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgaWNvbkNsYXNzID0gJ2ZsYXRpY29uLScgKyB0aGlzLnByb3BzLmNhdGVnb3J5LmlkO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnYnV0dG9uJyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuY2xpY2sgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6IGljb25DbGFzcy50b0xvd2VyQ2FzZSgpIH0pXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5jYXRlZ29yeS5uYW1lXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHRjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG5cdFx0dGhpcy5wcm9wcy5zZWxlY3RDYXRlZ29yeSh0aGlzLnByb3BzLmNhdGVnb3J5LmlkKTtcblx0fVxufSk7XG5cbnZhciBJbmdyZWRpZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0luZ3JlZGllbnQnLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItaW5ncmVkaWVudCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0dGhpcy5wcm9wcy5pbmdyZWRpZW50Lm5hbWUsXG5cdFx0XHRcdCcsICcsXG5cdFx0XHRcdHRoaXMucHJvcHMuaW5ncmVkaWVudC5kZXNjcmlwdGlvblxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmFkZCB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tYWRkJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQWRkJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdGFkZDogZnVuY3Rpb24gYWRkKCkge1xuXHRcdHRoaXMucHJvcHMuYWRkKHRoaXMucHJvcHMuaW5ncmVkaWVudC5pZCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb2RTZWxlY3RvcjtcblxuaWYgKGNzLmlzRGV2TW9kZSgnZm9vZF9zZWxlY3RvcicpKSB7XG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEZvb2RTZWxlY3RvciwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWZvb2Rfc2VsZWN0b3InKSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmb29kU2VsZWN0b3JVdGlscyA9IHtcblx0ZmluZENhdGVnb3J5OiBmdW5jdGlvbiBmaW5kQ2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIGlkKSB7XG5cdFx0dmFyIGNhdGVnb3J5ID0gXy5maW5kKGZvb2RDYXRlZ29yaWVzLnN1YiwgeyBpZDogaWQgfSk7XG5cblx0XHRpZiAoY2F0ZWdvcnkpIHJldHVybiBjYXRlZ29yeTtlbHNlIHtcblx0XHRcdGlmIChjYXRlZ29yeS5zdWIpIHtcblx0XHRcdFx0Xy5lYWNoKGNhdGVnb3J5LnN1YiwgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0XHRcdFx0dGhpcy5maW5kRm9vZENhdGVnb3J5KGNhdGVnb3J5LnN1YiwgaWQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSByZXR1cm47XG5cdFx0fVxuXHR9LFxuXHRmaW5kUGFyZW50Q2F0ZWdvcnk6IGZ1bmN0aW9uIGZpbmRQYXJlbnRDYXRlZ29yeShmb29kQ2F0ZWdvcmllcywgY2hpbGRDYXRlZ29yeUlkKSB7XG5cdFx0aWYgKGZvb2RDYXRlZ29yaWVzLnN1Yikge1xuXHRcdFx0dmFyIHNlYXJjaGVkQ2hpbGQgPSBfLmZpbmQoZm9vZENhdGVnb3JpZXMuc3ViLCB7IGlkOiBjaGlsZENhdGVnb3J5SWQgfSk7XG5cblx0XHRcdGlmIChzZWFyY2hlZENoaWxkKSB7XG5cdFx0XHRcdHJldHVybiBmb29kQ2F0ZWdvcmllcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBudWxsO1xuXG5cdFx0XHRcdF8uZWFjaChmb29kQ2F0ZWdvcmllcy5zdWIsIGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0XHRcdHZhciBmb3VuZCA9IHRoaXMuZmluZFBhcmVudENhdGVnb3J5KGNoaWxkLCBjaGlsZENhdGVnb3J5SWQpO1xuXG5cdFx0XHRcdFx0aWYgKGZvdW5kKSByZXN1bHQgPSBmb3VuZDtcblx0XHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZvb2RTZWxlY3RvclV0aWxzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMnKTtcbnZhciBQaWUgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3BpZS9waWUuanMnKTtcblxudmFyIEluZ3JlZGllbnRMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0luZ3JlZGllbnRMaXN0JyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5ncmVkaWVudHM6IFtdLFxuXHRcdFx0bWFjcm9zOiBudWxsXG5cdFx0fTtcblx0fSxcblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc3Vic2NyaWJlKGZ1bmN0aW9uIChpbmdyZWRpZW50cykge1xuXHRcdFx0dmFyIG1hY3JvcyA9IGluZ3JlZGllbnRzLmxlbmd0aCA+IDAgPyBVdGlscy5jYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIDogbnVsbDtcblxuXHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpbmdyZWRpZW50czogaW5ncmVkaWVudHMsXG5cdFx0XHRcdG1hY3JvczogbWFjcm9zXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGZvb2RzID0gXy5tYXAodGhpcy5zdGF0ZS5pbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQsIGtleSkge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBrZXk6IGtleSB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5LFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuYW1vdW50LnVuaXQsXG5cdFx0XHRcdFx0JyAnLFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuZm9vZC5uYW1lXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdFx0eyBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXMyLnJlbW92ZShrZXkpO1xuXHRcdFx0XHRcdFx0fSB9LFxuXHRcdFx0XHRcdCdSZW1vdmUnXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fSwgdGhpcyk7XG5cblx0XHR2YXIgbWFjcm9zID0gdGhpcy5zdGF0ZS5tYWNyb3MgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdjaDogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MuY2gudG9GaXhlZCgwKSxcblx0XHRcdFx0JyUnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdmYXQ6ICcsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLmZhdC50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J3Byb3RlaW46ICcsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLnByb3RlaW4udG9GaXhlZCgwKSxcblx0XHRcdFx0JyUnXG5cdFx0XHQpXG5cdFx0KSA6IG51bGw7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdpbmdyZWRpZW50LWxpc3QnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFBpZSwgeyBtYWNyb3M6IHRoaXMuc3RhdGUubWFjcm9zIH0pLFxuXHRcdFx0Zm9vZHMsXG5cdFx0XHRtYWNyb3Ncblx0XHQpO1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0XHR2YXIgaW5ncmVkaWVudHMgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdGluZ3JlZGllbnRzLnNwbGljZShrZXksIDEpO1xuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnRzKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5ncmVkaWVudExpc3Q7XG5cbmlmIChjcy5pc0Rldk1vZGUoJ2luZ3JlZGllbnRfbGlzdCcpKSB7XG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnRMaXN0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtaW5ncmVkaWVudF9saXN0JykpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaW5ncmVkaWVudExpc3RVdGlscyA9IHtcblx0Y2FsY3VsYXRlTWFjcm9zOiBmdW5jdGlvbiBjYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIHtcblx0XHR2YXIgY2hzID0gMDtcblx0XHR2YXIgZmF0cyA9IDA7XG5cdFx0dmFyIHByb3RlaW5zID0gMDtcblxuXHRcdF8uZWFjaChpbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQpIHtcblx0XHRcdGNocyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5jaF9tKTtcblx0XHRcdGZhdHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuZmF0X20pO1xuXHRcdFx0cHJvdGVpbnMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QucHJvdGVpbl9tKTtcblx0XHR9KTtcblxuXHRcdHZhciBzdW0gPSBjaHMgKyBmYXRzICsgcHJvdGVpbnM7XG5cdFx0dmFyIGNoUGVyY2VudCA9IGNocyAvIHN1bSAqIDEwMDtcblx0XHR2YXIgZmF0UGVyY2VudCA9IGZhdHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIHByb3RlaW5QZXJjZW50ID0gcHJvdGVpbnMgLyBzdW0gKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2g6IGNoUGVyY2VudCxcblx0XHRcdGZhdDogZmF0UGVyY2VudCxcblx0XHRcdHByb3RlaW46IHByb3RlaW5QZXJjZW50XG5cdFx0fTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbmdyZWRpZW50TGlzdFV0aWxzOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUGllID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogXCJQaWVcIixcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dGhpcy5kcmF3UGllKCk7XG5cdH0sXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuXHRcdHRoaXMuZHJhd1BpZSgpO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2FudmFzID0gdGhpcy5wcm9wcy5tYWNyb3MgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIsIHsgaWQ6IFwicGllLWNhbnZhc1wiLCByZWY6IFwiY2FudmFzXCIsIHdpZHRoOiBcIjIwMFwiLCBoZWlnaHQ6IFwiMjAwXCIgfSkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcImRpdlwiLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwicGllXCIgfSxcblx0XHRcdFwiY2FudmFzXCJcblx0XHQpO1xuXHR9LFxuXHRkcmF3UGllOiBmdW5jdGlvbiBkcmF3UGllKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLm1hY3Jvcykge1xuXHRcdFx0Ly8gRXJyb3IsIGRpZCBub3QgZHJhdyBjYW52YXMgeWV0XG5cdFx0XHR2YXIgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmNhbnZhcyk7XG5cdFx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgY2VudGVyWCA9IDEwMDtcblx0XHRcdHZhciBjZW50ZXJZID0gMTAwO1xuXHRcdFx0dmFyIGFuZ2xlWmVyb1ggPSAyMDA7XG5cdFx0XHR2YXIgYW5nbGVaZXJvWSA9IDEwMDtcblx0XHRcdHZhciByYWRpdXMgPSAxMDA7XG5cdFx0XHR2YXIgYW5nbGVGYXQgPSB0aGlzLnByb3BzLm1hY3Jvcy5mYXQgLyA1MDtcblx0XHRcdHZhciBhbmdsZVByb3RlaW4gPSB0aGlzLnByb3BzLm1hY3Jvcy5wcm90ZWluIC8gNTA7XG5cblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4Lm1vdmVUbyhjZW50ZXJYLCBjZW50ZXJZKTtcblx0XHRcdGN0eC5saW5lVG8oYW5nbGVaZXJvWCwgYW5nbGVaZXJvWSk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgYW5nbGVGYXQgKiBNYXRoLlBJKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdGN0eC5maWxsKCk7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmVkJztcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVGYXQgKiBNYXRoLlBJLCAoYW5nbGVGYXQgKyBhbmdsZVByb3RlaW4pICogTWF0aC5QSSk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAxMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSB7XG5cdGlkOiAncm9vdCcsXG5cdHJvb3Q6IHRydWUsXG5cdHN1YjogW3tcblx0XHRpZDogJ2Jha2VkJyxcblx0XHRuYW1lOiAnYmFrZWQgcHJvZHVjdHMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZ3JhaW5CYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gYmFzZWQgYmFrZWQgcHJvZHVjdHMnLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdncmFpbkZyZWVCYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gZnJlZSBiYWtlZCBwcm9kdWN0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdiZXZlcmFnZXMnLFxuXHRcdG5hbWU6ICdiZXZlcmFnZXMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYWxjb2hvbGljJyxcblx0XHRcdG5hbWU6ICdhbGNvaG9saWMnLFxuXHRcdFx0a2V0bzogZmFsc2UsXG5cdFx0XHRwYWxlbzogZmFsc2UsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnYmVlcicsXG5cdFx0XHRcdG5hbWU6ICdiZWVyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2Rpc3RpbGxlZCcsXG5cdFx0XHRcdG5hbWU6ICdkaXN0aWxsZWQnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnbGlxdW9yJyxcblx0XHRcdFx0bmFtZTogJ2xpcXVvcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd3aW5lJyxcblx0XHRcdFx0bmFtZTogJ3dpbmUnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnY29mZmVlJyxcblx0XHRcdG5hbWU6ICdjb2ZmZWUnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICd0ZWEnLFxuXHRcdFx0bmFtZTogJ3RlYSdcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdjZXJlYWwnLFxuXHRcdG5hbWU6ICdjZXJlYWwgZ3JhaW5zIGFuZCBwYXN0YScsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0cGFsZW86IGZhbHNlXG5cdH0sIHtcblx0XHRpZDogJ2RhaXJ5QW5kRWdnJyxcblx0XHRuYW1lOiAnZGFpcnkgYW5kIGVnZycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdkYWlyeScsXG5cdFx0XHRuYW1lOiAnZGFpcnknLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdlZ2cnLFxuXHRcdFx0bmFtZTogJ2VnZydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmYXRzQW5kT2lscycsXG5cdFx0bmFtZTogJ2ZhdHMgYW5kIG9pbHMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZmF0cycsXG5cdFx0XHRuYW1lOiAnZmF0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmaXNoJyxcblx0XHRuYW1lOiAnZmlzaCBhbmQgc2hlbGxmaXNoJ1xuXHR9LCB7XG5cdFx0aWQ6ICdmcnVpdHMnLFxuXHRcdG5hbWU6ICdmcnVpdHMgYW5kIGp1aWNlcydcblx0fSwge1xuXHRcdGlkOiAnbGVndW1lcycsXG5cdFx0bmFtZTogJ2xlZ3VtZXMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdtZWF0Jyxcblx0XHRuYW1lOiAnbWVhdCcsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdiZWVmJyxcblx0XHRcdG5hbWU6ICdiZWVmJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAncG9yaycsXG5cdFx0XHRuYW1lOiAncG9yaydcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvdWx0cnknLFxuXHRcdFx0bmFtZTogJ3BvdWx0cnknLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2NoaWNrZW4nLFxuXHRcdFx0XHRuYW1lOiAnY2hpY2tlbidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd0dXJrZXknLFxuXHRcdFx0XHRuYW1lOiAndHVya2V5J1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2R1Y2snLFxuXHRcdFx0XHRuYW1lOiAnZHVjaydcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdnb29zZScsXG5cdFx0XHRcdG5hbWU6ICdnb29zZSdcblx0XHRcdH1dXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdsYW1iJyxcblx0XHRcdG5hbWU6ICdsYW1iJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ29hdCcsXG5cdFx0XHRuYW1lOiAnZ29hdCdcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dhbWUnLFxuXHRcdFx0bmFtZTogJ2dhbWUnLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2RlZXInLFxuXHRcdFx0XHRuYW1lOiAnZGVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdib2FyJyxcblx0XHRcdFx0bmFtZTogJ2JvYXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAncmFiYml0Jyxcblx0XHRcdFx0bmFtZTogJ3JhYmJpdCdcblx0XHRcdH1dXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnbnV0cycsXG5cdFx0bmFtZTogJ251dHMgYW5kIHNlZWRzJ1xuXHR9LCB7XG5cdFx0aWQ6ICdzcGljZXMnLFxuXHRcdG5hbWU6ICdzcGljZXMgYW5kIGhlcmJzJ1xuXHR9LCB7XG5cdFx0aWQ6ICd2ZWdldGFibGVzJyxcblx0XHRuYW1lOiAndmVnZXRhYmxlcydcblx0fV1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZENhdGVnb3JpZXM7Il19
