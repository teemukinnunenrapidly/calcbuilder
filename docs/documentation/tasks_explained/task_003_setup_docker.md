# Task 3: Docker-kehitysympäristön perustaminen

## 🎯 Mitä tässä tehdään?

Tässä taskissa luodaan "kontti" jossa sovellus pyörii. Se on kuin asuntovaunu - kaikki tarvittava on
mukana ja se toimii samalla tavalla kaikkialla.

## 🔧 Miten se tehdään?

### 1. Sovelluksen "pakkaaminen" konttiin (Docker)

- Luodaan paketti joka sisältää sovelluksen ja kaikki sen tarvitsemat osat
- Kuin pakattu matkalaukku - kaikki tarvittava on mukana

### 2. Kehitysympäristön orkestrointi (Docker Compose)

- Luodaan ohje siitä, miten eri osat (sovellus, tietokanta, sähköposti) toimivat yhdessä
- Kuin resepti - kerrotaan tarkalleen miten kaikki valmistetaan

### 3. Tietokannan ja palveluiden paikallinen pyörittäminen

- Tietokanta ja muut palvelut pyörivät omassa koneessa
- Ei tarvitse nettiyhteyttä kehittämiseen

## 🌟 Miksi tämä on tärkeää?

### Yhdenmukaisuus

- Sovellus toimii samalla tavalla kaikilla kehittäjillä
- "Mulla toimii" -ongelmat katoavat

### Helppo aloittaminen

- Uusi kehittäjä saa sovelluksen käyntiin yhdellä komennolla
- Ei tarvitse asentaa kymmeniä eri ohjelmia

### Tuotantoa vastaava ympäristö

- Kehitysympäristö on mahdollisimman samanlainen kuin lopullinen palvelu
- Vähemmän yllätyksiä kun sovellus julkaistaan

## 👥 Kenen kannalta tärkeää?

- **Kehittäjille**: Helppo ja nopea ympäristön pystytys
- **Uusille tiimiläisille**: Helppo liittyä projektiin
- **DevOps-tiimille**: Yhdenmukaiset ympäristöt

## 📊 Lopputulos

Kun tämä task on valmis, meillä on:

- ✅ Helposti käynnistettävä kehitysympäristö
- ✅ Kaikki palvelut (tietokanta, sähköposti) pyörii paikallisesti
- ✅ Yhdenmukaiset ympäristöt kaikille kehittäjille
- ✅ Valmius tuotantoon viennille

## 🛠️ Mitä konttiin tulee?

### Web-sovellus

- React-sovellus joka näkyy selaimessa
- Automaattinen päivitys kun koodia muutetaan

### Tietokanta (Supabase)

- Paikallinen versio tietokannasta
- Sama kuin tuotannossa, mutta omassa koneessa

### Sähköpostipalvelu

- Testisähköpostien lähettäminen ja vastaanottaminen
- Ei lähetä oikeita sähköposteja kehityksen aikana

### Välimuisti (Redis)

- Nopeuttaa sovelluksen toimintaa
- Säilyttää usein käytettyjä tietoja muistissa
