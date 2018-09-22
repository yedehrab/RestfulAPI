/**
 * Uygulama için Front-End
 */

const uygulama = {};

// Yapılandırma
uygulama.yapılandırma = {
  oturumBelirteci: false
};

// AJAX istemcisi (Resftull API için)
uygulama.istemci = {};

/**
 *
 * @param {object} başlıklar HTML için başlıklar (headers)
 * @param {string} yol Adres çubuğu yolu
 * @param {string} metot HTML metodu (büyük & küçük harf fark etmez)
 * @param {object} sorguDizgisiObjesi Sorgu dizgileri ?no=12312 gibi (queryString)
 * @param {object} yukler Ek veriler
 * @param {function(number, object | boolean)} geriCagirma İşlemler bittiği zaman çalışan metot
 */
uygulama.istemci.istek = (
  başlıklar,
  yol,
  metot,
  sorguDizgisiObjesi,
  yukler,
  geriCagirma
) => {
  // Varsayılanları ayarlama
  başlıklar =
    typeof başlıklar == "object" && başlıklar !== null ? başlıklar : {};
  yol = typeof yol == "string" ? yol : "/";
  // HTTP istekeri için büyük harflerle metotlar yazılır
  metot =
    typeof metot == "string" &&
    ["POST", "GET", "PUT", "DELETE"].indexOf(metot.toUpperCase()) > -1
      ? metot.toUpperCase()
      : "GET";
  sorguDizgisiObjesi =
    typeof sorguDizgisiObjesi == "object" && sorguDizgisiObjesi !== null
      ? sorguDizgisiObjesi
      : {};
  yukler = typeof yukler == "object" && yukler !== null ? yukler : {};
  geriCagirma = typeof geriCagirma == "function" ? geriCagirma : false;

  // Gönderilen her bir sorgu dizgisi parametresini yola ekliyoruz
  let istekUrl = `${yol}?`;
  let sayıcı = 0;

  for (let sorguAnahtarı in sorguDizgisiObjesi) {
    sayıcı++;

    // ?
    if (sayıcı > 1) {
      istekUrl += "&";
    }

    istekUrl += `${sorguAnahtarı}=${sorguDizgisiObjesi[sorguAnahtarı]}`;
  }

  // HTTP isteğini JSON tipine dönüştürme
  const xhr = new XMLHttpRequest();
  xhr.open(metot, istekUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Her gönderilen başlığı isteğe ekliyoruz
  for (let başlıkAnahtarı in başlıklar) {
    if (başlıklar.hasOwnProperty(başlıkAnahtarı)) {
      xhr.setRequestHeader(başlıkAnahtarı, başlıklar[başlıkAnahtarı]);
    }
  }

  // Eğer zaten oturum beliteci varsa, bunları başlıklara ekliyoruz (varsayılan isim olur 'belirteç' olmaz) (Kimliğe dikkat et)
  if (uygulama.yapılandırma.oturumBelirteci) {
    xhr.setRequestHeader("token", uygulama.yapılandırma.oturumBelirteci.kimlik);
  }

  // İstek geri geldiğinde, yanıtı ele alıyoruz
  xhr.onreadystatechange = () => {
    // İstek yapıldıysa
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const durumKodu = xhr.status;
      const döndürülenYanıt = xhr.responseText;

      // Eğer gerekli sie geri çğaırma
      if (geriCagirma) {
        try {
          const işlenmişYanıt = JSON.parse(döndürülenYanıt);
          geriCagirma(durumKodu, işlenmişYanıt);
        } catch (e) {
          geriCagirma(durumKodu, false);
        }
      }
    }
  };

  // Yükleri JSON olarak gönderme
  const yükDizgisi = JSON.stringify(yukler);
  console.log(yükDizgisi);
  xhr.send(yükDizgisi);
};

// Bind the logout button
uygulama.bindLogoutButton = function() {
  document
    .getElementById("logoutButton")
    .addEventListener("click", function(e) {
      // Stop it from redirecting anywhere
      e.preventDefault();

      // Log the user out
      uygulama.logUserOut();
    });
};

// Log the user out then redirect them
uygulama.logUserOut = function() {
  // Get the current token id
  var tokenId =
    typeof uygulama.yapılandırma.oturumBelirteci.kimlik == "string"
      ? uygulama.yapılandırma.oturumBelirteci.kimlik
      : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {
    kimlik: tokenId
  };
  uygulama.istemci.istek(
    undefined,
    "api/belirtecler",
    "DELETE",
    queryStringObject,
    undefined,
    function(statusCode, responsePayload) {
      // Set the app.config token as false
      uygulama.setSessionToken(false);

      // Send the user to the logged out page
      window.location = "/oturum/sil";
    }
  );
};

