# Test-Anleitung für Amazon Monatskauf Skript

## Test-Szenarien

### 1. Business Account Test
**Ziel**: Überprüfen, ob das Skript Monatskauf-Daten in Business Accounts anzeigt

**Schritte**:
1. Logge dich in deinen Amazon Business Account ein
2. Besuche eine Produktseite (z.B. das LEGO-Produkt: B0DHSFL5DD)
3. Öffne die Browser-Konsole (F12)
4. Filtere nach "Amazon Monatskauf" oder "debug"
5. Prüfe, ob die Monatskauf-Anzeige erscheint

**Erwartetes Ergebnis**:
- Skript startet mit "Version 1.1.0"
- ASIN wird erkannt: "B0DHSFL5DD"
- Monatskauf-Anzeige erscheint unter den Bewertungen
- Fallback-Schätzung basierend auf Bewertungsanzahl (188 Bewertungen → ~4+ Mal gekauft)

### 2. Private Account Vergleich
**Ziel**: Vergleichen mit privatem Account (falls verfügbar)

**Schritte**:
1. Logge dich in privaten Amazon Account ein
2. Besuche dieselbe Produktseite
3. Prüfe, ob die originale Monatskauf-Anzeige vorhanden ist
4. Vergleiche mit Business Account Ergebnis

### 3. Verschiedene Produkttypen
**Ziel**: Testen mit verschiedenen ASINs

**Test-Produkte**:
- LEGO: B0DHSFL5DD (bekannt funktionierend)
- Elektronik: Verschiedene ASINs
- Bücher: Verschiedene ASINs
- Verschiedene Kategorien

### 4. API-Endpoint Tests
**Ziel**: Überprüfen der verschiedenen API-Strategien

**Debug-Ausgaben prüfen**:
```
Versuche API-Endpoint: https://www.amazon.de/gp/product/ajax/...
Endpoint fehlgeschlagen: HTTP 403
Versuche API-Endpoint: https://www.amazon.de/gp/product/ajax/...&businessAccount=true
Monatskauf-Daten gefunden: 1000+ Mal im letzten Monat gekauft
```

## Erwartete Debug-Ausgaben

### Erfolgreicher Lauf:
```
Amazon Monatskauf Skript gestartet - Version 1.1.0
ASIN gefunden: B0DHSFL5DD
Versuche API-Endpoint: https://www.amazon.de/gp/product/ajax/...
Monatskauf-Daten gefunden: 1000+ Mal im letzten Monat gekauft
Monatskauf-Anzeige hinzugefügt für ASIN B0DHSFL5DD: 1000+ Mal im letzten Monat gekauft
```

### Fallback-Szenario:
```
Amazon Monatskauf Skript gestartet - Version 1.1.0
ASIN gefunden: B0DHSFL5DD
Versuche API-Endpoint: https://www.amazon.de/gp/product/ajax/...
Endpoint fehlgeschlagen: HTTP 403
Versuche API-Endpoint: https://www.amazon.de/gp/product/ajax/...&businessAccount=true
Endpoint fehlgeschlagen: HTTP 403
Versuche API-Endpoint: https://www.amazon.de/dp/B0DHSFL5DD?ref=sr_1_1...
Endpoint fehlgeschlagen: HTTP 403
Fallback-Anzeige verwendet: ~4+ Mal im letzten Monat gekauft (geschätzt)
```

## Häufige Probleme und Lösungen

### Problem: Keine Anzeige
**Mögliche Ursachen**:
- Skript nicht aktiviert
- Falsche Domain (nur amazon.de)
- JavaScript-Fehler

**Lösung**:
1. Prüfe Tampermonkey Dashboard
2. Stelle sicher, dass Skript für amazon.de aktiviert ist
3. Prüfe Browser-Konsole auf Fehler

### Problem: API-Fehler (HTTP 403/429)
**Mögliche Ursachen**:
- Rate-Limiting durch Amazon
- Anti-Bot-Schutz
- Session-Probleme

**Lösung**:
- Warte 1-2 Minuten und versuche erneut
- Logge dich neu in Amazon ein
- Prüfe, ob Fallback-Schätzung funktioniert

### Problem: Falsche ASIN-Extraktion
**Debug-Ausgabe prüfen**:
```
ASIN nicht gefunden
```

**Lösung**:
- Prüfe, ob du auf einer Produktseite bist
- Versuche direkte Produktseite (/dp/ASIN)
- Prüfe HTML-Struktur auf Änderungen

## Performance-Tests

### Ladezeit-Impact
- Skript sollte < 2 Sekunden benötigen
- Keine sichtbare Verlangsamung der Seite
- API-Aufrufe im Hintergrund

### Memory-Usage
- Keine Memory-Leaks
- Observer wird korrekt aufgeräumt
- Keine wiederholten API-Aufrufe

## Browser-Kompatibilität

### Getestete Browser:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Edge 120+

### Tampermonkey-Versionen:
- ✅ Tampermonkey 4.19+
- ✅ Greasemonkey 4.11+

## Reporting

Bei Problemen bitte folgende Informationen sammeln:
1. Browser und Version
2. Tampermonkey Version
3. Vollständige Debug-Ausgaben aus der Konsole
4. URL der getesteten Seite
5. Screenshot des Problems (falls visuell)
