var allUsers = [];
var activeUserIndex = 0;
var opponentIndex = -1;
//ID elements on index.html
var userLogin = document.getElementById('sign-in-form');
var createUser = document.getElementById('sign-up-form');
//ID elements on setup.html
var homeName = document.getElementById('home-name');
var setUpForm = document.getElementById('setup-form');
var opponentName = document.getElementById('opponent-name');
var content = document.getElementById('content');
var opponentRecord = document.getElementById('opponent');

//User Object Constructor --> index.html
function UserObject(name, password) {
  this.userName = name;
  this.password = password;
  this.opponentsArray = [];
}
//Handles Create User Event, includes validation of existing Users --> index.html
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
//Handles User Login Event through Validation --> index.html
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
      localStorage.setItem('storedActiveUser', JSON.stringify(logInName));
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
//Finds the index at which the active user belongs in allUsers array
(function findActiveUser() {
  var checkForUser = JSON.parse(localStorage.storedActiveUser);
  var foundUser = false;
  for (var i = 0; i < allUsers.length; i++) {
    if (checkForUser === allUsers[i].userName) {
      foundUser = true;
      activeUserIndex = i;
    }
  }
  if (foundUser) {
    console.log('The active user is ' + checkForUser);
    return activeUserIndex;
  }
  if (!foundUser) {
    console.log('user does not exist');
  }
})();
//Finds an opponent's index inside an active user's opponentsArray with an opponent's
//name passed as a parameter
function findOpponentIndex(opponentNameValue) {
  var foundOpponent = false;
  for (var i = 0; i < allUsers[activeUserIndex].opponentsArray.length; i++) {
    if (allUsers[activeUserIndex].opponentsArray[i][0] == opponentNameValue) {
      foundOpponent = true;
      opponentIndex = i;
    }
  }
  if (foundOpponent) {
    // console.log('The opponent exists for the active user');
    return opponentIndex;
  }
  if (!foundOpponent) {
    return false;
  }
}
//On page load, adds existing opponents in a specific User's opponentsArray into the select
//drop down box using appendChild --> setup.html
if (opponentName) {
  (function extendActiveOpponentsList() {
    var currentUser = allUsers[activeUserIndex];
    if (currentUser.opponentsArray.length > 0) {
      for (var i = 0; i < currentUser.opponentsArray.length; i++) {
        var optionEl = document.createElement('option');
        optionEl.setAttribute('value', currentUser.opponentsArray[i][0]);
        optionEl.textContent = currentUser.opponentsArray[i][0];
        opponentName.appendChild(optionEl);
      }
    }
  })();
}
//Generates and appends a textbox to opponentRecord div in setup.html --> setup.html
function createTextBox() {
  var inputEl = document.createElement('input');
  inputEl.setAttribute('id', 'enter-new-opponent');
  inputEl.setAttribute('type', 'text');
  inputEl.setAttribute('name', 'enterNewOpponent');
  inputEl.setAttribute('size', '15');
  opponentRecord.appendChild(inputEl);
}
//Handles the change event on the select drop down box --> setup.html
function handleOpponentChangeEvent(event) {
  event.preventDefault();
  console.log(opponentName.value);
  findOpponentIndex(opponentName.value);
  if (opponentName.value == 'new-opponent') {
    // console.log('There were previous opponents, but I want to make a new one');
    if (!document.getElementById('enter-new-opponent')) {
      createTextBox();
    }
  } else if (allUsers[activeUserIndex].opponentsArray[opponentIndex][0] == opponentName.value) {
    // console.log('I want to remove the text box');
    var enterNewOpponent = document.getElementById('enter-new-opponent');
    if (enterNewOpponent) {
      opponentRecord.removeChild(enterNewOpponent);
    }
  }
}
//Handles the 'start game' submit button --> setup.html
function handleSetUpEvent(event) {
  event.preventDefault();
  if (document.getElementById('enter-new-opponent')) {
    var newOpponent = event.target.enterNewOpponent.value.toString();
    var currentUser = allUsers[activeUserIndex];
    // console.log(currentUser);
    if (findOpponentIndex(newOpponent) == true) {
      alert('Opponent name already exists, please enter a new name.');
    } else {
      console.log('I want to enter a new opponent');
      currentUser.opponentsArray.push([newOpponent, 0, 0]);
      localStorage.setItem('storedUsers', JSON.stringify(allUsers));
      localStorage.setItem('storedActiveOpponent', JSON.stringify(newOpponent));
    }
  }
  window.location = 'scoreboard.html';
}
//Finds existing users and setting h3 tage in setup.html to represent User Name
//from local storage --> setup.html
if (homeName) {
  homeName.textContent = JSON.parse(localStorage.storedActiveUser);
}
//Event Listeners
//index.html event listeners
if (createUser) {
  createUser.addEventListener('submit', handleCreateUserEvent);
}
if (userLogin) {
  userLogin.addEventListener('submit', handleValidateEvent);
}
//setup.html event listeners
if (setUpForm) {
  setUpForm.addEventListener('submit', handleSetUpEvent);
}
if (opponentName) {
  opponentName.addEventListener('change', handleOpponentChangeEvent);
}
if (opponentName) { //This event will create a textbox with one or no options in select element
  opponentName.addEventListener('click', function() {
    var options = opponentName.querySelectorAll('option');
    var count = options.length;
    if (typeof (count) === 'undefined' || count < 2) {
      console.log('There are no previously created opponents');
      createTextBox();
    }
  });
}
