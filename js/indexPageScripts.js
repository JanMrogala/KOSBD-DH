// alice
alicePrivateKeyA = "#secretKeyA";
alicePublicKeyResult = "#AResultAlice";
aliceCommonSecretResult = "#sResultAlice";
aliceMessageInput = "#textarea1";
aliceSendMessageBtn = "#sendMsgAlice";
aliceReceivedMessage = "#receivedMsgAlice";
aliceDecodedMessage = "#decodedMsgAlice";

// public
modP = "#modP";
baseG = "#baseG";
randomBtn = "#randomizeBtn";
continueBtn1 = "#continueBtn1";
continueBtn2 = "#continueBtn2";

// bob
bobPrivateKeyB = "#secretKeyB";
bobPublicKeyResult = "#BResultBob";
bobCommonSecretResult = "#sResultBob";
bobMessageInput = "#textarea2";
bobSendMessageBtn = "#sendMsgBob";
bobReceivedMessage = "#receivedMsgBob";
bobDecodedMessage = "#decodedMsgBob";

let a;
let b;
let g;
let p;

let A;
let B;

let s1;
let s2;

let msgFromAlice;
let msgFromBob;

let encodedMsgFromAlice;
let encodedMsgFromBob;

let decodedMsgFromAlice;
let decodedMsgFromBob;

let continue1 = false;
let continue2 = false;

$(document).ready(function () {
  $(".collapsible").collapsible();
});

// buttons

// alice
$(aliceSendMessageBtn).click(function () {
  if (!continue2) alert("Some values are still missing!");
  else {
    sendMessageFromAliceToBob();
  }
});

// bob
$(bobSendMessageBtn).click(function () {
  if (!continue2) alert("Some values are still missing!");
  else {
    sendMessageFromBobToAlice();
  }
});

// public
$(randomBtn).click(function () {
  randomP();
  randomG();
});

$(continueBtn1).click(function () {
  let check = validateInputs();
  if (check) calculatePublicKeys();
});

$(continueBtn2).click(function () {
  if (!continue1) alert("Some values are still missing!");
  else {
    calculateCommonSecret();
    continue2 = true;
  }
});

// mod P logic
function randomP() {
  let primes = eratosthenes(getRandomInt(100, 10000));
  $(modP).val(primes.at(-1));
}

function randomG() {
  let prim = findPrimitive($(modP).val());
  $(baseG).val(prim);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function validateInputs() {
  if (
    isNaN($(alicePrivateKeyA).val()) ||
    $(alicePrivateKeyA).val().length < 1 ||
    $(alicePrivateKeyA).val().indexOf(".") != -1
  ) {
    alert("Incorrect private key a!");
    return false;
  }
  if (
    isNaN($(bobPrivateKeyB).val()) ||
    $(bobPrivateKeyB).val().length < 1 ||
    $(bobPrivateKeyB).val().indexOf(".") != -1
  ) {
    alert("Incorrect private key b!");
    return false;
  }
  if (
    isNaN($(modP).val()) ||
    $(modP).val().length < 1 ||
    $(modP).val().indexOf(".") != -1
  ) {
    alert("Incorrect p!");
    return false;
  }
  if (
    isNaN($(baseG).val()) ||
    $(baseG).val().length < 1 ||
    $(baseG).val().indexOf(".") != -1
  ) {
    alert("Incorrect g!");
    return false;
  }
  if (!isPrime($(modP).val())) {
    alert("p is not a prime number!");
    return false;
  }
  if (!isPrimitive($(modP).val(), $(baseG).val())) {
    alert("g is not a primitive of modulo p!");
    return false;
  }
  a = $(alicePrivateKeyA).val();
  b = $(bobPrivateKeyB).val();
  p = $(modP).val();
  g = $(baseG).val();
  continue1 = true;

  return true;
}

function calculatePublicKeys() {
  A = BigInt(g) ** BigInt(a) % BigInt(p);
  B = BigInt(g) ** BigInt(b) % BigInt(p);

  $(alicePublicKeyResult).text("A = " + A);
  $(bobPublicKeyResult).text("B = " + B);
}

function calculateCommonSecret() {
  s1 = Number(((BigInt(B) ** BigInt(a) % BigInt(p)) + BigInt(p)) % BigInt(p));
  s2 = Number(((BigInt(A) ** BigInt(b) % BigInt(p)) + BigInt(p)) % BigInt(p));

  $(aliceCommonSecretResult).text("s = " + s1);
  $(bobCommonSecretResult).text("s = " + s2);
}

function sendMessageFromAliceToBob() {
  messageFromAlice = $(aliceMessageInput).val();
  encodedMsgFromAlice = encodeText(messageFromAlice, s1);
  decodedMsgFromAlice = decodeText(encodedMsgFromAlice, s2);

  $(bobReceivedMessage).text(encodedMsgFromAlice);
  $(bobDecodedMessage).text(decodedMsgFromAlice);
}

function sendMessageFromBobToAlice() {
  messageFromBob = $(bobMessageInput).val();
  encodedMsgFromBob = encodeText(messageFromBob, s2);
  decodedMsgFromBob = decodeText(encodedMsgFromBob, s1);

  $(aliceReceivedMessage).text(encodedMsgFromBob);
  $(aliceDecodedMessage).text(decodedMsgFromBob);
}
