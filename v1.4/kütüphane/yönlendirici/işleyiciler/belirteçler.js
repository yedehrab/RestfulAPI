
var dosya = require("./../dosya");
var yardımcılar = require("./../../yardımcılar");

/**
 * İşleyiciyi belirteçler
 * 
 * Örnek: localhost:3000/belirteçler yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
belirteçler = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        _belirteçler[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, { "bilgi": "Simgle işlemi için uygun metot bulunamadı :(" });
    }
};

// Belirteçler işleyicisinin alt metotları için kalıp
_belirteçler = {};

/**
 * Belirteç oluşturma metodu 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
_belirteçler.post = function (veri, geriCagirma) {
    var telefon = typeof (veri.yükler.telefon) == "string" &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;

    var şifre = typeof (veri.yükler.şifre) == "string" &&
        veri.yükler.şifre.trim().length > 0 ? veri.yükler.şifre.trim() : false;

    if (telefon && şifre) {
        dosya.oku("kullanıcılar", telefon, function (hata, kullanıcıVerisi) {
            if (!hata && kullanıcıVerisi) {
                // Alınan şifreyi gizlenmiş şifre ile karşılaştırmamız lazım.
                var gizlenmişŞifre = yardımcılar.şifreleme(şifre);

                if (gizlenmişŞifre == kullanıcıVerisi.gizlenmişŞifre) {
                    var belirteçNo = yardımcılar.rastgeleDizgiOluştur(20);
                    var ömür = Date.now() + 1000 * 60 * 60;

                    var belirteçObjesi = {
                        "telefon": telefon,
                        "no": belirteçNo,
                        "ömür": ömür
                    };

                    dosya.oluştur("belirteçler", belirteçNo, belirteçObjesi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, belirteçObjesi);
                        } else {
                            geriCagirma(500, { "bilgi": "Belirteç oluşturulamadı :(" });
                        }
                    });

                } else {
                    geriCagirma(400, { "bilgi": "Belirteç oluşturmak için girilen şifre kullanıcı ile uyuşmamakta" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Belirteç oluşturmak için aranan kullanıcı bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç oluşturmak için gerekli alanlar doldurulmadı :(" })
    }


}

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
_belirteçler.get = function (veri, geriCagirma) {
    // Rastgele dizgi oluştur metodundaki değere eşit olmak zorunda, o sebeple 20
    var no = typeof (veri.sorguDizgisiObjeleri.no) == "string" &&
        veri.sorguDizgisiObjeleri.no.trim().length == 20 ? veri.sorguDizgisiObjeleri.no.trim() :
        false;

    if (no) {
        dosya.oku("belirteçler", no, function (hata, belirteçVerisi) {
            if (!hata) {
                geriCagirma(200, belirteçVerisi);
            } else {
                geriCagirma(404, { "bilgi": "Alınacak belirteç bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç alma işlemi için gereken alanlar eksik :(" });
    }
}

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
_belirteçler.put = function (veri, geriCagirma) {
    // İndex'te rastgele dizgi oluşturma uzunluğu ile aynı olmak zorunda (20)
    var no = typeof (veri.yükler.no) == 'string' && veri.yükler.no.trim().length == 20 ?
        veri.yükler.no.trim() : false;

    var süreUzatma = typeof (veri.yükler.süreUzatma) == 'boolean' && veri.yükler.süreUzatma ?
        veri.yükler.süreUzatma : false;

    if (no && süreUzatma) {
        dosya.oku('belirteçler', no, function (hata, belirteçVerisi) {
            if (!hata) {
                if (belirteçVerisi.ömür > Date.now()) {
                    belirteçVerisi.ömür = Date.now() + 1000 * 60 * 60;

                    dosya.güncelle('belirteçler', no, belirteçVerisi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, { "bilgi": "Belirteç ömrü uzatıldı :)" });
                        } else {
                            geriCagirma(500, { "bilgi": "Belirteç verisi güncellenemedi :(" });
                        }
                    });
                } else {
                    geriCagirma(400, { "bilgi": "Ömrü uzatılmak istenen belirteç çoktan ölmüştür :(" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Belirteç koyma işlemi için aranan belirteç bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç koyma işlemi için gerekli alan(lar) eksik :(" });
    }
}

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
_belirteçler.delete = function (veri, geriCagirma) {
    var no = typeof (veri.sorguDizgisiObjeleri.no) == 'string' && veri.sorguDizgisiObjeleri.no.trim().length == 20 ?
        veri.sorguDizgisiObjeleri.no.trim() : false;

    if (no) {
        dosya.oku('belirteçler', no, function (hata) {
            if (!hata) {
                dosya.sil('belirteçler', no, function (hata) {
                    if (!hata) {
                        geriCagirma(200, { "bilgi": "Belirteç başarıyla silindi :)" });
                    } else {
                        geriCagirma(500, { "bilgi": "Belirteç silme işlemi başarısız oldu :(" });
                    }
                });
            } else {
                geriCagirma(400, { "bilgi": "Silenecek belirteç bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç silmek için gereken alanlar eksin :(" });
    }
}

/**
 * Belirteçleri onaylamak için kullanılan metot.
 * @param {string} belirteçNo Tokenler için kimlik no'su
 * @param {string} telefon Kullanıcı telefon numarası
 * @param {Function} geriCagirma İşlemler bittikten sonra çalışacak metot. (belirteçOnaylandıMı)
 */
_belirteçler.belirteçOnaylama = function (belirteçNo, telefon, geriCagirma) {
    dosya.oku('belirteçler', belirteçNo, function (hata, belirteçVerisi) {
        if (!hata && belirteçVerisi) {
            if (belirteçVerisi.telefon == telefon && belirteçVerisi.ömür > Date.now()) {
                geriCagirma(true);
            } else {
                geriCagirma(false);
            }
        } else {
            geriCagirma(false);
        }
    });
};

module.exports = belirteçler;