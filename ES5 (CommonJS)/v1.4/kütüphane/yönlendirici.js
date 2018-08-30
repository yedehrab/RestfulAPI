
var işleyiciler = require("./yönlendirici/işleyiciler.js");

<<<<<<< HEAD:ES5 (CommonJS)/v1.4/kütüphane/yönlendirici.js
=======

var yönlendirici = {};

>>>>>>> c532540505da8ada0547bd6491527c2fd5cd1d1b:v1.4/kütüphane/yönlendirici.js
/**
 * İstekler için yönlendirici tanımlama
 * * Örnek: *localhost:3000/<değişken> [ <değişken> = { "ornek", "durt", ...} ]*
 * * Not: *Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı]*
 * * Gerekli Modüller: *işleyiciler.js*
 */
<<<<<<< HEAD:ES5 (CommonJS)/v1.4/kütüphane/yönlendirici.js
var yönlendirici = {
=======
var yönlendirme = {
    "bulunamadi": işleyiciler.bulunamadı,
>>>>>>> c532540505da8ada0547bd6491527c2fd5cd1d1b:v1.4/kütüphane/yönlendirici.js
    "ornek": işleyiciler.örnek,
    "durt": işleyiciler.dürt,
    "kullanicilar": işleyiciler.kullanıcılar,
    "belirtecler": işleyiciler.belirteçler,
    "kontroller": işleyiciler.kontroller
};

/** 
<<<<<<< HEAD:ES5 (CommonJS)/v1.4/kütüphane/yönlendirici.js
 * İsteğin gideceği işleyiciyi seçme
 * * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
 * @param {object} veri index.js"te tanımlanan veri objesi
 * @param {function} geriCagirma İşlem bittikten sonra çalışacak metot
 */
yönlendirici.işleyiciAyarla = function (kırpılmışYol) {
    yönlendirici.seçilmişİşleyici = typeof (yönlendirici[kırpılmışYol]) !== "undefined" ?
        yönlendirici[kırpılmışYol] : işleyiciler.bulunamadı;
=======
* İsteğin gideceği işleyiciyi seçme
* * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
* @param {string} isleyici Seçilecek işleyicinin ismi
* @param {function(object)} geriCagirma Seçilmiş işleyiciyi geri döndürür.
* * arg0: *function(veri, function(durumKodu, yükler))*
*/
yönlendirici.işleyiciAyarla = function (isleyici, geriCagirma) {
    seçilmişİşleyici = typeof (yönlendirme[isleyici]) !== "undefined" ?
        yönlendirme[isleyici] : işleyiciler.bulunamadı;
   
    geriCagirma(seçilmişİşleyici);
>>>>>>> c532540505da8ada0547bd6491527c2fd5cd1d1b:v1.4/kütüphane/yönlendirici.js
};

// Dışa aktarılacak obje
module.exports = yönlendirici;