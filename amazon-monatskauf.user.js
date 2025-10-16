// ==UserScript==
// @name         Amazon Monatskauf Anzeige
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  Zeigt die Anzahl der Käufe im letzten Monat für Amazon-Produkte an (auch in Business Accounts)
// @author       AI Assistant
// @match        https://www.amazon.de/*
// @match        https://amazon.de/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.debug('Amazon Monatskauf Skript gestartet - Version 1.8.0 (Alle Produktkacheln)');

    // Keine fetch-Interception mehr - verursacht Fehler!

    // Funktion zum Extrahieren der ASIN aus der URL
    function extractASIN() {
        const url = window.location.href;
        const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
        return asinMatch ? asinMatch[1] : null;
    }

    // Funktion zum Extrahieren der ASIN aus dem HTML
    function extractASINFromHTML() {
        // Suche nach ASIN in verschiedenen HTML-Elementen
        const asinSelectors = [
            '[data-csa-c-asin]',
            'input[name*="asin"]',
            'form[action*="add-to-cart"] input[name*="asin"]'
        ];

        for (const selector of asinSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                if (element.hasAttribute('data-csa-c-asin')) {
                    return element.getAttribute('data-csa-c-asin');
                }
                if (element.name && element.name.includes('asin')) {
                    return element.value;
                }
            }
        }

        // Fallback: Suche in allen data-*-Attributen
        const allElements = document.querySelectorAll('[data-csa-c-asin]');
        if (allElements.length > 0) {
            return allElements[0].getAttribute('data-csa-c-asin');
        }

        return null;
    }

    // Funktion zum Abrufen der Monatskauf-Daten mit echten Selektoren
    async function fetchMonthlySales(asin) {
        try {
            console.debug(`🎯 Suche nach Social Proofing Widget für ASIN: ${asin}`);
            
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
                    console.debug('🎉 Social Proofing Widget gefunden!');
                    
                    // Suche nach dem spezifischen Text
                    const titleElement = socialProofingWidget.querySelector('#social-proofing-faceout-title-tk_bought');
                    if (titleElement) {
                        const text = titleElement.textContent.trim();
                        console.debug('✅ Monatskauf-Daten aus Social Proofing Widget:', text);
                        return text;
                    }
                    
                    // Alternative Suche im Widget
                    const boldElement = socialProofingWidget.querySelector('.a-text-bold');
                    const spanElement = socialProofingWidget.querySelector('span:not(.a-text-bold)');
                    if (boldElement && spanElement) {
                        const combinedText = boldElement.textContent.trim() + ' ' + spanElement.textContent.trim();
                        console.debug('✅ Monatskauf-Daten kombiniert:', combinedText);
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
                            console.debug('✅ Monatskauf-Daten gefunden (Fallback):', element.textContent.trim());
                            return element.textContent.trim();
                        }
                    }
                }
            }

            // Strategie 2: Suche im aktuellen DOM nach Social Proofing Widget
            const currentSocialProofing = document.querySelector('#socialProofingAsinFaceout_feature_div');
            if (currentSocialProofing) {
                console.debug('🎉 Social Proofing Widget im aktuellen DOM gefunden!');
                
                const titleElement = currentSocialProofing.querySelector('#social-proofing-faceout-title-tk_bought');
                if (titleElement) {
                    const text = titleElement.textContent.trim();
                    console.debug('✅ Monatskauf-Daten aus aktuellem DOM:', text);
                    return text;
                }
            }

            console.debug('❌ Keine Social Proofing Daten gefunden');
            return null;
        } catch (error) {
            console.debug('Fehler beim Abrufen der Monatskauf-Daten:', error);
            return null;
        }
    }

    // Funktion zum Hinzufügen der Monatskauf-Anzeige
    function addMonthlySalesDisplay(monthlySalesText, asin) {
        // Suche nach dem Reviews-Block, um die Information dort hinzuzufügen
        const reviewsBlock = document.querySelector('[data-cy="reviews-block"]');
        if (!reviewsBlock) {
            console.debug('Reviews-Block nicht gefunden');
            return;
        }

        // Prüfe, ob bereits eine Monatskauf-Anzeige existiert
        const existingDisplay = reviewsBlock.querySelector('.amazon-monatskauf-display');
        if (existingDisplay) {
            console.debug('Monatskauf-Anzeige bereits vorhanden');
            return;
        }

        // Erstelle das Anzeige-Element
        const monthlySalesRow = document.createElement('div');
        monthlySalesRow.className = 'a-row a-size-base amazon-monatskauf-display';
        monthlySalesRow.style.cssText = 'margin-top: 4px; padding: 2px 0;';
        
        const monthlySalesSpan = document.createElement('span');
        monthlySalesSpan.className = 'a-size-base a-color-secondary';
        monthlySalesSpan.textContent = monthlySalesText;
        monthlySalesSpan.style.cssText = 'background-color: #f0f8ff; padding: 2px 6px; border-radius: 3px; border-left: 3px solid #007185;';
        
        monthlySalesRow.appendChild(monthlySalesSpan);
        
        // Füge das Element nach dem Reviews-Block hinzu
        reviewsBlock.appendChild(monthlySalesRow);
        
        console.debug(`Monatskauf-Anzeige hinzugefügt für ASIN ${asin}: ${monthlySalesText}`);
    }

    // Funktion zum Verarbeiten einer einzelnen Produktkachel
    async function processProductCard(productCard, cardIndex = 0, totalCards = 0) {
        // Extrahiere ASIN aus der Produktkachel
        const asin = productCard.getAttribute('data-asin');
        if (!asin) {
            console.debug('Keine ASIN in Produktkachel gefunden');
            return;
        }

        const progressInfo = totalCards > 0 ? `[${cardIndex + 1}/${totalCards}]` : '';
        console.debug(`${progressInfo} Verarbeite Produktkachel für ASIN: ${asin}`);

        // Prüfe, ob bereits eine Monatskauf-Anzeige vorhanden ist
        const existingDisplay = productCard.querySelector('.amazon-monatskauf-display');
        if (existingDisplay) {
            console.debug(`${progressInfo} Monatskauf-Anzeige bereits vorhanden für ASIN ${asin}`);
            return;
        }

        // Versuche, die Monatskauf-Daten abzurufen
        const monthlySalesText = await fetchMonthlySales(asin);
        
        if (monthlySalesText) {
            addMonthlySalesDisplayToCard(monthlySalesText, asin, productCard);
            console.debug(`${progressInfo} ✅ Daten gefunden für ASIN ${asin}: ${monthlySalesText}`);
        } else {
            // Keine echten Daten verfügbar - zeige ehrliche Nachricht
            const fallbackText = generateFallbackMessage(asin);
            addMonthlySalesDisplayToCard(fallbackText, asin, productCard);
            console.debug(`${progressInfo} ❌ Keine Daten für ASIN ${asin}`);
        }
    }

    // Funktion für Fallback-Nachricht (keine Schätzungen mehr)
    function generateFallbackMessage(asin) {
        return `Monatskauf-Daten für ${asin} nicht verfügbar`;
    }

    // Funktion zum Hinzufügen der Monatskauf-Anzeige zu einer spezifischen Produktkachel
    function addMonthlySalesDisplayToCard(monthlySalesText, asin, productCard) {
        // Suche nach dem Reviews-Block in dieser spezifischen Kachel
        const reviewsBlock = productCard.querySelector('[data-cy="reviews-block"]');
        if (!reviewsBlock) {
            console.debug('Reviews-Block nicht in Produktkachel gefunden');
            return;
        }

        // Prüfe, ob bereits eine Monatskauf-Anzeige existiert
        const existingDisplay = reviewsBlock.querySelector('.amazon-monatskauf-display');
        if (existingDisplay) {
            console.debug('Monatskauf-Anzeige bereits in Kachel vorhanden');
            return;
        }

        // Erstelle das Anzeige-Element
        const monthlySalesRow = document.createElement('div');
        monthlySalesRow.className = 'a-row a-size-base amazon-monatskauf-display';
        monthlySalesRow.style.cssText = 'margin-top: 4px; padding: 2px 0;';
        
        const monthlySalesSpan = document.createElement('span');
        monthlySalesSpan.className = 'a-size-base a-color-secondary';
        monthlySalesSpan.textContent = monthlySalesText;
        monthlySalesSpan.style.cssText = 'background-color: #f0f8ff; padding: 2px 6px; border-radius: 3px; border-left: 3px solid #007185;';
        
        monthlySalesRow.appendChild(monthlySalesSpan);
        
        // Füge das Element nach dem Reviews-Block hinzu
        reviewsBlock.appendChild(monthlySalesRow);
        
        console.debug(`Monatskauf-Anzeige hinzugefügt für ASIN ${asin}: ${monthlySalesText}`);
    }

    // Optimierte Hauptfunktion
    async function main() {
        // Warte kurz, bis die Seite vollständig geladen ist
        await new Promise(resolve => setTimeout(resolve, 500));

        // Prüfe, ob wir auf einer Produktübersichtsseite sind (mehrere Produktkacheln)
        const productCards = document.querySelectorAll('[data-asin]');
        
        if (productCards.length > 1) {
            // Produktübersichtsseite - verarbeite ALLE Kacheln
            console.debug(`🚀 Gefunden: ${productCards.length} Produktkacheln - verarbeite ALLE`);
            
            // Verarbeite alle Kacheln in Batches für bessere Performance
            const batchSize = 5; // 5 Produkte gleichzeitig
            const allCards = Array.from(productCards);
            
            for (let i = 0; i < allCards.length; i += batchSize) {
                const batch = allCards.slice(i, i + batchSize);
                console.debug(`📦 Verarbeite Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allCards.length/batchSize)}: Produkte ${i + 1}-${Math.min(i + batchSize, allCards.length)}`);
                
                // Verarbeite Batch parallel mit Fortschrittsinformationen
                await Promise.all(batch.map((card, batchIndex) => 
                    processProductCard(card, i + batchIndex, allCards.length)
                ));
                
                // Kurze Pause zwischen Batches (um Amazon nicht zu überlasten)
                if (i + batchSize < allCards.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            
            console.debug(`✅ Alle ${productCards.length} Produktkacheln verarbeitet!`);
            
            // Zeige Zusammenfassung
            const foundData = document.querySelectorAll('.amazon-monatskauf-display');
            const withData = Array.from(foundData).filter(el => 
                !el.textContent.includes('nicht verfügbar')
            );
            console.debug(`📊 Zusammenfassung: ${withData.length}/${productCards.length} Produkte mit Monatskauf-Daten gefunden`);
            
        } else if (productCards.length === 1) {
            // Einzelproduktseite - verarbeite die eine Kachel
            console.debug('🚀 Einzelproduktseite erkannt');
            await processProductCard(productCards[0]);
        } else {
            // Fallback für direkte Produktseiten ohne data-asin
            let asin = extractASIN();
            if (!asin) {
                asin = extractASINFromHTML();
            }

            if (asin) {
                console.debug(`🚀 ASIN gefunden: ${asin}`);
                const monthlySalesText = await fetchMonthlySales(asin);
                if (monthlySalesText) {
                    addMonthlySalesDisplay(monthlySalesText, asin);
                } else {
                    const fallbackText = generateFallbackMessage(asin);
                    addMonthlySalesDisplay(fallbackText, asin);
                }
            } else {
                console.debug('❌ Keine ASIN gefunden');
            }
        }
    }

    // Skript starten
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // Observer für dynamische Inhalte (SPA-Navigation)
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Prüfe, ob neue Produktinformationen hinzugefügt wurden
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector && (
                            node.querySelector('[data-cy="reviews-block"]') ||
                            node.querySelector('[data-csa-c-asin]') ||
                            node.matches('[data-cy="reviews-block"]')
                        )) {
                            shouldRun = true;
                            break;
                        }
                    }
                }
            }
        });
        
        if (shouldRun) {
            console.debug('Neue Inhalte erkannt, Skript wird erneut ausgeführt');
            setTimeout(main, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
