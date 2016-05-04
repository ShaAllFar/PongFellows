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
var opponentRecord = document.getElementById('opponent');
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
  this.percentage = 0;
}
// UserObject.prototype.userTotalWinsAndLosses = function() {
//   for (var i = 0; i < this.opponentsArray.length; i++) {
//     this.wins += this.opponentsArray[i][2];
//     this.loss += this.opponentsArray[i][1];
//   }
//   console.log('the number of wins is ' + this.wins);
//   console.log('the number of losses is ' + this.loss);
// };
function userTotalWinsAndLosses() {
  var totalWins = 0;
  var totalLoss = 0;
  for (var i = 0; i < allUsers[activeUserIndex].opponentsArray.length; i++) {
    totalWins += allUsers[activeUserIndex].opponentsArray[i][2];
    totalLoss += allUsers[activeUserIndex].opponentsArray[i][1];
  }
  allUsers[activeUserIndex].wins = totalWins;
  allUsers[activeUserIndex].loss = totalLoss;
}
// UserObject.prototype.userPercentageWins = function() {
//   this.percentage = parseInt((this.wins / (this.loss + this.wins)) * 100);
//   console.log(this.percentage);
// };
function userPercentageWins() {
  allUsers[activeUserIndex].percentage = parseInt((allUsers[activeUserIndex].wins) / (allUsers[activeUserIndex].loss + allUsers[activeUserIndex].wins) * 100);
}

