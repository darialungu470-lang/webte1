*** Obedové menu v okolí FEI STU ***

Webová aplikácia na prehľadné zobrazovanie obedových menu vybraných stravovacích zariadení v okolí Fakulty elektrotechniky a informatiky STU v Bratislave.

Projekt bol vytvorený v rámci predmetu Webové technológie (WEBTE).


1. O projekte

Cieľom projektu je umožniť používateľovi jednoducho porovnávať obedové menu viacerých stravovacích zariadení na jednom mieste bez potreby navštevovať jednotlivé webové stránky.

Aplikácia spracováva HTML dokumenty obsahujúce jedálne lístky, získava z nich potrebné údaje a zobrazuje ich v jednotnom formáte.

Podporované stravovacie zariadenia

- Eat & Meet
- FIITFOOD
- Riviera


2. Funkcionalita

Aplikácia poskytuje nasledujúce funkcie:

+ Výber stravovacieho zariadenia pomocou rozbaľovacieho zoznamu.
+ Zobrazenie obedového menu podľa jednotlivých dní.
+ Zobrazenie názvov jedál, cien, dotovaných cien a alergénov, ak sú dostupné.
+ Zobrazenie Business Menu pre reštauráciu Riviera.
+ Zvýraznenie aktuálneho dňa.
+ Ukladanie spracovaných jedálnych lístkov do localStorage.
+ Opätovné načítanie údajov pomocou tlačidla na obnovenie menu.
+ Vymazanie uložených údajov z vyrovnávacej pamäte.
+ Zobrazenie času posledného úspešného načítania menu.
+ Responzívne rozhranie pre počítače, tablety a mobilné zariadenia.
+ Informačná podstránka o aplikácii s kontaktným formulárom.

Upozornenie: Kontaktný formulár iba simuluje odoslanie správy. Údaje sa neodosielajú na server ani e-mailovú adresu.


3. Použité technológie

HTML5                   - Štruktúra webových stránok
CSS3                    - Vzhľad a responzívne rozloženie
JavaScript (ES6+)       - Logika aplikácie a interaktivita
Bootstrap 5             - Štýlovanie a responzívne komponenty
Day.js                  - Práca s dátumami
Fetch API               - Načítavanie HTML dokumentov
DOMParser               - Spracovanie HTML obsahu
localStorage            - Ukladanie jedálnych lístkov a času aktualizácie


4. Štruktúra projektu

index.html – hlavná stránka s výberom reštaurácií a zobrazením menu.
about.html – informácie o aplikácii a kontaktný formulár.
style.css  – vlastné štýly a responzívny dizajn.
main.js    – načítavanie, ukladanie a zobrazovanie jedálnych lístkov.
contact.js – validácia a simulácia odoslania kontaktného formulára.
parsers/   – samostatné moduly na spracovanie HTML jednotlivých reštaurácií.
data/      – lokálne uložené HTML dokumenty obsahujúce jedálne lístky.


5. Princíp fungovania

- Používateľ otvorí aplikáciu a vyberie stravovacie zariadenie.
- Aplikácia skontroluje, či sú pre aktuálny deň dostupné uložené údaje v localStorage.
- Ak údaje nie sú dostupné alebo používateľ požaduje obnovenie, pomocou fetch() sa načíta príslušný lokálny HTML dokument.
- DOMParser prevedie HTML text na dokument.
- Parser konkrétnej reštaurácie vyhľadá jednotlivé dni a jedlá pomocou CSS selektorov.
- Spracované údaje sa uložia do localStorage a zobrazia na stránke.
- Používateľ môže prepínať medzi dňami, reštauráciami alebo vymazať uložené údaje.


Zdroj údajov a obmedzenia

Jedálne lístky sa získavajú z lokálne uložených HTML dokumentov jednotlivých stravovacích zariadení.

Priame načítavanie HTML z externých webových stránok môže byť obmedzené bezpečnostnou politikou CORS. Z tohto dôvodu aplikácia používa lokálne HTML súbory.

Tlačidlo na obnovenie menu opätovne načíta lokálny HTML dokument. Nezaručuje získanie aktuálnych údajov z webovej stránky reštaurácie.

6. Licencie použitých fontov

V projekte sú použité nasledujúce fonty z Google Fonts:

DM Serif Display
- SIL Open Font License 1.1
- https://fonts.google.com/specimen/DM+Serif+Display

Courgette
- SIL Open Font License 1.1
- https://fonts.google.com/specimen/Courgette

Oba fonty sú používané v súlade s podmienkami licencie SIL Open Font License 1.1 (OFL), ktorá povoľuje ich bezplatné používanie, úpravu a distribúciu za stanovených podmienok.

Úplné znenie licencie: https://openfontlicense.org/

7. Známe obmedzenia

- Jedálne lístky nie sú automaticky synchronizované s aktuálnymi webovými stránkami reštaurácií.
- HTML parsery závisia od štruktúry zdrojových dokumentov.
- Ak reštaurácia zmení HTML štruktúru, môže byť potrebné upraviť parser.
- Dostupnosť jednotlivých údajov závisí od obsahu zdrojového HTML.
- Kontaktný formulár nemá backend a odoslanie iba simuluje.

8. Autor

Projekt bol vytvorený ako školské zadanie v rámci predmetu Webové technológie na FEI STU.

Akademický rok: 2026/2027