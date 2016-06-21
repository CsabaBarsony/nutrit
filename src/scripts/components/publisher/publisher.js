var Publisher = React.createClass({
	getInitialState: function() {
		return {
			show: publisher.show,
			data: {
				name: publisher.data.name,
				content: publisher.data.content
			}
		};
	},
	render: function() {
		return this.state.show ? (
			<div>
				<textarea
					rows="10"
					cols="100"
					ref="dataContent"
					defaultValue={this.state.data.content}></textarea><br />
				<input type="text" ref="dataName" defaultValue={this.state.data.name} /><br />
				<button onClick={this.publish}>Publish</button>
				<button onClick={this.toggle}>Hide Publisher</button>
			</div>
		) : (<button onClick={this.toggle}>Show Publisher</button>);
	},
	publish: function() {
		bella.data[this.refs.dataName.value].set(JSON.parse(this.refs.dataContent.value));
	},
	toggle: function() {
		this.setState({ show: !this.state.show });
	}
});

ReactDOM.render(
	<Publisher />,
	document.getElementById('publisher-cont')
);