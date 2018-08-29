
var belirteçler = require("./belirteçler");
var _veri = require("./../veri");

kontroller = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        _kontroller[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, { "bilgi": "Kontrol işlemleri için metot uygun değil :(" });
    }
};

_kontroller = {};

/**
 * Kontrol oluşturma metodu 
 *
 * * Gerekli veriler: *Protokol, url, metot, başarı kodları, zaman aşımı*
 * * Kullanım şekli: *localhost:3000/kontroller*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kontroller.post = function (veri, geriCagirma) {
    // Gerekli veriler
    var protokol = typeof (veri.yükler.protokol) == 'string' &&
        ["http", "https"].indexOf(veri.yükler.protokol) > -1 ?
        veri.yükler.protokol : false;

    var url = typeof (veri.yükler.url) == 'string' &&
        veri.yükler.url.trim().length > 0 ?
        veri.yükler.url.trim() : false;

    var metot = typeof (veri.yükler.metot) == 'string' &&
        ["post", "get", "put", "delete"].indexOf(veri.yükler.metot) > -1 ?
        veri.yükler.metot : false;

    var başarıKodları = typeof (veri.yükler.başarıKodları) == 'object' &&
        veri.yükler.başarıKodları instanceof Array &&
        veri.yükler.başarıKodları.length > 0 ?
        veri.yükler.başarıKodları : false;

    var zamanAşımı = typeof (veri.yükler.zamanAşımı) == 'number' &&
        veri.yükler.zamanAşımı % 1 === 0 && // (?)
        veri.yükler.zamanAşımı >= 1 &&
        veri.yükler.zamanAşımı <= 5 ?
        veri.yükler.zamanAşımı : false;

    if (protokol && url && metot && başarıKodları && zamanAşımı) {
        // Sadece tanınmış kullanıclar kontrol yapabilsin diye belirtece bakıyoruz.
        var belirteç = typeof (veri.başlıklar.belirtec) == 'string' ?
            veri.başlıklar.belirtec : false;

        if (belirteç) {
            _veri.oku('belirteçler', belirteç, function (hata, belirteçVerisi) {
                if (!hata && belirteçVerisi) {
                    var kullanıcıTel = belirteçVerisi.telefon;

                    _veri.oku('kullanıcılar', kullanıcıTel, function (hata, kullanıcıVerisi) {
                        if (!hata && kullanıcıVerisi) {
                            var kullanıcıKontrolleri = typeof (kullanıcıVerisi.kontroller) == 'object' &&
                                kullanıcıVerisi.kontroller instanceof Array ?
                                kullanıcıVerisi.kontroller : [];

                            // Kullanıcının kontrol hakkının olup olmadığı kontrol ediliyor.
                            if (kullanıcıKontrolleri.length < yapılandırma.enfazlaKontrol) {
                                // Rastgele kontrol no'su oluşturuyoruz.
                                var kontrolNo = yardımcılar.rastgeleDizgiOluştur(20);

                                var kontrolObjesi = {
                                    "no": kontrolNo,
                                    "kullanıcıTel": kullanıcıTel,
                                    "protokol": protokol,
                                    "url": url,
                                    "metot": metot,
                                    "başarıKodları": başarıKodları,
                                    "zamanAşımı": zamanAşımı
                                };

                                _veri.oluştur("kontroller", kontrolNo, kontrolObjesi, function (hata) {
                                    if (!hata) {
                                        // İlk başta boş olduğundan, atama yapmamız gerekebilir. (?) [Array mi değil mi belli değil.]
                                        kullanıcıVerisi.kontroller = kullanıcıKontrolleri;
                                        kullanıcıVerisi.kontroller.push(kontrolNo);

                                        _veri.güncelle("kullanıcılar", kullanıcıTel, kullanıcıVerisi, function (hata) {
                                            if (!hata) {
                                                geriCagirma(200, kontrolObjesi);
                                            } else {
                                                geriCagirma(500, { "bilgi": "Kullanıcı kontrol objesi güncellenemedi :(" });
                                            }
                                        });
                                    } else {
                                        geriCagirma(500, { "bilgi": "Kontrol oluşturulamadı :(" });
                                    }
                                });
                            } else {
                                geriCagirma(400, { "bilgi": "Bütün kontrol hakklarını (" + yapılandırma.enfazlaKontrol + ") kullanmış bulunmaktasın :(" });
                            }

                        } else {
                            geriCagirma(403, { "bilgi": "Kontrol işlemi (post) için kullanıcı düzgün okunamadı :(" });
                        }
                    });
                } else {
                    geriCagirma(403, { "bilgi": "Kontrol işlemi (post) için gerekli belirteç düzgün okunamadı :(" });
                }
            });
        } else {
            geriCagirma(400, { "bilgi": "Kontrol işlemi (post) yapabilmek için tanınmış bir kullanıcı değilsiniz :(" });
        }
    } else {
        geriCagirma(400, { "bilgi": "Kontrol işlemi (post) için gerekli alanlar hatalı veya eksik :(" });
    }
};

/**
 * Kontrol alma metodu 
 *
 * * Gerekli veriler: *No*
 * * Kullanım şekli: *localhost:3000/kontroller?no=...*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kontroller.get = function (veri, geriCagirma) {
    // Gerekli veriler
    var no = typeof (veri.sorguDizgisiObjeleri.no) == "string" &&
        veri.sorguDizgisiObjeleri.no.trim().length > 20 ?
        veri.sorguDizgisiObjeleri.no.trim() : false;

    if (no) {
        _veri.oku("kontroller", no, function (hata, kontrolVerisi) {
            if (!hata && kontrolVerisi) {
                var belirteç = typeof (veri.başlıklar.belirtec) == "string" ?
                    veri.başlıklar.belirtec : false;

                belirteçler.belirteçOnaylama(belirteç, kullanıcıVerisi, function (belirteçOnaylandıMı) {
                    if (belirteçOnaylandıMı) {
                        geriCagirma(200, kontrolVerisi);
                    } else {
                        geriCagirma(200, { "bilgi": "Kontrol alma işlemi için belirteç onaylanamadı :(" });
                    }
                });
            } else {
                geriCagirma(404, { "bilgi": "Kontroller okunurken hata oluştu :(" });
            }
        });
    } else {
        geriCagirma(200, { "bilgi": "Kontrol alma işlemi için gerekli alanlar eksik :(" });
    }


};

/**
 * Kontrol güncelleme metodu 
 *
 * * Gerekli veriler: *No*
 * * İsteğe bağlı veriler: *Protokol, url, metot, başarı kodları, zaman aşımı*
 * * Kullanım şekli; *localhost:3000/kontroller?no=...*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma - *(durumKodu, yükler)* İşlemler bittiği zaman çalışacan metot.
 */
