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
var radioScore = document.getElementById('radio-score');
var endScore = document.getElementsByName('end-score');
var homeRecord = document.getElementById('home-record');
var opponentRecordList = document.getElementById('opponent-record-list');

//User Object Constructor --> index.html
function UserObject(name, password) {
  this.userName = name;
  this.password = password;
  this.opponentsArray = [];
  this.wins = 0;
  this.loss = 0;
}

UserObject.prototype.percentageWins = function(){
  // var sumWin = 0;
  // var sumLoss = 0;
  var winPercent = 0;
  // for (var i = 0; i < this.opponentsArray.length; i++) {
  //   sumWin += this.opponentsArray[i][1];
  //   sumLoss += this.opponentsArray[i][2];
  // }
  // if (sumLoss !== 0) {
  //   winPercent = parseInt((sumWin / sumLoss) * 100);
  // } else {
  //   winPercent = '';
  // }
  winPercent = parseInt((this.wins / (this.loss + this.wins)) * 100);
  return winPercent;
};

var Shawn = new UserObject('Shawn', 'password');

var opponent1 = ['Jon', 2, 3];
var opponent2 = ['Sam', 5, 3];
var opponent3 = ['Katie', 7, 0];
Shawn.opponentsArray.push(opponent1);
Shawn.opponentsArray.push(opponent2);
Shawn.opponentsArray.push(opponent3);
var Sean = new UserObject('Sean', 'password');
Sean.wins = 2;
Sean.loss = 2;
var Sung = new UserObject('Sung', 'password');
Sung.wins = 10;
Sung.loss = 15;
var Kyle = new UserObject('Kyle', 'password');
Kyle.wins = 20;
Kyle.loss = 1;
var Fancy = new UserObject('Fancy', 'password');
Fancy.wins = 5;
Fancy.loss = 9;
allUsers.push(Shawn);
allUsers.push(Sean);
allUsers.push(Sung);
allUsers.push(Kyle);
allUsers.push(Fancy);

Shawn.wins = sumTotals(2);
Shawn.loss = sumTotals(1);

function sumTotals (type) {
  var sumTotals = 0;
  for (var i = 0; i < allUsers[activeUserIndex].opponentsArray.length; i++) {
    sumTotals += allUsers[activeUserIndex].opponentsArray[i][type];
  } return sumTotals;
}

