# Task 4: Käyttäjien tunnistaminen ja kirjautuminen

## 🎯 Mitä tässä tehdään?

Tässä taskissa luodaan järjestelmä jolla käyttäjät voivat turvallisesti kirjautua sovellukseen. Se
on kuin oven lukot ja avaimet - vain oikeat henkilöt pääsevät sisään.

## 🔧 Miten se tehdään?

### Kirjautumisen perustoiminnot

- **Rekisteröityminen**: Uudet käyttäjät voivat luoda tilin
- **Sisäänkirjautuminen**: Käyttäjät pääsevät sisään sähköpostilla ja salasanalla
- **Salasanan vaihtaminen**: Jos salasana unohtuu, sen voi vaihtaa turvallisesti
- **Sähköpostivahvistus**: Varmistetaan että sähköpostiosoite on oikea

### Sähköpostiviestien lähettäminen

- Lähetetään automaattisesti sähköposteja tärkeissä tilanteissa:
  - Tervetuloa-viesti uusille käyttäjille
  - Vahvistusviesti sähköpostiosoitteelle
  - Linkki salasanan vaihtamiseen

### Turvallisuus

- Salasanat säilytetään turvallisesti (ei näy kellekään)
- Vain kirjautuneet käyttäjät pääsevät omiin tietoihinsa
- Istunnot vanhenevat automaattisesti

## 🌟 Miksi tämä on tärkeää?

### Tietoturva

- Käyttäjien tiedot pysyvät turvassa
- Vain oikeat henkilöt pääsevät käsiksi laskureihin ja dataan

### Käyttäjäkokemus

- Helppo ja turvallinen tapa käyttää palvelua
- Ei tarvitse muistaa monimutkaisia salasanoja

### Liiketoiminta

- Voidaan tarjota henkilökohtaisia ominaisuuksia
- Seurata kuka käyttää mitäkin laskuria

## 👥 Kenen kannalta tärkeää?

- **Loppukäyttäjille**: Turvallinen ja helppo kirjautuminen
- **Yrityksille**: Tietoturva ja yksityisyydensuoja
- **Ylläpitäjille**: Käyttäjien hallinta ja tuki

## 📊 Lopputulos

Kun tämä task on valmis, käyttäjät voivat:

- ✅ Rekisteröityä palveluun sähköpostilla
- ✅ Kirjautua sisään turvallisesti
- ✅ Vaihtaa salasanansa tarvittaessa
- ✅ Saada automaattisia sähköposteja
- ✅ Pysyä kirjautuneina turvallisesti

## 🔧 Alistehtävät yksinkertaisesti:

### 4.1: Perusasetusten tekeminen

Kytketään sähköpostipalvelu ja käyttäjätunnistus yhteen

### 4.2: Sähköpostimallien luominen

Tehdään kauniit sähköpostiviestit eri tilanteisiin

### 4.3: Käyttäjätietojen hallinta

Luodaan järjestelmä joka muistaa kuka on kirjautunut

### 4.4: Kirjautumissivujen tekeminen

Luodaan sivut joilla käyttäjät voivat kirjautua ja rekisteröityä

### 4.5: Suojattujen sivujen tekeminen

Varmistetaan että vain kirjautuneet käyttäjät näkevät tiettyjä sivuja
