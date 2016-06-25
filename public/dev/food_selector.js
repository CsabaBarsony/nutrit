cs.DEVELOPMENT = {
	mode: true,
	component: 'food_selector'
};
LAG = 500;
publisher = { data: {} };
cs.get = function(url, callback) {
	var data;
	
	if(url === '/foods/vegetables') data = [
		{ id: 1, name: 'asparagus', description: 'raw' },
		{ id: 2, name: 'broccoli', description: 'raw' },
		{ id: 3, name: 'potato', description: 'raw' },
		{ id: 4, name: 'tomato', description: 'raw' },
		{ id: 5, name: 'yam', description: 'raw' }
	];
	else data = [];
	
	setTimeout(function() {
		callback(200, data);
	}, LAG);
};