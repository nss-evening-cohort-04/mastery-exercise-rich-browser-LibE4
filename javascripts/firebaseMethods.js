"use strict";

var FbAPI = (function (oldFirebase) {

  oldFirebase.getSavedToys = function (apiKeys, uid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method:'GET',
        url:`${apiKeys.databaseURL}/toys.json?orderBy="uid"&equalTo="${uid}"`
      }).then((response)=>{
        let toys = [];
         Object.keys(response).map(key => {
           response[key].id = key;
           toys.push(response[key]);
         });
        resolve(toys);
      }, (error) => {
        console.log(error);
      });
    });
  };


	oldFirebase.getSelectedToy = function (FBapiKeys, itemId) {
	  return new Promise((resolve, reject)=>{
	      $.ajax({
	        method:'GET',
	        url:`${FBapiKeys.databaseURL}/toys/${itemId}.json`
	      }).then((response)=>{
	        resolve(response);
	      },(errorResponse)=>{
	        reject(errorResponse);
	      });
	  });
	};

  oldFirebase.addToy = function (apiKeys, newToy) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method:'POST',
        url:`${apiKeys.databaseURL}/toys.json`,
        data: JSON.stringify(newToy),
        dataType: 'json'
      }).then((response)=>{
        resolve(response);
      }, (error) => {
        console.log(error);
      });
    });
  };

  oldFirebase.deleteToy = function (apiKeys, itemId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method:'DELETE',
        url:`${apiKeys.databaseURL}/toys/${itemId}.json`
      }).then((response)=>{
        resolve(response);
      }, (error) => {
        console.log(error);
      });
    });
  };

  oldFirebase.getToy = function (apiKeys, itemId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method:'GET',
        url:`${apiKeys.databaseURL}/toys/${itemId}.json`
      }).then((response)=>{
        resolve(response);
      }, (error) => {
        console.log(error);
      });
    });
  };

  oldFirebase.editToy = function (apiKeys, itemId, editedToy) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method:'PUT',
        url:`${apiKeys.databaseURL}/toys/${itemId}.json`,
        data: JSON.stringify(editedToy),
        dataType: 'json'
      }).then((response)=>{
        resolve(response);
      }, (error) => {
        console.log(error);
      });
    });
  };

  return oldFirebase;
})(FbAPI || {});
