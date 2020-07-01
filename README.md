# BioCall-User
![BioCall-User screenshot](https://raw.githubusercontent.com/Underscoar/biocall-user/master/assets/screenshot.png)

## About
BioCall-User is een element van het grotere BioCall geheel. Een applicatie waarin biofeedback getoond wordt tijdens een videogesprek. Het bestaat uit drie onderdelen:
- BioCall: Frontend (React) applicatie
- BioCall-Server: NodeJS server die realtime biofeedback naar de frontend stuurt
**- BioCall-User: Electron applicatie die realtime de biofeedback van eSense en Facereader naar de NodeJS server stuurt**

## Installation
### Clone
Clone deze repo `https://github.com/Underscoar/biocall-user`

### Setup
Installeer alle NPM packages
```
npm install
```

Start de applicatie
```
npm start
```

> note: Deze Electron applicatie kan geëxporteerd worden naar een Windows, Linux of MacOS applicatie. Dat is tijdens het schrijven van deze readme nog niet gedaan. Het is tot nu toe alleen gebruikt voor tests en development, dus het was niet relevant.

## Use
Als BioCall-Server draait/online staat, verbind dan met de Socket.IO server. Open FacereaderClient en klik dan op `Connect to FacereaderClient`.

Voor eSense data: Open de eSense app en schakel ‘hidden mode’ in door 4 keer rechtsonder op ‘Mindfield Biosystems’ te tikken. Stel dan bij eSense Skin Response OSC transfer in.
- IP address: IP adres van de PC waar BioCall-User op draait
- Port: 4559
- Path: /GSR

Zorg dat de smartphone en de PC op hetzelfde netwerk zitten.
