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
		var canvas = React.findDOMNode(this.refs.canvas);
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#a0c';
		ctx.fillRect(10, 10, 50, 10);
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
			React.createElement('canvas', { id: 'pie-canvas', ref: 'canvas', width: '200', height: '100' })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0LmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbmdyZWRpZW50X2xpc3QvaW5ncmVkaWVudF9saXN0X3V0aWxzLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL2luZ3JlZGllbnRfbGlzdF91dGlscy5qcycpO1xudmFyIFBpZSA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcGllL3BpZS5qcycpO1xuXG52YXIgSW5ncmVkaWVudExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5ncmVkaWVudExpc3QnLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbmdyZWRpZW50czogW10sXG5cdFx0XHRtYWNyb3M6IG51bGxcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0YmVsbGEuZGF0YS5pbmdyZWRpZW50cy5zdWJzY3JpYmUoZnVuY3Rpb24gKGluZ3JlZGllbnRzKSB7XG5cdFx0XHR2YXIgbWFjcm9zID0gaW5ncmVkaWVudHMubGVuZ3RoID4gMCA/IFV0aWxzLmNhbGN1bGF0ZU1hY3JvcyhpbmdyZWRpZW50cykgOiBudWxsO1xuXG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGluZ3JlZGllbnRzOiBpbmdyZWRpZW50cyxcblx0XHRcdFx0bWFjcm9zOiBtYWNyb3Ncblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgZm9vZHMgPSBfLm1hcCh0aGlzLnN0YXRlLmluZ3JlZGllbnRzLCBmdW5jdGlvbiAoaW5ncmVkaWVudCwga2V5KSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGtleToga2V5IH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHksXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5hbW91bnQudW5pdCxcblx0XHRcdFx0XHQnICcsXG5cdFx0XHRcdFx0aW5ncmVkaWVudC5mb29kLm5hbWVcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnYnV0dG9uJyxcblx0XHRcdFx0XHR7IG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIucmVtb3ZlKGtleSk7XG5cdFx0XHRcdFx0XHR9IH0sXG5cdFx0XHRcdFx0J1JlbW92ZSdcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9LCB0aGlzKTtcblxuXHRcdHZhciBtYWNyb3MgPSB0aGlzLnN0YXRlLm1hY3JvcyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnN0YXRlLm1hY3Jvcy5jaC50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2ZhdDogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MuZmF0LnRvRml4ZWQoMCksXG5cdFx0XHRcdCclJ1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5zdGF0ZS5tYWNyb3MucHJvdGVpbi50b0ZpeGVkKDApLFxuXHRcdFx0XHQnJSdcblx0XHRcdClcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2luZ3JlZGllbnQtbGlzdCcgfSxcblx0XHRcdGZvb2RzLFxuXHRcdFx0bWFjcm9zXG5cdFx0KTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdFx0dmFyIGluZ3JlZGllbnRzID0gYmVsbGEuZGF0YS5pbmdyZWRpZW50cy5nZXQoKTtcblx0XHRpbmdyZWRpZW50cy5zcGxpY2Uoa2V5LCAxKTtcblx0XHRiZWxsYS5kYXRhLmluZ3JlZGllbnRzLnNldChpbmdyZWRpZW50cyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZ3JlZGllbnRMaXN0O1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdpbmdyZWRpZW50X2xpc3QnKSkge1xuXHRSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChJbmdyZWRpZW50TGlzdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250LWluZ3JlZGllbnRfbGlzdCcpKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluZ3JlZGllbnRMaXN0VXRpbHMgPSB7XG5cdGNhbGN1bGF0ZU1hY3JvczogZnVuY3Rpb24gY2FsY3VsYXRlTWFjcm9zKGluZ3JlZGllbnRzKSB7XG5cdFx0dmFyIGNocyA9IDA7XG5cdFx0dmFyIGZhdHMgPSAwO1xuXHRcdHZhciBwcm90ZWlucyA9IDA7XG5cblx0XHRfLmVhY2goaW5ncmVkaWVudHMsIGZ1bmN0aW9uIChpbmdyZWRpZW50KSB7XG5cdFx0XHRjaHMgKz0gaW5ncmVkaWVudC5hbW91bnQucXVhbnRpdHkgKiBwYXJzZUludChpbmdyZWRpZW50LmZvb2QuY2hfbSk7XG5cdFx0XHRmYXRzICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLmZhdF9tKTtcblx0XHRcdHByb3RlaW5zICs9IGluZ3JlZGllbnQuYW1vdW50LnF1YW50aXR5ICogcGFyc2VJbnQoaW5ncmVkaWVudC5mb29kLnByb3RlaW5fbSk7XG5cdFx0fSk7XG5cblx0XHR2YXIgc3VtID0gY2hzICsgZmF0cyArIHByb3RlaW5zO1xuXHRcdHZhciBjaFBlcmNlbnQgPSBjaHMgLyBzdW0gKiAxMDA7XG5cdFx0dmFyIGZhdFBlcmNlbnQgPSBmYXRzIC8gc3VtICogMTAwO1xuXHRcdHZhciBwcm90ZWluUGVyY2VudCA9IHByb3RlaW5zIC8gc3VtICogMTAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGNoOiBjaFBlcmNlbnQsXG5cdFx0XHRmYXQ6IGZhdFBlcmNlbnQsXG5cdFx0XHRwcm90ZWluOiBwcm90ZWluUGVyY2VudFxuXHRcdH07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5ncmVkaWVudExpc3RVdGlsczsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQaWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUGllJyxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dmFyIGNhbnZhcyA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpO1xuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjdHguZmlsbFN0eWxlID0gJyNhMGMnO1xuXHRcdGN0eC5maWxsUmVjdCgxMCwgMTAsIDUwLCAxMCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ3BpZScgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1jaCcgfSxcblx0XHRcdFx0J2NoOiAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5jaFxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1mYXQnIH0sXG5cdFx0XHRcdCdmYXQ6ICcsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLmZhdFxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ3BpZS1zZWdtZW50IHBpZS1wcm90ZWluJyB9LFxuXHRcdFx0XHQncHJvdGVpbjogJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpblxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycsIHsgaWQ6ICdwaWUtY2FudmFzJywgcmVmOiAnY2FudmFzJywgd2lkdGg6ICcyMDAnLCBoZWlnaHQ6ICcxMDAnIH0pXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAyMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59Il19
