(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Publisher = React.createClass({
	displayName: "Publisher",

	getInitialState: function getInitialState() {
		return {
			show: publisher.show,
			data: {
				name: publisher.data.name,
				content: publisher.data.content
			}
		};
	},
	render: function render() {
		return this.state.show ? React.createElement(
			"div",
			null,
			React.createElement("textarea", {
				rows: "10",
				cols: "100",
				ref: "dataContent",
				defaultValue: this.state.data.content }),
			React.createElement("br", null),
			React.createElement("input", { type: "text", ref: "dataName", defaultValue: this.state.data.name }),
			React.createElement("br", null),
			React.createElement(
				"button",
				{ onClick: this.publish },
				"Publish"
			),
			React.createElement(
				"button",
				{ onClick: this.toggle },
				"Hide Publisher"
			)
		) : React.createElement(
			"button",
			{ onClick: this.toggle },
			"Show Publisher"
		);
	},
	publish: function publish() {
		bella.data[this.refs.dataName.value].set(JSON.parse(this.refs.dataContent.value));
	},
	toggle: function toggle() {
		this.setState({ show: !this.state.show });
	}
});

ReactDOM.render(React.createElement(Publisher, null), document.getElementById('cont-publisher'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvcHVibGlzaGVyL3B1Ymxpc2hlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFB1Ymxpc2hlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUHVibGlzaGVyXCIsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IHB1Ymxpc2hlci5zaG93LFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRuYW1lOiBwdWJsaXNoZXIuZGF0YS5uYW1lLFxuXHRcdFx0XHRjb250ZW50OiBwdWJsaXNoZXIuZGF0YS5jb250ZW50XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUuc2hvdyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcImRpdlwiLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiLCB7XG5cdFx0XHRcdHJvd3M6IFwiMTBcIixcblx0XHRcdFx0Y29sczogXCIxMDBcIixcblx0XHRcdFx0cmVmOiBcImRhdGFDb250ZW50XCIsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5zdGF0ZS5kYXRhLmNvbnRlbnQgfSksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgeyB0eXBlOiBcInRleHRcIiwgcmVmOiBcImRhdGFOYW1lXCIsIGRlZmF1bHRWYWx1ZTogdGhpcy5zdGF0ZS5kYXRhLm5hbWUgfSksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcImJ1dHRvblwiLFxuXHRcdFx0XHR7IG9uQ2xpY2s6IHRoaXMucHVibGlzaCB9LFxuXHRcdFx0XHRcIlB1Ymxpc2hcIlxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiYnV0dG9uXCIsXG5cdFx0XHRcdHsgb25DbGljazogdGhpcy50b2dnbGUgfSxcblx0XHRcdFx0XCJIaWRlIFB1Ymxpc2hlclwiXG5cdFx0XHQpXG5cdFx0KSA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcImJ1dHRvblwiLFxuXHRcdFx0eyBvbkNsaWNrOiB0aGlzLnRvZ2dsZSB9LFxuXHRcdFx0XCJTaG93IFB1Ymxpc2hlclwiXG5cdFx0KTtcblx0fSxcblx0cHVibGlzaDogZnVuY3Rpb24gcHVibGlzaCgpIHtcblx0XHRiZWxsYS5kYXRhW3RoaXMucmVmcy5kYXRhTmFtZS52YWx1ZV0uc2V0KEpTT04ucGFyc2UodGhpcy5yZWZzLmRhdGFDb250ZW50LnZhbHVlKSk7XG5cdH0sXG5cdHRvZ2dsZTogZnVuY3Rpb24gdG9nZ2xlKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBzaG93OiAhdGhpcy5zdGF0ZS5zaG93IH0pO1xuXHR9XG59KTtcblxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHVibGlzaGVyLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnQtcHVibGlzaGVyJykpOyJdfQ==
