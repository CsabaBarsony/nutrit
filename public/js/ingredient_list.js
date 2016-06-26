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
'use strict';

var Pie = React.createClass({
	displayName: 'Pie',

	componentDidMount: function componentDidMount() {
		var centerX = 100;
		var centerY = 100;
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
		ctx.moveTo(100, 100);
		ctx.moveTo(200, 100);
		ctx.arc(centerX, centerY, radius, 0, angleFat * Math.PI, false);
		ctx.lineTo(100, 100);
		ctx.fill();
		ctx.closePath();

		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.moveTo(100, 100);
		ctx.arc(centerX, centerY, radius, angleFat * Math.PI, (angleFat + angleProtein) * Math.PI, false);
		ctx.lineTo(100, 100);
		ctx.fill();
		ctx.closePath();
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'pie' },
			React.createElement(
				'div',
				{ className: 'pie-segment pie-ch' },
				'ch: ',
				this.props.macros.ch
			),
			React.createElement(
				'div',
				{ className: 'pie-segment pie-fat' },
				'fat: ',
				this.props.macros.fat
			),
			React.createElement(
				'div',
				{ className: 'pie-segment pie-protein' },
				'protein: ',
				this.props.macros.protein
			),
			React.createElement('canvas', { id: 'pie-canvas', ref: 'canvas', width: '200', height: '200' })
		);
	}
});

module.exports = Pie;

