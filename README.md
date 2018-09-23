# RestfulAPI

> API tasarımı
> ES6 yazım kurallarıyla yazılmıştır.

## Kod Hakkında Notlar

* İşleyiciler

  * Kullanıcılar: Kullanıcı işlemleri için kullanılır
  * Belirteçler: Kullanıcı sisteme giriş yaptığı zaman, oluşturulur. Kullanıcının giriş yapmış olduğunu ispatlar.

## Genel Notlar

* Kalıplar;
  > Kalıplardaki formların metotları işleyicilerin uygun metotlarına hitap eder.

  * Her yeni kalıp **yönlendirici** ile işleyiciye bağlanmalıdır.

  * **input id**'leri ile işleyicilerin aldıkları veri'nin objeleri aynı isimde olmak zorundadır.

  * **form id**'leri ile genel/uygulama.js(formResponseProcessor) deki formId'si aynı olmak zorundadır.

* Kontroller:
  > Bir sitenin aktif veya pasif olduğunu kontrol etmemize yarar. (google aktif, wikipedi pasif (kapalı, yanıt vemiyor))

* Metot kullanımı
  > **trim()**: Dizgideki boşlukları kaldırmak için kullanılır.

* Yönlendirici
  > URL'deki veriye göre uygun sayfaya yönlendirme yapılır.

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: *localhost:300/ornek*

* Yükler
  > Kullanıcı adı ve şifre girin gibi verilerin girildiği alanlardan gelen bilgiler.

  > Veri oluşturma işlemleri için kullanırlır.

  > Türkçe karakter **içerebilirler**.

  > Örnek: *localhost:300/ornek* url'si altında body içindeki veriler.
  > { "yükler": "selam" }

* Sorgu Dizgisi Objeleri
  > Tamam butonuna basıldığında adres çubuğunun sonuna eklenen "?no=3" gibi bilgiler.
  
  > Güncelleme ve veri alma gibi işlemlerde kullanılır.

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: *localhost:300/ornek?no=231*

* Başlıklar
  > Kullanıcı giriş yaptığında, sayfalar arası gezinirken değişmeyen bilgiler.
 
  > Kontrol işlemleri için kullanılır. (belirteçler)

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: *localhost:300/ornek* url'si altında header içindeki veriler.
  > { "key": "belirtec", "value": "0542502495040" }

## Ek notlar

* xhr.setRequestHeader

  > İsim değeri api varsayılan değerlerindendir, **türkçe karakter içeremez**. (belirtec [token yerine türkçe yapmıştım], Content-Type)

 -----