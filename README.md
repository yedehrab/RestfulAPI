# RestfullAPI



## Version 1.0.2

* Sunucuya http isteği geldiği zaman, hangi http metodunun istenildiğini anlama
  * Post
  * Get
  * Put
  * Delete
  * Head

* Metod alınırken **kesinlikle** küçük harflere çevrilmeli 
```javascript
// HTTP metodu alma
var metod = istek.method.toLowerCase();
```
* Sunucuya gelen sorgu kelimesini algılama (query string)

```CMD
curl localhost:3000/foo?kelime=selam
```
> sorguKelimesiObjesi = { kelime: 'selam' } olacaktır.

## Version 1.0.1

* Kullanıcının isteklerinin basitçe nasıl çalıştığına bakıldı.

## Version 1.0.0

* Basit bir şekilde sunucuya bağlanma işlemi. (Giriş)
* require ile http kullanımı