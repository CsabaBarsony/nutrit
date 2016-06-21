var foodCategories = {
	id: 'root',
	root: true,
	sub: [
		{
			id: 'baked',
			name: 'baked products',
			keto: false,
			sub: [
				{
					id: 'grainBaked',
					name: 'grain based baked products',
					paleo: false
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
					keto: false,
					paleo: false,
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
			keto: false,
			paleo: false
		},
		{
			id: 'dairyAndEgg',
			name: 'dairy and egg',
			sub: [
				{
					id: 'dairy',
					name: 'dairy',
					paleo: false
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
			name: 'fish and shellfish'
		},
		{
			id: 'fruits',
			name: 'fruits and juices'
		},
		{
			id: 'legumes',
			name: 'legumes',
			keto: false,
			paleo: false
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
					id: 'goat',
					name: 'goat'
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
					]
				}
			]
		},
		{
			id: 'nuts',
			name: 'nuts and seeds'
		},
		{
			id: 'spices',
			name: 'spices and herbs'
		},
		{
			id: 'vegetables',
			name: 'vegetables'
		}
	]
};

module.exports = foodCategories;