_kontroller.put = function (veri, geriCagirma) {
    // Gerekli veriler
    var no = typeof (veri.yükler.no) == "string" &&
        veri.yükler.no.trim().length == 20 ?
        veri.yükler.no.trim() : false;

    // İsteğe bağlı veriler
    var protokol = typeof (veri.yükler.protokol) == "string" &&
        ["http", "https"].indexOf(veri.yükler.protokol) > -1 ?
        veri.yükler.protokol : false;
    var url = typeof (veri.yükler.url) == "string" &&
        veri.yükler.url.trim().length > 0 ?
        veri.yükler.url.trim() : false;
    var metot = typeof (veri.yükler.metot) == "string" &&
        ["post", "get", "put", "delete"].indexOf(veri.yükler.metot) > -1 ?
        veri.yükler.metot : false;
    var başarıKodları = typeof (veri.yükler.başarıKodları) == "object" &&
        veri.yükler.başarıKodları instanceof Array &&
        veri.yükler.başarıKodları.length > 0 ?
        veri.yükler.başarıKodları : false;
    var zamanAşımı = typeof (veri.yükler.zamanAşımı) == "number" &&
        veri.yükler.zamanAşımı % 1 === 0 && // (?)
        veri.yükler.zamanAşımı >= 1 &&
        veri.yükler.zamanAşımı <= 5 ?
        veri.yükler.zamanAşımı : false;

    // Eğer gerekli bilgiler verilmemişse hata vereceğiz.
    if (no) {
        // İsteğe bağlı veriler yoksa, hata vereceğiz.
        if (protokol || url || metot || başarıKodları || zamanAşımı) {
            _veri.oku("kontroller", no, function (hata, kontrolVerisi) {
                if (!hata && kontrolVerisi) {
                    var belirteç = typeof (veri.başlıklar.belirtec) == "string" ?
                        veri.başlıklar.belirtec : false;

                    belirteçler.belirteçOnaylama(belirteç, kontrolVerisi.telefon, function(belirteçOnaylandıMı){
                        if (belirteçOnaylandıMı) {
                            // Gereken kontrolleri güncelleme
                            if (protokol) {
                                kontrolVerisi.protokol = protokol;
                            }
                            if (url) {
                                kontrolVerisi.url = url;
                            }
                            if (metot) {
                                kontrolVerisi.metot = metot;
                            }
                            if (başarıKodları) {
                                kontrolVerisi.başarıKodları = başarıKodları;
                            }
                            if (zamanAşımı) {
                                kontrolVerisi.zamanAşımı = zamanAşımı;
                            }

                            // Yenilikleri kaydetme
                            _veri.güncelle("kontroller", no, kontrolVerisi, function(hata){
                                if (!hata) {
                                    geriCagirma(200);
                                } else {
                                    geriCagirma(500, {"bilgi": "Kontrol güncelleme işleminde hata meydana geldi :("});
                                }
                            });

                        } else {
                            geriCagirma(403, {"bilgi": "Kontrol güncelleme işlemi için belirteç onaylanmadı :("});
                        }
                    });

                } else {
                    geriCagirma(400, {"bilgi": "Kontrol güncelleme işlemi için no mevcut değil :("});
                }
            });
        } else {
            geriCagirma(400, {"bilgi": "Kontrol güncelleme işlemi için veriler mevcut değil :("});
        }
    } else {
        geriCagirma(400, {"bilgi": "Kontrol güncelleme işlemi için gerekli alanlar eksik :("});
    }
}

module.exports = kontroller;