
var işleyiciler = require("./yönlendirici/işleyiciler.js");

/**
 * İstekler için yönlendirici tanımlama
 * * Örnek: *localhost:3000/<değişken> [ <değişken> = { "ornek", "durt", ...} ]*
 * * Not: *Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı]*
 * * Gerekli Modüller: *işleyiciler.js*
 */
var yönlendirici = {
    "ornek": işleyiciler.örnek,
    "durt": işleyiciler.dürt,
    "kullanicilar": işleyiciler.kullanıcılar,
    "belirtecler": işleyiciler.belirteçler,
    "kontroller": işleyiciler.kontroller,
    "seçilmişİşleyici": işleyiciler.bulunamadı
};

/** 
 * İsteğin gideceği işleyiciyi seçme
 * * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
 * @param {object} veri index.js"te tanımlanan veri objesi
 * @param {function} geriCagirma İşlem bittikten sonra çalışacak metot
 */
yönlendirici.işleyiciAyarla = function (kırpılmışYol) {
    yönlendirici.seçilmişİşleyici = typeof (yönlendirici[kırpılmışYol]) !== "undefined" ?
        yönlendirici[kırpılmışYol] : işleyiciler.bulunamadı;
};

// Dışa aktarılacak obje
module.exports = yönlendirici;