/**
 * API için öncelikli dosya
 * Açılama: ES6 tabanında yazılmış bir API
 * Yazar: YunusEmre
 */

// Bağımlılıklar
var http = require('http');
var url = require('url');
var DizgiÇözücü = require('string_decoder').StringDecoder;
var yapılandırma = require('./config');

// Sunucu her isteğe string ile karşılık vermeli
var sunucu = http.createServer(function (istek, yanıt) {
    /**
     * Url ayrıştırma işlemi
     * Örnek: {... query: {}, pathname: '/ornek' ... } şeklinde bir url classı
     */
    var ayrıştırılmışUrl = url.parse(istek.url, true);

    /**
     * Sorgu kelimesini (query string) obje olarak almak.
     * Örnek: "curl localhost:3000/foo?test=testtir" ise { test : 'testtir' }
     * Not: "?test=testtir" sorgu dizgisidir.
     */
    var sorguDizgisiObjeleri = ayrıştırılmışUrl.query;

    /**
     * Ayrıştırılan urldeki pathname değişkenindeki değeri yol'a alıyorz.
     * Örnek: 'curl localhost:3000/ornek/test/' => yolu '/ornek/test/'
     * Not: sorgu dizgileri ele alınmaz ( 'curl localhost:3000/ornek?foo=bar' => yolu '/ornek' )
     */
    var yol = ayrıştırılmışUrl.pathname;

    /**
     * Replace içinde verilen işaretler çıkartılarak alınan yol. 
     * Örnek: '/ornek' -> 'ornek' veya '/ornek/test/' -> 'ornek/test/' olarak kırpılmakta. 
     * Not: Sadece ilk karakter kırpılıyor (?)
     */
    var kırpılmışYol = yol.replace(/^\/+|\+$/g, '');

    /**
     * HTTP metodu alma
     * Örnek: GET, POST, PUT, DELETE ...
     */
    var metot = istek.method.toLowerCase();

    /**
     * İsteğin içindeki başlıkları (header keys) obje olarak almak.
     * Not: Postman ile headers sekmesinde gönderilen anahtarları (keys) 
     * ve değerlerini (the value of them) içerir.
     */
    var başlıklar = istek.headers;

    /**
     * ASCI kodlarını çözümlemek için kod çözücü tanımlama
     * Not: 'utf-8' çözümleme yöntemidir
     */
    var kodÇözücü = new DizgiÇözücü('utf-8');
    var tampon = '';

    /**
     * İstek ile data geldiği zaman çalışan metot
     * @param data ASCI kodları
     */
    istek.on('data', function (data) {
        /**
         * ASCI kodlarını 'utf-8' formatında çözümlüyoruz.
         * Ornek: 42 75 -> Bu [ 42 = B, 75 = u]
         */
        tampon += kodÇözücü.write(data);
    });

    istek.on('end', function () {
        /**
         * Son kısmı ekliyoruz.
         * Not: Şu anlık '' (?)
         */
        tampon += kodÇözücü.end();

        /** 
         * İsteğin gideceği işleyiciyi seçme
         * Örnek: yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]
         */
        var seçilmişİşleyici =
            typeof (yönlendirici[kırpılmışYol]) !== 'undefined' ?
                yönlendirici[kırpılmışYol] : işleyiciler.bulunamadı;

        

        /**
         * İşleyiciye gönderilen veri objesi oluşturma
         * Örnek: { 'kırpılmışYol' = 'ornek', sorguDizgisiObjeleri = {}, metot = 'post', vs.}
         */
        var veri = {
            'kırpılmışYol': kırpılmışYol,
            'sorguDizgisiObjeleri': sorguDizgisiObjeleri,
            'metot': metot,
            'başlıklar': başlıklar,
            'yükler': tampon
        };

        seçilmişİşleyici(veri, function (durumKodu, yükler) {
            // Durum kodunu kullan veya varsayılanı ele al
            durumKodu = typeof (durumKodu) == 'number' ? durumKodu : 200;

            // Yükleri kullan yada varsayılanı ele al
            yükler = typeof (yükler) == 'object' ? yükler : {};

            // Yükleri dizgi'ye çevirme
            var yükDizgisi = JSON.stringify(yükler);

            /**
             * Döndürülen sonucun içeriğinin JSON olduğunu belirliyoruz.
             */
            yanıt.setHeader('Content-type', 'application/json');

            /**
             * Sonucu döndürme
             */
            yanıt.writeHead(durumKodu);
            yanıt.end(yükDizgisi);


            console.log("Yanıt: ", durumKodu, yükDizgisi);
        });
    });
});

/**
 * Sunucu başlatıyoruz ve onu 3000 portundan dinliyoruz.
 * Örnek kullanım: curl localhost:3000 
 * Not: Eğer 3000 yerine 500 yazsaydık, locakhost:500 yapacaktık.
 */
sunucu.listen(yapılandırma.bağlantıNoktası, function () {
    console.log("Sunucu " + yapılandırma.bağlantıNoktası + " portundan dinleniyor.");
});

/**
 * İşleyicileri (handlers) tanımlama
 * Örnek: işleyiciler.örnek
 * Not: Buradaki işleyiciler.örnek, yönlendiricilerdeki 'ornek' öğesine atanıyor.
 */
var işleyiciler = {};

/**
 * İşleyici örneği
 * Örnek: localhost:3000/ornek yazıldığında bu fonksiyon çalışır.
 * Not: ornek, yönlendirici 'nin bir objesidir.
 */
işleyiciler.örnek = function (veri, geriÇağırma) {
    // HTTP durumunu ve yüklerini geri çağırıyoruz.
    geriÇağırma(406, { 'isim': 'başlık örneği' });
};

/**
 * İşleyici bulunamaması durumunda çalışan metod
 * Örnek: localhost:3000/ornek1 yazıldığında bu fonksiyon çalışır. [ornek1 tanımlı değil]
 * Not: ornek1, yönlendirici'de tanımlı olmayan bir objesidir.
 */
işleyiciler.bulunamadı = function (veri, geriÇağırma) {
    // HTTP hata kodunu geri çağırıyoruz.
    geriÇağırma(404);
};

/**
 * İstekler için yönlendirici tanımlama
 * Örnek: localhost:3000/<değişken>
 * Not: Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı] 
 */
var yönlendirici = {
    // localhost:3000/ornek
    'ornek': işleyiciler.örnek
};