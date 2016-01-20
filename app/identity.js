'use strict';

var UserLoader = (function() {

  var STATE_START = 1;
  var STATE_ACQUIRING_AUTHTOKEN = 2;
  var STATE_AUTHTOKEN_ACQUIRED = 3;

  var LOGIN_URL = "http://localhost:8080/login/google";
  var REGISTER_URL = "http://localhost:8080/user/devices";

  var manifest = chrome.runtime.getManifest();

  var clientId = encodeURIComponent(manifest.oauth2.client_id);
  var scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
  var redirectUri = encodeURIComponent('https://' + chrome.runtime.id + '.chromiumapp.org');

  var url = 'https://accounts.google.com/o/oauth2/auth' +
            '?client_id=' + clientId +
            '&response_type=id_token' +
            '&access_type=offline' +
            '&redirect_uri=' + redirectUri +
            '&scope=' + scopes;

  var state = STATE_START;

  var signin_button, register_button, message_input, message_output, message_send;
  var messageId = 0;

 function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
  }

  function enableButton(button) {
    button.removeAttribute('disabled');
  }

  function changeState(newState) {
    state = newState;
    switch (state) {
      case STATE_START:
        enableButton(signin_button);
        break;
      case STATE_ACQUIRING_AUTHTOKEN:
        disableButton(signin_button);
        break;
      case STATE_AUTHTOKEN_ACQUIRED:
        disableButton(signin_button);
        break;
    }
  }

  function signIn(interactive) {
    var id_token;
    var retry = true;

    getToken();

    function getToken() {
      chrome.identity.launchWebAuthFlow({ url: url, interactive: interactive }, function(redirect) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }
        id_token = redirect.split('#', 2)[1].split('=')[1];
        requestStart();
      });
    }

    function requestStart() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', LOGIN_URL);
      xhr.setRequestHeader('Content-type','application/json;');
      xhr.onload = function() {
        if (this.status == 401 && retry) {
          retry = false;
        } else {
          onLoggedIn(null, this.status, this.response);
        }
      };
      xhr.send(JSON.stringify({ "token": id_token }));
    }
  }

  function onLoggedIn(error, status, response) {
    if (!error && status == 200) {
      changeState(STATE_AUTHTOKEN_ACQUIRED);
      console.log(response);
      var loginInfo = JSON.parse(response);
      chrome.storage.local.set({
        userId: loginInfo.user_id,
        userToken: loginInfo.token
      });
    } else {
      changeState(STATE_START);
    }
  }

  function interactiveSignIn() {
    changeState(STATE_ACQUIRING_AUTHTOKEN);
    signIn(true);
  }

  function sendRegistrationId(registrationId) {
    chrome.storage.local.get(['userId', 'userToken'], function(result) {
      if (!result['userId'] || !result['userToken']) {
        console.log('Missing token or id');
        console.log(result);
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open('POST', REGISTER_URL);
      xhr.setRequestHeader('Content-type','application/json;');
      xhr.setRequestHeader('X-USER-ID', result['userId']);
      xhr.setRequestHeader('X-USER-TOKEN', result['userToken']);
      xhr.onload = function() {
        console.log(this.response);
        console.log(this.status);
        var response = JSON.parse(this.response);
        if (this.status == 200) {
          chrome.storage.local.set({
            registered: true,
            encryptionKey: response.encryption_key,
            notificationKey: response.notification_key
          });
        } else {
          chrome.gcm.unregister(function() {
            console.log("Unregistered!");
          });
        }
      };
      xhr.send(JSON.stringify({ "token": registrationId, "type": "chrome" }));
    })
  }

  function registerGcm() {
    chrome.gcm.register(["1045304436932"], function(registrationId) {
      if (chrome.runtime.lastError) {
        console.log("ERROR!");
        return;
      }
      sendRegistrationId(registrationId);
    });
  }

  // Returns a new ID to identify the message.
  function getMessageId() {
    messageId++;
    chrome.storage.local.set({messageId: messageId});
    return messageId.toString();
  }


  function sendMessage() {
    chrome.storage.local.get(['notificationKey', 'encryptionKey'], function(result) {
      if (!result['notificationKey'] || !result['encryptionKey']) {
        console.log('Please reregister the device.');
        console.log(result);
        return;
      }
      var message = {
        messageId: getMessageId(),
        destinationId: result['notificationKey'],
        timeToLive: 86400,    // 1 day
        data: {
          "message": message_input.value || "empty",
        }
      };
      chrome.gcm.send(message, function(messageId) {
        if (chrome.runtime.lastError) {
          // Some error occurred. Fail gracefully or try to send
          // again.
          console.log("Error sending message!");
          return;
        }

        // The message has been accepted for delivery. If the message
        // can not reach the destination, onSendError event will be
        // fired.
      });
    });
  }

  function sendError(error) {
    console.log("Message " + error.messageId +
        " failed to be sent: " + error.errorMessage);
  }

  return {
    onload: function () {
      signin_button = document.querySelector('#signin');
      signin_button.addEventListener('click', interactiveSignIn);

      register_button = document.querySelector('#register');
      register_button.addEventListener('click', registerGcm);

      message_input = document.querySelector('#message_input');

      message_send = document.querySelector('#message_send');
      message_send.addEventListener('click', sendMessage);

      chrome.gcm.onSendError.addListener(sendError);
      chrome.storage.local.get(['userId', 'userToken'], function(result) {
        if (!result['userId'] || !result['userToken']) {
          signIn(false);
        }
      });

      chrome.storage.local.get("messageId", function(result) {
        if (chrome.runtime.lastError)
          return;
        messageId = parseInt(result["messageId"]);
        if (isNaN(messageId))
          messageId = 0;
      });
    }
  };

})();

window.onload = UserLoader.onload;

