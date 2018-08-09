/**
 * API için öncelikli dosya
 * Açılama: ES6 tabanında yazılmış bir API
 * Yazar: YunusEmre
 */

// Bağımlılıklar
var http = require('http');
var url = require('url');
var DizeÇözücü = require('string_decoder').StringDecoder;

// Sunucu her isteğe string ile karşılık vermeli
var sunucu = http.createServer(function (istek, yanıt) {
    // URL'i alma ve inceleme
    var incelenmişUrl = url.parse(istek.url, true);

    // Yolu alma
    var yol = incelenmişUrl.pathname; // Tam yoldur.
    var kırpılmışYol = yol.replace(/^\/+|\+$/g, '') // Solda verilen işaretler çıkartılarak alınan yol.

    // Sorgu kelimesini (query string) obje olarak almak.
    var sorguKelimesiObjesi = incelenmişUrl.query;

    // HTTP metodu alma
    var metod = istek.method.toLowerCase();

    // Üst bilgileri (headersları) obje olarak almak
    var üstBilgiler = istek.headers;

    // Eğer payloads varsa onları almak.
    var kodÇözücü = new DizeÇözücü('utf-8');
    var tampon = '';

    istek.on('data', function (data) {
        tampon += kodÇözücü.write(data);
    });

    istek.on('end', function () {
        tampon += kodÇözücü.end();

        yanıt.end("Selam\n");

        console.log("İstek şu payloadla alındı: ", tampon);
    });
});

// Sunucu başlatıyoruz ve onu 3000 portundan dinliyoruz.
sunucu.listen(3000, function () {
    console.log("Sunucu 3000 portundan dinleniyor.");
});