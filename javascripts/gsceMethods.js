'use strict';

var GSCE = (function(oldGSCE){

	oldGSCE.getGoogleImages = (searchText, GGapiKey, cx)=>{
		return new Promise((resolve, reject)=>{
			$.ajax({
				method:'GET',
				url: `https://www.googleapis.com/customsearch/v1?key=${GGapiKey}&cx=${cx}&q=${searchText}&num=5&searchType=image&fileType=jpg&imgSize=medium&alt=json`
			}).then((response)=>{
				let toys = response.items;
				resolve(toys);
			},(errorResponse)=>{
				reject(errorResponse);
			});
		});
	};

	return oldGSCE;
})(GSCE || {});
