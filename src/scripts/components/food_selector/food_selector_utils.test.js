describe('FoodSelectorUtils', function() {
	var foodCategories = {
		id: 'foodCategories',
		root: true,
		sub: [
			{
				id: 'baked',
				name: 'baked products',
				sub: [
					{
						id: 'grainBaked',
						name: 'grain based baked products'
					},
							{
						id: 'grainFreeBaked',
						name: 'grain free baked products'
					}
				]
			},
			{
				id: 'beverages',
				name: 'beverages',
				sub: [
					{
						id: 'alcoholic',
						name: 'alcoholic',
						sub: [
							{
								id: 'beer',
								name: 'beer'
							},
							{
								id: 'distilled',
								name: 'distilled'
							},
							{
								id: 'liquor',
								name: 'liquor'
							},
							{
								id: 'wine',
								name: 'wine'
							}
						]
					},
					{
						id: 'coffee',
						name: 'coffee'
					},
					{
						id: 'tea',
						name: 'tea'
					}
				]
			},
			{
				id: 'cereal',
				name: 'cereal grains and pasta',
				sub: []
			},
			{
				id: 'dairyAndEgg',
				name: 'dairy and egg',
				sub: [
					{
						id: 'dairy',
						name: 'dairy'
					},
							{
						id: 'egg',
						name: 'egg'
					}
				]
			},
			{
				id: 'fatsAndOils',
				name: 'fats and oils',
				sub: [
					{
						id: 'fats',
						name: 'fats'
					}
				]
			},
			{
				id: 'fish',
				name: 'fish and shellfish',
				sub: []
			},
			{
				id: 'fruits',
				name: 'fruits and juices',
				sub: []
			},
			{
				id: 'legumes',
				name: 'legumes',
				sub: []
			},
			{
				id: 'meat',
				name: 'meat',
				sub: [
					{
						id: 'beef',
						name: 'beef'
					},
					{
						id: 'pork',
						name: 'pork'
					},
					{
						id: 'poultry',
						name: 'poultry',
						sub: [
							{
								id: 'chicken',
								name: 'chicken'
							},
							{
								id: 'turkey',
								name: 'turkey'
							},
							{
								id: 'duck',
								name: 'duck'
							},
							{
								id: 'goose',
								name: 'goose'
							},
						]
					},
					{
						id: 'lamb',
						name: 'lamb'
					},
					{
						id: 'game',
						name: 'game',
						sub: [
							{
								id: 'deer',
								name: 'deer'
							},
							{
								id: 'boar',
								name: 'boar'
							},
							{
								id: 'rabbit',
								name: 'rabbit'
							},
							{
								id: 'goat',
								name: 'goat'
							},
						]
					}
				]
			},
			{
				id: 'nuts',
				name: 'nuts and seeds',
				sub: []
			},
			{
				id: 'spices',
				name: 'spices and herbs',
				sub: []
			},
			{
				id: 'vegetables',
				name: 'vegetables',
				sub: []
			}
		]
	};
	
	it('findParentCategory', function() {
		var parentOfBeverages = foodSelectorUtils.findParentCategory(foodCategories, 'beverages');
		expect(parentOfBeverages).not.toBe(null);
		expect(parentOfBeverages.id).toBe('foodCategories');
		
		var parentOfGrainFreeBaked = foodSelectorUtils.findParentCategory(foodCategories, 'grainFreeBaked');
		expect(parentOfGrainFreeBaked.id).toBe('baked');
		
		var parentOfDuck = foodSelectorUtils.findParentCategory(foodCategories, 'duck');
		expect(parentOfDuck.id).toBe('poultry');
		
		// Root category has no parent, must return null
		var parentOfRoot = foodSelectorUtils.findParentCategory(foodCategories, 'foodCategories');
		expect(parentOfRoot).toBe(null);
		
		// Category does not exist, must return null
		var parentOfNotExistingCategory = foodSelectorUtils.findParentCategory(foodCategories, 'notExistingCategory');
		expect(parentOfNotExistingCategory).toBe(null);
	});
	
	it('findCategory', function() {
		expect(foodSelectorUtils.findCategory(foodCategories, 'baked').id).toBe('baked');
	});
});