# TM-AMZB

Ein Tampermonkey Script, das Monatskauf-Daten für alle Produkte auf Übersichtsseiten anzeigt.

**Entwickelt von Stonehiller Industries**

## 🚀 Features

- **Alle Produktkacheln**: Verarbeitet ALLE Produkte auf Übersichtsseiten, nicht nur die ersten paar
- **Echte Daten**: Ruft echte Monatskauf-Daten ab, keine Schätzungen
- **Batch-Verarbeitung**: Verarbeitet 5 Produkte gleichzeitig für optimale Performance
- **Fortschrittsanzeige**: Zeigt Fortschritt in der Konsole an
- **Zusammenfassung**: Zeigt am Ende an, wie viele Produkte Daten gefunden haben
- **Dynamische Inhalte**: Funktioniert auch bei SPA-Navigation

## 📦 Installation

### Automatische Installation (Empfohlen)
Klicke auf den folgenden Link, um das Script direkt in Tampermonkey zu installieren:

**[🔗 Script installieren](https://github.com/Flyor/TM-AMZB/raw/main/monatskauf-daten.user.js)**

### Manuelle Installation
1. Öffne Tampermonkey
2. Klicke auf "Create a new script"
3. Kopiere den Inhalt von `monatskauf-daten.user.js` in den Editor
4. Speichere das Script (Ctrl+S)

## 🎯 Verwendung

1. Installiere das Script in Tampermonkey
2. Gehe zu einer Produktübersichtsseite (z.B. Suchergebnisse)
3. Das Script verarbeitet automatisch alle Produktkacheln
4. Monatskauf-Daten werden als farbige Karten angezeigt

## 🔧 Technische Details

- **Version**: 1.8.0
- **Kompatibilität**: Amazon.de
- **Laufzeit**: document-idle
- **Berechtigungen**: Keine speziellen Berechtigungen erforderlich

## 📊 Was wird angezeigt?

- **Echte Daten**: "1000+ gekauft Mal im letzten Monat"
- **Fallback**: "Daten nicht verfügbar" (wenn keine Daten gefunden werden)

## 🐛 Debugging

Öffne die Browser-Konsole (F12) um Debug-Informationen zu sehen:
- Fortschritt der Verarbeitung
- Gefundene ASINs
- Erfolgreich abgerufene Daten
- Zusammenfassung am Ende

## 📝 Changelog

### Version 1.8.0
- Verarbeitet ALLE Produktkacheln auf Übersichtsseiten
- Batch-Verarbeitung für bessere Performance
- Fortschrittsanzeige in der Konsole
- Zusammenfassung der gefundenen Daten

## ⚠️ Hinweise

- Das Script funktioniert am besten mit unangemeldeten Anfragen
- Verwendet echte Amazon-Daten, keine Schätzungen
- Respektiert Rate-Limits mit Pausen zwischen Batches
- Funktioniert auch bei dynamischen Inhalten (SPA)

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

```
MIT License

Copyright (c) 2025 Stonehiller Industries

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```