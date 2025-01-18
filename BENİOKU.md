# irem

![Biçimlendir, Test Et ve Oluştur](https://github.com/canbax/irem/actions/workflows/test.yml/badge.svg) | ![İfadeler](https://img.shields.io/badge/statements-92.37%25-brightgreen.svg?style=flat)

Dünya'da herhangi bir dilde herhangi bir yeri arayın.

<p align="center">
<img src="irem-icon.png" alt="Logo" width="200"/>
</p>

## Kullanım

### API Kullanımı

["Keçi" kelimesini Türkçe olarak arayın](https://vakit.vercel.app/api/searchPlaces?q=Keçi?lang=tr)

["随机" kelimesini İngilizce olarak arayın (varsayılan dil)](https://vakit.vercel.app/api/searchPlaces?q=随机)

[Ankara, Türkiye çevresindeki yakın yerler](https://vakit.vercel.app/api/nearByPlaces?lat=40.0006929&lng=32.8519762&lang=tr)

Yalnızca nodejs ortamında çalışır. Verileri `data` adlı klasörde TSV dosya biçiminde veya sıkıştırılmış biçimde veya ikili formatta (binary) depolar.

<p align="center">
<img src="recording.gif" alt="Logo" width="750"/>
</p>

### [npm](https://www.npmjs.com/package/irem) kullanın

`npm i irem` komutunu çalıştırın

### ESM modülünü kullanın

`import { getPlaceSuggestionsByText, getNearbyPlaces, getPlaceById } from 'irem';`

## Dökümantasyon

### getPlaceSuggestionsByText fonksiyonu

Belirtilen dildeki arama terimine göre yerlerin bir listesini döndürür. Enlem ve boylam sağlanırsa, liste mesafeye göre sıralanır, aksi takdirde metin eşleşmesine göre sıralanır. countryCode, TR veya US gibi bir ülkeyi temsil eden iki harfli bir koddur. Ülke kodu sağlanırsa, ülkeden gelen sonuçlar öncelikli olur. maxResultCount, döndürülen dizi uzunluğunun boyutudur. [0,100] aralığında olmalıdır. Dil tanımlanmamışsa, sonuçlar İngilizce olarak döndürülür.

```
async function getPlaceSuggestionsByText(
searchTerm: string,
language?: SupportedLanguage,
latitude?: number,
longitude?: number,
maxResultCount = 10,
countryCode: CountryCode | "" = "",
): Promise<PlaceMatchWithCountry[]>
```

### getNearbyPlaces işlevi

Belirtilen dilde sağlanan `latitude` ve `longitude` değerlerine göre bir yer listesi döndürür. Liste mesafeye göre sıralanır.
`maxResultCount`, döndürülen dizi uzunluğunun boyutudur. [0,100] aralığında olmalıdır

```
async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  language?: SupportedLanguage,
  maxResultCount = 10,
): Promise<PlaceWithCountry[]>
```

### getPlaceById fonksiyonu

Sağlanan kimlikten bir `PlaceWithCountry` nesnesi döndürür. Kimlik `db.tsv` dosyasında bulunmalıdır

```
async function getPlaceById(placeId: number, language?: SupportedLanguage)
```

[vakit](https://vakit.vercel.app/) için oluşturuldu
