## Version 1.2
---------

### Sorunlu özellikler 
> HTTPS hala sıkıntılıdır.
> Yükler object değil string olarak geliyor.
> delete işlemi çalışmıyor.

### Gelen Özellikler

* Dosya işlemleri
    * Oluşturma
    * Silme
    * Güncelleme
    * Okuma

* Fonksiyonların parametrelerindeki türkçe karakterler kaldırıldı.
> Dökümantasyonlarda hata oluşuyordu. (Türkçe karakter algılama sorunu)

* Dosya işlemlerini test eden **test.js** dosyası.

* Kullanıcı işlemleri
    * Kullanıcıların olduğu dosya
        > .data/kullanıcılar
    * Kullanıcı ekleme 
        * Telefon no ile indeksleme (ID yerine)


## Ek notlar
* Dosya işlemlerinin gerçekleştiği dosyanın dizini;

    * **.../.data/test/yeniDosya.json**

* Test dosyası sadece test amaçlı kullanılır.

## Önemli bilgiler

> Kodun içinde yorum satırları ile açıklanmıştır.
