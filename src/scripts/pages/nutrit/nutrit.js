var FoodSelector 	= require('../../components/food_selector/food_selector.js');
var IngredientList 	= require('../../components/ingredient_list/ingredient_list.js');

var Nutrit = React.createClass({
	render: function() {
		return (
			<div className="nutrit">
				<IngredientList />
				<FoodSelector />
			</div>
		);
	}
});

ReactDOM.render(
	<Nutrit />,
	document.getElementById('cont-nutrit')
);