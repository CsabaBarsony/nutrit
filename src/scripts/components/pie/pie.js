var Pie = React.createClass({
	render: function() {
		return (
			<div className="pie">
				<h2>Pie</h2>
				<div className="pie-segment">a</div>
				<div className="pie-segment">b</div>
				<div className="pie-segment">c</div>
			</div>
		);
	}
});

module.exports = Pie;

if(cs.isDevMode('pie')) {
	ReactDOM.render(
		<Pie />,
		document.getElementById('cont-pie')
	);
}