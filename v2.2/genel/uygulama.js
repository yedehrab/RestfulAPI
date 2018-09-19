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
uygulama.istemci.istek = (başlıklar, yol, metot, sorguDizgisiObjesi, yukler, geriCagirma) => {
    // Varsayılanları ayarlama
    başlıklar = typeof (başlıklar) == 'object' && başlıklar !== null
        ? başlıklar
        : {};
    yol = typeof (yol) == 'string'
        ? yol
        : '/';
    // HTTP istekeri için büyük harflerle metotlar yazılır
    metot = typeof (metot) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(metot.toUpperCase()) > -1
        ? metot.toUpperCase()
        : 'GET';
    sorguDizgisiObjesi = typeof (sorguDizgisiObjesi) == 'object' && sorguDizgisiObjesi !== null
        ? sorguDizgisiObjesisorguDizgisiObjesi
        : {};
    yukler = typeof (yukler) == 'object' && yukler !== null
        ? yukler
        : {};
    geriCagirma = typeof (geriCagirma) == 'function'
        ? geriCagirma
        : false;

    // Gönderilen her bir sorgu dizgisi parametresini yola ekliyoruz
    let istekUrl = `${yol}?`;
    let sayıcı = 0;

    for (let sorguAnahtarı in sorguDizgisiObjesi) {
        sayıcı++;

        // ?
        if (sayıcı > 1) {
            istekUrl += '&';
        }

        istekUrl += `${sorguAnahtarı}=${sorguDizgisiObjesi[sorguAnahtarı]}`;
    }

    // HTTP isteğini JSON tipine dönüştürme
    const xhr = new XMLHttpRequest();
    xhr.open(metot, istekUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Her gönderilen başlığı isteğe ekliyoruz
    for (let başlıkAnahtarı in başlıklar) {
        if (başlıklar.hasOwnProperty(başlıkAnahtarı)) {
            xhr.setRequestHeader(başlıkAnahtarı, başlıklar[başlıkAnahtarı]);
        }
    }

    // Eğer zaten oturum beliteci varsa, bunları başlıklara ekliyoruz (Kimliğe dikkat et)
    if (uygulama.yapılandırma.oturumBelirteci) {
        xhr.setRequestHeader('belirteç', uygulama.yapılandırma.oturumBelirteci.kimlik);
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
    }

    // Yükleri JSON olarak gönderme
    const yükDizgisi = JSON.stringify(yukler);
    console.log(yükDizgisi);
    xhr.send(yükDizgisi);
}

// Form'u bağlama// Bind the forms
uygulama.bindForms = function () {
    document.querySelector("form").addEventListener("submit", function (e) {

        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#" + formId + " .formError").style.display = 'hidden';

        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].type !== 'submit') {
                var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
                payload[elements[i].name] = valueOfElement;
            }
        }

        // Call the API
        uygulama.istemci.istek(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode !== 200) {

                // Try to get the error from  the api, or set a default error message
                var error = typeof (responsePayload.bilgi) == 'string' ? responsePayload.bilgi : 'Sunucuya ulaşılamadı, ya da tanımlanamayan hata :(';

                // Set the formError field with the error text
                document.querySelector("#" + formId + " .formError").innerHTML = error;

                // Show (unhide) the form error field on the form
                document.querySelector("#" + formId + " .formError").style.display = 'block';

            } else {
                // If successful, send to form response processor
                uygulama.formResponseProcessor(formId, payload, responsePayload);
            }

        });
    });
};

// Form response processor
uygulama.formResponseProcessor = function (formId, requestPayload, responsePayload) {
    var functionToCall = false;
    // Kalıplardaki form id'lerine göre yanıt vereceğiz
    if (formId == 'hesapOluştur') {
        // @TODO Do something here now that the account has been created successfully
    }
};

// Init (bootstrapping)
uygulama.init = function () {
    // Bind all form submissions
    uygulama.bindForms();
};

// Call the init processes after the window loads
window.onload = function () {
    uygulama.init();
}