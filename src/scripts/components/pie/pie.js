var Pie = React.createClass({
	componentDidMount: function() {
		var canvas = React.findDOMNode(this.refs.canvas);
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#a0c';
		ctx.fillRect(10, 10, 50, 10);
	},
	render: function() {
		return (
			<div className="pie">
				<div className="pie-segment pie-ch">ch: {this.props.macros.ch}</div>
				<div className="pie-segment pie-fat">fat: {this.props.macros.fat}</div>
				<div className="pie-segment pie-protein">protein: {this.props.macros.protein}</div>
				<canvas id="pie-canvas" ref="canvas" width="200" height="100"></canvas>
			</div>
		);
	}
});

module.exports = Pie;

if(cs.isDevMode('pie')) {
	var macros = {
		ch: 20,
		fat: 20,
		protein: 70
	};
	
	ReactDOM.render(
		<Pie macros={macros} />,
		document.getElementById('cont-pie')
	);
}