var Shawn = new UserObject('Shawn', 'coolguy');
var Sean = new UserObject('Sean', 'awesomeguy');
var Kyle = new UserObject('Kyle', 'greatguy');
var Sung = new UserObject('Sung', 'niceguy');
var opponent1 = ['Sam', 3, 4];
var opponent2 = ['Jon', 4, 5];
var opponent3 = ['Katie', 6, 0];
var opponent4 = ['Dan', 5, 2];
var opponent5 = ['Spencer', 3, 3];
var opponent6 = ['Benton', 10, 0];
Shawn.opponentsArray.push(opponent1);
Shawn.opponentsArray.push(opponent2);
Shawn.opponentsArray.push(opponent3);
Shawn.opponentsArray.push(opponent4);
Shawn.opponentsArray.push(opponent5);
Shawn.opponentsArray.push(opponent6);
allUsers.push(Shawn);
allUsers.push(Sean);
allUsers.push(Kyle);
allUsers.push(Sung);
// localStorage.setItem('storedTestingUserArray', JSON.stringify(allUsers));
// var parsedTestingUsers = JSON.parse(localStorage.storedTestingUserArray);
// allUsers = parsedTestingUsers;
//Handles Create User Event, includes validation of existing Users --> index.html
function handleCreateUserEvent(event) {
  event.preventDefault();
  if (!event.target.signUpName.value || !event.target.signUpPassword.value) {
    return alertify.alert('Please enter a valid Username and Password.');
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
    alertify.alert('Sorry!  This username already exists.  Please try again.');
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
      localStorage.setItem('storedUsers', JSON.stringify(allUsers));
      localStorage.setItem('storedActiveUser', JSON.stringify(logInName));
      window.location = 'setup.html';
    } else if (!userExists) {
      console.log('I did not find an existing user');
      alertify.alert('Incorrect username or password.  Please try again.');
    }
  } else {
    console.log('I did not find an existing user');
    alertify.alert('Incorrect username or password.  Please try again.');
  }
  event.target.signInName.value = null;
  event.target.signInPassword.value = null;
}
//Checks for existing local storage and updates stored data to allUser array
(function checkLocal() {
  if (localStorage.storedUsers) {
    var parsedStoredUsers = JSON.parse(localStorage.storedUsers);
    // for (i = 0; i < parsedStoredUsers.length; i++) {
    //   parsedStoredUsers[i].prototype = UserObject;
    // }
    allUsers = parsedStoredUsers;
  }
  if (localStorage.storedOpponentIndex) {
    var parsedStoredOpponentIndex = JSON.parse(localStorage.storedOpponentIndex);
    opponentIndex = parsedStoredOpponentIndex;
  }
  console.log(allUsers);
  // return allUsers;
})();
//Finds the index at which the active user belongs in allUsers array
if (localStorage.storedActiveUser) {
  (function findActiveUser() {
    console.log('I am looking for the active user');
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
//Finds an opponent's index inside an active user's opponentsArray with an opponent's name passed as a parameter
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
//On page load, adds existing opponents in a specific User's opponentsArray into the select drop down box using appendChild --> setup.html
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
//Calculates and displays total wins, total losses, and percentage for active user --> setup.html
if (homeRecord) {
  (function calculateAndDisplayWinPercentage() {
    userTotalWinsAndLosses();
    userPercentageWins();
    var winList = document.createElement('li');
    var lossList = document.createElement('li');
    // var winPercentList = document.createElement('li');

    winList.textContent = ('Wins: ' + allUsers[activeUserIndex].wins);
    lossList.textContent = ('Losses: ' + allUsers[activeUserIndex].loss);
    // winPercentList.textContent = ('Win%: ' + allUsers[activeUserIndex].percentage);
    homeRecord.appendChild(winList);
    homeRecord.appendChild(lossList);
    // homeRecord.appendChild(winPercentList);
  })();
}
//Calculates percentage for selected opponent of active user --> setup.html
function calculateOpponentPercentage(index) {
  var winValue = allUsers[activeUserIndex].opponentsArray[index][1];
  // console.log(winValue);
  var lossValue = allUsers[activeUserIndex].opponentsArray[index][2];
  // console.log(lossValue);
  var percentValue = '';
  if ((lossValue + winValue) > 0) {
    percentValue = parseInt((winValue / (winValue + lossValue)) * 100);
    return percentValue;
  } else {
    return percentValue;
  }
}
//Displays opponent statistics of wins, loss, and win percentage --> setup.html
function calculateAndDisplayOpponentWinPercentage() {
  var sumWin = allUsers[activeUserIndex].opponentsArray[opponentIndex][1];
  var sumLoss = allUsers[activeUserIndex].opponentsArray[opponentIndex][2];
  var winPercent = calculateOpponentPercentage(opponentIndex);

  var winList = document.createElement('li');
  var lossList = document.createElement('li');
  // var winPercentList = document.createElement('li');
  winList.setAttribute('id', 'win-list');
  lossList.setAttribute('id', 'loss-list');
  // winPercentList.setAttribute('id', 'win-percent-list');
  winList.textContent = ('Wins: ' + sumWin);
  lossList.textContent = ('Losses: ' + sumLoss);
  // winPercentList.textContent = ('Win%: ' + winPercent);
  opponentRecordList.appendChild(winList);
  opponentRecordList.appendChild(lossList);
  // opponentRecordList.appendChild(winPercentList);
}
//Handles the change event on the select drop down box --> setup.html
function handleOpponentChangeEvent(event) {
  event.preventDefault();
  console.log(opponentName.value);
  findOpponentIndex(opponentName.value);
  console.log('this is the opponent index: ' + opponentIndex);
  var winList = document.getElementById('win-list');
  var lossList = document.getElementById('loss-list');
  var winPercentList = document.getElementById('win-percent-list');
  if (opponentName.value == 'new-opponent') {
    // console.log('There were previous opponents, but I want to make a new one');
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
    } else if (document.getElementById('win-list')) {
      opponentRecordList.removeChild(winList);
      opponentRecordList.removeChild(lossList);
      opponentRecordList.removeChild(winPercentList);
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
  if (opponentName.value == 'no-opponent') {
    alertify.alert('Please select an opponent.');
  }
  if (document.getElementById('enter-new-opponent')) {
    var newOpponent = event.target.enterNewOpponent.value.toString().toUpperCase();
    var currentUser = allUsers[activeUserIndex];
    // console.log(currentUser);
    if (findOpponentIndex(newOpponent.toUpperCase()) > -1) {
      alertify.alert('Opponent name already exists, please enter a new name.');
    } else {
      console.log('I want to enter a new opponent');
      currentUser.opponentsArray.push([newOpponent, 0, 0]);
      findOpponentIndex(newOpponent.toUpperCase());
      console.log('The new opponent index is ' + opponentIndex);
      localStorage.setItem('storedOpponentIndex', JSON.stringify(opponentIndex));
      localStorage.setItem('storedUsers', JSON.stringify(allUsers));
      localStorage.setItem('storedActiveOpponent', JSON.stringify(newOpponent));
      window.location = 'scoreboard.html';
    }
  }
  if (opponentName.value != 'new-opponent' && opponentName.value != 'no-opponent') {
    localStorage.setItem('storedActiveOpponent', JSON.stringify(opponentName.value));
    window.location = 'scoreboard.html';
  }
}
//Finds existing users and setting h3 tage in setup.html to represent User Name from local storage --> setup.html
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
//Scoreboard.html js

//Displays active user name and active opponent name on scoreboard --> scoreboard.html
if (document.getElementById('name-display-container')) {
  (function displayNamesOnScoreboard() {
    var homeTeam = document.getElementById('home-team');
    var awayTeam = document.getElementById('away-team');
    homeTeam.textContent = JSON.parse(localStorage.storedActiveUser);
    awayTeam.textContent = JSON.parse(localStorage.storedActiveOpponent);
  })();
}
//Will ensure single digit numbers will be displayed with a 0 in front --> scoreboard.html
function pad2(number) {
  return (number < 10 ? '0' : '') + number;
}
var globalCounter = 0;
var homeUp = document.getElementById('home-up');
var homeDown = document.getElementById('home-down');
var awayUp = document.getElementById('away-up');
var awayDown = document.getElementById('away-down');
var homeScore = document.getElementById('home-score');
var awayScore = document.getElementById('away-score');
var globalHomeScore = pad2(0);
var globalAwayScore = pad2(0);
var scoreboardButtonContainer = document.getElementById('scoreboard-button-container');

if (document.getElementById('main-scoreboard-container')) {
  var endGameScore = parseInt(JSON.parse(localStorage.storedGameScore));
}
if (homeUp) {
  homeUp.addEventListener('click', homePowerUp);
}
if (homeDown) {
  homeDown.addEventListener('click', homePowerDown);
}
if (awayUp) {
  awayUp.addEventListener('click', awayPowerUp);
}
if (awayDown) {
  awayDown.addEventListener('click', awayPowerDown);
}
if (scoreboardButtonContainer) {
  scoreboardButtonContainer.style.visibility = 'hidden';
}
//Score incrementor event callback function for current active user. Stops game when appropriate score value is achieved --> scoreboard.html
function homePowerUp(event){
  globalHomeScore++;
  globalCounter++;
  serverChange();
  homeScore.textContent = pad2(globalHomeScore);
  if (globalHomeScore === globalAwayScore && globalHomeScore === endGameScore - 1) {
    // homeGamePoint();
    console.log('endGameScore increments');
    endGameScore++;
  }
  if (endGameScore == globalHomeScore){
    if((((globalAwayScore - globalHomeScore) >= 2) || ((globalHomeScore - globalAwayScore) >= 2))) {
      alertify.alert(allUsers[activeUserIndex].userName + ' WINS!!!');
      homeUp.removeEventListener('click', homePowerUp);
      homeDown.removeEventListener('click', homePowerDown);
      awayUp.removeEventListener('click', awayPowerUp);
      awayDown.removeEventListener('click', awayPowerDown);
      scoreboardButtonContainer.style.visibility = 'visible';
      saveOpponentLossRecord();
    // }
    // else{
      // endGameScore++;
      // console.log(endGameScore + 'this should go up by 1');
    }
  }
  homeGamePoint();
}
//Score decrementor event callback function for current active user --> scoreboard.html
function homePowerDown(event){
  globalHomeScore--;
  globalCounter--;
  if (endGameScore != JSON.parse(localStorage.storedGameScore)) {
    endGameScore--;
    awayGamePoint();
  }
  serverChange();
  if (globalHomeScore < 1) {
    globalHomeScore = 00;
  }
  homeScore.textContent = pad2(globalHomeScore);
  homeGamePoint();
}
//Score incrementor event callback function for current active opponent. Stops game when appropriate score value is achieved --> scoreboard.html
function awayPowerUp(event){
  globalAwayScore++;
  globalCounter++;
  serverChange();
  awayScore.textContent = pad2(globalAwayScore);
  if (globalHomeScore === globalAwayScore && globalAwayScore === endGameScore - 1) {
    // awayGamePoint();
    console.log('endGameScore increments');
    endGameScore++;
  }
  if (endGameScore == globalAwayScore){
    if((((globalAwayScore - globalHomeScore) >= 2) || ((globalHomeScore - globalAwayScore) >= 2))) {
      console.log('away fucking won');
      // allUsers[activeUserIndex].opponentsArray[opponentIndex][1] + 1;
      // console.log('Opponent score for wins should have gone up, it is: ' + allUsers[activeUserIndex].opponentsArray[opponentIndex][1]);
      alertify.alert(JSON.parse(localStorage.storedActiveOpponent) + ' WINS!!!');
      homeUp.removeEventListener('click', homePowerUp);
      homeDown.removeEventListener('click', homePowerDown);
      awayUp.removeEventListener('click', awayPowerUp);
      awayDown.removeEventListener('click', awayPowerDown);
      scoreboardButtonContainer.style.visibility = 'visible';
      saveOpponentWinRecord();
    }
    // else{
    //   // endGameScore++;
    //   console.log(endGameScore + ' this should go up by 1');
    // }
  }
  awayGamePoint();
}
//Score decrementor event callback function for current active opponent --> scoreboard.html
function awayPowerDown(event){
  globalAwayScore--;
  globalCounter--;
  if (endGameScore != JSON.parse(localStorage.storedGameScore)) {
    endGameScore--;
    homeGamePoint();
  }
  serverChange();
  if (globalAwayScore < 1) {
    globalAwayScore = 00;
  }
  awayScore.textContent = pad2(globalAwayScore);
  awayGamePoint();
}
//Serve Light
// current-player-serve
var homeServeLight = document.getElementById('current-home-serve');
var awayServeLight = document.getElementById('current-away-serve');

if (document.getElementById('serve-container')) {
  (function coinFlip() {
    var decision = Math.floor(Math.random() * (2)) + 1;
    if (decision === 1) {
      homeServeLight.setAttribute('class', 'current-player-serve');
      alertify.alert(allUsers[activeUserIndex].userName + ' serves first!!!');
    } else if (decision === 2) {
      awayServeLight.setAttribute('class', 'current-player-serve');
      alertify.alert(JSON.parse(localStorage.storedActiveOpponent) + ' serves first!!!');
    }
  })();
}

function lightChange(p1,p2) {
  if (p1.className === 'current-player-serve'){
    p1.removeAttribute('class', 'current-player-serve');
    p2.setAttribute('class', 'current-player-serve');
  }
  else if (p2.className === 'current-player-serve') {
    p2.removeAttribute('class', 'current-player-serve');
    p1.setAttribute('class', 'current-player-serve');
    // console.log('working');
  }
};

function serverChange(){
  if (globalCounter % 2 === 0) {
    lightChange(homeServeLight, awayServeLight);
  }
}

function awayGamePoint(){
  if ((endGameScore - 1) === globalAwayScore){
    console.log('Away\'s gamepoint!');
    if (awayServeLight.className === 'current-player-serve'){
      awayServeLight.removeAttribute('class', 'current-player-serve');
      homeServeLight.setAttribute('class', 'current-player-serve');
    }
  }
}

function homeGamePoint(){
  if((endGameScore - 1) === globalHomeScore){
    console.log('Home\'s game point!');
    if(homeServeLight.className === 'current-player-serve'){
      homeServeLight.removeAttribute('class', 'current-player-serve');
      awayServeLight.setAttribute('class', 'current-player-serve');
    }
  }
}

function saveOpponentWinRecord() {
  allUsers[activeUserIndex].opponentsArray[opponentIndex][1]++;
  calculateOpponentPercentage(opponentIndex);
  localStorage.setItem('storedUsers', JSON.stringify(allUsers));
}
function saveOpponentLossRecord() {
  allUsers[activeUserIndex].opponentsArray[opponentIndex][2]++;
  calculateOpponentPercentage(opponentIndex);
  localStorage.setItem('storedUsers', JSON.stringify(allUsers));
}

//Results.html JS
var userResults = document.getElementById('user-results');
// var opponentResults = document.getElementById('opponent-results');
var listResults = document.getElementById('list-record');
//Renders table on page load for current active user --> results.html
if (userResults) {
  (function renderUserData() {
    userTotalWinsAndLosses();
    userPercentageWins();
    var trEl1 = document.createElement('tr');
    userResults.appendChild(trEl1);
    var thEl1 = document.createElement('th');
    thEl1.textContent = 'CURRENT USER';
    var thEl2 = document.createElement('th');
    thEl2.textContent = 'WINS';
    var thEl3 = document.createElement('th');
    thEl3.textContent = 'LOSSES';
    var thEl4 = document.createElement('th');
    thEl4.textContent = 'WIN %';
    trEl1.appendChild(thEl1);
    trEl1.appendChild(thEl2);
    trEl1.appendChild(thEl3);
    trEl1.appendChild(thEl4);
    var trEl2 = document.createElement('tr');
    userResults.appendChild(trEl2);
    var tdEl1 = document.createElement('td');
    tdEl1.textContent = allUsers[activeUserIndex].userName;
    var tdEl2 = document.createElement('td');
    tdEl2.textContent = allUsers[activeUserIndex].wins;
    var tdEl3 = document.createElement('td');
    tdEl3.textContent = allUsers[activeUserIndex].loss;
    var tdEl4 = document.createElement('td');
    tdEl4.textContent = allUsers[activeUserIndex].percentage;
    trEl2.appendChild(tdEl1);
    trEl2.appendChild(tdEl2);
    trEl2.appendChild(tdEl3);
    trEl2.appendChild(tdEl4);
  })();
}
//Renders table on page load for all opponents of current active user --> results.html
if (listResults) {
  (function renderOpponentData() {
    var mainTable = document.createElement('table');
    listResults.appendChild(mainTable);
    var mainTrEl = document.createElement('tr');
    mainTable.appendChild(mainTrEl);
    var thEl1 = document.createElement('th');
    thEl1.textContent = 'OPPONENT';
    var thEl2 = document.createElement('th');
    thEl2.textContent = 'WINS';
    var thEl3 = document.createElement('th');
    thEl3.textContent = 'LOSSES';
    var thEl4 = document.createElement('th');
    thEl4.textContent = 'WIN %';
    mainTrEl.appendChild(thEl1);
    mainTrEl.appendChild(thEl2);
    mainTrEl.appendChild(thEl3);
    mainTrEl.appendChild(thEl4);
    for (var i = 0; i < allUsers[activeUserIndex].opponentsArray.length; i++) {
      var trEl = document.createElement('tr');
      var tdEl1 = document.createElement('td');
      var tdEl2 = document.createElement('td');
      var tdEl3 = document.createElement('td');
      var tdEl4 = document.createElement('td');
      tdEl1.textContent = allUsers[activeUserIndex].opponentsArray[i][0];
      tdEl2.textContent = allUsers[activeUserIndex].opponentsArray[i][1];
      tdEl3.textContent = allUsers[activeUserIndex].opponentsArray[i][2];
      tdEl4.textContent = calculateOpponentPercentage(i);
      mainTable.appendChild(trEl);
      trEl.appendChild(tdEl1);
      trEl.appendChild(tdEl2);
      trEl.appendChild(tdEl3);
      trEl.appendChild(tdEl4);
      var hrEl = document.createElement('hr');
      mainTable.appendChild(hrEl);
    }
  })();
}

var newOpponentButton = document.getElementById('new-opponent-button');
var rematchButton = document.getElementById('rematch-button');
var resultsButton = document.getElementById('records-button');

// newOpponentButton.addEventListener('click', newOpponentSetup);
// rematchButton.addEventListener('click', rematchSetup);
// resultsButton.addEventListener('click', resultsSetup);

function newOpponentSetup() {
  window.location.href = 'setup.html';
}

function rematchSetup() {
  window.location.href = 'scoreboard.html';
}

function resultsSetup() {
  window.location.href = 'results.html';
}