//Handles Create User Event, includes validation of existing Users --> index.html
function handleCreateUserEvent(event) {
  event.preventDefault();
  if (!event.target.signUpName.value || !event.target.signUpPassword.value) {
    return alert('Please enter a valid Username and Password.');
  }
  var foundUserName = false;
  var newName = event.target.signUpName.value.toString().toUpperCase();
  var newPassword = event.target.signUpPassword.value.toString();
  if (allUsers.length > 0) {
    for (var i = 0; i < allUsers.length; i++) {
      if (newName === allUsers[i].userName.toUpperCase()) {
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
  var logInName = event.target.signInName.value.toString().toUpperCase();
  var logInPassword = event.target.signInPassword.value.toString();
  if (allUsers.length > 0) {
    for (var i = 0; i < allUsers.length; i++) {
      if (logInName === allUsers[i].userName.toUpperCase() && logInPassword === allUsers[i].password) {
        userExists = true;
      }
    }
    if (userExists) {
      //store new user into local storage
      localStorage.setItem('storedActiveUser', JSON.stringify(logInName));
      window.location = 'setup.html';
    } else if (!userExists) {
      console.log('I did not find an existing user');
      alert('Incorrect username or password.  Please try again.');
    }
  } else {
    console.log('I did not find an existing user');
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
if (localStorage.storedActiveUser) {
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
}
//Finds an opponent's index inside an active user's opponentsArray with an opponent's
//name passed as a parameter
function findOpponentIndex(opponentNameValue) {
  var foundOpponent = false;
  if (allUsers[activeUserIndex].opponentsArray.length > 0) {
    for (var i = 0; i < allUsers[activeUserIndex].opponentsArray.length; i++) {
      if (allUsers[activeUserIndex].opponentsArray[i][0] == opponentNameValue) {
        foundOpponent = true;
        opponentIndex = i;
      }
    }
  }
  if (foundOpponent) {
    // console.log('The opponent exists for the active user');
    return opponentIndex;
  }
  if (!foundOpponent) {
    return -1;
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
//Calculates and displays win, loss, percentage for active user --> setup.html
if (homeRecord) {
  (function calculateAndDisplayWinPercentage() {

    percentageWins();
    var winList = document.createElement('li');
    var lossList = document.createElement('li');
    var winPercentList = document.createElement('li');
    winList.textContent = ('Wins: ' + sumWin);
    lossList.textContent = ('Losses: ' + sumLoss);
    winPercentList.textContent = ('Win%: ' + winPercent);
    homeRecord.appendChild(winList);
    homeRecord.appendChild(lossList);
    homeRecord.appendChild(winPercentList);
  })();
}
//Calculates and displays win, loss, percentage for selected opponent of active user
//--> setup.html
function calculateAndDisplayOpponentWinPercentage() {
  var sumWin = allUsers[activeUserIndex].opponentsArray[opponentIndex][1];
  // console.log(sumWin);
  var sumLoss = allUsers[activeUserIndex].opponentsArray[opponentIndex][2];
  // console.log(sumLoss);
  var winPercent = 0;
  if (sumLoss !== 0) {
    winPercent = parseInt((sumWin / sumLoss) * 100);
  } else {
    winPercent = '';
  }
  var winList = document.createElement('li');
  var lossList = document.createElement('li');
  var winPercentList = document.createElement('li');
  winList.setAttribute('id', 'win-list');
  lossList.setAttribute('id', 'loss-list');
  winPercentList.setAttribute('id', 'win-percent-list');
  winList.textContent = ('Wins: ' + sumWin);
  lossList.textContent = ('Losses: ' + sumLoss);
  winPercentList.textContent = ('Win%: ' + winPercent);
  opponentRecordList.appendChild(winList);
  opponentRecordList.appendChild(lossList);
  opponentRecordList.appendChild(winPercentList);
}
//Handles the change event on the select drop down box --> setup.html
function handleOpponentChangeEvent(event) {
  event.preventDefault();
  console.log(opponentName.value);
  findOpponentIndex(opponentName.value);
  console.log('this is the opponent index: ' + opponentIndex);
  if (opponentName.value == 'new-opponent') {
    // console.log('There were previous opponents, but I want to make a new one');
    var winList = document.getElementById('win-list');
    var lossList = document.getElementById('loss-list');
    var winPercentList = document.getElementById('win-percent-list');
    if (winList || lossList || winPercentList) {
      opponentRecordList.removeChild(winList);
      opponentRecordList.removeChild(lossList);
      opponentRecordList.removeChild(winPercentList);
    }
    if (!document.getElementById('enter-new-opponent')) {
      createTextBox();
    }
  } else if (allUsers[activeUserIndex].opponentsArray[opponentIndex][0] == opponentName.value) {
    if (!document.getElementById('win-list')) {
      calculateAndDisplayOpponentWinPercentage();
    }
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
  console.log('I entered the submit event');
  for (var i = 0; i < 3; i++) {
    if (endScore[i].checked) {
      var radioValue = endScore[i].value;
      console.log('I found my score, it is ' + radioValue);
      localStorage.setItem('storedGameScore', JSON.stringify(radioValue));
    }
  }
  if (document.getElementById('enter-new-opponent')) {
    var newOpponent = event.target.enterNewOpponent.value.toString().toUpperCase();
    var currentUser = allUsers[activeUserIndex];
    // console.log(currentUser);
    if (findOpponentIndex(newOpponent.toUpperCase()) > -1) {
      alert('Opponent name already exists, please enter a new name.');
    } else {
      console.log('I want to enter a new opponent');
      currentUser.opponentsArray.push([newOpponent, 0, 0]);
      localStorage.setItem('storedUsers', JSON.stringify(allUsers));
      localStorage.setItem('storedActiveOpponent', JSON.stringify(newOpponent));
      window.location = 'scoreboard.html';
    }
  }
}

if (document.getElementById('name-display-container')) {
  (function displayNamesOnScoreboard() {
    var homeTeam = document.getElementById('home-team');
    var awayTeam = document.getElementById('away-team');
    homeTeam.textContent = JSON.parse(localStorage.storedActiveUser);
    awayTeam.textContent = JSON.parse(localStorage.storedActiveOpponent);
  })();
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

(function renderTable() {
  table = document.createElement('table');
  table.id = 'table';
  var trElOne = document.createElement('tr');
  var thElOne = document.createElement('th');
  var trElFour = document.createElement('tr');
  var tdElOne = document.createElement('td');
  var tdElTwo = document.createElement('td');
  var tdElThree = document.createElement('td');
  var tdElFour = document.createElement('td');
  tdElOne.textContent = allUsers[activeUserIndex].percentageWins();
  tdElTwo.textContent = allUsers[activeUserIndex].userName;
  tdElThree.textContent = allUsers[activeUserIndex].wins;
  tdElFour.textContent = allUsers[activeUserIndex].loss;
  trElOne.appendChild(thElOne);
  trElFour.appendChild(tdElOne);
  trElFour.appendChild(tdElTwo);
  trElFour.appendChild(tdElThree);
  trElFour.appendChild(tdElFour);
    // trElTwo.appendChild(thElTwo);

  var thElThree = document.createElement('th');
  var thElFive = document.createElement('th');
  var thElSix = document.createElement('th');
  thElOne.textContent = 'User Name';
  thElThree.textContent = 'Total Wins';
  thElFive.textContent = 'Total Losses';
  thElSix.textContent = 'Percentage';
  trElOne.appendChild(thElThree);
  trElOne.appendChild(thElFive);
  trElOne.appendChild(thElSix);
  trElFour.appendChild(tdElOne);
  table.appendChild(trElOne);
  table.appendChild(trElFour);
  document.getElementById('overall-record').appendChild(table);
})();

function opponentsArrayFunction(index) {
  var winPercent = 0;
  winPercent = parseInt((allUsers[activeUserIndex].opponentsArray[index][1] / (allUsers[activeUserIndex].opponentsArray[index][1] + allUsers[activeUserIndex].opponentsArray[index][2])) * 100);
  return winPercent;
};

(function renderTotalPlaysTable() {
  tableTotalPlays = document.createElement('table');
  tableTotalPlays.id = 'table-total-plays';
  var totalTrOne = document.createElement('tr');
  var totalThOne = document.createElement('th');
  var totalThTwo = document.createElement('th');
  var totalThThree = document.createElement('th');
  var totalThFour = document.createElement('th');
  totalThOne.textContent = 'Opponent Name';
  totalThTwo.textContent = 'Total Wins';
  totalThThree.textContent = 'Total Loss';
  totalThFour.textContent = 'Percentage';
  totalTrOne.appendChild(totalThOne);
  totalTrOne.appendChild(totalThTwo);
  totalTrOne.appendChild(totalThThree);
  totalTrOne.appendChild(totalThFour);
  tableTotalPlays.appendChild(totalTrOne);
  document.getElementById('list-record').appendChild(tableTotalPlays);

  for (var i = 0; i < allUsers[activeUserIndex].opponentsArray.length; i++) {
    var totalTrTwo = document.createElement('tr');
    var totalTdOne = document.createElement('td');
    var totalTdTwo = document.createElement('td');
    var totalTdThree = document.createElement('td');
    var totalTdFour = document.createElement('td');
    totalTdOne.textContent = allUsers[activeUserIndex].opponentsArray[i][0];
    totalTdTwo.textContent = allUsers[activeUserIndex].opponentsArray[i][1];
    totalTdThree.textContent = allUsers[activeUserIndex].opponentsArray[i][2];
    totalTdFour.textContent = opponentsArrayFunction(i);
    totalTrTwo.appendChild(totalTdOne);
    totalTrTwo.appendChild(totalTdTwo);
    totalTrTwo.appendChild(totalTdThree);
    totalTrTwo.appendChild(totalTdFour);
    tableTotalPlays.appendChild(totalTrTwo);
  }
})();

//Scoreboard.html js
function pad2(number) {
  return (number < 10 ? '0' : '') + number;
}
var homeUp = document.getElementById('home-up');
var homeDown = document.getElementById('home-down');
var awayUp = document.getElementById('away-up');
var awayDown = document.getElementById('away-down');
var homeScore = document.getElementById('home-score');
var awayScore = document.getElementById('away-score');
var globalHomeScore = pad2(0);
var globalAwayScore = pad2(0);
var buttonContainer = document.getElementById('button-container');
var endGameScore = parseInt(JSON.parse(localStorage.storedGameScore));

homeUp.addEventListener('click', homePowerUp);
homeDown.addEventListener('click', homePowerDown);
awayUp.addEventListener('click', awayPowerUp);
awayDown.addEventListener('click', awayPowerDown);
buttonContainer.style.visibility = 'hidden';

function homePowerUp(event){
  globalHomeScore++;
  homeScore.textContent = pad2(globalHomeScore);
  if (endGameScore == globalHomeScore){
    if((((globalAwayScore - globalHomeScore) >= 2) || ((globalHomeScore - globalAwayScore) >= 2))) {
      console.log('Home fucking won');
      homeUp.removeEventListener('click', homePowerUp);
      homeDown.removeEventListener('click', homePowerDown);
      awayUp.removeEventListener('click', awayPowerUp);
      awayDown.removeEventListener('click', awayPowerDown);
      buttonContainer.style.visibility = 'visible';
    }else{
      endGameScore++;
      console.log(endGameScore + 'this should go up by 1');
    }
  }
};

function homePowerDown(event){
  globalHomeScore--;
  if (globalHomeScore < 1) {
    globalHomeScore = 00;
  }
  homeScore.textContent = pad2(globalHomeScore);
}
function awayPowerUp(event){
  globalAwayScore++;
  awayScore.textContent = pad2(globalAwayScore);

  if (endGameScore == globalAwayScore){
    if((((globalAwayScore - globalHomeScore) >= 2) || ((globalHomeScore - globalAwayScore) >= 2))) {
      console.log('away fucking won');
      homeUp.removeEventListener('click', homePowerUp);
      homeDown.removeEventListener('click', homePowerDown);
      awayUp.removeEventListener('click', awayPowerUp);
      awayDown.removeEventListener('click', awayPowerDown);
      buttonContainer.style.visibility = 'visible';
    }else{
      endGameScore++;
      console.log(endGameScore + 'this should go up by 1');
    }
  }
};

function awayPowerDown(event){
  globalAwayScore--;
  if (globalAwayScore < 1) {
    globalAwayScore = 00;
  }
  awayScore.textContent = pad2(globalAwayScore);
};
