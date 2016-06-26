(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../../food_categories.js":3,"./food_selector_utils.js":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2Zvb2Rfc2VsZWN0b3IvZm9vZF9zZWxlY3Rvcl91dGlscy5qcyIsInNyYy9zY3JpcHRzL2Zvb2RfY2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb29kQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uLy4uL2Zvb2RfY2F0ZWdvcmllcy5qcycpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9mb29kX3NlbGVjdG9yX3V0aWxzLmpzJyk7XG5cbnZhciBGb29kU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnRm9vZFNlbGVjdG9yJyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IGZvb2RDYXRlZ29yaWVzLFxuXHRcdFx0Zm9vZHM6IFtdLFxuXHRcdFx0bG9hZGluZzogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgbGlzdDtcblxuXHRcdGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1Yikge1xuXHRcdFx0bGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2F0ZWdvcnksIHsgY2F0ZWdvcnk6IGNhdGVnb3J5LCBrZXk6IGNhdGVnb3J5LmlkLCBzZWxlY3RDYXRlZ29yeTogdGhpcy5zZWxlY3RDYXRlZ29yeSB9KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsaXN0ID0gXy5tYXAodGhpcy5zdGF0ZS5mb29kcywgZnVuY3Rpb24gKGluZ3JlZGllbnQpIHtcblx0XHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0eyBrZXk6IGluZ3JlZGllbnQuaWQgfSxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnQsIHsgaW5ncmVkaWVudDogaW5ncmVkaWVudCwgYWRkOiB0aGlzLmFkZEluZ3JlZGllbnQgfSlcblx0XHRcdFx0KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdHZhciBjb250cm9scyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkucm9vdCA/IG51bGwgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY29udHJvbHMnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5iYWNrQnV0dG9uQ2xpY2sgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2ZsYXRpY29uLXByZXZpb3VzJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQmFjaydcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5yb290QnV0dG9uQ2xpY2sgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2ZsYXRpY29uLXJlZnJlc2gnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdBbGwgY2F0ZWdvcmllcydcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXG5cdFx0dmFyIGNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1saXN0JyB9LFxuXHRcdFx0XHRsaXN0XG5cdFx0XHQpLFxuXHRcdFx0Y29udHJvbHNcblx0XHQpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3RvcicgfSxcblx0XHRcdHRoaXMuc3RhdGUubG9hZGluZyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnbG9hZGluZy4uLidcblx0XHRcdCkgOiBjb250ZW50XG5cdFx0KTtcblx0fSxcblx0YWRkSW5ncmVkaWVudDogZnVuY3Rpb24gYWRkSW5ncmVkaWVudChpZCkge1xuXHRcdHZhciBhbW91bnQgPSBwcm9tcHQoJ1BsZWFzZSBlbnRlciB0aGUgYW1vdW50IG9mIGZvb2QgaW4gZ3JhbXMhJywgJzEwMCcpO1xuXG5cdFx0aWYgKGFtb3VudCkge1xuXHRcdFx0dmFyIGluZ3JlZGllbnREYXRhID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRcdGluZ3JlZGllbnREYXRhLnB1c2goeyBmb29kOiBfLmZpbmQodGhpcy5zdGF0ZS5mb29kcywgeyBpZDogaWQgfSksIGFtb3VudDogeyBxdWFudGl0eTogcGFyc2VJbnQoYW1vdW50KSwgdW5pdDogJ2cnIH0gfSk7XG5cdFx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50RGF0YSk7XG5cdFx0fVxuXHR9LFxuXHRzZWxlY3RDYXRlZ29yeTogZnVuY3Rpb24gc2VsZWN0Q2F0ZWdvcnkoY2F0ZWdvcnkpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0dmFyIHNlbGVjdGVkQ2F0ZWdvcnkgPSBfLmZpbmQodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIsIHsgaWQ6IGNhdGVnb3J5IH0pO1xuXG5cdFx0aWYgKHNlbGVjdGVkQ2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHNlbGVjdGVkQ2F0ZWdvcnksXG5cdFx0XHRcdGZvb2RzOiBbXVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNzLmdldCgnL2dldGZvb2RzP2lkPScgKyBzZWxlY3RlZENhdGVnb3J5LmlkLCBmdW5jdGlvbiAoc3RhdHVzLCBmb29kcykge1xuXHRcdFx0XHRpZiAoc3RhdHVzID09PSAyMDApIHtcblx0XHRcdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogc2VsZWN0ZWRDYXRlZ29yeSxcblx0XHRcdFx0XHRcdGZvb2RzOiBmb29kcyxcblx0XHRcdFx0XHRcdGxvYWRpbmc6IGZhbHNlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IHRydWUgfSk7XG5cdFx0fVxuXHR9LFxuXHRiYWNrQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIGJhY2tCdXR0b25DbGljaygpIHtcblx0XHR2YXIgcGFyZW50Q2F0ZWdvcnkgPSBVdGlscy5maW5kUGFyZW50Q2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuaWQpO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogcGFyZW50Q2F0ZWdvcnksXG5cdFx0XHRmb29kczogW11cblx0XHR9KTtcblx0fSxcblx0cm9vdEJ1dHRvbkNsaWNrOiBmdW5jdGlvbiByb290QnV0dG9uQ2xpY2soKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogZm9vZENhdGVnb3JpZXMsXG5cdFx0XHRmb29kczogW11cblx0XHR9KTtcblx0fVxufSk7XG5cbnZhciBDYXRlZ29yeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdDYXRlZ29yeScsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGljb25DbGFzcyA9ICdmbGF0aWNvbi0nICsgdGhpcy5wcm9wcy5jYXRlZ29yeS5pZDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2J1dHRvbicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmNsaWNrIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiBpY29uQ2xhc3MudG9Mb3dlckNhc2UoKSB9KVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdHRoaXMucHJvcHMuY2F0ZWdvcnkubmFtZVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Y2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuXHRcdHRoaXMucHJvcHMuc2VsZWN0Q2F0ZWdvcnkodGhpcy5wcm9wcy5jYXRlZ29yeS5pZCk7XG5cdH1cbn0pO1xuXG52YXIgSW5ncmVkaWVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbmdyZWRpZW50JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWluZ3JlZGllbnQnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHRoaXMucHJvcHMuaW5ncmVkaWVudC5uYW1lLFxuXHRcdFx0XHQnLCAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLmluZ3JlZGllbnQuZGVzY3JpcHRpb25cblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWNhdGVnb3J5Jywgb25DbGljazogdGhpcy5hZGQgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2ZsYXRpY29uLWFkZCcgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0FkZCdcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHRhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcblx0XHR0aGlzLnByb3BzLmFkZCh0aGlzLnByb3BzLmluZ3JlZGllbnQuaWQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb29kU2VsZWN0b3I7XG5cbmlmIChjcy5pc0Rldk1vZGUoJ2Zvb2Rfc2VsZWN0b3InKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChGb29kU2VsZWN0b3IsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1mb29kX3NlbGVjdG9yJykpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZm9vZFNlbGVjdG9yVXRpbHMgPSB7XG5cdGZpbmRDYXRlZ29yeTogZnVuY3Rpb24gZmluZENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBpZCkge1xuXHRcdHZhciBjYXRlZ29yeSA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGlkIH0pO1xuXG5cdFx0aWYgKGNhdGVnb3J5KSByZXR1cm4gY2F0ZWdvcnk7ZWxzZSB7XG5cdFx0XHRpZiAoY2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHRcdF8uZWFjaChjYXRlZ29yeS5zdWIsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdFx0XHRcdHRoaXMuZmluZEZvb2RDYXRlZ29yeShjYXRlZ29yeS5zdWIsIGlkKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgcmV0dXJuO1xuXHRcdH1cblx0fSxcblx0ZmluZFBhcmVudENhdGVnb3J5OiBmdW5jdGlvbiBmaW5kUGFyZW50Q2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIGNoaWxkQ2F0ZWdvcnlJZCkge1xuXHRcdGlmIChmb29kQ2F0ZWdvcmllcy5zdWIpIHtcblx0XHRcdHZhciBzZWFyY2hlZENoaWxkID0gXy5maW5kKGZvb2RDYXRlZ29yaWVzLnN1YiwgeyBpZDogY2hpbGRDYXRlZ29yeUlkIH0pO1xuXG5cdFx0XHRpZiAoc2VhcmNoZWRDaGlsZCkge1xuXHRcdFx0XHRyZXR1cm4gZm9vZENhdGVnb3JpZXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcblxuXHRcdFx0XHRfLmVhY2goZm9vZENhdGVnb3JpZXMuc3ViLCBmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdFx0XHR2YXIgZm91bmQgPSB0aGlzLmZpbmRQYXJlbnRDYXRlZ29yeShjaGlsZCwgY2hpbGRDYXRlZ29yeUlkKTtcblxuXHRcdFx0XHRcdGlmIChmb3VuZCkgcmVzdWx0ID0gZm91bmQ7XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb29kU2VsZWN0b3JVdGlsczsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb29kQ2F0ZWdvcmllcyA9IHtcblx0aWQ6ICdyb290Jyxcblx0cm9vdDogdHJ1ZSxcblx0c3ViOiBbe1xuXHRcdGlkOiAnYmFrZWQnLFxuXHRcdG5hbWU6ICdiYWtlZCBwcm9kdWN0cycsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdncmFpbkJha2VkJyxcblx0XHRcdG5hbWU6ICdncmFpbiBiYXNlZCBiYWtlZCBwcm9kdWN0cycsXG5cdFx0XHRwYWxlbzogZmFsc2Vcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dyYWluRnJlZUJha2VkJyxcblx0XHRcdG5hbWU6ICdncmFpbiBmcmVlIGJha2VkIHByb2R1Y3RzJ1xuXHRcdH1dXG5cdH0sIHtcblx0XHRpZDogJ2JldmVyYWdlcycsXG5cdFx0bmFtZTogJ2JldmVyYWdlcycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdhbGNvaG9saWMnLFxuXHRcdFx0bmFtZTogJ2FsY29ob2xpYycsXG5cdFx0XHRrZXRvOiBmYWxzZSxcblx0XHRcdHBhbGVvOiBmYWxzZSxcblx0XHRcdHN1YjogW3tcblx0XHRcdFx0aWQ6ICdiZWVyJyxcblx0XHRcdFx0bmFtZTogJ2JlZXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnZGlzdGlsbGVkJyxcblx0XHRcdFx0bmFtZTogJ2Rpc3RpbGxlZCdcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdsaXF1b3InLFxuXHRcdFx0XHRuYW1lOiAnbGlxdW9yJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ3dpbmUnLFxuXHRcdFx0XHRuYW1lOiAnd2luZSdcblx0XHRcdH1dXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdjb2ZmZWUnLFxuXHRcdFx0bmFtZTogJ2NvZmZlZSdcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3RlYScsXG5cdFx0XHRuYW1lOiAndGVhJ1xuXHRcdH1dXG5cdH0sIHtcblx0XHRpZDogJ2NlcmVhbCcsXG5cdFx0bmFtZTogJ2NlcmVhbCBncmFpbnMgYW5kIHBhc3RhJyxcblx0XHRrZXRvOiBmYWxzZSxcblx0XHRwYWxlbzogZmFsc2Vcblx0fSwge1xuXHRcdGlkOiAnZGFpcnlBbmRFZ2cnLFxuXHRcdG5hbWU6ICdkYWlyeSBhbmQgZWdnJyxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2RhaXJ5Jyxcblx0XHRcdG5hbWU6ICdkYWlyeScsXG5cdFx0XHRwYWxlbzogZmFsc2Vcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2VnZycsXG5cdFx0XHRuYW1lOiAnZWdnJ1xuXHRcdH1dXG5cdH0sIHtcblx0XHRpZDogJ2ZhdHNBbmRPaWxzJyxcblx0XHRuYW1lOiAnZmF0cyBhbmQgb2lscycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdmYXRzJyxcblx0XHRcdG5hbWU6ICdmYXRzJ1xuXHRcdH1dXG5cdH0sIHtcblx0XHRpZDogJ2Zpc2gnLFxuXHRcdG5hbWU6ICdmaXNoIGFuZCBzaGVsbGZpc2gnXG5cdH0sIHtcblx0XHRpZDogJ2ZydWl0cycsXG5cdFx0bmFtZTogJ2ZydWl0cyBhbmQganVpY2VzJ1xuXHR9LCB7XG5cdFx0aWQ6ICdsZWd1bWVzJyxcblx0XHRuYW1lOiAnbGVndW1lcycsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0cGFsZW86IGZhbHNlXG5cdH0sIHtcblx0XHRpZDogJ21lYXQnLFxuXHRcdG5hbWU6ICdtZWF0Jyxcblx0XHRzdWI6IFt7XG5cdFx0XHRpZDogJ2JlZWYnLFxuXHRcdFx0bmFtZTogJ2JlZWYnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdwb3JrJyxcblx0XHRcdG5hbWU6ICdwb3JrJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAncG91bHRyeScsXG5cdFx0XHRuYW1lOiAncG91bHRyeScsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnY2hpY2tlbicsXG5cdFx0XHRcdG5hbWU6ICdjaGlja2VuJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ3R1cmtleScsXG5cdFx0XHRcdG5hbWU6ICd0dXJrZXknXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnZHVjaycsXG5cdFx0XHRcdG5hbWU6ICdkdWNrJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2dvb3NlJyxcblx0XHRcdFx0bmFtZTogJ2dvb3NlJ1xuXHRcdFx0fV1cblx0XHR9LCB7XG5cdFx0XHRpZDogJ2xhbWInLFxuXHRcdFx0bmFtZTogJ2xhbWInXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdnb2F0Jyxcblx0XHRcdG5hbWU6ICdnb2F0J1xuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ2FtZScsXG5cdFx0XHRuYW1lOiAnZ2FtZScsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnZGVlcicsXG5cdFx0XHRcdG5hbWU6ICdkZWVyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2JvYXInLFxuXHRcdFx0XHRuYW1lOiAnYm9hcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdyYWJiaXQnLFxuXHRcdFx0XHRuYW1lOiAncmFiYml0J1xuXHRcdFx0fV1cblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdudXRzJyxcblx0XHRuYW1lOiAnbnV0cyBhbmQgc2VlZHMnXG5cdH0sIHtcblx0XHRpZDogJ3NwaWNlcycsXG5cdFx0bmFtZTogJ3NwaWNlcyBhbmQgaGVyYnMnXG5cdH0sIHtcblx0XHRpZDogJ3ZlZ2V0YWJsZXMnLFxuXHRcdG5hbWU6ICd2ZWdldGFibGVzJ1xuXHR9XVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb29kQ2F0ZWdvcmllczsiXX0=
