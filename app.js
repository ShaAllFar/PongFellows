var allUsers = [];
var userLogin = document.getElementById('sign-in-form');
var createUser = document.getElementById('sign-up-form');
function UserObject(name, password) {
  this.userName = name;
  this.password = password;
  this.opponentsArray = [];
}

function handleCreateUserEvent(event) {
  event.preventDefault();
  var foundUserName = false;
  var name = event.target.signUpName.value.toString();
  var password = event.target.signUpPassword.value.toString();
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
    var CreateNewUser = new UserObject(name, password);
    allUsers.push(CreateNewUser);
    localStorage.setItem('storedUsers', JSON.stringify(allUsers));
    window.location = 'setup.html';
  }
  event.target.newUserName.value = null;
  event.target.newPassword.value = null;
}

function handleValidateEvent(event) {
  event.preventDefault();
  var name = event.target.signInName.value.toString();
  var password = event.target.signInPassword.value.toString();
  if (allUsers.length > 0) {
    for (var i = 0; i < allUsers.length; i++) {
      if (name === allUsers[i].userName && password === allUsers[i].password) {
        window.location = 'setup.html';
      } else {
        alert('Incorrect username or password.  Please try again.');
      }
    }
  } else {
    alert('Incorrect username or password.  Please try again.');
  }
  event.target.userName.value = null;
  event.target.password.value = null;
}
if (createuser) {
  userLogin.addEventListener('submit', handleValidateEvent);
  createUser.addEventListener('submit', handleCreateUserEvent);
}

(function checkLocal() {
  if (localStorage.storedUsers) {
    var parsedStoredUsers = JSON.parse(localStorage.storedUsers);
    allUsers = parsedStoredUsers;
  }
})();
