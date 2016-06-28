(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			"canvas"
		);
	},
	drawPie: function drawPie() {
		if (this.props.macros) {
			// Error, did not draw canvas yet
			var canvas = ReactDOM.findDOMNode(this.refs.canvas);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUGllXCIsXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMuZHJhd1BpZSgpO1xuXHR9LFxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcblx0XHR0aGlzLmRyYXdQaWUoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNhbnZhcyA9IHRoaXMucHJvcHMubWFjcm9zID8gUmVhY3QuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiLCB7IGlkOiBcInBpZS1jYW52YXNcIiwgcmVmOiBcImNhbnZhc1wiLCB3aWR0aDogXCIyMDBcIiwgaGVpZ2h0OiBcIjIwMFwiIH0pIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XCJkaXZcIixcblx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZVwiIH0sXG5cdFx0XHRcImNhbnZhc1wiXG5cdFx0KTtcblx0fSxcblx0ZHJhd1BpZTogZnVuY3Rpb24gZHJhd1BpZSgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5tYWNyb3MpIHtcblx0XHRcdC8vIEVycm9yLCBkaWQgbm90IGRyYXcgY2FudmFzIHlldFxuXHRcdFx0dmFyIGNhbnZhcyA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYW52YXMpO1xuXHRcdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0dmFyIGNlbnRlclggPSAxMDA7XG5cdFx0XHR2YXIgY2VudGVyWSA9IDEwMDtcblx0XHRcdHZhciBhbmdsZVplcm9YID0gMjAwO1xuXHRcdFx0dmFyIGFuZ2xlWmVyb1kgPSAxMDA7XG5cdFx0XHR2YXIgcmFkaXVzID0gMTAwO1xuXHRcdFx0dmFyIGFuZ2xlRmF0ID0gdGhpcy5wcm9wcy5tYWNyb3MuZmF0IC8gNTA7XG5cdFx0XHR2YXIgYW5nbGVQcm90ZWluID0gdGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpbiAvIDUwO1xuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHguYXJjKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcblx0XHRcdGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdibHVlJztcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5tb3ZlVG8oY2VudGVyWCwgY2VudGVyWSk7XG5cdFx0XHRjdHgubGluZVRvKGFuZ2xlWmVyb1gsIGFuZ2xlWmVyb1kpO1xuXHRcdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIDAsIGFuZ2xlRmF0ICogTWF0aC5QSSk7XG5cdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHgubW92ZVRvKGNlbnRlclgsIGNlbnRlclkpO1xuXHRcdFx0Y3R4LmFyYyhjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGFuZ2xlRmF0ICogTWF0aC5QSSwgKGFuZ2xlRmF0ICsgYW5nbGVQcm90ZWluKSAqIE1hdGguUEkpO1xuXHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpZTtcblxuaWYgKGNzLmlzRGV2TW9kZSgncGllJykpIHtcblx0dmFyIG1hY3JvcyA9IHtcblx0XHRjaDogMTAsXG5cdFx0ZmF0OiAyMCxcblx0XHRwcm90ZWluOiA3MFxuXHR9O1xuXG5cdFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFBpZSwgeyBtYWNyb3M6IG1hY3JvcyB9KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcGllJykpO1xufSJdfQ==
