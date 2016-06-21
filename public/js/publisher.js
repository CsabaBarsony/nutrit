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

ReactDOM.render(React.createElement(Publisher, null), document.getElementById('publisher-cont'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy9wdWJsaXNoZXIvcHVibGlzaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHVibGlzaGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogXCJQdWJsaXNoZXJcIixcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogcHVibGlzaGVyLnNob3csXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG5hbWU6IHB1Ymxpc2hlci5kYXRhLm5hbWUsXG5cdFx0XHRcdGNvbnRlbnQ6IHB1Ymxpc2hlci5kYXRhLmNvbnRlbnRcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5zdGF0ZS5zaG93ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiZGl2XCIsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHtcblx0XHRcdFx0cm93czogXCIxMFwiLFxuXHRcdFx0XHRjb2xzOiBcIjEwMFwiLFxuXHRcdFx0XHRyZWY6IFwiZGF0YUNvbnRlbnRcIixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLmRhdGEuY29udGVudCB9KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHR5cGU6IFwidGV4dFwiLCByZWY6IFwiZGF0YU5hbWVcIiwgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLmRhdGEubmFtZSB9KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFwiYnV0dG9uXCIsXG5cdFx0XHRcdHsgb25DbGljazogdGhpcy5wdWJsaXNoIH0sXG5cdFx0XHRcdFwiUHVibGlzaFwiXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XCJidXR0b25cIixcblx0XHRcdFx0eyBvbkNsaWNrOiB0aGlzLnRvZ2dsZSB9LFxuXHRcdFx0XHRcIkhpZGUgUHVibGlzaGVyXCJcblx0XHRcdClcblx0XHQpIDogUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFwiYnV0dG9uXCIsXG5cdFx0XHR7IG9uQ2xpY2s6IHRoaXMudG9nZ2xlIH0sXG5cdFx0XHRcIlNob3cgUHVibGlzaGVyXCJcblx0XHQpO1xuXHR9LFxuXHRwdWJsaXNoOiBmdW5jdGlvbiBwdWJsaXNoKCkge1xuXHRcdGJlbGxhLmRhdGFbdGhpcy5yZWZzLmRhdGFOYW1lLnZhbHVlXS5zZXQoSlNPTi5wYXJzZSh0aGlzLnJlZnMuZGF0YUNvbnRlbnQudmFsdWUpKTtcblx0fSxcblx0dG9nZ2xlOiBmdW5jdGlvbiB0b2dnbGUoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHNob3c6ICF0aGlzLnN0YXRlLnNob3cgfSk7XG5cdH1cbn0pO1xuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChQdWJsaXNoZXIsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVibGlzaGVyLWNvbnQnKSk7Il19
