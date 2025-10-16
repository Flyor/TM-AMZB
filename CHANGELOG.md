# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2024-01-XX

### 🚀 Alle Produktkacheln verarbeiten!
- **Vollständige Abdeckung**: Verarbeitet ALLE Produktkacheln auf Übersichtsseiten
- **Batch-Processing**: 5 Produkte gleichzeitig für optimale Performance
- **Fortschrittsanzeige**: Zeigt [1/20], [2/20] etc. für jeden Verarbeitungsschritt
- **Zusammenfassung**: Zeigt am Ende, wie viele Produkte Daten gefunden haben

### Hinzugefügt
- **Batch-Processing für alle Produkte**:
  - Verarbeitet alle Produktkacheln (nicht nur die ersten 5)
  - 5 Produkte gleichzeitig für optimale Performance
  - 200ms Pause zwischen Batches (um Amazon nicht zu überlasten)
- **Fortschrittsanzeige**:
  - `[1/20] Verarbeite Produktkachel für ASIN: B0DHSFL5DD`
  - `[1/20] ✅ Daten gefunden für ASIN B0DHSFL5DD: 1000+ gekauft Mal im letzten Monat`
  - `[1/20] ❌ Keine Daten für ASIN B0DHSFL5DD`
- **Zusammenfassung am Ende**:
  - `📊 Zusammenfassung: 15/20 Produkte mit Monatskauf-Daten gefunden`

### Verbessert
- **Vollständige Produktabdeckung**: Alle Produktkacheln werden verarbeitet
- **Bessere Performance**: Batch-Processing mit optimalen Pausen
- **Detailliertes Logging**: Fortschrittsanzeige für jeden Verarbeitungsschritt
- **Übersichtliche Zusammenfassung**: Zeigt Erfolgsrate am Ende

### Technische Verbesserungen
- Batch-Processing mit 5 Produkten gleichzeitig
- Fortschrittsinformationen für jeden Verarbeitungsschritt
- Zusammenfassung der gefundenen Daten
- Optimierte Pausen zwischen Batches

## [1.7.0] - 2024-01-XX

### 🎉 DURCHBRUCH: Social Proofing Widget gefunden!
- **Echte Amazon-Daten**: Social Proofing Widget mit "1000+ gekauft Mal im letzten Monat"
- **Korrekte Selektoren**: `#socialProofingAsinFaceout_feature_div` und `#social-proofing-faceout-title-tk_bought`
- **Keine fetch-Interception**: Alle Fehler behoben
- **Unangemeldete Requests**: Funktioniert ohne Login

### Hinzugefügt
- **Social Proofing Widget-Erkennung**:
  - `#socialProofingAsinFaceout_feature_div` - Hauptwidget
  - `#social-proofing-faceout-title-tk_bought` - Spezifischer Text
  - `.a-text-bold` + `span` Kombination für Text-Extraktion
- **Echte Text-Varianten**:
  - "1000+ gekauft Mal im letzten Monat"
  - "Mal im letzten Monat gekauft"
  - "gekauft Mal im letzten Monat"

### Verbessert
- **2 optimierte Strategien**:
  1. Unangemeldete Produktseite mit Social Proofing Widget
  2. Aktuelles DOM nach Social Proofing Widget
- **Keine Performance-Probleme**:
  - Fetch-Interception komplett entfernt
  - Keine Fehler mehr in der Konsole
  - Schnelle und zuverlässige Daten-Extraktion

### Technische Verbesserungen
- Keine fetch-Interception mehr (verursachte Fehler)
- Spezifische Selektoren für Social Proofing Widget
- Fallback-Strategien für verschiedene Text-Varianten
- Optimierte Debug-Ausgaben

## [1.6.0] - 2024-01-XX

### ⚡ Performance-Optimiert!
- **Fetch-Interception-Fehler behoben**: Vereinfachte Netzwerk-Überwachung
- **Strategien drastisch reduziert**: Von 7 auf 3 Strategien
- **Batch-Processing optimiert**: Nur noch die ersten 5 Produktkacheln
- **Timeouts reduziert**: Von 1000ms auf 500ms Startverzögerung

