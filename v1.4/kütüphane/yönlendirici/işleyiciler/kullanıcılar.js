/**
 * Bağımlılıklar
 * -> belirteçler; Kullanıcı sisteme giriş yapmış mı kontrolü için kullanılıyor.
 */
var belirteçler = require("./belirteçler");
var _veri = require("./../veri");
var yardımcılar = require("./../../yardımcılar");

/**
 * İşleyiciler, kullanıcı işlemleri için metot
 * Örnek: localhost:3000/kullanicilar yazıldığında bu fonksiyon çalışır.
 * 
 * Not: _kullanıcılar; private oluyor, dışarıdan erişilemez.
 * 
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot
 */

kullanıcılar = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        _kullanıcılar[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, {
            "Hata": "HTML isteklerinin metodu uygun değil",
            "Metot": "isleyiciler.kullanıcılar"
        });
    }
};

/**
 * İşleyiciler.kullanıclar için kullanılan obje
 * @see kullanicilar
 */
_kullanıcılar = {};

/**
 * Kullanıcı oluşturma metodu 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kullanıcılar.post = function (veri, geriCagirma) {
    // İsim alma, 0 karakterden fazla olmalı
    var isim = typeof (veri.yükler.isim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;
    // Soyad alma, 0 karakterden fazla olmalı
    var soyİsim = typeof (veri.yükler.soyİsim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;
    // Telefon bilgisi alma. Telefonlar 10 haneli olur.
    var telefon = typeof (veri.yükler.telefon) == "string" &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;
    // Şifre alma
    var şifre = typeof (veri.yükler.şifre) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;
    // Koşulları kabul etti mi kontrolü
    var koşulKabulü = typeof (veri.yükler.koşulKabulü) == "boolean" &&
        veri.yükler.koşulKabulü == true ? true : false;

    if (isim && soyİsim && telefon && şifre && koşulKabulü) {
        // Kullanıcının zaten olmadığından emin oluyoruz
        _veri.oku("kullanıcılar", telefon, function (hata, veri) {
            // Eğer kullanıcı dosyasında istenen telefon no bulunmaz ise, hata verir. Yani kullanıcı yoksa;
            if (hata) {
                // Şifreyi şifreleyerek (hashing) tutuyoruz.
                var gizlenmişŞifre = yardımcılar.şifreleme(şifre);

                if (gizlenmişŞifre) {
                    var kullanıcıObjesi = {
                        "isim": isim,
                        "soyİsim": soyİsim,
                        "telefon": telefon,
                        "gizlenmişŞifre": gizlenmişŞifre,
                        "koşulKabulü": koşulKabulü
                    };

                    _veri.oluştur("kullanıcılar", telefon, kullanıcıObjesi, function (hata) {
                        if (!hata) {
                            geriCagirma(200);
                        } else {
                            geriCagirma(500, { "bilgi": "Kullanıcı oluşturulamadı :(" });
                        }
                    });
                } else {
                    geriCagirma(500, { "bilgi": "Kullanıcı şifrelenemedi :(" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Bu telefon numarası zaten kayıtlı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "İstenen alanlarda eksiklikler var :(" });
    }
};

/**
 * Kullanıcı girişi
 * @property Sadece kimliği onaylanmış kişiler, kendi biligilerine erişebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kullanıcılar.get = function (veri, geriCagirma) {
    // Telefon numarasını kontrol etmemiz gerekmekte
    var telefon = typeof (veri.sorguDizgisiObjeleri.telefon) == "string" &&
        veri.sorguDizgisiObjeleri.telefon.trim().length == 10 ?
        veri.sorguDizgisiObjeleri.telefon.trim() : false;

    if (telefon) {
        // Bilgilere erişmek isteyen kişinin kendimiz olduğunu anlamak için gereken işlemler.
        var belirteç = typeof (veri.başlıklar.belirtec) == 'string' ? veri.başlıklar.belirtec : false;

        belirteçler.belirteçOnaylama(belirteç, telefon, function (belirteçOnaylandıMı) {
            if (belirteçOnaylandıMı) {
                _veri.oku('kullanıcılar', telefon, function (hata, veri) {
                    if (!hata && veri) {
                        // Gizlenmiş şifreyi, veriyi isteyene vermeden önce kaldırıyoruz.
                        delete veri.gizlenmişŞifre;

                        // Durum kodu ve yükleri gönderiyoruz. (Index.js"teki seçilmişİşleyici)
                        geriCagirma(200, veri);
                    } else {
                        geriCagirma(404, { "bilgi": "Gösterilecek kullanıcı bulunamadı :(" });
                    }
                });
            } else {
                geriCagirma(400, { "bilgi": "Kullanıcı görme işlemi için belirteç onaylanmadı veya belirtecin ömrü bitmiş :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Kullanıcı görme işlemi için gerekli bilgi bulunmadı :(" });
    }

};

/**
 * Kullanıcı verileri güncelleme
 * @property Sadece kimliği onaylanmış kişiler, kendi bilgilerini değiştirebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kullanıcılar.put = function (veri, geriCagirma) {
    // Kullanıcıyı kontrol etme
    // Not: === yerine == kullanıyoruz, detaylı kontrol etmeye gerek yok.
    var telefon = typeof (veri.yükler.telefon) == "string" &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;

    // İsim alma, 0 karakterden fazla olmalı
    var isim = typeof (veri.yükler.isim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;
    // Soyad alma, 0 karakterden fazla olmalı
    var soyİsim = typeof (veri.yükler.soyİsim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;
    // Şifre alma
    var şifre = typeof (veri.yükler.şifre) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;

    if (telefon) {
        if (isim || soyİsim || şifre) {
            // Kulanıcının giren kişinin kendi hesabı olduğundan emin oluyoruz.
            var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ? veri.başlıklar.belirteç : false;

            belirteçler.belirteçOnaylama(belirteç, telefon, function (belirteçOnaylandıMı) {
                if (belirteçOnaylandıMı) {
                    _veri.oku("kullanıcılar", telefon, function (hata, kullanıcıVerisi) {
                        if (!hata && kullanıcıVerisi) {
                            if (isim) {
                                kullanıcıVerisi.isim = isim;
                            }
                            if (soyİsim) {
                                kullanıcıVerisi.soyİsim = soyİsim;
                            }
                            if (şifre) {
                                kullanıcıVerisi.gizlenmişŞifre = yardımcılar.şifreleme(şifre);
                            }

                            _veri.güncelle("kullanıcılar", telefon, kullanıcıVerisi, function (hata) {
                                if (!hata) {
                                    geriCagirma(200, { "bilgi": "Kullanıcı güncellendi :)" });
                                } else {
                                    geriCagirma(500, { "bilgi": "Kulanıcı güncellenemedi :(" });
                                }
                            });
                        } else {
                            geriCagirma(400, { "bilgi": "Kullanıcı bulunamadı :(" })
                        }
                    });
                } else {
                    geriCagirma(403, { "bilgi": "Kullanıcı güncellemek için belirteç bulunamadı veya belirtecin ömrü bitmiş :(" });
                }
            });
        } else {
            geriCagirma(400, { "bilgi": "Güncelleme için girilen bilgiler eksik :(" })
        }
    } else {
        geriCagirma(400, { "bilgi": "Güncelleme için gerekli bilgiler eksik :(" })
    }
};

/**
 * Kullanıcı verileri güncelleme
 * @property Sadece kimliği onaylanmış kişiler, kendi bilgilerini değiştirebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kullanıcılar.delete = function (veri, geriCagirma) {
    // Kullanıcının olduğunu kontrol ediyoruz.
    var telefon = typeof (veri.sorguDizgisiObjeleri.telefon) == "string" &&
        veri.sorguDizgisiObjeleri.telefon.trim().length == 10 ? veri.sorguDizgisiObjeleri.telefon : false;

    if (telefon) {
        var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ? veri.başlıklar.belirteç : false;

        belirteçler.belirteçOnaylama(belirteç, telefon, function (belirteçOnaylama) {
            if (belirteçOnaylandıMı) {
                _veri.oku("kullanıcılar", telefon, function (hata, veri) {
                    if (!hata) {
                        _veri.sil("kullanıcılar", telefon, function (hata, veri) {
                            if (!hata) {
                                geriCagirma(200, { "bilgi": "İstenen kullanıcı silindi :)" });
                            } else {
                                geriCagirma(500, { "bilgi": "Kullanıcı silinemedi :(" });
                            }
                        });
                    } else {
                        geriCagirma(400, { "bilgi": "Silenecek kullanıcı bulunamadı :(" });
                    }
                });
            } else {
                geriCagirma(403, { "bilgi": "Kullanıcı silmek için belirteç bulunamadı veya belirtecin ömrü bitmiş :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Kullanıcı silmek için gereken bilgiler eksik :(" });
    }
};

module.exports = kullanıcılar;