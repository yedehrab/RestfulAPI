/**
 * İşleyiciler
 * Açıklama:
 * Tarih: 13 / 8 / 2018
 */

/**
 * Bağımlılıklar
 */
var _veri = require('./data');
var yardımcılar = require('./helpers');

/**
 * İşleyicileri (handlers) tanımlama
 * Örnek: işleyiciler.örnek
 *
 * Not: Buradaki işleyiciler.örnek, yönlendiricilerdeki 'ornek' öğesine atanıyor.
 */
var işleyiciler = {};

/**
 * İşleyiciler, kullanıcı işlemleri için metot
 * Örnek: localhost:3000/kullanicilar yazıldığında bu fonksiyon çalışır.
 * 
 * Not: _kullanıcılar; private oluyor, dışarıdan erişilemez.
 * 
 * @param {object} veri Index.js'te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.kullanıcılar = function (veri, geriCagirma) {
    var uygunMetotlar = ['post', 'get', 'put', 'delete'];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        işleyiciler._kullanıcılar[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, {
            'Hata': 'HTML isteklerinin metodu uygun değil',
            'Metot': 'isleyiciler.kullanıcılar'
        });
    }
};

/**
 * İşleyiciler.kullanıclar için kullanılan obje
 * @see işleyiciler.kullanicilar
 */
işleyiciler._kullanıcılar = {};

/**
 * Kullanıcı oluşturma metodu 
 * @param {object} veri Index.js'te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._kullanıcılar.post = function (veri, geriCagirma) {
    // İsim alma, 0 karakterden fazla olmalı
    var isim = typeof (veri.yükler.isim) === 'string' &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;
    // Soyad alma, 0 karakterden fazla olmalı
    var soyİsim = typeof (veri.yükler.soyİsim) === 'string' &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;
    // Telefon bilgisi alma. Telefonlar 10 haneli olur.
    var telefon = typeof (veri.yükler.telefon) === 'string' &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;
    // Şifre alma
    var şifre = typeof (veri.yükler.şifre) === 'string' &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;
    // Koşulları kabul etti mi kontrolü
    var koşulKabulü = typeof (veri.yükler.koşulKabulü) === 'boolean' &&
        veri.yükler.koşulKabulü == true ? true : false;

    if (isim && soyİsim && telefon && şifre && koşulKabulü) {
        // Kullanıcının zaten olmadığından emin oluyoruz
        _veri.oku('kullanıcılar', telefon, function (hata, veri) {
            // Eğer kullanıcı dosyasında istenen telefon no bulunmaz ise, hata verir. Yani kullanıcı yoksa;
            if (hata) {
                // Şifreyi şifreleyerek (hashing) tutuyoruz.
                var gizlenmişŞifre = yardımcılar.şifreleme(şifre);

                if (gizlenmişŞifre) {
                    var kullanıcıObjesi = {
                        'isim': isim,
                        'soyİsim': soyİsim,
                        'telefon': telefon,
                        'gizlenmişŞifre': gizlenmişŞifre,
                        'koşulKabulü': koşulKabulü
                    };

                    _veri.oluştur('kullanıcılar', telefon, kullanıcıObjesi, function (hata) {
                        if (!hata) {
                            geriCagirma(200);
                        } else {
                            geriCagirma(500, { 'bilgi': 'Kullanıcı oluşturulamadı :(' });
                        }
                    });
                } else {
                    geriCagirma(500, { 'bilgi': 'Kullanıcı şifrelenemedi :(' });
                }
            } else {
                geriCagirma(400, { 'bilgi': 'Bu telefon numarası zaten kayıtlı :(' });
            }
        });
    } else {
        geriCagirma(400, { 'bilgi': 'İstenen alanlarda eksiklikler var :(' });
    }
};

/**
 * Kullanıcı girişi
 * @property Sadece kimliği onaylanmış kişiler, kendi biligilerine erişebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js'te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._kullanıcılar.get = function (veri, geriCagirma) {
    // Telefon numarasını kontrol etmemiz gerekmekte
    var telefon = typeof (veri.sorguDizgisiObjeleri.telefon) === 'string' &&
        veri.sorguDizgisiObjeleri.telefon.trim().length == 10 ?
        veri.sorguDizgisiObjeleri.telefon.trim() : false;

    if (telefon) {
        _veri.oku('kullanıcılar', telefon, function (hata, veri) {
            if (!hata && veri) {
                // Gizlenmiş şifreyi, veriyi isteyene vermeden önce kaldırıyoruz.
                delete veri.gizlenmişŞifre;
                
                // Durum kodu ve yükleri gönderiyoruz. (Index.js'teki seçilmişİşleyici)
                geriCagirma(200, veri);
            } else {
                geriCagirma(404);
            }
        });

    } else {
        geriCagirma(400, { 'bilgi': 'Gerekli bilgiler eksik :(' });
    }
}

/**
 * İşleyiciyi dürtme
 * 
 * Örnek: localhost:3000/durt yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js'te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.dürt = function (veri, geriCagirma) {
    geriCagirma(200);
};

/**
 * İşleyici örneği
 * 
 * Örnek: localhost:3000/ornek yazıldığında bu fonksiyon çalışır.
 * 
 * Not: ornek, yönlendirici 'nin bir objesidir.
 * 
 * @param {object} veri Index.js'te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.örnek = function (veri, geriCagirma) {
    // HTTP durumunu ve yüklerini geri çağırıyoruz.
    geriCagirma(406, { 'isim': 'başlık örneği' });
};

/**
 * İşleyici bulunamaması durumunda çalışan metod
 * 
 * Örnek: localhost:3000/ornek1 yazıldığında bu fonksiyon çalışır. [ornek1 tanımlı değil]
 * 
 * Not: ornek1, yönlendirici'de tanımlı olmayan bir objesidir.
 * 
 * @param {object} veri Index.js'te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.bulunamadı = function (veri, geriCagirma) {
    // HTTP hata kodunu geri çağırıyoruz.
    geriCagirma(404);
};

module.exports = işleyiciler;