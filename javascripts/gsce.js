'use strict';

var GSCE = (function(){
	return {
		GoogleCredentials: function(){
			return new Promise((resolve, reject)=>{
				$.ajax({
					method: 'GET',
					url: 'GgapiKeys.json'
				}).then((response)=>{
					resolve(response);
				}, (error)=>{
					reject(error);
				});
			});
		}
	};
})();