/**
 * Raporları tutan ve yönlendiren kütüphane
 */

/**
 * Bağımlılıklar
 */

import { join as yoluKat } from 'path';
import {
    open as dosyayıAç,
    appendFile as dosyayaİlaveEt,
    close as dosyayıKapat,
    readdir as dizinOku,
} from 'fs';

// Raporların kayıt edildiği dizin
export const anaDizin = yoluKat(__dirname, `/../.raporlar/`);

/**
 * Rapor dosyasına veri ekleme, eğer dosya yoksa oluşturma
 * @param {string} dosyaAdi Veri ilave edilecek dosyanın adı
 * @param {string} veri İlave edilecek veri
 * @param {function(boolean | string):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 */
export function ilaveEt(dosyaAdi, veri, geriCagirma) {
    dosyayıAç(`${anaDizin}${dosyaAdi}.log`, `a`, (hata, dosyaTanımlayıcı) => {
        if (!hata && dosyaTanımlayıcı) {
            // Dosyaya veri ilave etme
            dosyayaİlaveEt(dosyaTanımlayıcı, `${veri}\n`, hata => {
                if (!hata) {
                    dosyayıKapat(dosyaTanımlayıcı, hata => {
                        if (!hata) {
                            geriCagirma(false);
                        } else {
                            geriCagirma("Dosyayı kapatırken hata meydana geldi :(");
                        }
                    });
                } else {
                    geriCagirma("Dosyaya ilave yaparken hata meydana geldi :(");
                }
            });
        } else {
            geriCagirma("Dosya ilave yapmak için açılamadı :(");
        }
    });
}

/**
 * 
 * @param {boolean} seriListele Eğer *true* ise sıkıştırılmış raporları da içerir
 * @param {function(boolean | NodeJS.ErrnoException, string[])} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 ** arg1: *İşlem sonrasında oluşan verilerin listesi*
 */
export function listele(seriListele, geriCagirma) {
    dizinOku(anadizin, (hata, veri) => {
        if (!hata && veri && veri.length > 0) {
            let kırpılmışDosyaİsimleri = [];

            veri.forEach(veriİsmi => {
                // .log uzantılı verileri ekleme
                if (veriİsmi.indexOf(".log") > -1) {
                    kırpılmışDosyaİsimleri.push(veriİsmi.replace(".log", ""));
                }

                // Sıkıştırılmış dosyları da içeriyorsa onlar da ekleniyor
                if(veriİsmi.indexOf(".gz.b64") > -1 && seriListele) {
                    kırpılmışDosyaİsimleri.push(veriİsmi.replace(".gz.b64", ""));
                }

                geriCagirma(false, kırpılmışDosyaİsimleri);
            });
        } else {
            geriCagirma(hata, veri);
        }
    });
}


