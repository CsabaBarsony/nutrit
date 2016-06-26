var foodSelectorUtils = {
	findCategory: function(foodCategories, id) {
		var category = _.find(foodCategories.sub, { id: id });
		
		if(category) return category;
		else {
			if(category.sub) {
				_.each(category.sub, function(category) {
					this.findFoodCategory(category.sub, id);
				});
			}
			else return;
		}
	},
	findParentCategory: function(foodCategories, childCategoryId) {
		if(foodCategories.sub) {
			var searchedChild = _.find(foodCategories.sub, { id: childCategoryId });
			
			if(searchedChild) {
				return foodCategories;
			}
			else {
				var result = null;
				
				_.each(foodCategories.sub, function(child) {
					var found = this.findParentCategory(child, childCategoryId);
					
					if(found) result = found;
				}, this);
				
				return result;
			}
		}
		else {
			return null;
		}
	}
};

module.exports = foodSelectorUtils;