// Form'u bağlama
uygulama.bindForms = function() {
  if (document.querySelector("form")) {
    document.querySelector("form").addEventListener("submit", function(e) {
      // Stop it from submitting
      e.preventDefault();
      var formId = this.id;
      var path = this.action;
      var method = this.method.toUpperCase();

      // Hide the error message (if it's currently shown due to a previous error)
      document.querySelector("#" + formId + " .formError").style.display =
        "hidden";

      // Turn the inputs into a payload
      var payload = {};
      var elements = this.elements;
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].type !== "submit") {
          var valueOfElement =
            elements[i].type == "checkbox"
              ? elements[i].checked
              : elements[i].value;
          payload[elements[i].name] = valueOfElement;
        }
      }

      // Call the API
      uygulama.istemci.istek(
        undefined,
        path,
        method,
        undefined,
        payload,
        function(statusCode, responsePayload) {
          // Display an error on the form if needed
          if (statusCode !== 200) {
            // Try to get the error from the api, or set a default error message
            var error =
              typeof responsePayload.bilgi == "string"
                ? responsePayload.bilgi
                : "Bilinmeyen bir hata oluştu, lütfen tekrar deneyin :(";

            // Set the formError field with the error text
            document.querySelector(
              "#" + formId + " .formError"
            ).innerHTML = error;

            // Show (unhide) the form error field on the form
            document.querySelector("#" + formId + " .formError").style.display =
              "block";
          } else {
            // If successful, send to form response processor
            uygulama.formResponseProcessor(formId, payload, responsePayload);
          }
        }
      );
    });
  }
};

// Form response processor
uygulama.formResponseProcessor = function(
  formId,
  requestPayload,
  responsePayload
) {
  var functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if (formId == "hesapOluştur") {
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      telefonNo: requestPayload.telefonNo,
      şifre: requestPayload.şifre
    };

    uygulama.istemci.istek(
      undefined,
      "api/belirtecler",
      "POST",
      undefined,
      newPayload,
      function(newStatusCode, newResponsePayload) {
        // Display an error on the form if needed
        if (newStatusCode !== 200) {
          // Set the formError field with the error text
          document.querySelector("#" + formId + " .formError").innerHTML =
            "Üzgünüm, bir hata oluştu :( Lütfen tekrar deneyin";

          // Show (unhide) the form error field on the form
          document.querySelector("#" + formId + " .formError").style.display =
            "block";
        } else {
          // If successful, set the token and redirect the user
          uygulama.setSessionToken(newResponsePayload);
          window.location = "/checks/all";
        }
      }
    );
  }
  // If login was successful, set the token in localstorage and redirect the user
  if (formId == "oturumOluştur") {
    uygulama.setSessionToken(responsePayload);
    window.location = "/checks/all";
  }
};

// Get the session token from localstorage and set it in the uygulama.yapılandırma object
uygulama.getSessionToken = function() {
  var tokenString = localStorage.getItem("token");
  if (typeof tokenString == "string") {
    try {
      var token = JSON.parse(tokenString);
      uygulama.yapılandırma.oturumBelirteci = token;
      if (typeof token == "object") {
        uygulama.setLoggedInClass(true);
      } else {
        uygulama.setLoggedInClass(false);
      }
    } catch (e) {
      uygulama.yapılandırma.oturumBelirteci = false;
      uygulama.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
uygulama.setLoggedInClass = function(add) {
  var target = document.querySelector("body");
  if (add) {
    target.classList.add("loggedIn");
  } else {
    target.classList.remove("loggedIn");
  }
};

// Set the session token in the uygulama.yapılandırma object as well as localstorage
uygulama.setSessionToken = function(token) {
  uygulama.yapılandırma.oturumBelirteci = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem("token", tokenString);
  if (typeof token == "object") {
    uygulama.setLoggedInClass(true);
  } else {
    uygulama.setLoggedInClass(false);
  }
};

// Renew the token
uygulama.renewToken = function(callback) {
  var currentToken =
    typeof uygulama.yapılandırma.oturumBelirteci == "object"
      ? uygulama.yapılandırma.oturumBelirteci
      : false;
  if (currentToken) {
    // Update the token with a new expiration
    var payload = {
      kimlik: currentToken.id,
      süreUzatma: true
    };
    uygulama.istemci.istek(
      undefined,
      "api/belirtecler",
      "PUT",
      undefined,
      payload,
      function(statusCode, responsePayload) {
        // Display an error on the form if needed
        if (statusCode == 200) {
          // Get the new token details
          var queryStringObject = { kimlik: currentToken.id };
          uygulama.istemci.istek(
            undefined,
            "api/belirtecler",
            "GET",
            queryStringObject,
            undefined,
            function(statusCode, responsePayload) {
              // Display an error on the form if needed
              if (statusCode == 200) {
                uygulama.setSessionToken(responsePayload);
                callback(false);
              } else {
                uygulama.setSessionToken(false);
                callback(true);
              }
            }
          );
        } else {
          uygulama.setSessionToken(false);
          callback(true);
        }
      }
    );
  } else {
    uygulama.setSessionToken(false);
    callback(true);
  }
};

// Loop to renew token often
uygulama.tokenRenewalLoop = function() {
  setInterval(function() {
    uygulama.renewToken(function(err) {
      if (!err) {
        console.log("Token renewed successfully @ " + Date.now());
      }
    });
  }, 1000 * 60);
};

// Init (bootstrapping)
uygulama.init = function() {
  // Bind all form submissions
  uygulama.bindForms();

  // Bind logout logout button
  uygulama.bindLogoutButton();

  // Get the token from localstorage
  uygulama.getSessionToken();

  // Renew token
  uygulama.tokenRenewalLoop();
};

// Call the init processes after the window loads
window.onload = function() {
  uygulama.init();
};
