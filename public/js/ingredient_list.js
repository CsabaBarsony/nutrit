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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzJyk7XG52YXIgUGllID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9waWUvcGllLmpzJyk7XG5cbnZhciBJbmdyZWRpZW50TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbmdyZWRpZW50TGlzdCcsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZ3JlZGllbnRzOiBbXSxcblx0XHRcdG1hY3JvczogbnVsbFxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnN1YnNjcmliZShmdW5jdGlvbiAoaW5ncmVkaWVudHMpIHtcblx0XHRcdHZhciBtYWNyb3MgPSBpbmdyZWRpZW50cy5sZW5ndGggPiAwID8gVXRpbHMuY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSA6IG51bGw7XG5cblx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aW5ncmVkaWVudHM6IGluZ3JlZGllbnRzLFxuXHRcdFx0XHRtYWNyb3M6IG1hY3Jvc1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBmb29kcyA9IF8ubWFwKHRoaXMuc3RhdGUuaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50LCBrZXkpIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsga2V5OiBrZXkgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC51bml0LFxuXHRcdFx0XHRcdCcgJyxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmZvb2QubmFtZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHRcdHsgb25DbGljazogZnVuY3Rpb24gb25DbGljaygpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzMi5yZW1vdmUoa2V5KTtcblx0XHRcdFx0XHRcdH0gfSxcblx0XHRcdFx0XHQnUmVtb3ZlJ1xuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0sIHRoaXMpO1xuXG5cdFx0dmFyIG1hY3JvcyA9IHRoaXMuc3RhdGUubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnY2g6ICcsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLmNoLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnZmF0OiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5mYXQudG9GaXhlZCgwKSxcblx0XHRcdFx0JyUnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdwcm90ZWluOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5wcm90ZWluLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KVxuXHRcdCkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnaW5ncmVkaWVudC1saXN0JyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChQaWUsIHsgbWFjcm9zOiB0aGlzLnN0YXRlLm1hY3JvcyB9KSxcblx0XHRcdGZvb2RzLFxuXHRcdFx0bWFjcm9zXG5cdFx0KTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdFx0dmFyIGluZ3JlZGllbnRzID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRpbmdyZWRpZW50cy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50cyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZ3JlZGllbnRMaXN0O1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdpbmdyZWRpZW50X2xpc3QnKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWluZ3JlZGllbnRfbGlzdCcpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluZ3JlZGllbnRMaXN0VXRpbHMgPSB7XG5cdGNhbGN1bGF0ZU1hY3JvczogZnVuY3Rpb24gY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSB7XG5cdFx0dmFyIGNocyA9IDA7XG5cdFx0dmFyIGZhdHMgPSAwO1xuXHRcdHZhciBwcm90ZWlucyA9IDA7XG5cblx0XHRfLmVhY2goaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRjaHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuY2hfbSk7XG5cdFx0XHRmYXRzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmZhdF9tKTtcblx0XHRcdHByb3RlaW5zICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLnByb3RlaW5fbSk7XG5cdFx0fSk7XG5cblx0XHR2YXIgc3VtID0gY2hzICsgZmF0cyArIHByb3RlaW5zO1xuXHRcdHZhciBjaFBlcmNlbnQgPSBjaHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIGZhdFBlcmNlbnQgPSBmYXRzIC8gc3VtICogMTAwO1xuXHRcdHZhciBwcm90ZWluUGVyY2VudCA9IHByb3RlaW5zIC8gc3VtICogMTAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoOiBjaFBlcmNlbnQsXG5cdFx0XHRmYXQ6IGZhdFBlcmNlbnQsXG5cdFx0XHRwcm90ZWluOiBwcm90ZWluUGVyY2VudFxuXHRcdH07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5ncmVkaWVudExpc3RVdGlsczsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUGllXCIsXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMuZHJhd1BpZSgpO1xuXHR9LFxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcblx0XHR0aGlzLmRyYXdQaWUoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNhbnZhcyA9IHRoaXMucHJvcHMubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiLCB7IGlkOiBcInBpZS1jYW52YXNcIiwgcmVmOiBcImNhbnZhc1wiLCB3aWR0aDogXCIyMDBcIiwgaGVpZ2h0OiBcIjIwMFwiIH0pIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XCJkaXZcIixcblx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZVwiIH0sXG5cdFx0XHRjYW52YXNcblx0XHQpO1xuXHR9LFxuXHRkcmF3UGllOiBmdW5jdGlvbiBkcmF3UGllKCkge1xuXHRcdHZhciBjYW52YXMgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzKTtcblx0XHRpZiAoY2FudmFzKSB7XG5cdFx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHR2YXIgY2VudGVyWCA9IDEwMDtcblx0XHRcdHZhciBjZW50ZXJZID0gMTAwO1xuXHRcdFx0dmFyIGFuZ2xlWmVyb1ggPSAyMDA7XG5cdFx0XHR2YXIgYW5nbGVaZXJvWSA9IDEwMDtcblx0XHRcdHZhciByYWRpdXMgPSAxMDA7XG5cdFx0XHR2YXIgYW5nbGVGYXQgPSB0aGlzLnByb3BzLm1hY3Jvcy5mYXQgLyA1MDtcblx0XHRcdHZhciBhbmdsZVByb3RlaW4gPSB0aGlzLnByb3BzLm1hY3Jvcy5wcm90ZWluIC8gNTA7XG5cblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4Lm1vdmVUbyhjZW50ZXJYLCBjZW50ZXJZKTtcblx0XHRcdGN0eC5saW5lVG8oYW5nbGVaZXJvWCwgYW5nbGVaZXJvWSk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgYW5nbGVGYXQgKiBNYXRoLlBJKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdGN0eC5maWxsKCk7XG5cblx0XHRcdGN0eC5maWxsU3R5bGUgPSAncmVkJztcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVGYXQgKiBNYXRoLlBJLCAoYW5nbGVGYXQgKyBhbmdsZVByb3RlaW4pICogTWF0aC5QSSk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAxMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59Il19
