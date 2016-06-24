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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9mb29kX3NlbGVjdG9yL2Zvb2Rfc2VsZWN0b3IuanMiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2Zvb2Rfc2VsZWN0b3IvZm9vZF9zZWxlY3Rvcl91dGlscy5qcyIsInNyYy9zY3JpcHRzL2Zvb2RfY2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvb2RDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi4vLi4vZm9vZF9jYXRlZ29yaWVzLmpzJyk7XG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2Zvb2Rfc2VsZWN0b3JfdXRpbHMuanMnKTtcblxudmFyIEZvb2RTZWxlY3RvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdGb29kU2VsZWN0b3InLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogZm9vZENhdGVnb3JpZXMsXG5cdFx0XHRmb29kczogW10sXG5cdFx0XHRsb2FkaW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBsaXN0O1xuXG5cdFx0aWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRGb29kQ2F0ZWdvcnkuc3ViKSB7XG5cdFx0XHRsaXN0ID0gXy5tYXAodGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5zdWIsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDYXRlZ29yeSwgeyBjYXRlZ29yeTogY2F0ZWdvcnksIGtleTogY2F0ZWdvcnkuaWQsIHNlbGVjdENhdGVnb3J5OiB0aGlzLnNlbGVjdENhdGVnb3J5IH0pO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxpc3QgPSBfLm1hcCh0aGlzLnN0YXRlLmZvb2RzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCkge1xuXHRcdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHR7IGtleTogaW5ncmVkaWVudC5pZCB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5ncmVkaWVudCwgeyBpbmdyZWRpZW50OiBpbmdyZWRpZW50LCBhZGQ6IHRoaXMuYWRkSW5ncmVkaWVudCB9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRyb2xzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5yb290ID8gbnVsbCA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jb250cm9scycgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmJhY2tCdXR0b25DbGljayB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tcHJldmlvdXMnIH0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdCdCYWNrJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLnJvb3RCdXR0b25DbGljayB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tcmVmcmVzaCcgfSlcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0J0FsbCBjYXRlZ29yaWVzJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cblx0XHR2YXIgY29udGVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yLWxpc3QnIH0sXG5cdFx0XHRcdGxpc3Rcblx0XHRcdCksXG5cdFx0XHRjb250cm9sc1xuXHRcdCk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdmb29kX3NlbGVjdG9yJyB9LFxuXHRcdFx0dGhpcy5zdGF0ZS5sb2FkaW5nID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdsb2FkaW5nLi4uJ1xuXHRcdFx0KSA6IGNvbnRlbnRcblx0XHQpO1xuXHR9LFxuXHRhZGRJbmdyZWRpZW50OiBmdW5jdGlvbiBhZGRJbmdyZWRpZW50KGlkKSB7XG5cdFx0dmFyIGFtb3VudCA9IHByb21wdCgnUGxlYXNlIGVudGVyIHRoZSBhbW91bnQgb2YgZm9vZCBpbiBncmFtcyEnLCAnMTAwJyk7XG5cblx0XHRpZiAoYW1vdW50KSB7XG5cdFx0XHR2YXIgaW5ncmVkaWVudERhdGEgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdFx0aW5ncmVkaWVudERhdGEucHVzaCh7IGZvb2Q6IF8uZmluZCh0aGlzLnN0YXRlLmZvb2RzLCB7IGlkOiBpZCB9KSwgYW1vdW50OiB7IHF1YW50aXR5OiBwYXJzZUludChhbW91bnQpLCB1bml0OiAnZycgfSB9KTtcblx0XHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnREYXRhKTtcblx0XHR9XG5cdH0sXG5cdHNlbGVjdENhdGVnb3J5OiBmdW5jdGlvbiBzZWxlY3RDYXRlZ29yeShjYXRlZ29yeSkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHR2YXIgc2VsZWN0ZWRDYXRlZ29yeSA9IF8uZmluZCh0aGlzLnN0YXRlLnNlbGVjdGVkRm9vZENhdGVnb3J5LnN1YiwgeyBpZDogY2F0ZWdvcnkgfSk7XG5cblx0XHRpZiAoc2VsZWN0ZWRDYXRlZ29yeS5zdWIpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRzZWxlY3RlZEZvb2RDYXRlZ29yeTogc2VsZWN0ZWRDYXRlZ29yeSxcblx0XHRcdFx0Zm9vZHM6IFtdXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3MuZ2V0KCcvZ2V0Zm9vZHM/aWQ9JyArIHNlbGVjdGVkQ2F0ZWdvcnkuaWQsIGZ1bmN0aW9uIChzdGF0dXMsIGZvb2RzKSB7XG5cdFx0XHRcdGlmIChzdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBzZWxlY3RlZENhdGVnb3J5LFxuXHRcdFx0XHRcdFx0Zm9vZHM6IGZvb2RzLFxuXHRcdFx0XHRcdFx0bG9hZGluZzogZmFsc2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9KTtcblx0XHR9XG5cdH0sXG5cdGJhY2tCdXR0b25DbGljazogZnVuY3Rpb24gYmFja0J1dHRvbkNsaWNrKCkge1xuXHRcdHZhciBwYXJlbnRDYXRlZ29yeSA9IFV0aWxzLmZpbmRQYXJlbnRDYXRlZ29yeShmb29kQ2F0ZWdvcmllcywgdGhpcy5zdGF0ZS5zZWxlY3RlZEZvb2RDYXRlZ29yeS5pZCk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBwYXJlbnRDYXRlZ29yeSxcblx0XHRcdGZvb2RzOiBbXVxuXHRcdH0pO1xuXHR9LFxuXHRyb290QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIHJvb3RCdXR0b25DbGljaygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkRm9vZENhdGVnb3J5OiBmb29kQ2F0ZWdvcmllcyxcblx0XHRcdGZvb2RzOiBbXVxuXHRcdH0pO1xuXHR9XG59KTtcblxudmFyIENhdGVnb3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0NhdGVnb3J5JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgaWNvbkNsYXNzID0gJ2ZsYXRpY29uLScgKyB0aGlzLnByb3BzLmNhdGVnb3J5LmlkO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnYnV0dG9uJyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnZm9vZF9zZWxlY3Rvci1jYXRlZ29yeScsIG9uQ2xpY2s6IHRoaXMuY2xpY2sgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6IGljb25DbGFzcy50b0xvd2VyQ2FzZSgpIH0pXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5jYXRlZ29yeS5uYW1lXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHRjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG5cdFx0dGhpcy5wcm9wcy5zZWxlY3RDYXRlZ29yeSh0aGlzLnByb3BzLmNhdGVnb3J5LmlkKTtcblx0fVxufSk7XG5cbnZhciBJbmdyZWRpZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0luZ3JlZGllbnQnLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItaW5ncmVkaWVudCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0dGhpcy5wcm9wcy5pbmdyZWRpZW50Lm5hbWUsXG5cdFx0XHRcdCcsICcsXG5cdFx0XHRcdHRoaXMucHJvcHMuaW5ncmVkaWVudC5kZXNjcmlwdGlvblxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2Zvb2Rfc2VsZWN0b3ItY2F0ZWdvcnknLCBvbkNsaWNrOiB0aGlzLmFkZCB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZmxhdGljb24tYWRkJyB9KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHQnQWRkJ1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdGFkZDogZnVuY3Rpb24gYWRkKCkge1xuXHRcdHRoaXMucHJvcHMuYWRkKHRoaXMucHJvcHMuaW5ncmVkaWVudC5pZCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb2RTZWxlY3RvcjtcblxuaWYgKGNzLmlzRGV2TW9kZSgnZm9vZF9zZWxlY3RvcicpKSB7XG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEZvb2RTZWxlY3RvciwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWZvb2Rfc2VsZWN0b3InKSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmb29kU2VsZWN0b3JVdGlscyA9IHtcblx0ZmluZENhdGVnb3J5OiBmdW5jdGlvbiBmaW5kQ2F0ZWdvcnkoZm9vZENhdGVnb3JpZXMsIGlkKSB7XG5cdFx0dmFyIGNhdGVnb3J5ID0gXy5maW5kKGZvb2RDYXRlZ29yaWVzLnN1YiwgeyBpZDogaWQgfSk7XG5cblx0XHRpZiAoY2F0ZWdvcnkpIHJldHVybiBjYXRlZ29yeTtlbHNlIHtcblx0XHRcdGlmIChjYXRlZ29yeS5zdWIpIHtcblx0XHRcdFx0Xy5lYWNoKGNhdGVnb3J5LnN1YiwgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0XHRcdFx0dGhpcy5maW5kRm9vZENhdGVnb3J5KGNhdGVnb3J5LnN1YiwgaWQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSByZXR1cm47XG5cdFx0fVxuXHR9LFxuXHQvLyBUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZmluZFBhcmVudENhdGVnb3J5IGZ1bmN0aW9uXG5cdGZpbmRQYXJlbnRDYXRlZ29yeTogZnVuY3Rpb24gZmluZFBhcmVudENhdGVnb3J5KGZvb2RDYXRlZ29yaWVzLCBjaGlsZENhdGVnb3J5SWQpIHtcblx0XHRpZiAoZm9vZENhdGVnb3JpZXMuc3ViKSB7XG5cdFx0XHR2YXIgc2VhcmNoZWRDaGlsZCA9IF8uZmluZChmb29kQ2F0ZWdvcmllcy5zdWIsIHsgaWQ6IGNoaWxkQ2F0ZWdvcnlJZCB9KTtcblxuXHRcdFx0aWYgKHNlYXJjaGVkQ2hpbGQpIHtcblx0XHRcdFx0cmV0dXJuIGZvb2RDYXRlZ29yaWVzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0Xy5lYWNoKGZvb2RDYXRlZ29yaWVzLnN1YiwgZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRcdFx0dmFyIGZvdW5kID0gdGhpcy5maW5kUGFyZW50Q2F0ZWdvcnkoY2hpbGQsIGNoaWxkQ2F0ZWdvcnlJZCk7XG5cblx0XHRcdFx0XHRpZiAoZm91bmQpIHJlc3VsdCA9IGZvdW5kO1xuXHRcdFx0XHR9LCB0aGlzKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZFNlbGVjdG9yVXRpbHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9vZENhdGVnb3JpZXMgPSB7XG5cdGlkOiAncm9vdCcsXG5cdHJvb3Q6IHRydWUsXG5cdHN1YjogW3tcblx0XHRpZDogJ2Jha2VkJyxcblx0XHRuYW1lOiAnYmFrZWQgcHJvZHVjdHMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZ3JhaW5CYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gYmFzZWQgYmFrZWQgcHJvZHVjdHMnLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdncmFpbkZyZWVCYWtlZCcsXG5cdFx0XHRuYW1lOiAnZ3JhaW4gZnJlZSBiYWtlZCBwcm9kdWN0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdiZXZlcmFnZXMnLFxuXHRcdG5hbWU6ICdiZXZlcmFnZXMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnYWxjb2hvbGljJyxcblx0XHRcdG5hbWU6ICdhbGNvaG9saWMnLFxuXHRcdFx0a2V0bzogZmFsc2UsXG5cdFx0XHRwYWxlbzogZmFsc2UsXG5cdFx0XHRzdWI6IFt7XG5cdFx0XHRcdGlkOiAnYmVlcicsXG5cdFx0XHRcdG5hbWU6ICdiZWVyJ1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2Rpc3RpbGxlZCcsXG5cdFx0XHRcdG5hbWU6ICdkaXN0aWxsZWQnXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAnbGlxdW9yJyxcblx0XHRcdFx0bmFtZTogJ2xpcXVvcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd3aW5lJyxcblx0XHRcdFx0bmFtZTogJ3dpbmUnXG5cdFx0XHR9XVxuXHRcdH0sIHtcblx0XHRcdGlkOiAnY29mZmVlJyxcblx0XHRcdG5hbWU6ICdjb2ZmZWUnXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICd0ZWEnLFxuXHRcdFx0bmFtZTogJ3RlYSdcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdjZXJlYWwnLFxuXHRcdG5hbWU6ICdjZXJlYWwgZ3JhaW5zIGFuZCBwYXN0YScsXG5cdFx0a2V0bzogZmFsc2UsXG5cdFx0cGFsZW86IGZhbHNlXG5cdH0sIHtcblx0XHRpZDogJ2RhaXJ5QW5kRWdnJyxcblx0XHRuYW1lOiAnZGFpcnkgYW5kIGVnZycsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdkYWlyeScsXG5cdFx0XHRuYW1lOiAnZGFpcnknLFxuXHRcdFx0cGFsZW86IGZhbHNlXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdlZ2cnLFxuXHRcdFx0bmFtZTogJ2VnZydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmYXRzQW5kT2lscycsXG5cdFx0bmFtZTogJ2ZhdHMgYW5kIG9pbHMnLFxuXHRcdHN1YjogW3tcblx0XHRcdGlkOiAnZmF0cycsXG5cdFx0XHRuYW1lOiAnZmF0cydcblx0XHR9XVxuXHR9LCB7XG5cdFx0aWQ6ICdmaXNoJyxcblx0XHRuYW1lOiAnZmlzaCBhbmQgc2hlbGxmaXNoJ1xuXHR9LCB7XG5cdFx0aWQ6ICdmcnVpdHMnLFxuXHRcdG5hbWU6ICdmcnVpdHMgYW5kIGp1aWNlcydcblx0fSwge1xuXHRcdGlkOiAnbGVndW1lcycsXG5cdFx0bmFtZTogJ2xlZ3VtZXMnLFxuXHRcdGtldG86IGZhbHNlLFxuXHRcdHBhbGVvOiBmYWxzZVxuXHR9LCB7XG5cdFx0aWQ6ICdtZWF0Jyxcblx0XHRuYW1lOiAnbWVhdCcsXG5cdFx0c3ViOiBbe1xuXHRcdFx0aWQ6ICdiZWVmJyxcblx0XHRcdG5hbWU6ICdiZWVmJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAncG9yaycsXG5cdFx0XHRuYW1lOiAncG9yaydcblx0XHR9LCB7XG5cdFx0XHRpZDogJ3BvdWx0cnknLFxuXHRcdFx0bmFtZTogJ3BvdWx0cnknLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2NoaWNrZW4nLFxuXHRcdFx0XHRuYW1lOiAnY2hpY2tlbidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICd0dXJrZXknLFxuXHRcdFx0XHRuYW1lOiAndHVya2V5J1xuXHRcdFx0fSwge1xuXHRcdFx0XHRpZDogJ2R1Y2snLFxuXHRcdFx0XHRuYW1lOiAnZHVjaydcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdnb29zZScsXG5cdFx0XHRcdG5hbWU6ICdnb29zZSdcblx0XHRcdH1dXG5cdFx0fSwge1xuXHRcdFx0aWQ6ICdsYW1iJyxcblx0XHRcdG5hbWU6ICdsYW1iJ1xuXHRcdH0sIHtcblx0XHRcdGlkOiAnZ29hdCcsXG5cdFx0XHRuYW1lOiAnZ29hdCdcblx0XHR9LCB7XG5cdFx0XHRpZDogJ2dhbWUnLFxuXHRcdFx0bmFtZTogJ2dhbWUnLFxuXHRcdFx0c3ViOiBbe1xuXHRcdFx0XHRpZDogJ2RlZXInLFxuXHRcdFx0XHRuYW1lOiAnZGVlcidcblx0XHRcdH0sIHtcblx0XHRcdFx0aWQ6ICdib2FyJyxcblx0XHRcdFx0bmFtZTogJ2JvYXInXG5cdFx0XHR9LCB7XG5cdFx0XHRcdGlkOiAncmFiYml0Jyxcblx0XHRcdFx0bmFtZTogJ3JhYmJpdCdcblx0XHRcdH1dXG5cdFx0fV1cblx0fSwge1xuXHRcdGlkOiAnbnV0cycsXG5cdFx0bmFtZTogJ251dHMgYW5kIHNlZWRzJ1xuXHR9LCB7XG5cdFx0aWQ6ICdzcGljZXMnLFxuXHRcdG5hbWU6ICdzcGljZXMgYW5kIGhlcmJzJ1xuXHR9LCB7XG5cdFx0aWQ6ICd2ZWdldGFibGVzJyxcblx0XHRuYW1lOiAndmVnZXRhYmxlcydcblx0fV1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vZENhdGVnb3JpZXM7Il19