### Verbessert
- **3 schnelle Strategien**:
  1. Unangemeldete Produktseite
  2. Business Account-Aktivierung
  3. Aktuelles DOM
- **Performance-Verbesserungen**:
  - Keine Rate-Limiting-Pausen
  - Parallele Verarbeitung ohne Verzögerungen
  - Schnellere API-Aufrufe

## [1.5.0] - 2024-01-XX

### 🎯 Game-Changer: Unangemeldete Daten verfügbar!
- **Unangemeldete Requests**: Da Daten auch ohne Login verfügbar sind!
- **Business Account-Aktivierung**: Versucht die Funktion im Business Account zu aktivieren
- **Headless Browser**: Iframe-basierte Daten-Extraktion
- **Multi-User-Agent**: Verschiedene Browser-Identifikationen

### Hinzugefügt
- **Unangemeldete API-Strategien**: 
  - `credentials: 'omit'` für unangemeldete Requests
  - Verschiedene User-Agents (Chrome, Firefox, Safari, Mac)
  - Business Account-Aktivierungs-Parameter
- **Aktivierungs-Endpoints**:
  - `businessAccount=false`
  - `showSalesData=true`
  - `enableSalesData=true`
  - `displaySalesInfo=true`
  - `salesData=true`

### Verbessert
- **7 verschiedene Strategien** für Daten-Extraktion:
  1. Unangemeldete Produktseiten-Aufrufe
  2. Verschiedene User-Agents
  3. AJAX-Endpoints
  4. Aktuelles DOM
  5. "Headless Browser" (Iframe)
  6. Business Account-Aktivierung
  7. Alternative Endpoints
- **Robustere Daten-Extraktion**:
  - Überwacht alle Netzwerk-Requests in Echtzeit
  - Identifiziert potentielle API-Endpoints automatisch
  - Bessere Fehlerbehandlung für Cross-Origin-Requests

### Technische Verbesserungen
- Request-Interception für fetch und XMLHttpRequest
- Iframe-basierte Daten-Extraktion mit 5s Timeout
- Erweiterte Endpoint-Parameter-Kombinationen
- Verbesserte Debug-Ausgaben mit Emojis

## [1.4.0] - 2024-01-XX

### Hinzugefügt
- **Netzwerk-Request-Überwachung**: Überwacht alle Amazon-Requests um echte API-Endpoints zu finden
- **Iframe-Strategie**: Versucht Daten über versteckte iframes zu laden
- **Erweiterte Endpoint-Strategien**: Mehrere Amazon-Endpoints mit verschiedenen Parametern
- **Debug-Emojis**: Bessere Sichtbarkeit der Debug-Ausgaben

### Verbessert
- **Erweiterte API-Strategien**: 
  - 5 verschiedene Strategien für Daten-Extraktion
  - Alternative Selektoren für Monatskauf-Daten
  - Bessere Parameter-Kombinationen für Amazon-Endpoints
  - Iframe-basierte Daten-Extraktion
- **Robustere Daten-Extraktion**:
  - Überwacht alle Netzwerk-Requests in Echtzeit
  - Identifiziert potentielle API-Endpoints automatisch
  - Bessere Fehlerbehandlung für Cross-Origin-Requests

### Technische Verbesserungen
- Request-Interception für fetch und XMLHttpRequest
- Iframe-basierte Daten-Extraktion mit Timeout
- Erweiterte Endpoint-Parameter-Kombinationen
- Verbesserte Debug-Ausgaben mit Emojis

## [1.3.0] - 2024-01-XX

### Wichtig: Keine Schätzungen mehr!
- **Echte Daten oder nichts**: Alle Schätzungen entfernt
- **Ehrliche Fallback-Nachrichten**: "Monatskauf-Daten nicht verfügbar" statt falscher Schätzungen
- **Fokus auf echte Amazon-Daten**: Nur noch echte API-Aufrufe

