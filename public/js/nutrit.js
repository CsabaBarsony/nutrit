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
			canvas
		);
	},
	drawPie: function drawPie() {
		var canvas = ReactDOM.findDOMNode(this.refs.canvas);
		if (canvas) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNyYy9zY3JpcHRzL3BhZ2VzL251dHJpdC9udXRyaXQuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2Zvb2Rfc2VsZWN0b3IvZm9vZF9zZWxlY3Rvci5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvZm9vZF9zZWxlY3Rvci9mb29kX3NlbGVjdG9yX3V0aWxzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIiwic3JjL3NjcmlwdHMvZm9vZF9jYXRlZ29yaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBGb29kU2VsZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2Zvb2Rfc2VsZWN0b3IvZm9vZF9zZWxlY3Rvci5qcycpO1xudmFyIEluZ3JlZGllbnRMaXN0ID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzJyk7XG5cbnZhciBOdXRyaXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTnV0cml0JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdudXRyaXQnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnRMaXN0LCBudWxsKSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vZFNlbGVjdG9yLCBudWxsKVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChOdXRyaXQsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1udXRyaXQnKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuLi8uLi9mb29kX2NhdGVnb3JpZXMuanMnKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vZm9vZF9zZWxlY3Rvcl91dGlscy5qcycpO1xuXG52YXIgRm9vZFNlbGVjdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0Zvb2RTZWxlY3RvcicsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBmb29kQ2F0ZWdvcmllcyxcblx0XHRcdGZvb2RzOiBbXSxcblx0XHRcdGxvYWRpbmc6IGZhbHNlXG5cdFx0fTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGxpc3Q7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIpIHtcblx0XHRcdGxpc3QgPSBfLm1hcCh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1YiwgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENhdGVnb3J5LCB7IGNhdGVnb3J5OiBjYXRlZ29yeSwga2V5OiBjYXRlZ29yeS5pZCwgc2VsZWN0Q2F0ZWdvcnk6IHRoaXMuc2VsZWN0Q2F0ZWdvcnkgfSk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUuZm9vZHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdHsga2V5OiBpbmdyZWRpZW50LmlkIH0sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50LCB7IGluZ3JlZGllbnQ6IGluZ3JlZGllbnQsIGFkZDogdGhpcy5hZGRJbmdyZWRpZW50IH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9XG5cblx0XHR2YXIgY29udHJvbHMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnJvb3QgPyBudWxsIDogUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNvbnRyb2xzJyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuYmFja0J1dHRvbkNsaWNrIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1wcmV2aW91cycgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0JhY2snXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMucm9vdEJ1dHRvbkNsaWNrIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1yZWZyZXNoJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQWxsIGNhdGVnb3JpZXMnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblxuXHRcdHZhciBjb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItbGlzdCcgfSxcblx0XHRcdFx0bGlzdFxuXHRcdFx0KSxcblx0XHRcdGNvbnRyb2xzXG5cdFx0KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3InIH0sXG5cdFx0XHR0aGlzLnN0YXRlLmxvYWRpbmcgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2xvYWRpbmcuLi4nXG5cdFx0XHQpIDogY29udGVudFxuXHRcdCk7XG5cdH0sXG5cdGFkZEluZ3JlZGllbnQ6IGZ1bmN0aW9uIGFkZEluZ3JlZGllbnQoaWQpIHtcblx0XHR2YXIgYW1vdW50ID0gcHJvbXB0KCdQbGVhc2UgZW50ZXIgdGhlIGFtb3VudCBvZiBmb29kIGluIGdyYW1zIScsICcxMDAnKTtcblxuXHRcdGlmIChhbW91bnQpIHtcblx0XHRcdHZhciBpbmdyZWRpZW50RGF0YSA9IGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuZ2V0KCk7XG5cdFx0XHRpbmdyZWRpZW50RGF0YS5wdXNoKHsgZm9vZDogXy5maW5kKHRoaXMuc3RhdGUuZm9vZHMsIHsgaWQ6IGlkIH0pLCBhbW91bnQ6IHsgcXVhbnRpdHk6IHBhcnNlSW50KGFtb3VudCksIHVuaXQ6ICdnJyB9IH0pO1xuXHRcdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zZXQoaW5ncmVkaWVudERhdGEpO1xuXHRcdH1cblx0fSxcblx0c2VsZWN0Q2F0ZWdvcnk6IGZ1bmN0aW9uIHNlbGVjdENhdGVnb3J5KGNhdGVnb3J5KSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdHZhciBzZWxlY3RlZENhdGVnb3J5ID0gXy5maW5kKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViLCB7IGlkOiBjYXRlZ29yeSB9KTtcblxuXHRcdGlmIChzZWxlY3RlZENhdGVnb3J5LnN1Yikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBzZWxlY3RlZENhdGVnb3J5LFxuXHRcdFx0XHRmb29kczogW11cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcy5nZXQoJy9nZXRmb29kcz9pZD0nICsgc2VsZWN0ZWRDYXRlZ29yeS5pZCwgZnVuY3Rpb24gKHN0YXR1cywgZm9vZHMpIHtcblx0XHRcdFx0aWYgKHN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHNlbGVjdGVkQ2F0ZWdvcnksXG5cdFx0XHRcdFx0XHRmb29kczogZm9vZHMsXG5cdFx0XHRcdFx0XHRsb2FkaW5nOiBmYWxzZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBsb2FkaW5nOiB0cnVlIH0pO1xuXHRcdH1cblx0fSxcblx0YmFja0J1dHRvbkNsaWNrOiBmdW5jdGlvbiBiYWNrQnV0dG9uQ2xpY2soKSB7XG5cdFx0dmFyIHBhcmVudENhdGVnb3J5ID0gVXRpbHMuZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCB0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LmlkKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHBhcmVudENhdGVnb3J5LFxuXHRcdFx0Zm9vZHM6IFtdXG5cdFx0fSk7XG5cdH0sXG5cdHJvb3RCdXR0b25DbGljazogZnVuY3Rpb24gcm9vdEJ1dHRvbkNsaWNrKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IGZvb2RDYXRlZ29yaWVzLFxuXHRcdFx0Zm9vZHM6IFtdXG5cdFx0fSk7XG5cdH1cbn0pO1xuXG52YXIgQ2F0ZWdvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnQ2F0ZWdvcnknLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBpY29uQ2xhc3MgPSAnZmxhdGljb24tJyArIHRoaXMucHJvcHMuY2F0ZWdvcnkuaWQ7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdidXR0b24nLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5jbGljayB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogaWNvbkNsYXNzLnRvTG93ZXJDYXNlKCkgfSlcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHR0aGlzLnByb3BzLmNhdGVnb3J5Lm5hbWVcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcblx0XHR0aGlzLnByb3BzLnNlbGVjdENhdGVnb3J5KHRoaXMucHJvcHMuY2F0ZWdvcnkuaWQpO1xuXHR9XG59KTtcblxudmFyIEluZ3JlZGllbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudCcsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1pbmdyZWRpZW50JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHR0aGlzLnByb3BzLmluZ3JlZGllbnQubmFtZSxcblx0XHRcdFx0JywgJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5pbmdyZWRpZW50LmRlc2NyaXB0aW9uXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuYWRkIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1hZGQnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdBZGQnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0YWRkOiBmdW5jdGlvbiBhZGQoKSB7XG5cdFx0dGhpcy5wcm9wcy5hZGQodGhpcy5wcm9wcy5pbmdyZWRpZW50LmlkKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9vZFNlbGVjdG9yO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdmb29kX3NlbGVjdG9yJykpIHtcblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vZFNlbGVjdG9yLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtZm9vZF9zZWxlY3RvcicpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGZvb2RTZWxlY3RvclV0aWxzID0ge1xuXHRmaW5kQ2F0ZWdvcnk6IGZ1bmN0aW9uIGZpbmRDYXRlZ29yeShmb29kQ2F0ZWdvcmllcywgaWQpIHtcblx0XHR2YXIgY2F0ZWdvcnkgPSBfLmZpbmQoZm9vZENhdGVnb3JpZXMuc3ViLCB7IGlkOiBpZCB9KTtcblxuXHRcdGlmIChjYXRlZ29yeSkgcmV0dXJuIGNhdGVnb3J5O2Vsc2Uge1xuXHRcdFx0aWYgKGNhdGVnb3J5LnN1Yikge1xuXHRcdFx0XHRfLmVhY2goY2F0ZWdvcnkuc3ViLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRcdFx0XHR0aGlzLmZpbmRGb29kQ2F0ZWdvcnkoY2F0ZWdvcnkuc3ViLCBpZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHJldHVybjtcblx0XHR9XG5cdH0sXG5cdGZpbmRQYXJlbnRDYXRlZ29yeTogZnVuY3Rpb24gZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBjaGlsZENhdGVnb3J5SWQpIHtcblx0XHRpZiAoZm9vZENhdGVnb3JpZXMuc3ViKSB7XG5cdFx0XHR2YXIgc2VhcmNoZWRDaGlsZCA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGNoaWxkQ2F0ZWdvcnlJZCB9KTtcblxuXHRcdFx0aWYgKHNlYXJjaGVkQ2hpbGQpIHtcblx0XHRcdFx0cmV0dXJuIGZvb2RDYXRlZ29yaWVzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0Xy5lYWNoKGZvb2RDYXRlZ29yaWVzLnN1YiwgZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gdGhpcy5maW5kUGFyZW50Q2F0ZWdvcnkoY2hpbGQsIGNoaWxkQ2F0ZWdvcnlJZCk7XG5cblx0XHRcdFx0XHRpZiAoZm91bmQpIHJlc3VsdCA9IGZvdW5kO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZFNlbGVjdG9yVXRpbHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2luZ3JlZGllbnRfbGlzdF91dGlscy5qcycpO1xudmFyIFBpZSA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcGllL3BpZS5qcycpO1xuXG52YXIgSW5ncmVkaWVudExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudExpc3QnLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmdyZWRpZW50czogW10sXG5cdFx0XHRtYWNyb3M6IG51bGxcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zdWJzY3JpYmUoZnVuY3Rpb24gKGluZ3JlZGllbnRzKSB7XG5cdFx0XHR2YXIgbWFjcm9zID0gaW5ncmVkaWVudHMubGVuZ3RoID4gMCA/IFV0aWxzLmNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykgOiBudWxsO1xuXG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGluZ3JlZGllbnRzOiBpbmdyZWRpZW50cyxcblx0XHRcdFx0bWFjcm9zOiBtYWNyb3Ncblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgZm9vZHMgPSBfLm1hcCh0aGlzLnN0YXRlLmluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCwga2V5KSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGtleToga2V5IH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHksXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQudW5pdCxcblx0XHRcdFx0XHQnICcsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5mb29kLm5hbWVcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0XHR7IG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIucmVtb3ZlKGtleSk7XG5cdFx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0J1JlbW92ZSdcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9LCB0aGlzKTtcblxuXHRcdHZhciBtYWNyb3MgPSB0aGlzLnN0YXRlLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5jaC50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2ZhdDogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MuZmF0LnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MucHJvdGVpbi50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdClcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2luZ3JlZGllbnQtbGlzdCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogdGhpcy5zdGF0ZS5tYWNyb3MgfSksXG5cdFx0XHRmb29kcyxcblx0XHRcdG1hY3Jvc1xuXHRcdCk7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xuXHRcdHZhciBpbmdyZWRpZW50cyA9IGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuZ2V0KCk7XG5cdFx0aW5ncmVkaWVudHMuc3BsaWNlKGtleSwgMSk7XG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zZXQoaW5ncmVkaWVudHMpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbmdyZWRpZW50TGlzdDtcblxuaWYgKGNzLmlzRGV2TW9kZSgnaW5ncmVkaWVudF9saXN0JykpIHtcblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5ncmVkaWVudExpc3QsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1pbmdyZWRpZW50X2xpc3QnKSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbmdyZWRpZW50TGlzdFV0aWxzID0ge1xuXHRjYWxjdWxhdGVNYWNyb3M6IGZ1bmN0aW9uIGNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykge1xuXHRcdHZhciBjaHMgPSAwO1xuXHRcdHZhciBmYXRzID0gMDtcblx0XHR2YXIgcHJvdGVpbnMgPSAwO1xuXG5cdFx0Xy5lYWNoKGluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCkge1xuXHRcdFx0Y2hzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmNoX20pO1xuXHRcdFx0ZmF0cyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5mYXRfbSk7XG5cdFx0XHRwcm90ZWlucyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5wcm90ZWluX20pO1xuXHRcdH0pO1xuXG5cdFx0dmFyIHN1bSA9IGNocyArIGZhdHMgKyBwcm90ZWlucztcblx0XHR2YXIgY2hQZXJjZW50ID0gY2hzIC8gc3VtICogMTAwO1xuXHRcdHZhciBmYXRQZXJjZW50ID0gZmF0cyAvIHN1bSAqIDEwMDtcblx0XHR2YXIgcHJvdGVpblBlcmNlbnQgPSBwcm90ZWlucyAvIHN1bSAqIDEwMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRjaDogY2hQZXJjZW50LFxuXHRcdFx0ZmF0OiBmYXRQZXJjZW50LFxuXHRcdFx0cHJvdGVpbjogcHJvdGVpblBlcmNlbnRcblx0XHR9O1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluZ3JlZGllbnRMaXN0VXRpbHM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQaWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiBcIlBpZVwiLFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR0aGlzLmRyYXdQaWUoKTtcblx0fSxcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG5cdFx0dGhpcy5kcmF3UGllKCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjYW52YXMgPSB0aGlzLnByb3BzLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiwgeyBpZDogXCJwaWUtY2FudmFzXCIsIHJlZjogXCJjYW52YXNcIiwgd2lkdGg6IFwiMjAwXCIsIGhlaWdodDogXCIyMDBcIiB9KSA6IG51bGw7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiZGl2XCIsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJwaWVcIiB9LFxuXHRcdFx0Y2FudmFzXG5cdFx0KTtcblx0fSxcblx0ZHJhd1BpZTogZnVuY3Rpb24gZHJhd1BpZSgpIHtcblx0XHR2YXIgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmNhbnZhcyk7XG5cdFx0aWYgKGNhbnZhcykge1xuXHRcdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGNlbnRlclggPSAxMDA7XG5cdFx0XHR2YXIgY2VudGVyWSA9IDEwMDtcblx0XHRcdHZhciBhbmdsZVplcm9YID0gMjAwO1xuXHRcdFx0dmFyIGFuZ2xlWmVyb1kgPSAxMDA7XG5cdFx0XHR2YXIgcmFkaXVzID0gMTAwO1xuXHRcdFx0dmFyIGFuZ2xlRmF0ID0gdGhpcy5wcm9wcy5tYWNyb3MuZmF0IC8gNTA7XG5cdFx0XHR2YXIgYW5nbGVQcm90ZWluID0gdGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpbiAvIDUwO1xuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcblx0XHRcdGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdibHVlJztcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0XHRjdHgubGluZVRvKGFuZ2xlWmVyb1gsIGFuZ2xlWmVyb1kpO1xuXHRcdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIGFuZ2xlRmF0ICogTWF0aC5QSSk7XG5cdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHgubW92ZVRvKGNlbnRlclgsIGNlbnRlclkpO1xuXHRcdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGFuZ2xlRmF0ICogTWF0aC5QSSwgKGFuZ2xlRmF0ICsgYW5nbGVQcm90ZWluKSAqIE1hdGguUEkpO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcblxuaWYgKGNzLmlzRGV2TW9kZSgncGllJykpIHtcblx0dmFyIG1hY3JvcyA9IHtcblx0XHRjaDogMTAsXG5cdFx0ZmF0OiAyMCxcblx0XHRwcm90ZWluOiA3MFxuXHR9O1xuXG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFBpZSwgeyBtYWNyb3M6IG1hY3JvcyB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcGllJykpO1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvb2RDYXRlZ29yaWVzID0ge1xuXHRpZDogJ3Jvb3QnLFxuXHRyb290OiB0cnVlLFxuXHRzdWI6IFt7XG5cdFx0aWQ6ICdiYWtlZCcsXG5cdFx0bmFtZTogJ2Jha2VkIHByb2R1Y3RzJyxcblx0XHRrZXRvOiBmYWxzZSxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2dyYWluQmFrZWQnLFxuXHRcdFx0bmFtZTogJ2dyYWluIGJhc2VkIGJha2VkIHByb2R1Y3RzJyxcblx0XHRcdHBhbGVvOiBmYWxzZVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ3JhaW5GcmVlQmFrZWQnLFxuXHRcdFx0bmFtZTogJ2dyYWluIGZyZWUgYmFrZWQgcHJvZHVjdHMnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnYmV2ZXJhZ2VzJyxcblx0XHRuYW1lOiAnYmV2ZXJhZ2VzJyxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2FsY29ob2xpYycsXG5cdFx0XHRuYW1lOiAnYWxjb2hvbGljJyxcblx0XHRcdGtldG86IGZhbHNlLFxuXHRcdFx0cGFsZW86IGZhbHNlLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2JlZXInLFxuXHRcdFx0XHRuYW1lOiAnYmVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdkaXN0aWxsZWQnLFxuXHRcdFx0XHRuYW1lOiAnZGlzdGlsbGVkJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2xpcXVvcicsXG5cdFx0XHRcdG5hbWU6ICdsaXF1b3InXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnd2luZScsXG5cdFx0XHRcdG5hbWU6ICd3aW5lJ1xuXHRcdFx0fV1cblx0XHR9LCB7XG5cdFx0XHRpZDogJ2NvZmZlZScsXG5cdFx0XHRuYW1lOiAnY29mZmVlJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAndGVhJyxcblx0XHRcdG5hbWU6ICd0ZWEnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnY2VyZWFsJyxcblx0XHRuYW1lOiAnY2VyZWFsIGdyYWlucyBhbmQgcGFzdGEnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdkYWlyeUFuZEVnZycsXG5cdFx0bmFtZTogJ2RhaXJ5IGFuZCBlZ2cnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZGFpcnknLFxuXHRcdFx0bmFtZTogJ2RhaXJ5Jyxcblx0XHRcdHBhbGVvOiBmYWxzZVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnZWdnJyxcblx0XHRcdG5hbWU6ICdlZ2cnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnZmF0c0FuZE9pbHMnLFxuXHRcdG5hbWU6ICdmYXRzIGFuZCBvaWxzJyxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2ZhdHMnLFxuXHRcdFx0bmFtZTogJ2ZhdHMnXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnZmlzaCcsXG5cdFx0bmFtZTogJ2Zpc2ggYW5kIHNoZWxsZmlzaCdcblx0fSwge1xuXHRcdGlkOiAnZnJ1aXRzJyxcblx0XHRuYW1lOiAnZnJ1aXRzIGFuZCBqdWljZXMnXG5cdH0sIHtcblx0XHRpZDogJ2xlZ3VtZXMnLFxuXHRcdG5hbWU6ICdsZWd1bWVzJyxcblx0XHRrZXRvOiBmYWxzZSxcblx0XHRwYWxlbzogZmFsc2Vcblx0fSwge1xuXHRcdGlkOiAnbWVhdCcsXG5cdFx0bmFtZTogJ21lYXQnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYmVlZicsXG5cdFx0XHRuYW1lOiAnYmVlZidcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvcmsnLFxuXHRcdFx0bmFtZTogJ3BvcmsnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdwb3VsdHJ5Jyxcblx0XHRcdG5hbWU6ICdwb3VsdHJ5Jyxcblx0XHRcdHN1YjogW3tcblx0XHRcdFx0aWQ6ICdjaGlja2VuJyxcblx0XHRcdFx0bmFtZTogJ2NoaWNrZW4nXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAndHVya2V5Jyxcblx0XHRcdFx0bmFtZTogJ3R1cmtleSdcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdkdWNrJyxcblx0XHRcdFx0bmFtZTogJ2R1Y2snXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnZ29vc2UnLFxuXHRcdFx0XHRuYW1lOiAnZ29vc2UnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnbGFtYicsXG5cdFx0XHRuYW1lOiAnbGFtYidcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dvYXQnLFxuXHRcdFx0bmFtZTogJ2dvYXQnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdnYW1lJyxcblx0XHRcdG5hbWU6ICdnYW1lJyxcblx0XHRcdHN1YjogW3tcblx0XHRcdFx0aWQ6ICdkZWVyJyxcblx0XHRcdFx0bmFtZTogJ2RlZXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnYm9hcicsXG5cdFx0XHRcdG5hbWU6ICdib2FyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ3JhYmJpdCcsXG5cdFx0XHRcdG5hbWU6ICdyYWJiaXQnXG5cdFx0XHR9XVxuXHRcdH1dXG5cdH0sIHtcblx0XHRpZDogJ251dHMnLFxuXHRcdG5hbWU6ICdudXRzIGFuZCBzZWVkcydcblx0fSwge1xuXHRcdGlkOiAnc3BpY2VzJyxcblx0XHRuYW1lOiAnc3BpY2VzIGFuZCBoZXJicydcblx0fSwge1xuXHRcdGlkOiAndmVnZXRhYmxlcycsXG5cdFx0bmFtZTogJ3ZlZ2V0YWJsZXMnXG5cdH1dXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZvb2RDYXRlZ29yaWVzOyJdfQ==
