(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGllID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1BpZScsXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHZhciBjYW52YXMgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzKTtcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICcjYTBjJztcblx0XHRjdHguZmlsbFJlY3QoMTAsIDEwLCA1MCwgMTApO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdwaWUnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdwaWUtc2VnbWVudCBwaWUtY2gnIH0sXG5cdFx0XHRcdCdjaDogJyxcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MuY2hcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdwaWUtc2VnbWVudCBwaWUtZmF0JyB9LFxuXHRcdFx0XHQnZmF0OiAnLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5mYXRcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdwaWUtc2VnbWVudCBwaWUtcHJvdGVpbicgfSxcblx0XHRcdFx0J3Byb3RlaW46ICcsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLnByb3RlaW5cblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdjYW52YXMnLCB7IGlkOiAncGllLWNhbnZhcycsIHJlZjogJ2NhbnZhcycsIHdpZHRoOiAnMjAwJywgaGVpZ2h0OiAnMTAwJyB9KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcblxuaWYgKGNzLmlzRGV2TW9kZSgncGllJykpIHtcblx0dmFyIG1hY3JvcyA9IHtcblx0XHRjaDogMjAsXG5cdFx0ZmF0OiAyMCxcblx0XHRwcm90ZWluOiA3MFxuXHR9O1xuXG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFBpZSwgeyBtYWNyb3M6IG1hY3JvcyB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcGllJykpO1xufSJdfQ==
