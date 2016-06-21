(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Publisher = React.createClass({
	displayName: "Publisher",

	getInitialState: function getInitialState() {
		return {
			data: {
				name: publisher.data.name,
				content: publisher.data.content
			}
		};
	},
	render: function render() {
		return React.createElement(
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
			)
		);
	},
	publish: function publish() {
		bella.data[this.refs.dataName.value].set(JSON.parse(this.refs.dataContent.value));
	}
});

ReactDOM.render(React.createElement(Publisher, null), document.getElementById('publisher-cont'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9wdWJsaXNoZXIvcHVibGlzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFB1Ymxpc2hlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6IFwiUHVibGlzaGVyXCIsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bmFtZTogcHVibGlzaGVyLmRhdGEubmFtZSxcblx0XHRcdFx0Y29udGVudDogcHVibGlzaGVyLmRhdGEuY29udGVudFxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XCJkaXZcIixcblx0XHRcdG51bGwsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIiwge1xuXHRcdFx0XHRyb3dzOiBcIjEwXCIsXG5cdFx0XHRcdGNvbHM6IFwiMTAwXCIsXG5cdFx0XHRcdHJlZjogXCJkYXRhQ29udGVudFwiLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUuZGF0YS5jb250ZW50IH0pLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgdHlwZTogXCJ0ZXh0XCIsIHJlZjogXCJkYXRhTmFtZVwiLCBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUuZGF0YS5uYW1lIH0pLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJidXR0b25cIixcblx0XHRcdFx0eyBvbkNsaWNrOiB0aGlzLnB1Ymxpc2ggfSxcblx0XHRcdFx0XCJQdWJsaXNoXCJcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXHRwdWJsaXNoOiBmdW5jdGlvbiBwdWJsaXNoKCkge1xuXHRcdGJlbGxhLmRhdGFbdGhpcy5yZWZzLmRhdGFOYW1lLnZhbHVlXS5zZXQoSlNPTi5wYXJzZSh0aGlzLnJlZnMuZGF0YUNvbnRlbnQudmFsdWUpKTtcblx0fVxufSk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFB1Ymxpc2hlciwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdWJsaXNoZXItY29udCcpKTsiXX0=
