// ==UserScript==
// @name         TM-AMZB
// @namespace    https://github.com/Flyor
// @version      1.8.1
// @description  Zeigt Monatskauf-Daten für alle Produkte auf Übersichtsseiten an
// @author       Stonehiller Industries
// @match        https://www.amazon.de/*
// @match        https://amazon.de/*
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/Flyor/TM-AMZB/raw/main/monatskauf-daten.user.js
// @updateURL    https://github.com/Flyor/TM-AMZB/raw/main/monatskauf-daten.user.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Debug-Funktion
    function debug(message) {
        console.debug(`[Monatskauf-Daten] ${message}`);
    }

    // ASIN aus URL extrahieren
    function extractASIN() {
        const url = window.location.href;
        const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
        return asinMatch ? asinMatch[1] : null;
    }

    // ASIN aus HTML extrahieren
    function extractASINFromHTML() {
        const asinElement = document.querySelector('[data-asin]');
        return asinElement ? asinElement.getAttribute('data-asin') : null;
    }

    // Monatskauf-Daten abrufen
    async function fetchMonthlySales(asin) {
        try {
            debug(`🎯 Suche nach Social Proofing Widget für ASIN: ${asin}`);
            
            // Strategie 1: Unangemeldete Produktseite mit echten Selektoren
            const productUrl = `https://www.amazon.de/dp/${asin}`;
            
            const response = await fetch(productUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                credentials: 'omit'
            });

            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Suche nach dem Social Proofing Widget
                const socialProofingWidget = doc.querySelector('#socialProofingAsinFaceout_feature_div');
                if (socialProofingWidget) {
                    debug('🎉 Social Proofing Widget gefunden!');
                    
                    // Suche nach dem spezifischen Text
                    const titleElement = socialProofingWidget.querySelector('#social-proofing-faceout-title-tk_bought');
                    if (titleElement) {
                        const text = titleElement.textContent.trim();
                        debug('✅ Monatskauf-Daten aus Social Proofing Widget:', text);
                        return text;
                    }
                    
                    // Alternative Suche im Widget
                    const boldElement = socialProofingWidget.querySelector('.a-text-bold');
                    const spanElement = socialProofingWidget.querySelector('span:not(.a-text-bold)');
                    if (boldElement && spanElement) {
                        const combinedText = boldElement.textContent.trim() + ' ' + spanElement.textContent.trim();
                        debug('✅ Monatskauf-Daten kombiniert:', combinedText);
                        return combinedText;
                    }
                }
                
                // Fallback: Suche nach dem Text in verschiedenen Varianten
                const textVariants = [
                    '1000+ gekauft Mal im letzten Monat',
                    'Mal im letzten Monat gekauft',
                    'gekauft Mal im letzten Monat'
                ];
                
                for (const variant of textVariants) {
                    const elements = doc.querySelectorAll('*');
                    for (const element of elements) {
                        if (element.textContent.includes(variant)) {
                            debug('✅ Monatskauf-Daten gefunden (Fallback):', element.textContent.trim());
                            return element.textContent.trim();
                        }
                    }
                }
            }

            // Strategie 2: Suche im aktuellen DOM nach Social Proofing Widget
            const currentSocialProofing = document.querySelector('#socialProofingAsinFaceout_feature_div');
            if (currentSocialProofing) {
                debug('🎉 Social Proofing Widget im aktuellen DOM gefunden!');
                
                const titleElement = currentSocialProofing.querySelector('#social-proofing-faceout-title-tk_bought');
                if (titleElement) {
                    const text = titleElement.textContent.trim();
                    debug('✅ Monatskauf-Daten aus aktuellem DOM:', text);
                    return text;
                }
            }

            debug('❌ Keine Social Proofing Daten gefunden');
            return null;
        } catch (error) {
            debug('Fehler beim Abrufen der Monatskauf-Daten:', error);
            return null;
        }
    }

    // Fallback-Nachricht generieren
    function generateFallbackMessage(asin) {
        return 'Daten nicht verfügbar';
    }

    // Monatskauf-Daten anzeigen
    function addMonthlySalesDisplay(monthlySalesText, asin) {
        // Prüfe, ob bereits eine Anzeige existiert
        const existingDisplay = document.querySelector(`[data-asin="${asin}"] .monatskauf-display`);
        if (existingDisplay) {
            existingDisplay.textContent = monthlySalesText;
            return;
        }

        // Finde das Produktkarten-Element
        const productCard = document.querySelector(`[data-asin="${asin}"]`);
        if (!productCard) return;

        // Erstelle das Anzeige-Element
        const displayElement = document.createElement('div');
        displayElement.className = 'monatskauf-display';
        displayElement.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin: 8px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            border: 2px solid #4a5568;
            position: relative;
            overflow: hidden;
        `;

        // Füge einen subtilen Glanz-Effekt hinzu
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shine 2s infinite;
        `;
        displayElement.appendChild(shine);

        // Füge CSS-Animation hinzu
        if (!document.querySelector('#monatskauf-animation')) {
            const style = document.createElement('style');
            style.id = 'monatskauf-animation';
            style.textContent = `
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `;
            document.head.appendChild(style);
        }

        displayElement.textContent = monthlySalesText;

        // Füge das Element zur Produktkarte hinzu
        productCard.appendChild(displayElement);
    }

    // Einzelne Produktkarte verarbeiten
    async function processProductCard(card, index = 0, total = 1) {
        const asin = card.getAttribute('data-asin');
        if (!asin) return;

        debug(`📦 Verarbeite Produkt ${index + 1}/${total} (ASIN: ${asin})`);
        
        const monthlySalesText = await fetchMonthlySales(asin);
        if (monthlySalesText) {
            addMonthlySalesDisplay(monthlySalesText, asin);
            debug(`✅ Monatskauf-Daten für ${asin} gefunden: ${monthlySalesText}`);
        } else {
            const fallbackText = generateFallbackMessage(asin);
            addMonthlySalesDisplay(fallbackText, asin);
            debug(`❌ Keine Monatskauf-Daten für ${asin} gefunden`);
        }
    }

    // Hauptfunktion
    async function main() {
        // Warte kurz, bis die Seite vollständig geladen ist
        await new Promise(resolve => setTimeout(resolve, 500));

        // Prüfe, ob wir auf einer Produktübersichtsseite sind (mehrere Produktkacheln)
        const productCards = document.querySelectorAll('[data-asin]');
        
        if (productCards.length > 1) {
            // Produktübersichtsseite - verarbeite ALLE Kacheln
            debug(`🚀 Gefunden: ${productCards.length} Produktkacheln - verarbeite ALLE`);
            
            // Verarbeite alle Kacheln in Batches für bessere Performance
            const batchSize = 5; // 5 Produkte gleichzeitig
            const allCards = Array.from(productCards);
            
            for (let i = 0; i < allCards.length; i += batchSize) {
                const batch = allCards.slice(i, i + batchSize);
                debug(`📦 Verarbeite Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allCards.length/batchSize)}: Produkte ${i + 1}-${Math.min(i + batchSize, allCards.length)}`);
                
                // Verarbeite Batch parallel mit Fortschrittsinformationen
                await Promise.all(batch.map((card, batchIndex) => 
                    processProductCard(card, i + batchIndex, allCards.length)
                ));
                
                // Kurze Pause zwischen Batches (um Server nicht zu überlasten)
                if (i + batchSize < allCards.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            
            debug(`✅ Alle ${productCards.length} Produktkacheln verarbeitet!`);
            
            // Zeige Zusammenfassung
            const foundData = document.querySelectorAll('.monatskauf-display');
            const withData = Array.from(foundData).filter(el => 
                !el.textContent.includes('nicht verfügbar')
            );
            debug(`📊 Zusammenfassung: ${withData.length}/${productCards.length} Produkte mit Monatskauf-Daten gefunden`);
            
        } else if (productCards.length === 1) {
            // Einzelproduktseite - verarbeite die eine Kachel
            debug('🚀 Einzelproduktseite erkannt');
            await processProductCard(productCards[0]);
        } else {
            // Fallback für direkte Produktseiten ohne data-asin
            let asin = extractASIN();
            if (!asin) {
                asin = extractASINFromHTML();
            }

            if (asin) {
                debug(`🚀 ASIN gefunden: ${asin}`);
                const monthlySalesText = await fetchMonthlySales(asin);
                if (monthlySalesText) {
                    addMonthlySalesDisplay(monthlySalesText, asin);
                } else {
                    const fallbackText = generateFallbackMessage(asin);
                    addMonthlySalesDisplay(fallbackText, asin);
                }
            } else {
                debug('❌ Keine ASIN gefunden');
            }
        }
    }

    // MutationObserver für dynamische Inhalte
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Prüfe, ob neue Produktkarten hinzugefügt wurden
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector && node.querySelector('[data-asin]')) {
                            shouldRun = true;
                        }
                    }
                });
            }
        });

        if (shouldRun) {
            debug('🔄 Neue Produktkarten erkannt - starte erneut');
            setTimeout(main, 1000);
        }
    });

    // Observer starten
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Hauptfunktion ausführen
    main();
})();
