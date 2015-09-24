
//Some higher order helper functions used throughout the program. I thought it would be good practice to write a small library for myself instead of just using underscore.
var y = {

	each: function(collection, cb) {
		
		//Test if collection is an array
		if(Array.isArray(collection)) {

			//If so, use for loop to invoke the cb on each item
			for(var i = 0; i < collection.length; i++) {
				cb(collection[i],i,collection);
			}
		}

		//If not, use a for in loop to iterate
		else {
			for(var key in collection){
				cb(collection[i], i, collection);
			}
		}
	},
	
	//Returns an array of values from the collection that pass a predicate test.
	filter: function(collection, predicate) {
		var result = [];

		y.each(collection, function(value, index, list){
			
			//If the predicate is true, push the value into the results array.
			if(predicate(value, index, list)){
				result.push(value);
			}
		})	
		return result;
	},

	//Returns a new array mapping the cb invoked on each item of the collection.
	map: function(collection, cb){
		var result = [];
		
		y.each(collection, function(value,index,list) {
			result.push(cb(value,index,list));
		});
		return result;
	},
	
	//Creates a single result from a collection
	reduce: function(collection, acumulator, start) {
		
			//Checking if start is passed to the function
			var noStart = arguments.length < 3; 
			console.log(noStart)	
			//Iterate over a collection.
			y.each(collection, function(current, index, collection) {
				if(noStart){
					noStart = false;
					start = current;	
				}
				
				else {
					start = acumulator(start, current)	
				}	
			});			
			return start;
		},	
	

   //Returns true if every item in a collection passes the predicate
	every: function(collection, predicate) {

		var test=true;
		y.each(collection, function(value, index, list){
			if(!predicate(value,index,list)){
				test=false;
			}
		})
		return test;
		
	},

	//Returns the maximum value of a collection.
	max: function(collection) {

		var max = y.reduce(collection, function(memo,current) {
			if (current > memo) {
				return current
			}

			else {
				return memo
			}
		});
		return max;
	}
};	


