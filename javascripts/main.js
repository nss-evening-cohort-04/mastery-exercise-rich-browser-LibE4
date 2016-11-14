"use strict";

let FBapiKeys = {};
let GGapiKeys = {};
let uid = "";
let itemId = "";
let toysFound = null;
let searchText = "";

function createLogoutButton() {
  FbAPI.getUser(FBapiKeys, uid).then(function(userResponse) {
    $('#logout-container').html('');
    let currentUsername = userResponse.username;
    let logoutLink = `<a href="" id="logoutLink">Logout ${currentUsername}</a>`;
    $('#logout-container').append(logoutLink);
  });
}

function putSearchedToysInDOM (toys) {
  $("#toy-result").html("");
  let contentToDOM = "";
  contentToDOM = `<h4>Total searched results found ${toys.length}.</h4>`;
  for (var i = 0; i < toys.length; i++){
    if (i % 3 === 0){
      contentToDOM += '<div class="row">';
    }
        contentToDOM += '<div class="card col-md-4">';
          contentToDOM += `<h3 class="caption">Toy ${i}</h3>`;
          contentToDOM += `Toy Name:<input type="text" class="form-control editName" value="Input Toy Name Here">`;
          contentToDOM += `<div><img width="200" height="150" src="${toys[i].link}"></div>`;
          contentToDOM += `Toy Price:<input type="text" class="form-control editPrice" value="Input Toy price Here">`;
          contentToDOM += `Toy Description:<input type="text" class="form-control editDescription" value="Input Toy description Here">`;
          contentToDOM += `<button class="btn btn-success add-btn" data-fbid="${i}">Add</button>`;
        contentToDOM += '</div>';
    if ((i - 2) % 3 === 0 || i === toys.length - 1){
      contentToDOM += '</div>';
    }
  }
  $("#toy-pic-result").append(contentToDOM);
}

function putSavedToysInDOM(toys) {
  $("#toy-result").html("");
  let contentToDOM = "";
  for (var i = 0; i < toys.length; i++){
    if (i % 3 === 0){
      contentToDOM += '<div class="row">';
    }
        contentToDOM += '<div class="card col-md-4">';
          contentToDOM += `<h3 class="caption">${toys[i].name}</h3>`;
          contentToDOM += `<img width="300" height="225" src="${toys[i].url}">`;
          contentToDOM += `<div class="more-detail col-xs-12"><button class="btn btn-primary col-xs-4 col-xs-offset-4 detail-btn" data-fbid="${toys[i].id}">DETAILS</button></div>`;
          contentToDOM += `<div class="more-detail col-xs-12"><button id="view-saved-toys-link" class="btn btn-success col-xs-4 col-xs-offset-4 edit-btn cd-btn" data-fbid="${toys[i].id}">EDIT</button></div>`;
          contentToDOM += `<div class="more-detail col-xs-12"><button class="btn btn-danger col-xs-4 col-xs-offset-4 delete-btn" data-fbid="${toys[i].id}">DELETE</button></div>`;
        contentToDOM += '</div>';
    if ((i - 2) % 3 === 0 || i === toys.length - 1){
      contentToDOM += '</div>';
    }
  }
  $("#toy-result").append(contentToDOM);
}

function putEditToyInDOM(FBapiKeys, itemId) {
  FbAPI.getSelectedToy(FBapiKeys, itemId).then(function(toy) {
      let toyItem = '<li>';
      toyItem += '<div class="col-xs-12">';
      toyItem += `<input type="text" id="editName" class="form-control" value="${toy.name}">`;
      toyItem += `<img src="${toy.url}" width="400px" height="300px"></img>`;
      toyItem += `<input type="text" id="editURL" class="form-control" value="${toy.url}">`;
      toyItem += `<input type="text" id="editPrice" class="form-control" value="${toy.price}">`;
      toyItem += `<input type="text" id="editDescription" class="form-control" value="${toy.description}">`;
      toyItem += '</div>';
      toyItem += '<div class="col-xs-12">';
      toyItem += `<button class="btn btn-success save-edit-btn" data-fbid="${itemId}">SAVE</button>`;
      toyItem += '</div>';
      toyItem += '</li>';
    $('#saved-toy-list').html(toyItem);
  });
}


