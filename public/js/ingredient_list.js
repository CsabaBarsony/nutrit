(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			React.createElement(Pie, { macros: this.state.macros }),
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
},{"../../components/pie/pie.js":3,"./ingredient_list_utils.js":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
		return React.createElement(
			"div",
			{ className: "pie" },
			React.createElement(
				"div",
				{ className: "pie-segment pie-ch" },
				"ch: ",
				this.props.macros.ch.toFixed(0),
				"%"
			),
			React.createElement(
				"div",
				{ className: "pie-segment pie-fat" },
				"fat: ",
				this.props.macros.fat.toFixed(0),
				"%"
			),
			React.createElement(
				"div",
				{ className: "pie-segment pie-protein" },
				"protein: ",
				this.props.macros.protein.toFixed(0),
				"%"
			),
			React.createElement("canvas", { id: "pie-canvas", ref: "canvas", width: "200", height: "200" })
		);
	},
	drawPie: function drawPie() {
		var centerX = 100;
		var centerY = 100;
		var angleZeroX = 200;
		var angleZeroY = 100;
		var radius = 100;
		var angleFat = this.props.macros.fat / 50;
		var angleProtein = this.props.macros.protein / 50;
		var ctx = ReactDOM.findDOMNode(this.refs.canvas).getContext('2d');

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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9pbmdyZWRpZW50X2xpc3RfdXRpbHMuanMnKTtcbnZhciBQaWUgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3BpZS9waWUuanMnKTtcblxudmFyIEluZ3JlZGllbnRMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0luZ3JlZGllbnRMaXN0JyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5ncmVkaWVudHM6IFtdLFxuXHRcdFx0bWFjcm9zOiBudWxsXG5cdFx0fTtcblx0fSxcblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc3Vic2NyaWJlKGZ1bmN0aW9uIChpbmdyZWRpZW50cykge1xuXHRcdFx0dmFyIG1hY3JvcyA9IGluZ3JlZGllbnRzLmxlbmd0aCA+IDAgPyBVdGlscy5jYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIDogbnVsbDtcblxuXHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpbmdyZWRpZW50czogaW5ncmVkaWVudHMsXG5cdFx0XHRcdG1hY3JvczogbWFjcm9zXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGZvb2RzID0gXy5tYXAodGhpcy5zdGF0ZS5pbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQsIGtleSkge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBrZXk6IGtleSB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5LFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuYW1vdW50LnVuaXQsXG5cdFx0XHRcdFx0JyAnLFxuXHRcdFx0XHRcdGluZ3JlZGllbnQuZm9vZC5uYW1lXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdFx0eyBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXMyLnJlbW92ZShrZXkpO1xuXHRcdFx0XHRcdFx0fSB9LFxuXHRcdFx0XHRcdCdSZW1vdmUnXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fSwgdGhpcyk7XG5cblx0XHR2YXIgbWFjcm9zID0gdGhpcy5zdGF0ZS5tYWNyb3MgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChQaWUsIHsgbWFjcm9zOiB0aGlzLnN0YXRlLm1hY3JvcyB9KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnY2g6ICcsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLmNoLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnZmF0OiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5mYXQudG9GaXhlZCgwKSxcblx0XHRcdFx0JyUnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdwcm90ZWluOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5wcm90ZWluLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KVxuXHRcdCkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnaW5ncmVkaWVudC1saXN0JyB9LFxuXHRcdFx0Zm9vZHMsXG5cdFx0XHRtYWNyb3Ncblx0XHQpO1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0XHR2YXIgaW5ncmVkaWVudHMgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdGluZ3JlZGllbnRzLnNwbGljZShrZXksIDEpO1xuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnRzKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5ncmVkaWVudExpc3Q7XG5cbmlmIChjcy5pc0Rldk1vZGUoJ2luZ3JlZGllbnRfbGlzdCcpKSB7XG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnRMaXN0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtaW5ncmVkaWVudF9saXN0JykpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaW5ncmVkaWVudExpc3RVdGlscyA9IHtcblx0Y2FsY3VsYXRlTWFjcm9zOiBmdW5jdGlvbiBjYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIHtcblx0XHR2YXIgY2hzID0gMDtcblx0XHR2YXIgZmF0cyA9IDA7XG5cdFx0dmFyIHByb3RlaW5zID0gMDtcblxuXHRcdF8uZWFjaChpbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQpIHtcblx0XHRcdGNocyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5jaF9tKTtcblx0XHRcdGZhdHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuZmF0X20pO1xuXHRcdFx0cHJvdGVpbnMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QucHJvdGVpbl9tKTtcblx0XHR9KTtcblxuXHRcdHZhciBzdW0gPSBjaHMgKyBmYXRzICsgcHJvdGVpbnM7XG5cdFx0dmFyIGNoUGVyY2VudCA9IGNocyAvIHN1bSAqIDEwMDtcblx0XHR2YXIgZmF0UGVyY2VudCA9IGZhdHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIHByb3RlaW5QZXJjZW50ID0gcHJvdGVpbnMgLyBzdW0gKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2g6IGNoUGVyY2VudCxcblx0XHRcdGZhdDogZmF0UGVyY2VudCxcblx0XHRcdHByb3RlaW46IHByb3RlaW5QZXJjZW50XG5cdFx0fTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbmdyZWRpZW50TGlzdFV0aWxzOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUGllID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogXCJQaWVcIixcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dGhpcy5kcmF3UGllKCk7XG5cdH0sXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuXHRcdHRoaXMuZHJhd1BpZSgpO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiZGl2XCIsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJwaWVcIiB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0eyBjbGFzc05hbWU6IFwicGllLXNlZ21lbnQgcGllLWNoXCIgfSxcblx0XHRcdFx0XCJjaDogXCIsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLmNoLnRvRml4ZWQoMCksXG5cdFx0XHRcdFwiJVwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0eyBjbGFzc05hbWU6IFwicGllLXNlZ21lbnQgcGllLWZhdFwiIH0sXG5cdFx0XHRcdFwiZmF0OiBcIixcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MuZmF0LnRvRml4ZWQoMCksXG5cdFx0XHRcdFwiJVwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJkaXZcIixcblx0XHRcdFx0eyBjbGFzc05hbWU6IFwicGllLXNlZ21lbnQgcGllLXByb3RlaW5cIiB9LFxuXHRcdFx0XHRcInByb3RlaW46IFwiLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5wcm90ZWluLnRvRml4ZWQoMCksXG5cdFx0XHRcdFwiJVwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiLCB7IGlkOiBcInBpZS1jYW52YXNcIiwgcmVmOiBcImNhbnZhc1wiLCB3aWR0aDogXCIyMDBcIiwgaGVpZ2h0OiBcIjIwMFwiIH0pXG5cdFx0KTtcblx0fSxcblx0ZHJhd1BpZTogZnVuY3Rpb24gZHJhd1BpZSgpIHtcblx0XHR2YXIgY2VudGVyWCA9IDEwMDtcblx0XHR2YXIgY2VudGVyWSA9IDEwMDtcblx0XHR2YXIgYW5nbGVaZXJvWCA9IDIwMDtcblx0XHR2YXIgYW5nbGVaZXJvWSA9IDEwMDtcblx0XHR2YXIgcmFkaXVzID0gMTAwO1xuXHRcdHZhciBhbmdsZUZhdCA9IHRoaXMucHJvcHMubWFjcm9zLmZhdCAvIDUwO1xuXHRcdHZhciBhbmdsZVByb3RlaW4gPSB0aGlzLnByb3BzLm1hY3Jvcy5wcm90ZWluIC8gNTA7XG5cdFx0dmFyIGN0eCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpLmdldENvbnRleHQoJzJkJyk7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XG5cdFx0Y3R4LmZpbGwoKTtcblx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgubW92ZVRvKGNlbnRlclgsIGNlbnRlclkpO1xuXHRcdGN0eC5saW5lVG8oYW5nbGVaZXJvWCwgYW5nbGVaZXJvWSk7XG5cdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIGFuZ2xlRmF0ICogTWF0aC5QSSk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdGN0eC5maWxsKCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGFuZ2xlRmF0ICogTWF0aC5QSSwgKGFuZ2xlRmF0ICsgYW5nbGVQcm90ZWluKSAqIE1hdGguUEkpO1xuXHRcdGN0eC5maWxsKCk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQaWU7XG5cbmlmIChjcy5pc0Rldk1vZGUoJ3BpZScpKSB7XG5cdHZhciBtYWNyb3MgPSB7XG5cdFx0Y2g6IDEwLFxuXHRcdGZhdDogMjAsXG5cdFx0cHJvdGVpbjogNzBcblx0fTtcblxuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChQaWUsIHsgbWFjcm9zOiBtYWNyb3MgfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LXBpZScpKTtcbn0iXX0=
