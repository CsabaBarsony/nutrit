var Pie = React.createClass({
	componentDidMount: function() {
		this.drawPie();
	},
	componentDidUpdate: function() {
		this.drawPie();
	},
	render: function() {
		var canvas = this.props.macros ? (<canvas id="pie-canvas" ref="canvas" width="200" height="200"></canvas>) : null;

		return (
			<div className="pie">
				canvas
			</div>
		);
	},
	drawPie: function() {
		if(this.props.macros) {
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

if(cs.isDevMode('pie')) {
	var macros = {
		ch: 10,
		fat: 20,
		protein: 70
	};
	
	ReactDOM.render(
		<Pie macros={macros} />,
		document.getElementById('cont-pie')
	);
}