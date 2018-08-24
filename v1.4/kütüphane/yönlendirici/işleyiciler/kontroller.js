
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
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 * @requires protokol, url, metot, başarıKodları, zamanAşımı
 */
_kontroller.post = function (veri, geriCagirma) {
    console.log("ccalistis");
    var protokol = typeof (veri.yükler.protokol) == 'string' &&
        ["http", "https"].indexOf(veri.yükler.protokol) > -1 ?
        veri.yükler.protokol.trim() : false;

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
        var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ?
            veri.başlıklar.belirteç : false;
        
        if (belirteç) {
            _veri.oku('belirteçler', belirteç, function (hata, belirteçVerisi){
                if (!hata && belirteçVerisi) {
                    var kullanıcıTel = belirteçVerisi.telefon;

                    _veri.oku('kullanıcılar', kullanıcıTel, function (hata, kullanıcıVerisi){
                        if (!hata && kullanıcıVerisi) {
                            var kullanıcıKontrolleri = typeof(kullanıcıVerisi.kontroller) == 'object' &&
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

                                _veri.oluştur("kontroller", kontrolNo, kontrolObjesi, function (hata){
                                    if (!hata) {
                                        // İlk başta boş olduğundan, atama yapmamız gerekebilir. (?) [Array mi değil mi belli değil.]
                                        kullanıcıVerisi.kontroller = kullanıcıKontrolleri;
                                        kullanıcıVerisi.kontroller.push(kontrolNo);

                                        _veri.güncelle("kullanıcılar", kullanıcıTel, kullanıcıVerisi, function (hata){
                                            if (!hata) {
                                                geriCagirma(200, kontrolObjesi);
                                            } else {
                                                geriCagirma(500, {"bilgi": "Kullanıcı kontrol objesi güncellenemedi :("});
                                            }
                                        });
                                    } else {
                                        geriCagirma(500, {"bilgi": "Kontrol oluşturulamadı :("});
                                    }
                                });
                            } else {
                                geriCagirma (400, {"bilgi": "Bütün kontrol hakklarını (" + yapılandırma.enfazlaKontrol +") kullanmış bulunmaktasın :("});
                            }

                        } else {
                            geriCagirma(403, {"bilgi": "Kontrol işlemi (post) için kullanıcı düzgün okunamadı :("});
                        }
                    });
                } else {
                    geriCagirma(403, {"bilgi": "Kontrol işlemi (post) için gerekli belirteç düzgün okunamadı :("});
                }
            });
        } else {
            geriCagirma(400, {"bilgi": "Kontrol işlemi (post) yapabilmek için tanınmış bir kullanıcı değilsiniz :("});
        }
    } else {
        geriCagirma(400, {"bilgi": "Kontrol işlemi (post) için gerekli alanlar hatalı veya eksik :("});
    }
};

module.exports = kontroller;