### Verbessert
- **Erweiterte API-Strategien**: 
  - Direkte Produktseiten-Aufrufe mit vollständigen Headers
  - Multiple AJAX-Endpoints für Amazon's interne APIs
  - Bessere Cookie- und Session-Behandlung
  - Realistischere Browser-Headers
- **Robustere Daten-Extraktion**:
  - Durchsucht aktuelles DOM nach bereits geladenen Daten
  - Multiple Endpoint-Strategien mit verschiedenen Parametern
  - Bessere Fehlerbehandlung und Logging

### Technische Verbesserungen
- Verwendung von `navigator.userAgent` für realistischere Requests
- Erweiterte Header-Konfiguration für bessere Kompatibilität
- Mehrere Fallback-Strategien für verschiedene Amazon-Endpoints
- Detaillierteres Debug-Logging für Troubleshooting

## [1.2.0] - 2024-01-XX

### Hinzugefügt
- **Multi-Produkt-Unterstützung**: Funktioniert jetzt für alle Produktkacheln auf Übersichtsseiten
- **Batch-Verarbeitung**: Intelligente Verarbeitung mehrerer Produkte mit Rate-Limiting
- **Verbesserte API-Strategien**: Direkte Produktseiten-Aufrufe für echte Daten
- **LEGO-spezifische Optimierung**: Höhere Schätzungen für LEGO-Produkte

### Verbessert
- **Realistische Fallback-Schätzungen**: 
  - 188 Bewertungen → ~141+ Monatskäufe (statt ~10+)
  - LEGO-Produkte: Mindestens 500+ Monatskäufe
  - Bessere Algorithmen basierend auf Produktbeliebtheit
- **Parallele Verarbeitung**: Bis zu 3 Produkte gleichzeitig
- **Robustere Seitenerkennung**: Automatische Unterscheidung zwischen Einzel- und Übersichtsseiten

### Technische Verbesserungen
- Batch-Processing mit 500ms Pausen zwischen Batches
- Spezifische Produktkachel-Verarbeitung
- Verbesserte ASIN-Extraktion aus data-asin Attributen
- Optimierte MutationObserver für dynamische Inhalte

## [1.1.0] - 2024-01-XX

### Verbessert
- **Business Account Optimierung**: Spezielle API-Endpoints für Business Accounts
- **Erweiterte Fallback-Strategien**: Intelligente Schätzung basierend auf Bewertungsanzahl
- **Robustere API-Aufrufe**: Mehrere Endpoints mit besserer Fehlerbehandlung
- **Verbesserte User-Agent**: Realistischere Browser-Identifikation
- **Erweiterte Debug-Ausgaben**: Detaillierteres Logging für Troubleshooting

### Technische Verbesserungen
- Multiple API-Endpoint-Strategien
- Intelligente Monatskauf-Schätzung (2% der Bewertungen)
- Bessere Fehlerbehandlung bei API-Aufrufen
- Optimierte Selektoren für verschiedene Amazon-Layouts

## [1.0.0] - 2024-01-XX

### Hinzugefügt
- Initiale Version des Amazon Monatskauf Tampermonkey-Skripts
- Automatische ASIN-Extraktion aus URL und HTML
- API-Integration für Monatskauf-Daten
- Visuelle Anzeige der Monatskauf-Informationen
- MutationObserver für dynamische Inhalte
- Debug-Logging für Troubleshooting
- Fallback-Mechanismus bei API-Fehlern
- Responsive Design-Integration
- Umfassende Dokumentation

### Technische Features
- Unterstützung für amazon.de
- SPA-Navigation kompatibel
- Rate-Limiting berücksichtigt
- Cross-browser Kompatibilität (Chrome, Firefox)
- Tampermonkey Integration

### Dokumentation
- README.md mit Installationsanweisungen
- Technische Dokumentation
- Debugging-Guide
- Fehlerbehebung
