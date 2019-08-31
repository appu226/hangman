var useless=3;
var drawSeq = [drawBase, drawPole, drawRoof, drawRope, 
               drawHead, drawTorso,
               drawLeftHand, drawRightHand,
               drawLeftFoot, drawRightFoot];
var wordlist = ["cyclone", "heatwave", "coldwave", "thunderstorm", "hail", "hailstorm",
                "downburst", "tornado", "derecho", "supercell", "waterspout", "windstorm",
                "blizzard", "icestorm", "hurricane", "snowstorm", "snowfall", "rain",
                "lightning", "thunder", "duststorm", "storm", "drought", "flood", "flashflood",
                "landslide", "mudslide", "wildfire", "firestorm", "avalanche"];
var ACODE = c2k("a");
var ZCODE = c2k("z");
var fails;
var lettersRemaining;
var hiddenWord;

restart();

function passLetter(event) {
  var k = event.keyCode;
  if (k < ACODE || k > (ACODE + 25))
    return;
  if (!lettersRemaining[k - ACODE])
    return;
  
  var hasFailed = true;
  var c = k2c(k);
  for (var hp = 0; hp < hiddenWord.length && hasFailed; ++hp)
  {
    var hc = hiddenWord[hp];
    hasFailed = (hc != c);
  }
  
  if (hasFailed)
  {
    var gallow = document.getElementById("gallow");
    var nextDraw = drawSeq[fails];
    var ctx = gallow.getContext("2d");
    ctx.beginPath();
    nextDraw(ctx);
    ctx.stroke();
    ctx.closePath();
    fails = fails + 1;
  }
  lettersRemaining[k - ACODE] = false;
  refreshDisplay();
}

function drawBase(ctx) {
  ctx.moveTo(50, 350);
  ctx.lineTo(350, 350);
}

function drawPole(ctx) {
  ctx.moveTo(100, 50);
  ctx.lineTo(100, 350);
}

function drawRoof(ctx) {
  ctx.moveTo(100, 50);
  ctx.lineTo(250, 50);
}

function drawRope(ctx) {
  ctx.moveTo(250, 50);
  ctx.lineTo(250, 100);
}

function drawHead(ctx) {
  ctx.beginPath();
  ctx.arc(250, 125, 25, 0, 2 * Math.PI);
}
function drawTorso(ctx) {
  ctx.moveTo(250, 150);
  ctx.lineTo(250, 225);
}
function drawLeftHand(ctx) {
  ctx.moveTo(250, 150);
  ctx.lineTo(230, 200);
}
function drawRightHand(ctx) {
  ctx.moveTo(250, 150);
  ctx.lineTo(270, 200);
}
function drawLeftFoot(ctx) {
  ctx.moveTo(250, 225);
  ctx.lineTo(230, 300);
}
function drawRightFoot(ctx) {
  ctx.moveTo(250, 225);
  ctx.lineTo(270, 300);
}

function k2c(k) {
  return String.fromCharCode(k);
}
function c2k(c) {
  return c.charCodeAt(0);
}

function refreshDisplay()
{
  refreshAlphabetDisplay();
  refreshWordDisplay();
  if (hasWon())
    displayMessageAndStop("You WIN!!!");
  else if (hasLost())
  {
    var wordShow = "";
    for (var hp = 0; hp < hiddenWord.length; ++hp)
    {
      var hc = hiddenWord[hp];
      var hk = c2k(hc);
      if (!lettersRemaining[hk - ACODE])
        wordShow = wordShow + hc + " ";
      else
        wordShow = wordShow + hc.fontcolor("red") + " ";
    }
    document.getElementById("displayWord").innerHTML=wordShow;
    displayMessageAndStop("You LOSE!!");
  }
}

function hasWon() {
  var foundMissingChar = false;
  for (var hp = 0; 
       hp < hiddenWord.length && !foundMissingChar; 
       ++hp)
  {
    var hc = hiddenWord[hp];
    var hk = c2k(hc);
    foundMissingChar = lettersRemaining[hk - ACODE];
  }
  return !foundMissingChar;
}

function hasLost() {
  return fails == drawSeq.length;
}

function displayMessageAndStop(msg) {
  var ctx = document.getElementById("gallow").getContext("2d");
  ctx.font = "40px Arial";
  ctx.fillText(msg, 110, 200);
  window.removeEventListener("keypress", passLetter, true);
}

function refreshAlphabetDisplay()
{
  var alphabet = "";
  for (var l = ACODE; l <= ZCODE; ++l) {
    if(lettersRemaining[l - ACODE])
      alphabet = alphabet + k2c(l) + " ";
    else
      alphabet = alphabet + k2c(l).fontcolor("white") + " ";
  }
  document.getElementById("displayAlphabet").innerHTML=alphabet;
}

function refreshWordDisplay() {
  var wordShow = "";
  for (var hp = 0; hp < hiddenWord.length; ++hp)
  {
    var hc = hiddenWord[hp];
    var hk = c2k(hc);
    if (!lettersRemaining[hk - ACODE])
      wordShow = wordShow + hc + " ";
    else
      wordShow = wordShow + "_ ";
  }
  document.getElementById("displayWord").innerHTML=wordShow;
}

function restart() {
  fails=0;
  lettersRemaining = [];
  for (var l = 0; l < 26; ++l) {
    lettersRemaining.push(true);
  }
  hiddenWord = wordlist[Math.floor(Math.random() * wordlist.length)];
  refreshDisplay();
  var gallow = document.getElementById("gallow");
  var ctx = gallow.getContext('2d');
  ctx.clearRect(0, 0, gallow.width, gallow.height);
  window.addEventListener("keypress", passLetter, true);
}
