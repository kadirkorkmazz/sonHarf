# sonHarf

### Son Harf Nedir?
Son Harf, bilgisayara karşı oynanabilen bir çeşit kelime oyunudur. Oyunda amaç karşıdaki kişinin söylediği ismin son harfi ile yeni bir isim türetmektir. Oynamak için aktif bir mikrofon ve hoparlör yeterli olacaktır.
Oyunun nasıl ilerlediğine dair bir örnek; <br>
Hasan -> Niyazi -> İbrahim -> Mustafa -> Ahmet -> … <br>

### Oyun Akışı
- Öncelikle ekrandaki **mikrofon** simgesine dokunarak mikrofonunuzu açmalısınız. Mikrofon, sayfa yenilenene kadar açık kalacaktır.
- Skor tablosunda bulunmak isterseniz, isminizi girebilirsiniz. (Boş bıraktığınızda skorunuz tabloya anonim olarak kaydedilecektir.)
- Zorluk seviyesini seçin:
  - **Easy**: Bu modda bilgisayarın kelime bulamama ihtimali %30'dur.
  - **Medium**: Bu modda bilgisayarın kelime bulamama ihtimali %15'dir.
  - **Hard**: Bu modda bilgisayar her zaman kelime bulur.
 - Oyun dili seçin: Oyun **Türkçe** ve **İngilizce** oynanabilir.
  - _**Not:**_ Projede kullanılan [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) API'nin Türkçe desteği tüm Chrome sürümlerinde bulunmamaktadır. Bu yüzden Türkçe oynarken Chrome sürümünüze göre, bilgisayar kelimeleri İngilizce okunuşuyla okuyabilir. Bunu göz ardı ederek **Türkçe** oynayabilirsiniz.
 - **Play** butonuna basarak oyuna başlayın.
    - Bilgisayar bir isim söylediğinde süreniz başlayacaktır.
    - Süre bitimine kadar istediğiniz sayıda isim denemesi yapabilirsiniz*
      - *Özellikle İngilizce oynarken [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)'ın telaffuza bağlı olarak birçok kelimeyi yanlış, farklı algılaması sebebiyle bu şekilde ayarlandı.
 - Puanlama:
    - Taraflardan biri belirtilen süre içerisinde isim söylemezse, oyun biter. 
    - Oyuncu, zincire başarılı olarak eklediği her isim için 1 puan alır.
    - Oyunu oyuncu kazanırsa ek 5 puan alır. 
    - En yüksek 5 skor, skor tablosuna eklenir.

## Kurulum 
Repo klonlandıktan sonra
```
npm install
npm run dev
```
yukarıdaki komutlar izlenerek proje çalıştırılabilir. 
Ek olarak mockapi kaynaklı bir problemde çalışmama ihtimaline karşı;
mockapi.io adresinden hesabınıza giriş yaptıktan sonra 
[buraya tıklayarak](https://mockapi.io/clone/606398066bc4d60017fab510) kendi mockapi url'ini oluşturup, `src/constants.js` dosyasında güncelleyerek projeyi sorunsuz bir şekilde çalıştırabilirsiniz.
