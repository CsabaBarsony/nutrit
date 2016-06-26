(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQaWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUGllJyxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dmFyIGNlbnRlclggPSAxMDA7XG5cdFx0dmFyIGNlbnRlclkgPSAxMDA7XG5cdFx0dmFyIHJhZGl1cyA9IDEwMDtcblx0XHR2YXIgYW5nbGVGYXQgPSB0aGlzLnByb3BzLm1hY3Jvcy5mYXQgLyA1MDtcblx0XHR2YXIgYW5nbGVQcm90ZWluID0gdGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpbiAvIDUwO1xuXHRcdHZhciBjdHggPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzKS5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xuXHRcdGN0eC5maWxsKCk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdibHVlJztcblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4Lm1vdmVUbygxMDAsIDEwMCk7XG5cdFx0Y3R4Lm1vdmVUbygyMDAsIDEwMCk7XG5cdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIGFuZ2xlRmF0ICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdGN0eC5saW5lVG8oMTAwLCAxMDApO1xuXHRcdGN0eC5maWxsKCk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgubW92ZVRvKDEwMCwgMTAwKTtcblx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVGYXQgKiBNYXRoLlBJLCAoYW5nbGVGYXQgKyBhbmdsZVByb3RlaW4pICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdGN0eC5saW5lVG8oMTAwLCAxMDApO1xuXHRcdGN0eC5maWxsKCk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdwaWUnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdwaWUtc2VnbWVudCBwaWUtY2gnIH0sXG5cdFx0XHRcdCdjaDogJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MuY2hcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdwaWUtc2VnbWVudCBwaWUtZmF0JyB9LFxuXHRcdFx0XHQnZmF0OiAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5mYXRcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdwaWUtc2VnbWVudCBwaWUtcHJvdGVpbicgfSxcblx0XHRcdFx0J3Byb3RlaW46ICcsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLnByb3RlaW5cblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdjYW52YXMnLCB7IGlkOiAncGllLWNhbnZhcycsIHJlZjogJ2NhbnZhcycsIHdpZHRoOiAnMjAwJywgaGVpZ2h0OiAnMjAwJyB9KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcblxuaWYgKGNzLmlzRGV2TW9kZSgncGllJykpIHtcblx0dmFyIG1hY3JvcyA9IHtcblx0XHRjaDogMjAsXG5cdFx0ZmF0OiAyMCxcblx0XHRwcm90ZWluOiA3MFxuXHR9O1xuXG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFBpZSwgeyBtYWNyb3M6IG1hY3JvcyB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcGllJykpO1xufSJdfQ==
