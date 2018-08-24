/**
 * İstekler için yönlendirici tanımlama
 * Örnek: localhost:3000/<değişken>
 * Not: Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı] 
 */

/**
* Bağımlılıklar
* -> işleyiciler; Yönlendirici için gereklidir.
*/
var işleyiciler = require("./yönlendirici/işleyiciler.js");

var yönlendirici = {
    // localhost:3000/ornek
    "ornek": işleyiciler.örnek,
    "durt": işleyiciler.dürt,
    "kullanicilar": işleyiciler.kullanıcılar,
    "belirtecler": işleyiciler.belirteçler,
    "kontroller": işleyiciler.kontroller,
    "seçilmişİşleyici": işleyiciler.bulunamadı
};

/** 
 * İsteğin gideceği işleyiciyi seçme
 * Örnek: yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]
 * @param {object} veri index.js"te tanımlanan veri objesi
 * @param {function} geriCagirma İşlem bittikten sonra çalışacak metot
 */
yönlendirici.işleyiciAyarla = function (kırpılmışYol) {
    yönlendirici.seçilmişİşleyici = typeof (yönlendirici[kırpılmışYol]) !== "undefined" ?
        yönlendirici[kırpılmışYol] : işleyiciler.bulunamadı;
};

module.exports = yönlendirici;