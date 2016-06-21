var Publisher = React.createClass({
	getInitialState: function() {
		return {
			data: {
				name: publisher.data.name,
				content: publisher.data.content
			}
		};
	},
	render: function() {
		return (
			<div>
				<textarea
					rows="10"
					cols="100"
					ref="dataContent"
					defaultValue={this.state.data.content}></textarea><br />
				<input type="text" ref="dataName" defaultValue={this.state.data.name} /><br />
				<button onClick={this.publish}>Publish</button>
			</div>
		);
	},
	publish: function() {
		bella.data[this.refs.dataName.value].set(JSON.parse(this.refs.dataContent.value));
	}
});

ReactDOM.render(
	<Publisher />,
	document.getElementById('publisher-cont')
);