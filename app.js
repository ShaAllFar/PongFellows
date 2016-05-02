var allUsers = [];
var userLogin = document.getElementById('sign-in-form');
var createUser = document.getElementById('sign-up-form');
var homeName = document.getElementById('home-name');
//User Object Constructor
function UserObject(name, password) {
  this.userName = name;
  this.password = password;
  this.opponentsArray = [];
}
//Handles Create User Event, includes validation of existing Users
function handleCreateUserEvent(event) {
  event.preventDefault();
  var foundUserName = false;
  var newName = event.target.signUpName.value.toString();
  var newPassword = event.target.signUpPassword.value.toString();
  if (allUsers.length > 0) {
    for (var i = 0; i < allUsers.length; i++) {
      if (name === allUsers[i].userName) {
        foundUserName = true;
      }
    }
  }
  if (foundUserName) {
    alert('Sorry!  This username already exists.  Please try again.');
  }
  if (!foundUserName) {
    //store new user into local storage
    localStorage.setItem('storedActiveUser', JSON.stringify(newName));
    var CreateNewUser = new UserObject(newName, newPassword);
    allUsers.push(CreateNewUser);
    localStorage.setItem('storedUsers', JSON.stringify(allUsers));
    window.location = 'setup.html';
  }
  event.target.newUserName.value = null;
  event.target.newPassword.value = null;
}
//Handles User Login Event through Validation
function handleValidateEvent(event) {
  event.preventDefault();
  var userExists = false;
  var logInName = event.target.signInName.value.toString();
  var logInPassword = event.target.signInPassword.value.toString();
  if (allUsers.length > 0) {
    for (var i = 0; i < allUsers.length; i++) {
      if (logInName === allUsers[i].userName && logInPassword === allUsers[i].password) {
        userExists = true;
      }
    }
    if (userExists) {
      //store new user into local storage
      localStorage.setItem('storedActiveUser', JSON.stringify(name));
      window.location = 'setup.html';
    }
  } else {
    alert('Incorrect username or password.  Please try again.');
  }
  event.target.signInName.value = null;
  event.target.signInPassword.value = null;
}
//Checks for existing local storage and updates stored data to allUser array
(function checkLocal() {
  if (localStorage.storedUsers) {
    var parsedStoredUsers = JSON.parse(localStorage.storedUsers);
    allUsers = parsedStoredUsers;
  }
  // console.log(allUsers);
  return allUsers;
})();

homeName.textContent = JSON.parse(localStorage.storedActiveUser);
//Event listeners
if (createUser) {
  createUser.addEventListener('submit', handleCreateUserEvent);
}
if (userLogin) {
  userLogin.addEventListener('submit', handleValidateEvent);
}
