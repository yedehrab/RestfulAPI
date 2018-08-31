# RestfulAPI

> API tasarımı
> ES6 yazım kurallarıyla yazılmıştır.

## Kod Hakkında Notlar

* İşleyiciler

  * Kullanıcılar: Kullanıcı işlemleri için kullanılır
  * Belirteçler: Kullanıcı sisteme giriş yaptığı zaman, oluşturulur. Kullanıcının giriş yapmış olduğunu ispatlar.

## Genel Notlar

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
-----
