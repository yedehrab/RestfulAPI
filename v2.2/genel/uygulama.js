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
        ? sorguDizgisiObjesi
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

    // Eğer zaten oturum beliteci varsa, bunları başlıklara ekliyoruz
    if (uygulama.yapılandırma.oturumBelirteci) {
        xhr.setRequestHeader('belirteç', app.yapılandırma.oturumBelirteci.id);
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
    xhr.send(yükDizgisi);
}