if (cs.isDevMode('pie')) {
	var macros = {
		ch: 20,
		fat: 20,
		protein: 70
	};

	ReactDOM.render(React.createElement(Pie, { macros: macros }), document.getElementById('cont-pie'));
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzJyk7XG52YXIgUGllID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9waWUvcGllLmpzJyk7XG5cbnZhciBJbmdyZWRpZW50TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbmdyZWRpZW50TGlzdCcsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZ3JlZGllbnRzOiBbXSxcblx0XHRcdG1hY3JvczogbnVsbFxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnN1YnNjcmliZShmdW5jdGlvbiAoaW5ncmVkaWVudHMpIHtcblx0XHRcdHZhciBtYWNyb3MgPSBpbmdyZWRpZW50cy5sZW5ndGggPiAwID8gVXRpbHMuY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSA6IG51bGw7XG5cblx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aW5ncmVkaWVudHM6IGluZ3JlZGllbnRzLFxuXHRcdFx0XHRtYWNyb3M6IG1hY3Jvc1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBmb29kcyA9IF8ubWFwKHRoaXMuc3RhdGUuaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50LCBrZXkpIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsga2V5OiBrZXkgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmFtb3VudC51bml0LFxuXHRcdFx0XHRcdCcgJyxcblx0XHRcdFx0XHRpbmdyZWRpZW50LmZvb2QubmFtZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdidXR0b24nLFxuXHRcdFx0XHRcdHsgb25DbGljazogZnVuY3Rpb24gb25DbGljaygpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzMi5yZW1vdmUoa2V5KTtcblx0XHRcdFx0XHRcdH0gfSxcblx0XHRcdFx0XHQnUmVtb3ZlJ1xuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0sIHRoaXMpO1xuXG5cdFx0dmFyIG1hY3JvcyA9IHRoaXMuc3RhdGUubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnY2g6ICcsXG5cdFx0XHRcdHRoaXMuc3RhdGUubWFjcm9zLmNoLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnZmF0OiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5mYXQudG9GaXhlZCgwKSxcblx0XHRcdFx0JyUnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdwcm90ZWluOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5wcm90ZWluLnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KVxuXHRcdCkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnaW5ncmVkaWVudC1saXN0JyB9LFxuXHRcdFx0Zm9vZHMsXG5cdFx0XHRtYWNyb3Ncblx0XHQpO1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0XHR2YXIgaW5ncmVkaWVudHMgPSBiZWxsYS5kYXRhLmluZ3JlZGllbnRzLmdldCgpO1xuXHRcdGluZ3JlZGllbnRzLnNwbGljZShrZXksIDEpO1xuXHRcdGJlbGxhLmRhdGEuaW5ncmVkaWVudHMuc2V0KGluZ3JlZGllbnRzKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5ncmVkaWVudExpc3Q7XG5cbmlmIChjcy5pc0Rldk1vZGUoJ2luZ3JlZGllbnRfbGlzdCcpKSB7XG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEluZ3JlZGllbnRMaXN0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtaW5ncmVkaWVudF9saXN0JykpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaW5ncmVkaWVudExpc3RVdGlscyA9IHtcblx0Y2FsY3VsYXRlTWFjcm9zOiBmdW5jdGlvbiBjYWxjdWxhdGVNYWNyb3MoaW5ncmVkaWVudHMpIHtcblx0XHR2YXIgY2hzID0gMDtcblx0XHR2YXIgZmF0cyA9IDA7XG5cdFx0dmFyIHByb3RlaW5zID0gMDtcblxuXHRcdF8uZWFjaChpbmdyZWRpZW50cywgZnVuY3Rpb24gKGluZ3JlZGllbnQpIHtcblx0XHRcdGNocyArPSBpbmdyZWRpZW50LmFtb3VudC5xdWFudGl0eSAqIHBhcnNlSW50KGluZ3JlZGllbnQuZm9vZC5jaF9tKTtcblx0XHRcdGZhdHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuZmF0X20pO1xuXHRcdFx0cHJvdGVpbnMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QucHJvdGVpbl9tKTtcblx0XHR9KTtcblxuXHRcdHZhciBzdW0gPSBjaHMgKyBmYXRzICsgcHJvdGVpbnM7XG5cdFx0dmFyIGNoUGVyY2VudCA9IGNocyAvIHN1bSAqIDEwMDtcblx0XHR2YXIgZmF0UGVyY2VudCA9IGZhdHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIHByb3RlaW5QZXJjZW50ID0gcHJvdGVpbnMgLyBzdW0gKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2g6IGNoUGVyY2VudCxcblx0XHRcdGZhdDogZmF0UGVyY2VudCxcblx0XHRcdHByb3RlaW46IHByb3RlaW5QZXJjZW50XG5cdFx0fTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbmdyZWRpZW50TGlzdFV0aWxzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdQaWUnLFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgY2VudGVyWCA9IDEwMDtcblx0XHR2YXIgY2VudGVyWSA9IDEwMDtcblx0XHR2YXIgcmFkaXVzID0gMTAwO1xuXHRcdHZhciBhbmdsZUZhdCA9IHRoaXMucHJvcHMubWFjcm9zLmZhdCAvIDUwO1xuXHRcdHZhciBhbmdsZVByb3RlaW4gPSB0aGlzLnByb3BzLm1hY3Jvcy5wcm90ZWluIC8gNTA7XG5cdFx0dmFyIGN0eCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpLmdldENvbnRleHQoJzJkJyk7XG5cblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XG5cdFx0Y3R4LmZpbGwoKTtcblx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgubW92ZVRvKDEwMCwgMTAwKTtcblx0XHRjdHgubW92ZVRvKDIwMCwgMTAwKTtcblx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgYW5nbGVGYXQgKiBNYXRoLlBJLCBmYWxzZSk7XG5cdFx0Y3R4LmxpbmVUbygxMDAsIDEwMCk7XG5cdFx0Y3R4LmZpbGwoKTtcblx0XHRjdHguY2xvc2VQYXRoKCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGN0eC5tb3ZlVG8oMTAwLCAxMDApO1xuXHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBhbmdsZUZhdCAqIE1hdGguUEksIChhbmdsZUZhdCArIGFuZ2xlUHJvdGVpbikgKiBNYXRoLlBJLCBmYWxzZSk7XG5cdFx0Y3R4LmxpbmVUbygxMDAsIDEwMCk7XG5cdFx0Y3R4LmZpbGwoKTtcblx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ3BpZScgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1jaCcgfSxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5jaFxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1mYXQnIH0sXG5cdFx0XHRcdCdmYXQ6ICcsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLmZhdFxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1wcm90ZWluJyB9LFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpblxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycsIHsgaWQ6ICdwaWUtY2FudmFzJywgcmVmOiAnY2FudmFzJywgd2lkdGg6ICcyMDAnLCBoZWlnaHQ6ICcyMDAnIH0pXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAyMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59Il19
