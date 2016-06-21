(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Utils = require('./ingredient_list_utils.js');

var IngredientList = {
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
				"div",
				{ key: key },
				React.createElement(
					"span",
					null,
					ingredient.amount.quantity,
					ingredient.amount.unit,
					" ",
					ingredient.food.name
				),
				React.createElement(
					"button",
					{ onClick: function onClick() {
							return _this2.remove(key);
						} },
					"Remove"
				)
			);
		}, this);

		var macros = this.state.macros ? React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				null,
				"ch: ",
				this.state.macros.ch.toFixed(0),
				"%"
			),
			React.createElement(
				"div",
				null,
				"fat: ",
				this.state.macros.fat.toFixed(0),
				"%"
			),
			React.createElement(
				"div",
				null,
				"protein: ",
				this.state.macros.protein.toFixed(0),
				"%"
			)
		) : null;

		return React.createElement(
			"div",
			{ className: "ingredient-list" },
			foods,
			macros
		);
	},
	remove: function remove(key) {
		var ingredients = bella.data.ingredients.get();
		ingredients.splice(key, 1);
		bella.data.ingredients.set(ingredients);
	}
};

var Pie = React.createClass({
	displayName: "Pie",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "pie" },
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

var IngredientListComponent = React.createClass(IngredientList);

ReactDOM.render(React.createElement(IngredientListComponent, null), document.getElementById('ingredient-list-cont'));
},{"./ingredient_list_utils.js":2}],2:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMnKTtcblxudmFyIEluZ3JlZGllbnRMaXN0ID0ge1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5ncmVkaWVudHM6IFtdLFxuXHRcdFx0bWFjcm9zOiBudWxsXG5cdFx0fTtcblx0fSxcblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc3Vic2NyaWJlKGZ1bmN0aW9uIChpbmdyZWRpZW50cykge1xuXHRcdFx0dmFyIG1hY3JvcyA9IGluZ3JlZGllbnRzLmxlbmd0aCA+IDAgPyBVdGlscy5jYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIDogbnVsbDtcblxuXHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpbmdyZWRpZW50czogaW5ncmVkaWVudHMsXG5cdFx0XHRcdG1hY3JvczogbWFjcm9zXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGZvb2RzID0gXy5tYXAodGhpcy5zdGF0ZS5pbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQsIGtleSkge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcImRpdlwiLFxuXHRcdFx0XHR7IGtleToga2V5IH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XCJzcGFuXCIsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC51bml0LFxuXHRcdFx0XHRcdFwiIFwiLFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuZm9vZC5uYW1lXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XCJidXR0b25cIixcblx0XHRcdFx0XHR7IG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIucmVtb3ZlKGtleSk7XG5cdFx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0XCJSZW1vdmVcIlxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0sIHRoaXMpO1xuXG5cdFx0dmFyIG1hY3JvcyA9IHRoaXMuc3RhdGUubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiZGl2XCIsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XCJjaDogXCIsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLmNoLnRvRml4ZWQoMCksXG5cdFx0XHRcdFwiJVwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XCJmYXQ6IFwiLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5mYXQudG9GaXhlZCgwKSxcblx0XHRcdFx0XCIlXCJcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcImRpdlwiLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcInByb3RlaW46IFwiLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5wcm90ZWluLnRvRml4ZWQoMCksXG5cdFx0XHRcdFwiJVwiXG5cdFx0XHQpXG5cdFx0KSA6IG51bGw7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiZGl2XCIsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJpbmdyZWRpZW50LWxpc3RcIiB9LFxuXHRcdFx0Zm9vZHMsXG5cdFx0XHRtYWNyb3Ncblx0XHQpO1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0XHR2YXIgaW5ncmVkaWVudHMgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdGluZ3JlZGllbnRzLnNwbGljZShrZXksIDEpO1xuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnRzKTtcblx0fVxufTtcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUGllXCIsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcImRpdlwiLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwicGllXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZS1zZWdtZW50XCIgfSxcblx0XHRcdFx0XCJhXCJcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcImRpdlwiLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogXCJwaWUtc2VnbWVudFwiIH0sXG5cdFx0XHRcdFwiYlwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0eyBjbGFzc05hbWU6IFwicGllLXNlZ21lbnRcIiB9LFxuXHRcdFx0XHRcImNcIlxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgSW5ncmVkaWVudExpc3RDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyhJbmdyZWRpZW50TGlzdCk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnRMaXN0Q29tcG9uZW50LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZ3JlZGllbnQtbGlzdC1jb250JykpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaW5ncmVkaWVudExpc3RVdGlscyA9IHtcblx0Y2FsY3VsYXRlTWFjcm9zOiBmdW5jdGlvbiBjYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIHtcblx0XHR2YXIgY2hzID0gMDtcblx0XHR2YXIgZmF0cyA9IDA7XG5cdFx0dmFyIHByb3RlaW5zID0gMDtcblxuXHRcdF8uZWFjaChpbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQpIHtcblx0XHRcdGNocyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5jaF9tKTtcblx0XHRcdGZhdHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuZmF0X20pO1xuXHRcdFx0cHJvdGVpbnMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QucHJvdGVpbl9tKTtcblx0XHR9KTtcblxuXHRcdHZhciBzdW0gPSBjaHMgKyBmYXRzICsgcHJvdGVpbnM7XG5cdFx0dmFyIGNoUGVyY2VudCA9IGNocyAvIHN1bSAqIDEwMDtcblx0XHR2YXIgZmF0UGVyY2VudCA9IGZhdHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIHByb3RlaW5QZXJjZW50ID0gcHJvdGVpbnMgLyBzdW0gKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2g6IGNoUGVyY2VudCxcblx0XHRcdGZhdDogZmF0UGVyY2VudCxcblx0XHRcdHByb3RlaW46IHByb3RlaW5QZXJjZW50XG5cdFx0fTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbmdyZWRpZW50TGlzdFV0aWxzOyJdfQ==
