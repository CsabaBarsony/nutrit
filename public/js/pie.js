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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9waWUvcGllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBpZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUGllXCIsXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMuZHJhd1BpZSgpO1xuXHR9LFxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcblx0XHR0aGlzLmRyYXdQaWUoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcImRpdlwiLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwicGllXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZS1zZWdtZW50IHBpZS1jaFwiIH0sXG5cdFx0XHRcdFwiY2g6IFwiLFxuXHRcdFx0XHR0aGlzLnByb3BzLm1hY3Jvcy5jaC50b0ZpeGVkKDApLFxuXHRcdFx0XHRcIiVcIlxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZS1zZWdtZW50IHBpZS1mYXRcIiB9LFxuXHRcdFx0XHRcImZhdDogXCIsXG5cdFx0XHRcdHRoaXMucHJvcHMubWFjcm9zLmZhdC50b0ZpeGVkKDApLFxuXHRcdFx0XHRcIiVcIlxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiZGl2XCIsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcInBpZS1zZWdtZW50IHBpZS1wcm90ZWluXCIgfSxcblx0XHRcdFx0XCJwcm90ZWluOiBcIixcblx0XHRcdFx0dGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpbi50b0ZpeGVkKDApLFxuXHRcdFx0XHRcIiVcIlxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiwgeyBpZDogXCJwaWUtY2FudmFzXCIsIHJlZjogXCJjYW52YXNcIiwgd2lkdGg6IFwiMjAwXCIsIGhlaWdodDogXCIyMDBcIiB9KVxuXHRcdCk7XG5cdH0sXG5cdGRyYXdQaWU6IGZ1bmN0aW9uIGRyYXdQaWUoKSB7XG5cdFx0dmFyIGNlbnRlclggPSAxMDA7XG5cdFx0dmFyIGNlbnRlclkgPSAxMDA7XG5cdFx0dmFyIGFuZ2xlWmVyb1ggPSAyMDA7XG5cdFx0dmFyIGFuZ2xlWmVyb1kgPSAxMDA7XG5cdFx0dmFyIHJhZGl1cyA9IDEwMDtcblx0XHR2YXIgYW5nbGVGYXQgPSB0aGlzLnByb3BzLm1hY3Jvcy5mYXQgLyA1MDtcblx0XHR2YXIgYW5nbGVQcm90ZWluID0gdGhpcy5wcm9wcy5tYWNyb3MucHJvdGVpbiAvIDUwO1xuXHRcdHZhciBjdHggPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY2FudmFzKS5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuXHRcdGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xuXHRcdGN0eC5maWxsKCk7XG5cdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdibHVlJztcblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4Lm1vdmVUbyhjZW50ZXJYLCBjZW50ZXJZKTtcblx0XHRjdHgubGluZVRvKGFuZ2xlWmVyb1gsIGFuZ2xlWmVyb1kpO1xuXHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCAwLCBhbmdsZUZhdCAqIE1hdGguUEkpO1xuXHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRjdHguZmlsbCgpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgubW92ZVRvKGNlbnRlclgsIGNlbnRlclkpO1xuXHRcdGN0eC5hcmMoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBhbmdsZUZhdCAqIE1hdGguUEksIChhbmdsZUZhdCArIGFuZ2xlUHJvdGVpbikgKiBNYXRoLlBJKTtcblx0XHRjdHguZmlsbCgpO1xuXHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGllO1xuXG5pZiAoY3MuaXNEZXZNb2RlKCdwaWUnKSkge1xuXHR2YXIgbWFjcm9zID0ge1xuXHRcdGNoOiAxMCxcblx0XHRmYXQ6IDIwLFxuXHRcdHByb3RlaW46IDcwXG5cdH07XG5cblx0UmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGllLCB7IG1hY3JvczogbWFjcm9zIH0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udC1waWUnKSk7XG59Il19
