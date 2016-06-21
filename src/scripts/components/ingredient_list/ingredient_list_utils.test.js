describe('IngredientListUtils', function() {
	var ingredients = [
		{
			amount: {
				quantity: 123,
				unit: 'g'
			},
			food: {
				ch_m: 40,
				fat_m: 6,
				protein_m: 20
			}
		},
		{
			amount: {
				quantity: 301,
				unit: 'g'
			},
			food: {
				ch_m: 20,
				fat_m: 10,
				protein_m: 15
			}
		}
	];
	
	it('calculateMacros', function() {
		var macros = ingredientListUtils.calculateMacros(ingredients);
		var result = {
			ch: 51,
			fat: 17,
			protein: 32
		};
		expect(macros.ch).toBeCloseTo(result.ch, 0);
		expect(macros.fat).toBeCloseTo(result.fat, 0);
		expect(macros.protein).toBeCloseTo(result.protein, 0);
	});
});