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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcGFnZXMvbnV0cml0L251dHJpdC5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvZm9vZF9zZWxlY3Rvci9mb29kX3NlbGVjdG9yLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3QuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL3BpZS9waWUuanMiLCJzcmMvc2NyaXB0cy9mb29kX2NhdGVnb3JpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEZvb2RTZWxlY3RvciA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvZm9vZF9zZWxlY3Rvci9mb29kX3NlbGVjdG9yLmpzJyk7XG52YXIgSW5ncmVkaWVudExpc3QgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2luZ3JlZGllbnRfbGlzdC9pbmdyZWRpZW50X2xpc3QuanMnKTtcblxudmFyIE51dHJpdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdOdXRyaXQnLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ251dHJpdCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5ncmVkaWVudExpc3QsIG51bGwpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChGb29kU2VsZWN0b3IsIG51bGwpXG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KE51dHJpdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LW51dHJpdCcpKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb29kQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uLy4uL2Zvb2RfY2F0ZWdvcmllcy5qcycpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9mb29kX3NlbGVjdG9yX3V0aWxzLmpzJyk7XG5cbnZhciBGb29kU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnRm9vZFNlbGVjdG9yJyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IGZvb2RDYXRlZ29yaWVzLFxuXHRcdFx0Zm9vZHM6IFtdLFxuXHRcdFx0bG9hZGluZzogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgbGlzdDtcblxuXHRcdGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1Yikge1xuXHRcdFx0bGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2F0ZWdvcnksIHsgY2F0ZWdvcnk6IGNhdGVnb3J5LCBrZXk6IGNhdGVnb3J5LmlkLCBzZWxlY3RDYXRlZ29yeTogdGhpcy5zZWxlY3RDYXRlZ29yeSB9KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsaXN0ID0gXy5tYXAodGhpcy5zdGF0ZS5mb29kcywgZnVuY3Rpb24gKGluZ3JlZGllbnQpIHtcblx0XHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0eyBrZXk6IGluZ3JlZGllbnQuaWQgfSxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnQsIHsgaW5ncmVkaWVudDogaW5ncmVkaWVudCwgYWRkOiB0aGlzLmFkZEluZ3JlZGllbnQgfSlcblx0XHRcdFx0KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdHZhciBjb250cm9scyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkucm9vdCA/IG51bGwgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY29udHJvbHMnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5iYWNrQnV0dG9uQ2xpY2sgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2ZsYXRpY29uLXByZXZpb3VzJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQmFjaydcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5yb290QnV0dG9uQ2xpY2sgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2ZsYXRpY29uLXJlZnJlc2gnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdBbGwgY2F0ZWdvcmllcydcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXG5cdFx0dmFyIGNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1saXN0JyB9LFxuXHRcdFx0XHRsaXN0XG5cdFx0XHQpLFxuXHRcdFx0Y29udHJvbHNcblx0XHQpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3RvcicgfSxcblx0XHRcdHRoaXMuc3RhdGUubG9hZGluZyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnbG9hZGluZy4uLidcblx0XHRcdCkgOiBjb250ZW50XG5cdFx0KTtcblx0fSxcblx0YWRkSW5ncmVkaWVudDogZnVuY3Rpb24gYWRkSW5ncmVkaWVudChpZCkge1xuXHRcdHZhciBhbW91bnQgPSBwcm9tcHQoJ1BsZWFzZSBlbnRlciB0aGUgYW1vdW50IG9mIGZvb2QgaW4gZ3JhbXMhJywgJzEwMCcpO1xuXG5cdFx0aWYgKGFtb3VudCkge1xuXHRcdFx0dmFyIGluZ3JlZGllbnREYXRhID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRcdGluZ3JlZGllbnREYXRhLnB1c2goeyBmb29kOiBfLmZpbmQodGhpcy5zdGF0ZS5mb29kcywgeyBpZDogaWQgfSksIGFtb3VudDogeyBxdWFudGl0eTogcGFyc2VJbnQoYW1vdW50KSwgdW5pdDogJ2cnIH0gfSk7XG5cdFx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50RGF0YSk7XG5cdFx0fVxuXHR9LFxuXHRzZWxlY3RDYXRlZ29yeTogZnVuY3Rpb24gc2VsZWN0Q2F0ZWdvcnkoY2F0ZWdvcnkpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0dmFyIHNlbGVjdGVkQ2F0ZWdvcnkgPSBfLmZpbmQodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIsIHsgaWQ6IGNhdGVnb3J5IH0pO1xuXG5cdFx0aWYgKHNlbGVjdGVkQ2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHNlbGVjdGVkQ2F0ZWdvcnksXG5cdFx0XHRcdGZvb2RzOiBbXVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNzLmdldCgnL2dldGZvb2RzP2lkPScgKyBzZWxlY3RlZENhdGVnb3J5LmlkLCBmdW5jdGlvbiAoc3RhdHVzLCBmb29kcykge1xuXHRcdFx0XHRpZiAoc3RhdHVzID09PSAyMDApIHtcblx0XHRcdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogc2VsZWN0ZWRDYXRlZ29yeSxcblx0XHRcdFx0XHRcdGZvb2RzOiBmb29kcyxcblx0XHRcdFx0XHRcdGxvYWRpbmc6IGZhbHNlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IHRydWUgfSk7XG5cdFx0fVxuXHR9LFxuXHRiYWNrQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIGJhY2tCdXR0b25DbGljaygpIHtcblx0XHR2YXIgcGFyZW50Q2F0ZWdvcnkgPSBVdGlscy5maW5kUGFyZW50Q2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuaWQpO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogcGFyZW50Q2F0ZWdvcnksXG5cdFx0XHRmb29kczogW11cblx0XHR9KTtcblx0fSxcblx0cm9vdEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiByb290QnV0dG9uQ2xpY2soKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogZm9vZENhdGVnb3JpZXMsXG5cdFx0XHRmb29kczogW11cblx0XHR9KTtcblx0fVxufSk7XG5cbnZhciBDYXRlZ29yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdDYXRlZ29yeScsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGljb25DbGFzcyA9ICdmbGF0aWNvbi0nICsgdGhpcy5wcm9wcy5jYXRlZ29yeS5pZDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2J1dHRvbicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmNsaWNrIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiBpY29uQ2xhc3MudG9Mb3dlckNhc2UoKSB9KVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdHRoaXMucHJvcHMuY2F0ZWdvcnkubmFtZVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Y2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuXHRcdHRoaXMucHJvcHMuc2VsZWN0Q2F0ZWdvcnkodGhpcy5wcm9wcy5jYXRlZ29yeS5pZCk7XG5cdH1cbn0pO1xuXG52YXIgSW5ncmVkaWVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbmdyZWRpZW50JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWluZ3JlZGllbnQnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHRoaXMucHJvcHMuaW5ncmVkaWVudC5uYW1lLFxuXHRcdFx0XHQnLCAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLmluZ3JlZGllbnQuZGVzY3JpcHRpb25cblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5hZGQgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2ZsYXRpY29uLWFkZCcgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0FkZCdcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHRhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcblx0XHR0aGlzLnByb3BzLmFkZCh0aGlzLnByb3BzLmluZ3JlZGllbnQuaWQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb29kU2VsZWN0b3I7XG5cbmlmIChjcy5pc0Rldk1vZGUoJ2Zvb2Rfc2VsZWN0b3InKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChGb29kU2VsZWN0b3IsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1mb29kX3NlbGVjdG9yJykpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZm9vZFNlbGVjdG9yVXRpbHMgPSB7XG5cdGZpbmRDYXRlZ29yeTogZnVuY3Rpb24gZmluZENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBpZCkge1xuXHRcdHZhciBjYXRlZ29yeSA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGlkIH0pO1xuXG5cdFx0aWYgKGNhdGVnb3J5KSByZXR1cm4gY2F0ZWdvcnk7ZWxzZSB7XG5cdFx0XHRpZiAoY2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHRcdF8uZWFjaChjYXRlZ29yeS5zdWIsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdFx0XHRcdHRoaXMuZmluZEZvb2RDYXRlZ29yeShjYXRlZ29yeS5zdWIsIGlkKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgcmV0dXJuO1xuXHRcdH1cblx0fSxcblx0ZmluZFBhcmVudENhdGVnb3J5OiBmdW5jdGlvbiBmaW5kUGFyZW50Q2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIGNoaWxkQ2F0ZWdvcnlJZCkge1xuXHRcdGlmIChmb29kQ2F0ZWdvcmllcy5zdWIpIHtcblx0XHRcdHZhciBzZWFyY2hlZENoaWxkID0gXy5maW5kKGZvb2RDYXRlZ29yaWVzLnN1YiwgeyBpZDogY2hpbGRDYXRlZ29yeUlkIH0pO1xuXG5cdFx0XHRpZiAoc2VhcmNoZWRDaGlsZCkge1xuXHRcdFx0XHRyZXR1cm4gZm9vZENhdGVnb3JpZXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcblxuXHRcdFx0XHRfLmVhY2goZm9vZENhdGVnb3JpZXMuc3ViLCBmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdFx0XHR2YXIgZm91bmQgPSB0aGlzLmZpbmRQYXJlbnRDYXRlZ29yeShjaGlsZCwgY2hpbGRDYXRlZ29yeUlkKTtcblxuXHRcdFx0XHRcdGlmIChmb3VuZCkgcmVzdWx0ID0gZm91bmQ7XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb29kU2VsZWN0b3JVdGlsczsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzJyk7XG52YXIgUGllID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9waWUvcGllLmpzJyk7XG5cbnZhciBJbmdyZWRpZW50TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbmdyZWRpZW50TGlzdCcsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZ3JlZGllbnRzOiBbXSxcblx0XHRcdG1hY3JvczogbnVsbFxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnN1YnNjcmliZShmdW5jdGlvbiAoaW5ncmVkaWVudHMpIHtcblx0XHRcdHZhciBtYWNyb3MgPSBpbmdyZWRpZW50cy5sZW5ndGggPiAwID8gVXRpbHMuY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSA6IG51bGw7XG5cblx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aW5ncmVkaWVudHM6IGluZ3JlZGllbnRzLFxuXHRcdFx0XHRtYWNyb3M6IG1hY3Jvc1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBmb29kcyA9IF8ubWFwKHRoaXMuc3RhdGUuaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50LCBrZXkpIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsga2V5OiBrZXkgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC51bml0LFxuXHRcdFx0XHRcdCcgJyxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmZvb2QubmFtZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHRcdHsgb25DbGljazogZnVuY3Rpb24gb25DbGljaygpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzMi5yZW1vdmUoa2V5KTtcblx0XHRcdFx0XHRcdH0gfSxcblx0XHRcdFx0XHQnUmVtb3ZlJ1xuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0sIHRoaXMpO1xuXG5cdFx0dmFyIG1hY3JvcyA9IHRoaXMuc3RhdGUubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnY2g6ICcsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLmNoLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnZmF0OiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5mYXQudG9GaXhlZCgwKSxcblx0XHRcdFx0JyUnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdwcm90ZWluOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5wcm90ZWluLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KVxuXHRcdCkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnaW5ncmVkaWVudC1saXN0JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChQaWUsIHsgbWFjcm9zOiB0aGlzLnN0YXRlLm1hY3JvcyB9KSxcblx0XHRcdGZvb2RzLFxuXHRcdFx0bWFjcm9zXG5cdFx0KTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdFx0dmFyIGluZ3JlZGllbnRzID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRpbmdyZWRpZW50cy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50cyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZ3JlZGllbnRMaXN0O1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdpbmdyZWRpZW50X2xpc3QnKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWluZ3JlZGllbnRfbGlzdCcpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluZ3JlZGllbnRMaXN0VXRpbHMgPSB7XG5cdGNhbGN1bGF0ZU1hY3JvczogZnVuY3Rpb24gY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSB7XG5cdFx0dmFyIGNocyA9IDA7XG5cdFx0dmFyIGZhdHMgPSAwO1xuXHRcdHZhciBwcm90ZWlucyA9IDA7XG5cblx0XHRfLmVhY2goaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRjaHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuY2hfbSk7XG5cdFx0XHRmYXRzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmZhdF9tKTtcblx0XHRcdHByb3RlaW5zICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLnByb3RlaW5fbSk7XG5cdFx0fSk7XG5cblx0XHR2YXIgc3VtID0gY2hzICsgZmF0cyArIHByb3RlaW5zO1xuXHRcdHZhciBjaFBlcmNlbnQgPSBjaHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIGZhdFBlcmNlbnQgPSBmYXRzIC8gc3VtICogMTAwO1xuXHRcdHZhciBwcm90ZWluUGVyY2VudCA9IHByb3RlaW5zIC8gc3VtICogMTAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoOiBjaFBlcmNlbnQsXG5cdFx0XHRmYXQ6IGZhdFBlcmNlbnQsXG5cdFx0XHRwcm90ZWluOiBwcm90ZWluUGVyY2VudFxuXHRcdH07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5ncmVkaWVudExpc3RVdGlsczsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUGllXCIsXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMuZHJhd1BpZSgpO1xuXHR9LFxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcblx0XHR0aGlzLmRyYXdQaWUoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNhbnZhcyA9IHRoaXMucHJvcHMubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiLCB7IGlkOiBcInBpZS1jYW52YXNcIiwgcmVmOiBcImNhbnZhc1wiLCB3aWR0aDogXCIyMDBcIiwgaGVpZ2h0OiBcIjIwMFwiIH0pIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XCJkaXZcIixcblx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZVwiIH0sXG5cdFx0XHRjYW52YXNcblx0XHQpO1xuXHR9LFxuXHRkcmF3UGllOiBmdW5jdGlvbiBkcmF3UGllKCkge1xuXHRcdHZhciBjYW52YXMgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzKTtcblx0XHRpZiAoY2FudmFzKSB7XG5cdFx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgY2VudGVyWCA9IDEwMDtcblx0XHRcdHZhciBjZW50ZXJZID0gMTAwO1xuXHRcdFx0dmFyIGFuZ2xlWmVyb1ggPSAyMDA7XG5cdFx0XHR2YXIgYW5nbGVaZXJvWSA9IDEwMDtcblx0XHRcdHZhciByYWRpdXMgPSAxMDA7XG5cdFx0XHR2YXIgYW5nbGVGYXQgPSB0aGlzLnByb3BzLm1hY3Jvcy5mYXQgLyA1MDtcblx0XHRcdHZhciBhbmdsZVByb3RlaW4gPSB0aGlzLnByb3BzLm1hY3Jvcy5wcm90ZWluIC8gNTA7XG5cblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4Lm1vdmVUbyhjZW50ZXJYLCBjZW50ZXJZKTtcblx0XHRcdGN0eC5saW5lVG8oYW5nbGVaZXJvWCwgYW5nbGVaZXJvWSk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgYW5nbGVGYXQgKiBNYXRoLlBJKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdGN0eC5maWxsKCk7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmVkJztcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVGYXQgKiBNYXRoLlBJLCAoYW5nbGVGYXQgKyBhbmdsZVByb3RlaW4pICogTWF0aC5QSSk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAxMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSB7XG5cdGlkOiAncm9vdCcsXG5cdHJvb3Q6IHRydWUsXG5cdHN1YjogW3tcblx0XHRpZDogJ2Jha2VkJyxcblx0XHRuYW1lOiAnYmFrZWQgcHJvZHVjdHMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZ3JhaW5CYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gYmFzZWQgYmFrZWQgcHJvZHVjdHMnLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdncmFpbkZyZWVCYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gZnJlZSBiYWtlZCBwcm9kdWN0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdiZXZlcmFnZXMnLFxuXHRcdG5hbWU6ICdiZXZlcmFnZXMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYWxjb2hvbGljJyxcblx0XHRcdG5hbWU6ICdhbGNvaG9saWMnLFxuXHRcdFx0a2V0bzogZmFsc2UsXG5cdFx0XHRwYWxlbzogZmFsc2UsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnYmVlcicsXG5cdFx0XHRcdG5hbWU6ICdiZWVyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2Rpc3RpbGxlZCcsXG5cdFx0XHRcdG5hbWU6ICdkaXN0aWxsZWQnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnbGlxdW9yJyxcblx0XHRcdFx0bmFtZTogJ2xpcXVvcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd3aW5lJyxcblx0XHRcdFx0bmFtZTogJ3dpbmUnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnY29mZmVlJyxcblx0XHRcdG5hbWU6ICdjb2ZmZWUnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICd0ZWEnLFxuXHRcdFx0bmFtZTogJ3RlYSdcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdjZXJlYWwnLFxuXHRcdG5hbWU6ICdjZXJlYWwgZ3JhaW5zIGFuZCBwYXN0YScsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0cGFsZW86IGZhbHNlXG5cdH0sIHtcblx0XHRpZDogJ2RhaXJ5QW5kRWdnJyxcblx0XHRuYW1lOiAnZGFpcnkgYW5kIGVnZycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdkYWlyeScsXG5cdFx0XHRuYW1lOiAnZGFpcnknLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdlZ2cnLFxuXHRcdFx0bmFtZTogJ2VnZydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmYXRzQW5kT2lscycsXG5cdFx0bmFtZTogJ2ZhdHMgYW5kIG9pbHMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZmF0cycsXG5cdFx0XHRuYW1lOiAnZmF0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmaXNoJyxcblx0XHRuYW1lOiAnZmlzaCBhbmQgc2hlbGxmaXNoJ1xuXHR9LCB7XG5cdFx0aWQ6ICdmcnVpdHMnLFxuXHRcdG5hbWU6ICdmcnVpdHMgYW5kIGp1aWNlcydcblx0fSwge1xuXHRcdGlkOiAnbGVndW1lcycsXG5cdFx0bmFtZTogJ2xlZ3VtZXMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdtZWF0Jyxcblx0XHRuYW1lOiAnbWVhdCcsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdiZWVmJyxcblx0XHRcdG5hbWU6ICdiZWVmJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAncG9yaycsXG5cdFx0XHRuYW1lOiAncG9yaydcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvdWx0cnknLFxuXHRcdFx0bmFtZTogJ3BvdWx0cnknLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2NoaWNrZW4nLFxuXHRcdFx0XHRuYW1lOiAnY2hpY2tlbidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd0dXJrZXknLFxuXHRcdFx0XHRuYW1lOiAndHVya2V5J1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2R1Y2snLFxuXHRcdFx0XHRuYW1lOiAnZHVjaydcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdnb29zZScsXG5cdFx0XHRcdG5hbWU6ICdnb29zZSdcblx0XHRcdH1dXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdsYW1iJyxcblx0XHRcdG5hbWU6ICdsYW1iJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ29hdCcsXG5cdFx0XHRuYW1lOiAnZ29hdCdcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dhbWUnLFxuXHRcdFx0bmFtZTogJ2dhbWUnLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2RlZXInLFxuXHRcdFx0XHRuYW1lOiAnZGVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdib2FyJyxcblx0XHRcdFx0bmFtZTogJ2JvYXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAncmFiYml0Jyxcblx0XHRcdFx0bmFtZTogJ3JhYmJpdCdcblx0XHRcdH1dXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnbnV0cycsXG5cdFx0bmFtZTogJ251dHMgYW5kIHNlZWRzJ1xuXHR9LCB7XG5cdFx0aWQ6ICdzcGljZXMnLFxuXHRcdG5hbWU6ICdzcGljZXMgYW5kIGhlcmJzJ1xuXHR9LCB7XG5cdFx0aWQ6ICd2ZWdldGFibGVzJyxcblx0XHRuYW1lOiAndmVnZXRhYmxlcydcblx0fV1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZENhdGVnb3JpZXM7Il19
