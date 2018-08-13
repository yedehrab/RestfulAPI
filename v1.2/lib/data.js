/**
 * Kütüphane
 * Açıklama: Verileri inceleme ve düzenlemek için kütüphane
 */

/**
 * Bağımlılıklar
 * -> ds; Dosya işlemleri için gerekli [ fs = file system ]
 * -> yol; Dosyaların yollarını bulmak için gerekli
 */
var ds = require('fs');
var yol = require('path');



/**
 * Aktarılacak modül için bu değişkeni oluşturuyoruz.
 */
var kütüphane = {};

/**
 * Ana dosya yollarını tanımlama
 * Not: __dirname evrensel objedir (global object) değiştirilemez (türkçeleştirilemez)
 * Not: __dirname; Bulunduğum dizini verir.
 */
kütüphane.anaDizin = yol.join(__dirname, '/../.data/');

/**
 * Dosyaya veri yazma
 * @param {string} dizin Dosya dizini
 * @param {string} dosya Dosya ismi
 * @param {function} geriÇağırma İşlemler yapıldıktan sonra çalışacak metot
 */
kütüphane.oluştur = function (dizin, dosya, veri, geriÇağırma) {
    // Dosyayı yazmak için açma
    ds.open(kütüphane.anaDizin + dizin + '/' + dosya + '.json', 'wx', function (hata, dosyaTanımlayıcı) {
        if (!hata && dosyaTanımlayıcı) {
            // Veriyi dizgiye çeviriyoruz.
            var dizgiVerisi = JSON.stringify(veri);

            ds.writeFile(dosyaTanımlayıcı, dizgiVerisi, function (hata) {
                if (!hata) {
                    ds.close(dosyaTanımlayıcı, function (hata) {
                        if (!hata) {
                            geriÇağırma("Dosya oluşturma işleminde hata yok :)");
                        } else {
                            geriÇağırma('Dosyayı kapatırken hata meydana geldi :(');
                        }
                    });
                } else {
                    geriÇağırma('Dosyaya yazarken hata meydana geldi :(');
                }
            });

        } else {
            geriÇağırma('Dosya oluşturulamadı, zaten oluşturulmuş olabilir ;)');
        }
    });
};

/**
 * 
 * @param {string} dizin Dosya dizini
 * @param {string} dosya Dosya
 * @param {function} geriÇağırma İşlemler yapıldıktan sonra çalışacak metot
 */
kütüphane.oku = function (dizin, dosya, geriÇağırma) {
    ds.readFile(kütüphane.anaDizin + dizin + '/' + dosya + '.json', 'utf8', function (hata, veri) {
        geriÇağırma(hata, veri);
    });
};

/**
 * Verileri güncelleme metodu
 * 
 * @param {string} dizin Dosya dizini
 * @param {string} dosya Dosya
 * @param {string} veri Veri dizgisi
 * @param {function} geriÇağırma İşlemler bittikten sonra çalışacak metot
 */
kütüphane.güncelle = function (dizin, dosya, veri, geriÇağırma) {
    ds.open(kütüphane.anaDizin + dizin + '/' + dosya + '.json', 'r+', function (hata, dosyaTanımlayıcı) {
        if (!hata && dosyaTanımlayıcı) {
            var veriDizgisi = JSON.stringify(veri);

            // Dosyayı kırpmak
            ds.ftruncate(dosyaTanımlayıcı, function (hata) {
                if (!hata) {
                    // Dosyaya yazma ve sonrasında kapatma
                    ds.writeFile(dosyaTanımlayıcı, veriDizgisi, function (hata) {
                        if (!hata) {
                            ds.close(dosyaTanımlayıcı, function (hata) {
                                if (!hata) {
                                    geriÇağırma("Dosya güncelleme işleminde hata yok :)");
                                } else {
                                    geriÇağırma('Dosyayı kapatırken hata oluştu :(');
                                }
                            })
                        } else {
                            geriÇağırma('Var olan dosyaya yazmada hata oluştu :(');
                        }
                    })
                } else {
                    geriÇağırma('Dosyayı kırpmada hata oluştu :(');
                }
            });
        } else {
            geriÇağırma('Güncellenecek dosya bulunamadı :(');
        }
    });
}

/**
 * Dosyayı silmek
 * 
 * @param {string} dizin Silinecek dosyanın dizini
 * @param {string} dosya Silinecek dosya adı
 * @param {function} geriÇağırma Silme işleminden sonra yapılacak işlemler.
 */
kütüphane.sil = function (dizin, dosya, geriÇağırma) {
    // Dosya baplantısını kaldırma
    ds.unlink(kütüphane.anaDizin + dizin + '/' + dosya + '.json', function (hata) {
        if (!hata) {
            geriÇağırma("Dosya silme işleminde hata yok :)");
        } else {
            geriÇağırma("Dosyadan veri silinmesinde hata meydana geldi :(");
        }
    });
}


// Aktarılacak obje
module.exports = kütüphane;