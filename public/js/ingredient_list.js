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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvaW5ncmVkaWVudF9saXN0L2luZ3JlZGllbnRfbGlzdC5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvaW5ncmVkaWVudF9saXN0L2luZ3JlZGllbnRfbGlzdF91dGlscy5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvcGllL3BpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2luZ3JlZGllbnRfbGlzdF91dGlscy5qcycpO1xudmFyIFBpZSA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcGllL3BpZS5qcycpO1xuXG52YXIgSW5ncmVkaWVudExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudExpc3QnLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmdyZWRpZW50czogW10sXG5cdFx0XHRtYWNyb3M6IG51bGxcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zdWJzY3JpYmUoZnVuY3Rpb24gKGluZ3JlZGllbnRzKSB7XG5cdFx0XHR2YXIgbWFjcm9zID0gaW5ncmVkaWVudHMubGVuZ3RoID4gMCA/IFV0aWxzLmNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykgOiBudWxsO1xuXG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGluZ3JlZGllbnRzOiBpbmdyZWRpZW50cyxcblx0XHRcdFx0bWFjcm9zOiBtYWNyb3Ncblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgZm9vZHMgPSBfLm1hcCh0aGlzLnN0YXRlLmluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCwga2V5KSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGtleToga2V5IH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHksXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQudW5pdCxcblx0XHRcdFx0XHQnICcsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5mb29kLm5hbWVcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0XHR7IG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIucmVtb3ZlKGtleSk7XG5cdFx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0J1JlbW92ZSdcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9LCB0aGlzKTtcblxuXHRcdHZhciBtYWNyb3MgPSB0aGlzLnN0YXRlLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5jaC50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2ZhdDogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MuZmF0LnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MucHJvdGVpbi50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdClcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2luZ3JlZGllbnQtbGlzdCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogdGhpcy5zdGF0ZS5tYWNyb3MgfSksXG5cdFx0XHRmb29kcyxcblx0XHRcdG1hY3Jvc1xuXHRcdCk7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xuXHRcdHZhciBpbmdyZWRpZW50cyA9IGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuZ2V0KCk7XG5cdFx0aW5ncmVkaWVudHMuc3BsaWNlKGtleSwgMSk7XG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zZXQoaW5ncmVkaWVudHMpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbmdyZWRpZW50TGlzdDtcblxuaWYgKGNzLmlzRGV2TW9kZSgnaW5ncmVkaWVudF9saXN0JykpIHtcblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5ncmVkaWVudExpc3QsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1pbmdyZWRpZW50X2xpc3QnKSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbmdyZWRpZW50TGlzdFV0aWxzID0ge1xuXHRjYWxjdWxhdGVNYWNyb3M6IGZ1bmN0aW9uIGNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykge1xuXHRcdHZhciBjaHMgPSAwO1xuXHRcdHZhciBmYXRzID0gMDtcblx0XHR2YXIgcHJvdGVpbnMgPSAwO1xuXG5cdFx0Xy5lYWNoKGluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCkge1xuXHRcdFx0Y2hzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmNoX20pO1xuXHRcdFx0ZmF0cyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5mYXRfbSk7XG5cdFx0XHRwcm90ZWlucyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5wcm90ZWluX20pO1xuXHRcdH0pO1xuXG5cdFx0dmFyIHN1bSA9IGNocyArIGZhdHMgKyBwcm90ZWlucztcblx0XHR2YXIgY2hQZXJjZW50ID0gY2hzIC8gc3VtICogMTAwO1xuXHRcdHZhciBmYXRQZXJjZW50ID0gZmF0cyAvIHN1bSAqIDEwMDtcblx0XHR2YXIgcHJvdGVpblBlcmNlbnQgPSBwcm90ZWlucyAvIHN1bSAqIDEwMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRjaDogY2hQZXJjZW50LFxuXHRcdFx0ZmF0OiBmYXRQZXJjZW50LFxuXHRcdFx0cHJvdGVpbjogcHJvdGVpblBlcmNlbnRcblx0XHR9O1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluZ3JlZGllbnRMaXN0VXRpbHM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQaWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiBcIlBpZVwiLFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR0aGlzLmRyYXdQaWUoKTtcblx0fSxcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG5cdFx0dGhpcy5kcmF3UGllKCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjYW52YXMgPSB0aGlzLnByb3BzLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiwgeyBpZDogXCJwaWUtY2FudmFzXCIsIHJlZjogXCJjYW52YXNcIiwgd2lkdGg6IFwiMjAwXCIsIGhlaWdodDogXCIyMDBcIiB9KSA6IG51bGw7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiZGl2XCIsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJwaWVcIiB9LFxuXHRcdFx0Y2FudmFzXG5cdFx0KTtcblx0fSxcblx0ZHJhd1BpZTogZnVuY3Rpb24gZHJhd1BpZSgpIHtcblx0XHR2YXIgY2FudmFzID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmNhbnZhcyk7XG5cdFx0aWYgKGNhbnZhcykge1xuXHRcdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGNlbnRlclggPSAxMDA7XG5cdFx0XHR2YXIgY2VudGVyWSA9IDEwMDtcblx0XHRcdHZhciBhbmdsZVplcm9YID0gMjAwO1xuXHRcdFx0dmFyIGFuZ2xlWmVyb1kgPSAxMDA7XG5cdFx0XHR2YXIgcmFkaXVzID0gMTAwO1xuXHRcdFx0dmFyIGFuZ2xlRmF0ID0gdGhpcy5wcm9wcy5tYWNyb3MuZmF0IC8gNTA7XG5cdFx0XHR2YXIgYW5nbGVQcm90ZWluID0gdGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpbiAvIDUwO1xuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcblx0XHRcdGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdibHVlJztcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0XHRjdHgubGluZVRvKGFuZ2xlWmVyb1gsIGFuZ2xlWmVyb1kpO1xuXHRcdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIGFuZ2xlRmF0ICogTWF0aC5QSSk7XG5cdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHgubW92ZVRvKGNlbnRlclgsIGNlbnRlclkpO1xuXHRcdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGFuZ2xlRmF0ICogTWF0aC5QSSwgKGFuZ2xlRmF0ICsgYW5nbGVQcm90ZWluKSAqIE1hdGguUEkpO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcblxuaWYgKGNzLmlzRGV2TW9kZSgncGllJykpIHtcblx0dmFyIG1hY3JvcyA9IHtcblx0XHRjaDogMTAsXG5cdFx0ZmF0OiAyMCxcblx0XHRwcm90ZWluOiA3MFxuXHR9O1xuXG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFBpZSwgeyBtYWNyb3M6IG1hY3JvcyB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcGllJykpO1xufSJdfQ==