function createModal(toy) {

    let html =  '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += `<h2>${toy.name}</h2>`;
    html += '</div>';  // modal header
    html += '<div class="modal-body">';
    html += `<img src="${toy.url}" width="300px" height="200px"></img>`;
    html += `<h3>${toy.price}</h3>`;
    html += `<h4>${toy.description}</h4>`;
    html += '</div>';  // modal body
    html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');

    $('#dynamicModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });

}


$(document).ready(function() {

  FbAPI.firebaseCredentials().then(function(keys) {
    FBapiKeys = keys;
    firebase.initializeApp(FBapiKeys);
  });

  GSCE.GoogleCredentials().then(function(keys){
    GGapiKeys = keys;
  });
  
  // search pic for new toy
  $('#search-img-btn').on('click', () => {
    searchText = $('#search-img-title').val();
    GSCE.getGoogleImages(searchText, GGapiKeys.Server_key, GGapiKeys.cx).then(function(response){
      toysFound = response;
      console.log("response", response);
      putSearchedToysInDOM(response);
    });
  });

  // filter toy by name
  $('#filter-btn').on('click', () => {
    searchText = $('#search-title').val();
    if (searchText === "") return;
    FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => {
      let filteredToys = [];
      toys.forEach(function(toy){
        if (toy.name.indexOf(searchText) !== -1){
          filteredToys.push(toy);
        }
      });
      putSavedToysInDOM(filteredToys);
    });
  });

  // add new toy
  $(document).on('click', '.add-btn', (e) => {
    itemId = e.target.getAttribute("data-fbid");
    let newItem = {
      "uid": uid,
      "name": $(e.target).siblings(".editName").val(),
      "price": $(e.target).siblings(".editPrice").val(),
      "url": toysFound[parseInt(itemId)].link,
      "description": $(e.target).siblings(".editDescription").val(),
    };
    FbAPI.addToy(FBapiKeys, newItem).then(function(){
      FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => putSavedToysInDOM(toys));
    });
  });

  // check toy detail
  $(document).on('click', '.detail-btn', (e) => {
    itemId = e.target.getAttribute("data-fbid");
    FbAPI.getSelectedToy(FBapiKeys, itemId).then(function(toy){
      createModal(toy);
    });
  });

  // delete toy
  $(document).on('click', '.delete-btn', function() {
    itemId = $(this).data("fbid");
    FbAPI.deleteToy(FBapiKeys, itemId).then(function() {
      FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => putSavedToysInDOM(toys));
    });
  });

  // save edit
  $(document).on('click', '.save-edit-btn', function() {
    event.preventDefault();
    let editedItem = {
      "uid": uid,
      "name": $("#editName").val(),
      "price": $("#editPrice").val(),
      "url": $("#editURL").val(),
      "description": $("#editDescription").val()
    };
    FbAPI.editToy(FBapiKeys, itemId, editedItem).then(function() {
      console.log("done edit" );
      $('.cd-panel').removeClass('is-visible');
      FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => putSavedToysInDOM(toys));
    });
  });

  //edit toy view
  //slide out view
  $(document).on('click', '.cd-btn', function(event){
    event.preventDefault();
    itemId = $(this).data("fbid");
    putEditToyInDOM(FBapiKeys, itemId);
    $('.cd-panel').addClass('is-visible');
  });
  //clode the lateral panel
  $(document).on('click', '.cd-panel', function(event){
    if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) {
      $('.cd-panel').removeClass('is-visible');
      event.preventDefault();
    }
  });

  $(document).on('click', '#add-new-toy-link', function(event){
    event.preventDefault();
    $('#add-new-toy').removeClass('hide');
    $('#search').addClass('hide');
  });

  $(document).on('click', '#view-saved-toys-link', function(event){
    event.preventDefault();
    $('#add-new-toy').addClass('hide');
    $('#search').removeClass('hide');
    FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => putSavedToysInDOM(toys));
  });

  $('#registerButton').on('click', function() {
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();
    let username = $('#inputUsername').val();
    let user = {
      email: email,
      password: password
    };
    FbAPI.registerUser(user).then(function(registerResponse) {
      let newUser = {
        username,
        uid: registerResponse.uid
      };
      return FbAPI.addUser(FBapiKeys, newUser);
    }).then(function(userResponse) {
      return FbAPI.loginUser(user);
    }).then(function(loginResponse) {
      uid = loginResponse.uid;
      createLogoutButton();
      FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => putSavedToysInDOM(toys));
      $('#login-container').addClass('hide');
      $('#search').removeClass('hide');
      $('#navbar-main').removeClass('hide');
    });
  });

  $('#loginButton').on('click', function() {
    let email = $('#inputEmail').val();
    let password = $('#inputPassword').val();
    let user = {
      email: email,
      password: password
    };
    FbAPI.loginUser(user).then(function(loginResponse) {
      uid = loginResponse.uid;
      console.log("FBapiKeys n uid", FBapiKeys,uid);
      FbAPI.getSavedToys(FBapiKeys, uid).then((toys) => putSavedToysInDOM(toys));
      createLogoutButton();
      $('#login-container').addClass('hide');
      $('#search').removeClass('hide');
      $('#navbar-main').removeClass('hide');
    });
  });

  $("#logout-container").on('click', '#logoutLink', function(e) {
    e.preventDefault();
    FbAPI.logoutUser();
    uid = "";
    itemId = "";
    toysFound = null;
    searchText = "";
    $('#search-title').val('');
    $('#search-img-title').val('');
    $('#toy-result').html('');
    $("#toy-pic-result").html('');
    $('#inputEmail').val('');
    $('#inputPassword').val('');
    $('#inputUsername').val('');
    $('#login-container').removeClass('hide');
    $('#navbar-main').addClass('hide');
    $('#search').addClass('hide');
    $('#add-new-toy').addClass('hide');
  });
});
