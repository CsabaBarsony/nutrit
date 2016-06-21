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
				return React.createElement(FoodCategory, { category: category, key: category.id, selectCategory: this.selectCategory });
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
			{ className: 'food-selector-controls' },
			React.createElement(
				'button',
				{ className: 'food-category', onClick: this.backButtonClick },
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
				{ className: 'food-category', onClick: this.rootButtonClick },
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
				{ className: 'food-selector-list' },
				list
			),
			controls
		);

		return React.createElement(
			'div',
			{ className: 'food-selector' },
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

var FoodCategory = React.createClass({
	displayName: 'FoodCategory',

	render: function render() {
		var iconClass = 'flaticon-' + this.props.category.id;

		return React.createElement(
			'button',
			{ className: 'food-category', onClick: this.click },
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
			{ className: 'ingredient' },
			React.createElement(
				'span',
				null,
				this.props.ingredient.name,
				', ',
				this.props.ingredient.description
			),
			React.createElement(
				'button',
				{ className: 'food-category add-ingredient', onClick: this.add },
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

ReactDOM.render(React.createElement(FoodSelector, null), document.getElementById('food-selector-cont'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2Zvb2Rfc2VsZWN0b3IvZm9vZF9zZWxlY3Rvcl91dGlscy5qcyIsInNyYy9zY3JpcHRzL2Zvb2RfY2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb29kQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uLy4uL2Zvb2RfY2F0ZWdvcmllcy5qcycpO1xudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9mb29kX3NlbGVjdG9yX3V0aWxzLmpzJyk7XG5cbnZhciBGb29kU2VsZWN0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnRm9vZFNlbGVjdG9yJyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IGZvb2RDYXRlZ29yaWVzLFxuXHRcdFx0Zm9vZHM6IFtdLFxuXHRcdFx0bG9hZGluZzogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgbGlzdDtcblxuXHRcdGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1Yikge1xuXHRcdFx0bGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vZENhdGVnb3J5LCB7IGNhdGVnb3J5OiBjYXRlZ29yeSwga2V5OiBjYXRlZ29yeS5pZCwgc2VsZWN0Q2F0ZWdvcnk6IHRoaXMuc2VsZWN0Q2F0ZWdvcnkgfSk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUuZm9vZHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdHsga2V5OiBpbmdyZWRpZW50LmlkIH0sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50LCB7IGluZ3JlZGllbnQ6IGluZ3JlZGllbnQsIGFkZDogdGhpcy5hZGRJbmdyZWRpZW50IH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9XG5cblx0XHR2YXIgY29udHJvbHMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnJvb3QgPyBudWxsIDogUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kLXNlbGVjdG9yLWNvbnRyb2xzJyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZC1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuYmFja0J1dHRvbkNsaWNrIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1wcmV2aW91cycgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0JhY2snXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZC1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMucm9vdEJ1dHRvbkNsaWNrIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1yZWZyZXNoJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQWxsIGNhdGVnb3JpZXMnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblxuXHRcdHZhciBjb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Qtc2VsZWN0b3ItbGlzdCcgfSxcblx0XHRcdFx0bGlzdFxuXHRcdFx0KSxcblx0XHRcdGNvbnRyb2xzXG5cdFx0KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Qtc2VsZWN0b3InIH0sXG5cdFx0XHR0aGlzLnN0YXRlLmxvYWRpbmcgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2xvYWRpbmcuLi4nXG5cdFx0XHQpIDogY29udGVudFxuXHRcdCk7XG5cdH0sXG5cdGFkZEluZ3JlZGllbnQ6IGZ1bmN0aW9uIGFkZEluZ3JlZGllbnQoaWQpIHtcblx0XHR2YXIgYW1vdW50ID0gcHJvbXB0KCdQbGVhc2UgZW50ZXIgdGhlIGFtb3VudCBvZiBmb29kIGluIGdyYW1zIScsICcxMDAnKTtcblxuXHRcdGlmIChhbW91bnQpIHtcblx0XHRcdHZhciBpbmdyZWRpZW50RGF0YSA9IGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuZ2V0KCk7XG5cdFx0XHRpbmdyZWRpZW50RGF0YS5wdXNoKHsgZm9vZDogXy5maW5kKHRoaXMuc3RhdGUuZm9vZHMsIHsgaWQ6IGlkIH0pLCBhbW91bnQ6IHsgcXVhbnRpdHk6IHBhcnNlSW50KGFtb3VudCksIHVuaXQ6ICdnJyB9IH0pO1xuXHRcdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zZXQoaW5ncmVkaWVudERhdGEpO1xuXHRcdH1cblx0fSxcblx0c2VsZWN0Q2F0ZWdvcnk6IGZ1bmN0aW9uIHNlbGVjdENhdGVnb3J5KGNhdGVnb3J5KSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdHZhciBzZWxlY3RlZENhdGVnb3J5ID0gXy5maW5kKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViLCB7IGlkOiBjYXRlZ29yeSB9KTtcblxuXHRcdGlmIChzZWxlY3RlZENhdGVnb3J5LnN1Yikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBzZWxlY3RlZENhdGVnb3J5LFxuXHRcdFx0XHRmb29kczogW11cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcy5nZXQoJy9nZXRmb29kcz9pZD0nICsgc2VsZWN0ZWRDYXRlZ29yeS5pZCwgZnVuY3Rpb24gKHN0YXR1cywgZm9vZHMpIHtcblx0XHRcdFx0aWYgKHN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHNlbGVjdGVkQ2F0ZWdvcnksXG5cdFx0XHRcdFx0XHRmb29kczogZm9vZHMsXG5cdFx0XHRcdFx0XHRsb2FkaW5nOiBmYWxzZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBsb2FkaW5nOiB0cnVlIH0pO1xuXHRcdH1cblx0fSxcblx0YmFja0J1dHRvbkNsaWNrOiBmdW5jdGlvbiBiYWNrQnV0dG9uQ2xpY2soKSB7XG5cdFx0dmFyIHBhcmVudENhdGVnb3J5ID0gVXRpbHMuZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCB0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LmlkKTtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IHBhcmVudENhdGVnb3J5LFxuXHRcdFx0Zm9vZHM6IFtdXG5cdFx0fSk7XG5cdH0sXG5cdHJvb3RCdXR0b25DbGljazogZnVuY3Rpb24gcm9vdEJ1dHRvbkNsaWNrKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0ZWRGb29kQ2F0ZWdvcnk6IGZvb2RDYXRlZ29yaWVzLFxuXHRcdFx0Zm9vZHM6IFtdXG5cdFx0fSk7XG5cdH1cbn0pO1xuXG52YXIgRm9vZENhdGVnb3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0Zvb2RDYXRlZ29yeScsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGljb25DbGFzcyA9ICdmbGF0aWNvbi0nICsgdGhpcy5wcm9wcy5jYXRlZ29yeS5pZDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2J1dHRvbicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2QtY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmNsaWNrIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiBpY29uQ2xhc3MudG9Mb3dlckNhc2UoKSB9KVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdHRoaXMucHJvcHMuY2F0ZWdvcnkubmFtZVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0Y2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuXHRcdHRoaXMucHJvcHMuc2VsZWN0Q2F0ZWdvcnkodGhpcy5wcm9wcy5jYXRlZ29yeS5pZCk7XG5cdH1cbn0pO1xuXG52YXIgSW5ncmVkaWVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbmdyZWRpZW50JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdpbmdyZWRpZW50JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHR0aGlzLnByb3BzLmluZ3JlZGllbnQubmFtZSxcblx0XHRcdFx0JywgJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5pbmdyZWRpZW50LmRlc2NyaXB0aW9uXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZC1jYXRlZ29yeSBhZGQtaW5ncmVkaWVudCcsIG9uQ2xpY2s6IHRoaXMuYWRkIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdmbGF0aWNvbi1hZGQnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdBZGQnXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSxcblx0YWRkOiBmdW5jdGlvbiBhZGQoKSB7XG5cdFx0dGhpcy5wcm9wcy5hZGQodGhpcy5wcm9wcy5pbmdyZWRpZW50LmlkKTtcblx0fVxufSk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEZvb2RTZWxlY3RvciwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb29kLXNlbGVjdG9yLWNvbnQnKSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmb29kU2VsZWN0b3JVdGlscyA9IHtcblx0ZmluZENhdGVnb3J5OiBmdW5jdGlvbiBmaW5kQ2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIGlkKSB7XG5cdFx0dmFyIGNhdGVnb3J5ID0gXy5maW5kKGZvb2RDYXRlZ29yaWVzLnN1YiwgeyBpZDogaWQgfSk7XG5cblx0XHRpZiAoY2F0ZWdvcnkpIHJldHVybiBjYXRlZ29yeTtlbHNlIHtcblx0XHRcdGlmIChjYXRlZ29yeS5zdWIpIHtcblx0XHRcdFx0Xy5lYWNoKGNhdGVnb3J5LnN1YiwgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0XHRcdFx0dGhpcy5maW5kRm9vZENhdGVnb3J5KGNhdGVnb3J5LnN1YiwgaWQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSByZXR1cm47XG5cdFx0fVxuXHR9LFxuXHQvLyBUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZmluZFBhcmVudENhdGVnb3J5IGZ1bmN0aW9uXG5cdGZpbmRQYXJlbnRDYXRlZ29yeTogZnVuY3Rpb24gZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBjaGlsZENhdGVnb3J5SWQpIHtcblx0XHRpZiAoZm9vZENhdGVnb3JpZXMuc3ViKSB7XG5cdFx0XHR2YXIgc2VhcmNoZWRDaGlsZCA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGNoaWxkQ2F0ZWdvcnlJZCB9KTtcblxuXHRcdFx0aWYgKHNlYXJjaGVkQ2hpbGQpIHtcblx0XHRcdFx0cmV0dXJuIGZvb2RDYXRlZ29yaWVzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0Xy5lYWNoKGZvb2RDYXRlZ29yaWVzLnN1YiwgZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gdGhpcy5maW5kUGFyZW50Q2F0ZWdvcnkoY2hpbGQsIGNoaWxkQ2F0ZWdvcnlJZCk7XG5cblx0XHRcdFx0XHRpZiAoZm91bmQpIHJlc3VsdCA9IGZvdW5kO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZFNlbGVjdG9yVXRpbHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSB7XG5cdGlkOiAncm9vdCcsXG5cdHJvb3Q6IHRydWUsXG5cdHN1YjogW3tcblx0XHRpZDogJ2Jha2VkJyxcblx0XHRuYW1lOiAnYmFrZWQgcHJvZHVjdHMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZ3JhaW5CYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gYmFzZWQgYmFrZWQgcHJvZHVjdHMnLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdncmFpbkZyZWVCYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gZnJlZSBiYWtlZCBwcm9kdWN0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdiZXZlcmFnZXMnLFxuXHRcdG5hbWU6ICdiZXZlcmFnZXMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYWxjb2hvbGljJyxcblx0XHRcdG5hbWU6ICdhbGNvaG9saWMnLFxuXHRcdFx0a2V0bzogZmFsc2UsXG5cdFx0XHRwYWxlbzogZmFsc2UsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnYmVlcicsXG5cdFx0XHRcdG5hbWU6ICdiZWVyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2Rpc3RpbGxlZCcsXG5cdFx0XHRcdG5hbWU6ICdkaXN0aWxsZWQnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnbGlxdW9yJyxcblx0XHRcdFx0bmFtZTogJ2xpcXVvcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd3aW5lJyxcblx0XHRcdFx0bmFtZTogJ3dpbmUnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnY29mZmVlJyxcblx0XHRcdG5hbWU6ICdjb2ZmZWUnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICd0ZWEnLFxuXHRcdFx0bmFtZTogJ3RlYSdcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdjZXJlYWwnLFxuXHRcdG5hbWU6ICdjZXJlYWwgZ3JhaW5zIGFuZCBwYXN0YScsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0cGFsZW86IGZhbHNlXG5cdH0sIHtcblx0XHRpZDogJ2RhaXJ5QW5kRWdnJyxcblx0XHRuYW1lOiAnZGFpcnkgYW5kIGVnZycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdkYWlyeScsXG5cdFx0XHRuYW1lOiAnZGFpcnknLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdlZ2cnLFxuXHRcdFx0bmFtZTogJ2VnZydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmYXRzQW5kT2lscycsXG5cdFx0bmFtZTogJ2ZhdHMgYW5kIG9pbHMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZmF0cycsXG5cdFx0XHRuYW1lOiAnZmF0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmaXNoJyxcblx0XHRuYW1lOiAnZmlzaCBhbmQgc2hlbGxmaXNoJ1xuXHR9LCB7XG5cdFx0aWQ6ICdmcnVpdHMnLFxuXHRcdG5hbWU6ICdmcnVpdHMgYW5kIGp1aWNlcydcblx0fSwge1xuXHRcdGlkOiAnbGVndW1lcycsXG5cdFx0bmFtZTogJ2xlZ3VtZXMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdtZWF0Jyxcblx0XHRuYW1lOiAnbWVhdCcsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdiZWVmJyxcblx0XHRcdG5hbWU6ICdiZWVmJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAncG9yaycsXG5cdFx0XHRuYW1lOiAncG9yaydcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvdWx0cnknLFxuXHRcdFx0bmFtZTogJ3BvdWx0cnknLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2NoaWNrZW4nLFxuXHRcdFx0XHRuYW1lOiAnY2hpY2tlbidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd0dXJrZXknLFxuXHRcdFx0XHRuYW1lOiAndHVya2V5J1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2R1Y2snLFxuXHRcdFx0XHRuYW1lOiAnZHVjaydcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdnb29zZScsXG5cdFx0XHRcdG5hbWU6ICdnb29zZSdcblx0XHRcdH1dXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdsYW1iJyxcblx0XHRcdG5hbWU6ICdsYW1iJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ29hdCcsXG5cdFx0XHRuYW1lOiAnZ29hdCdcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dhbWUnLFxuXHRcdFx0bmFtZTogJ2dhbWUnLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2RlZXInLFxuXHRcdFx0XHRuYW1lOiAnZGVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdib2FyJyxcblx0XHRcdFx0bmFtZTogJ2JvYXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAncmFiYml0Jyxcblx0XHRcdFx0bmFtZTogJ3JhYmJpdCdcblx0XHRcdH1dXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnbnV0cycsXG5cdFx0bmFtZTogJ251dHMgYW5kIHNlZWRzJ1xuXHR9LCB7XG5cdFx0aWQ6ICdzcGljZXMnLFxuXHRcdG5hbWU6ICdzcGljZXMgYW5kIGhlcmJzJ1xuXHR9LCB7XG5cdFx0aWQ6ICd2ZWdldGFibGVzJyxcblx0XHRuYW1lOiAndmVnZXRhYmxlcydcblx0fV1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZENhdGVnb3JpZXM7Il19
