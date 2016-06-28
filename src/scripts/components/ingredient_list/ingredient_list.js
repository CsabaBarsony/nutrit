var Utils	= require('./ingredient_list_utils.js');
var Pie		= require('../../components/pie/pie.js');

var IngredientList = React.createClass({
	getInitialState: function() {
		return {
			ingredients: [],
			macros: null
		};
	},
	componentWillMount: function() {
		bella.data.ingredients.subscribe((ingredients) => {
			var macros = ingredients.length > 0 ? Utils.calculateMacros(ingredients) : null;
			
			this.setState({
				ingredients: ingredients,
				macros: macros
			});
		});
	},
	render: function() {
		var foods = _.map(this.state.ingredients, function(ingredient, key) {
			return (
				<div key={key}>
					<span>{ingredient.amount.quantity}{ingredient.amount.unit} {ingredient.food.name}</span>
					<button onClick={() => this.remove(key)}>Remove</button>
				</div>
			);
		}, this);
			
		var macros = this.state.macros ? (
			<div>
				<div>ch: {this.state.macros.ch.toFixed(0)}%</div>
				<div>fat: {this.state.macros.fat.toFixed(0)}%</div>
				<div>protein: {this.state.macros.protein.toFixed(0)}%</div>
			</div>
		) : null;
		
		return (
			<div className="ingredient-list">
				<Pie macros={this.state.macros} />
				{foods}
				{macros}
			</div>
		);
	},
	remove: function(key) {
		var ingredients = bella.data.ingredients.get();
		ingredients.splice(key, 1);
		bella.data.ingredients.set(ingredients);
	}
});

module.exports = IngredientList;

if(cs.isDevMode('ingredient_list')) {
	ReactDOM.render(
		<IngredientList />,
		document.getElementById('cont-ingredient_list')
	);
}
