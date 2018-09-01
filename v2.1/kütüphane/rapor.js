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
    close as dosyayıKapat
} from 'fs';

// Raporların kayıt edildiği dizin
export const anaDizin = yoluKat(__dirname, `/../.raporlar/`);

/**
 * Rapor dosyasına veri ekleme, eğer dosya yoksa oluşturma
 * @param {string} dosyaAdi Veri ilave edilecek dosyanın adı
 * @param {string} veri İlave edilecek veri
 * @param {function(boolean | string):void} geriCagirma geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)
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


