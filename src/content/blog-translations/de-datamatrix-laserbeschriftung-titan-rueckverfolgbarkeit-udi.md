---
title: "DataMatrix Laserbeschriftung und Rückverfolgbarkeit für Titanbauteile: UDI-Konformität, Anlassbeschriftung und ISO-13485-Audit"
description: "Engineering-Leitfaden zur lasergestützten Kennzeichnung von Titan: Anlassbeschriftung vs. Direktbeschriftung, DataMatrix-Aufbau nach GS1, UDI-Pflichtinhalte nach EU-MDR und FDA 21 CFR 830, Rückverfolgbarkeitskette nach ISO 13485 und EN ISO 13485. Mit Schwerpunkt auf Ti6Al4V/Grade 23-Oberflächenvorbereitung, Kontrastverhalten bei dunkler Anlassfarbe und Audit-Prüfpunkte in der Medizintechnik."
pubDate: 2026-08-26T10:00:00.000+08:00
author: "Boze Titanium Manufacturing Center"
category: "Titan-Rückverfolgbarkeit und Laserkennzeichnung"
tags: ["DataMatrix Laserbeschriftung Metall", "Anlassbeschriftung Titan", "UDI Kennzeichnung Medizinprodukte", "Rückverfolgbarkeit Titan ISO 13485", "GS1 DataMatrix Titan", "Lasermarkierung Titan Grade 23", "FDA UDI Titan", "MDR Kennzeichnung Implantate"]
coverImage: "/uploads/blog-titanium-material-certification-traceability-guide-cover.jpg"
coverImageAlt: "Laserbeschrifteter Titan-Datenmatrix-Code auf einem Medizintechnik-Bauteil – Symbol für Rückverfolgbarkeit und UDI-Konformität"
featured: false
lang: "de"
originalSlug: "datamatrix-laserbeschriftung-titan-rueckverfolgbarkeit-udi"
---

## Zusammenfassung für Einkauf, Qualitätssicherung und Regulatory Affairs

Die lasergestützte Direktbeschriftung ist heute das dominierende Kennzeichnungsverfahren für Titanbauteile in der Medizintechnik und Luftfahrt. Sie ist reversibel nicht entfernbar, hitzebeständig, sterilisierbar und übersteht Reinigungs- und Passivierungsprozesse ohne Schaden. Bei Titan stehen sich zwei physikalisch unterschiedliche Verfahren gegenüber: die Anlassbeschriftung, die durch lokale Wärmeeinwirkung die Oxidschicht verfärbt und so einen dunklen Kontrast auf der Titan-Oberfläche erzeugt; und die Direktbeschriftung mit Materialabtrag, die durch Laserablation Vertiefungen erzeugt und so auch ohne Anlassfarbe einen dauerhaften Kontrast liefert. Welches Verfahren das richtige ist, hängt von der geforderten Kontrastqualität, der nachfolgenden Oberflächenbehandlung und der normativen Anforderung ab. Dieser Artikel ordnet die beiden Verfahren, erklärt den Aufbau eines GS1-DataMatrix-Codes für UDI, die Pflichtinhalte nach EU-MDR und FDA 21 CFR 830, sowie die Audit-Praxis nach ISO 13485. Er richtet sich an Einkaufsleiter, Qualitätssicherungsingenieure und Regulatory-Affairs-Verantwortliche, die Titan-Bauteile in Medizintechnik oder Luftfahrt verantworten.

---

## Inhaltsverzeichnis

- Abschnitt 1 — Anlassbeschriftung und Direktbeschriftung: Die zwei Physiken der Titan-Laserbeschriftung
- Abschnitt 2 — DataMatrix nach GS1 und ISO/IEC 16022: Aufbau, Lesbarkeit und Inspektionspraxis
- Abschnitt 3 — UDI-Konformität nach EU-MDR und FDA 21 CFR 830
- Abschnitt 4 — Rückverfolgbarkeit nach ISO 13485: Chargen- und Bauteil-Dokumentation
- Abschnitt 5 — Verfahrenswahl in Medizintechnik, Luftfahrt und Serienfertigung

---

## 1. Anlassbeschriftung und Direktbeschriftung: Die zwei Physiken der Titan-Laserbeschriftung

Die Laserbeschriftung von Titan nutzt die starke Absorption der Laserstrahlung durch das Metall und die lokale Erhitzung der Oberfläche. Dabei laufen zwei physikalisch unterschiedliche Vorgänge ab, je nach Laserparameter und Titan-Legierung: Die Anlassbeschriftung (auch als „Schwarzbeschriftung" oder „Dark Marking" bezeichnet) erzeugt die dunkle Farbe durch lokale Oxidation der TiO₂-Schicht, ohne das Basismaterial abzutragen. Die Direktbeschriftung (auch als „Tiefenbeschriftung" oder „Ablation" bezeichnet) trägt das Material lokal ab und erzeugt einen mechanisch eingeprägten Kontrast.

**Die Anlassbeschriftung im Detail.**

Bei der Anlassbeschriftung wird die Titan-Oberfläche durch kurze Laserpulse (typisch 10–100 ns, Faserlaser mit 1,07 µm Wellenlänge) lokal auf Temperaturen zwischen 350 und 600 °C erhitzt. Bei diesen Temperaturen wächst die natürlich vorhandene TiO₂-Schicht von 5–10 nm auf 50–200 nm Dicke an; gleichzeitig verändert sich die Kristallstruktur der Oxidschicht und es bilden sich farbige Oxide. Die Folge ist eine dunkle, oft schwarze Verfärbung der behandelten Fläche, die bei einer typischen Pulsenergie von 0,1–0,5 mJ pro Punkt etwa 20–50 µm breite Linien ergibt.

Die Anlassbeschriftung hat zwei wesentliche Vorteile: Sie trägt kein Material ab und erzeugt keine Riefen oder Vertiefungen, die Korrosionskeime bilden könnten. Sie ist deshalb für medizintechnische Implantate besonders geeignet, weil die biologische Verträglichkeit der Oberfläche vollständig erhalten bleibt. Der Nachteil: Die Anlassfarbe ist nicht so kontraststark wie eine mechanische Vertiefung; in der Endprüfung wird der Kontrast mit speziellen Kamerasystemen (Monochrom-Kameras oder NIR-Kameras) gemessen, und die Akzeptanzschwelle liegt typisch bei einem Helligkeitsverhältnis von 3:1 bis 5:1 zwischen beschrifteter und unbasierter Fläche.

**Die Direktbeschriftung im Detail.**

Bei der Direktbeschriftung werden durch höhere Pulsenergie (0,5–5 mJ) und/oder mehrfache Pulse lokale Vertiefungen von 20–100 µm Tiefe erzeugt. Das abgetragene Material wird in Form winziger Partikel aus der Bearbeitungszone ausgestoßen; die typische Strukturbreite liegt bei 30–80 µm. Der Kontrast entsteht durch die unterschiedliche Streuung des Lichts an der Vertiefung im Vergleich zur umgebenden Oberfläche. Der Kontrast ist deutlich höher als bei der Anlassbeschriftung (typisch 5:1 bis 10:1) und ist auch mit normalen CMOS-Kameras lesbar.

Die Direktbeschriftung hat den Vorteil der höheren Kontrastqualität und der besseren Maschinenlesbarkeit. Sie hat aber zwei Nachteile: Sie erzeugt Mikrokerben, die bei dynamisch belasteten Bauteilen die Ermüdungsfestigkeit reduzieren können. Und sie verändert die lokale Oberflächentopologie so, dass nachfolgende Passivierungs- oder Elektropolierschritte den Kontrast reduzieren oder die Vertiefung auffüllen können – die Endprüfung muss daher nach der vollständigen Oberflächenbehandlung erfolgen.

**Welches Verfahren wann passt.**

Für medizintechnische Implantate ist die Anlassbeschriftung fast immer die erste Wahl, weil die Biokompatibilität und die Korrosionsbeständigkeit der Oberfläche nicht beeinträchtigt werden. Für Luftfahrt-Strukturbauteile und für Industrieteile wird oft die Direktbeschriftung bevorzugt, weil der höhere Kontrast die maschinelle Lesbarkeit verbessert. Eine wichtige Engineering-Realität: Die Verfahrenswahl muss vor der Definition des RFQ festgelegt werden, weil die Position der Beschriftung, die Aufspannung des Bauteils und die Reihenfolge der Bearbeitungsschritte alle aufeinander abgestimmt sein müssen.

---

## 2. DataMatrix nach GS1 und ISO/IEC 16022: Aufbau, Lesbarkeit und Inspektionspraxis

Der GS1-DataMatrix-Code ist der Standard für die UDI-Kennzeichnung (Unique Device Identification) von Medizinprodukten. Die Norm ISO/IEC 16022 definiert die allgemeine Spezifikation des DataMatrix-Codes; die GS1-Healthcare-Spezifikation definiert die Anwendung für Medizinprodukte.

**Aufbau eines DataMatrix-Codes.**

Ein DataMatrix-Code besteht aus einer quadratischen oder rechteckigen Matrix aus schwarzen und weißen Modulen (typisch 8×8 bis 144×144, je nach Datenmenge). Jeder Code enthält:

- **Finder-Pattern** – die L-förmige Umrandung, die dem Lesegerät die Orientierung des Codes angibt
- **Timing-Pattern** – die alternierenden schwarz-weißen Module an der gegenüberliegenden Seite, die die Spaltenanzahl kodieren
- **Datenbereich** – die eigentlichen Nutzdaten, einschließlich Fehlerkorrektur nach Reed-Solomon-Algorithmus
- **Quiet Zone** – ein einmodulbreiter Rand aus unbedruckter Fläche, der für die Lesegerät-Erkennung erforderlich ist

Für GS1-Healthcare enthält der Datenbereich die folgenden Elemente:

- **Application Identifier (AI)** – standardisierte numerische Codes, die dem Lesegerät die Art der folgenden Daten angeben (z. B. AI 01 für GTIN, AI 10 für Charge, AI 17 für Verfallsdatum, AI 21 für Seriennummer)
- **GTIN (Global Trade Item Number)** – die eindeutige Produktidentifikation, 14 Stellen numerisch
- **Chargennummer oder Seriennummer** – je nach Klassifizierung des Produkts (AI 10 für Charge, AI 21 für Seriennummer)
- **Verfallsdatum** – bei sterilen Produkten mit begrenzter Haltbarkeit (AI 17)
- **Herstellungsdatum** – optional, AI 11

Die GS1-Spezifikation für Medizinprodukte verlangt zusätzlich einen **Application Identifier 7100–7195** für die nationale Produktnummer (z. B. NHRN in den USA, Basis-UDI in der EU). Für die EU-MDR-Kennzeichnung ist die Basic UDI-DI der zentrale Identifikator, der die Produktfamilie kennzeichnet.

**Lesbarkeit und Inspektionspraxis.**

Die Lesbarkeit eines DataMatrix-Codes wird durch den **Verifikations-Score nach ISO/IEC 15415** (oder AIM DPM-1 für Direktmarkierung) gemessen. Dieser Score setzt sich aus mehreren Einzelwerten zusammen, die von A (sehr gut) bis F (sehr schlecht) reichen. Für medizintechnische Anwendungen wird typisch ein **Gesamt-Score von C oder besser** verlangt; für sicherheitskritische Anwendungen (Implantate, lebenserhaltende Geräte) oft ein **Gesamt-Score von B oder besser**.

Die Mindestgröße des DataMatrix-Codes hängt von der verfügbaren Bauteilfläche ab; in der Praxis werden Codes zwischen 2×2 mm und 6×6 mm verwendet. Die Modulgröße (Größe eines einzelnen schwarz/weißen Moduls) liegt typisch zwischen 100 und 250 µm.

Eine kritische Audit-Realität: Die Verifikations-Messung muss mit einem kalibrierten Verifikationsgerät erfolgen. Viele mittelständische Titan-Bearbeiter haben kein eigenes Verifikationsgerät und nutzen externe Dienstleister oder einfache Lesegeräte, die nur die Lesbarkeit prüfen, aber nicht den normativen Score. Die FDA-Auditoren und Benannte Stellen in der EU akzeptieren nur normgerechte Verifikationsberichte mit kalibriertem Gerät.

---

## 3. UDI-Konformität nach EU-MDR und FDA 21 CFR 830

Die Unique Device Identification (UDI) ist die weltweit eingeführte Pflichtkennzeichnung für Medizinprodukte. In der Europäischen Union regelt die Medical Device Regulation (MDR, EU 2017/745) die UDI-Pflicht; in den USA die FDA 21 CFR 830.

**Was die EU-MDR für Titan-Implantate verlangt.**

Die EU-MDR verlangt für jedes Medizinprodukt eine UDI, die aus zwei Teilen besteht: der UDI-DI (Device Identifier, Produktidentifikation) und der UDI-PI (Production Identifier, Produktionsidentifikation). Die UDI-DI ist die GTIN oder ein GS1-konformer Produkt-Identifier, der für jede Produktvariante einmalig vergeben wird. Die UDI-PI enthält die produktionsspezifischen Daten (Charge, Seriennummer, Verfallsdatum) und wird auf jedem einzelnen Bauteil oder jeder Verpackungseinheit angebracht.

Für die UDI-Trägerformate sind in der EU die folgenden Codes zulässig:

- **GS1 DataMatrix** (für die direkte Bauteilbeschriftung und für die Verpackung)
- **GS1-128** (linearer Barcode für die logistische Kennzeichnung)
- **HIBC-Code** (Health Industry Business Communications Council, alternativer Standard)

Die MDR verlangt weiterhin, dass die UDI in einer **UDI-Datenbank (EUDAMED)** registriert wird. Die Registrierung muss vor dem Inverkehrbringen des Produkts erfolgen und enthält die UDI-DI, die Produktklassifizierung, die Basic UDI-DI und die zertifizierende Benannte Stelle.

**Was die FDA 21 CFR 830 verlangt.**

Die FDA-Regulierung 21 CFR Part 830 ist konzeptionell ähnlich, verwendet aber eine eigene Terminologie: das „Device Identifier" (DI) entspricht der EU-UDI-DI, das „Production Identifier" (PI) entspricht der EU-UDI-PI. Die FDA akzeptiert die gleichen Trägerformate wie die EU (GS1 DataMatrix, GS1-128, HIBC) und verwendet die **Global Unique Device Identification Database (GUDID)** als zentrale Registrierungsdatenbank.

Die FDA-Zulassung verlangt zusätzlich einen **Labeler Code**, der den Hersteller oder Labeler identifiziert. Dieser Code wird von der FDA zugewiesen und ist Teil des FDA-UDI-Trägers.

**Pflichtinhalte auf dem Bauteil selbst.**

Auf dem direkt gekennzeichneten Titanbauteil (das sogenannte "Direct Part Marking", DPM) muss mindestens die UDI-DI erscheinen, je nach Klassifizierung des Produkts zusätzlich die UDI-PI. Bei Implantaten der Klasse III (z. B. Hüftendoprothesen, Wirbelsäulenimplantate) muss die UDI-DI und die Seriennummer auf jedem Bauteil direkt gekennzeichnet sein, nicht nur auf der Verpackung. Bei Instrumenten der Klasse I (z. B. chirurgische Pinzetten) genügt oft die Verpackungskennzeichnung.

**Audit-Praxis bei UDI-Verstößen.**

In der EU sind die häufigsten UDI-Audit-Befunde: fehlender oder falscher AI-Code im DataMatrix, falsche GTIN-Zuordnung, fehlende EUDAMED-Registrierung, oder eine unzureichende Verifikations-Dokumentation. Die Benannten Stellen (z. B. TÜV Süd, TÜV Rheinland, DEKRA) prüfen die UDI-Konformität als Teil des ISO-13485-Audits und der MDR-Zertifizierung.

---

## 4. Rückverfolgbarkeit nach ISO 13485: Chargen- und Bauteil-Dokumentation

Die ISO-13485-Norm verlangt eine lückenlose Rückverfolgbarkeit für Medizinprodukte. Die Anforderungen sind in Abschnitt 7.5.8 (Identification) und 7.5.9 (Traceability) der Norm definiert.

**Was die Norm konkret verlangt.**

Die ISO 13485 verlangt die folgenden Elemente:

- **Lückenlose Identifikation** – jedes Bauteil muss von der Wareneingangsprüfung bis zum Warenausgang identifizierbar sein
- **Chargen-Rückverfolgbarkeit** – die Identifikation jeder Charge und die Zuordnung zu den verwendeten Rohstoff-Chargen (insbesondere bei Titan: Schmelze, Halbzeug-Charge, Wärmebehandlungs-Charge)
- **Bauteil-Rückverfolgbarkeit** – bei Implantaten und Instrumenten mit Seriennummer muss jede Seriennummer bis zum Bauteil-Code zurückverfolgbar sein
- **Aufzeichnungen über den Produktionsprozess** – Datum, Mitarbeiter, Maschine, Prozessparameter für jedes Bauteil

Eine Titan-Implantat-Rückverfolgbarkeitskette enthält typischerweise die folgenden Stationen:

- **Wareneingang** – Schmelzen-Nummer, Zertifikat nach EN 10204-3.1, Halbzeug-Charge
- **Bearbeitung** – CNC-Programmversion, Maschine, Spannvorrichtung, Werkzeug, Bediener, Datum
- **Oberflächenbehandlung** – Passivierungscharge, Elektropoliercharge, Eloxiercharge (falls zutreffend)
- **Laserbeschriftung** – Markierprogramm, Markiergerät, Verifikations-Score
- **Reinigung** – Reinigungscharge, Reinstwasser-Leitfähigkeit
- **Sterilisation** – Sterilisationscharge, Indikator-Streifen (falls zutreffend)
- **Verpackung** – Verpackungscharge, Chargen-Nummer, Verfallsdatum
- **Warenausgang** – Auslieferdatum, Empfänger, Charge

**Die Audit-Praxis für Titan-Bauteile.**

ISO-13485-Auditoren prüfen die Rückverfolgbarkeit typischerweise durch eine **Stichprobe**: Sie wählen ein einzelnes Bauteil aus dem Lager und verlangen die lückenlose Dokumentation aller Produktionsschritte zurück bis zum Rohmaterial-Zertifikat. Wenn einer der Schritte fehlt oder unzureichend dokumentiert ist, ist das eine schwere Audit-Beanstandung.

Die Titan-spezifische Audit-Realität ist oft die Lücke zwischen dem Materialzertifikat und dem ersten Bearbeitungsschritt. Viele mittelständische Bearbeiter dokumentieren das Materialzertifikat als Wissen im ERP-System, aber die Verknüpfung zur ersten Bearbeitungscharge fehlt – das Bauteil kann nach der Bearbeitung nicht mehr eindeutig der ursprünglichen Schmelze zugeordnet werden. Die Folge ist eine Audit-Beanstandung wegen unzureichender Materialrückverfolgbarkeit.

Die Material- und Werkstoffgrundlagen für die Rückverfolgbarkeit sind im [Titan Güteklassen und Normen-Vergleichsartikel](/de/blog/titan-gueteklassen-normen-ams-astm-vergleich/) zusammengefasst. Die Biokompatibilität der Medizintechnik-Titanlegierungen ist im [Medizintechnik-Titan Grade 23 Artikel](/de/blog/medizintechnik-titan-grade-23-ta6v-eli-iso-5832-1/) im Detail dargestellt. Die für die Laserbeschriftung notwendige Oberflächenvorbehandlung ist im [Passivieren und Elektropolieren-Artikel](/de/blog/passivieren-elektropolieren-titan-ams-4944/) dieses Clusters erläutert.

---

## 5. Verfahrenswahl in Medizintechnik, Luftfahrt und Serienfertigung

Die Wahl zwischen Anlassbeschriftung und Direktbeschriftung, die Wahl des Codeformats und der Verifikationsstrategie wird in der Beschaffungspraxis durch vier Engineering-Kriterien bestimmt: die geforderte Kontrastqualität, die nachfolgende Oberflächenbehandlung, die normativen Anforderungen und die Stückzahl.

**Medizintechnik (Klasse III Implantate).**

Für Implantate der Klasse III (Hüftendoprothesen, Wirbelsäulenimplantate, Knieendoprothesen) ist die Anlassbeschriftung der Standard. Sie erhält die Biokompatibilität der Oberfläche, der Kontrast reicht für die GS1-DataMatrix-Lesbarkeit aus, und die Beschriftung übersteht die nachfolgende Passivierung und Sterilisation ohne Schaden. Die Modulgröße wird typisch auf 150–200 µm gesetzt, der Code ist 3×3 bis 4×4 mm groß. Der Verifikations-Score nach AIM DPM-1 muss B oder besser sein.

**Luftfahrt (Strukturbauteile, sicherheitskritische Komponenten).**

Für Luftfahrtbauteile ist die Direktbeschriftung häufiger, weil der höhere Kontrast die Lesbarkeit auch unter schwierigen Bedingungen (Öl, Schmutz, Beschädigung) verbessert. Die Anlassbeschriftung wird bei sicherheitskritischen Bauteilen eingesetzt, deren Ermüdungsfestigkeit nicht durch die Beschriftung beeinträchtigt werden soll. Die einschlägige Norm ist AS9132 für DataMatrix-Laserbeschriftung in der Luftfahrt. Die Modulgröße wird typisch auf 200–250 µm gesetzt; der Code ist 4×4 bis 6×6 mm groß.

**Industrielle Serienfertigung.**

Für industrielle Serienfertigung (z. B. Titankomponenten in der chemischen Verfahrenstechnik) ist die Wahl weniger normativ eingeschränkt; oft wird die Direktbeschriftung wegen der einfacheren Lesbarkeit gewählt. Die Stückzahl bestimmt die Investition in eine automatisierte Beschriftungszelle; ab etwa 5.000 Stück pro Jahr amortisiert sich die Investition in eine integrierte Markier- und Verifikationsstation typisch innerhalb von 18 Monaten.

**Was die RFQ-Vorbereitung leisten muss.**

Eine RFQ für lasermarkierte Titanbauteile muss mindestens die folgenden Punkte spezifizieren:

- **Verfahren** – Anlassbeschriftung oder Direktbeschriftung
- **Codeformat** – GS1 DataMatrix oder GS1-128 oder HIBC
- **Pflichtinhalte** – AI-Codes, GTIN, Seriennummer, Charge
- **Verifikations-Anforderung** – ISO/IEC 15415 oder AIM DPM-1, Mindest-Score
- **Position und Größe des Codes** – mit Skizze auf der Bauteilzeichnung
- **Reihenfolge im Fertigungsprozess** – vor oder nach der Oberflächenbehandlung
- **Dokumentation** – Verifikations-Bericht pro Charge, Datenspeicherung

Eine unvollständige RFQ-Spezifikation führt häufig zu Mehrfach-Iterationen in der Angebotsphase und zu Nachforderungen in der Audit-Praxis. Die Erfahrung zeigt, dass eine vollständige UDI-RFQ die Angebotszeit um 30–50 % verkürzt.

**Tabelle 1: Verfahrensvergleich Anlassbeschriftung vs. Direktbeschriftung auf Titan**

| Kriterium | Anlassbeschriftung | Direktbeschriftung |
|---|---|---|
| **Physik** | Lokale Oxidation, kein Materialabtrag | Lokale Materialablation |
| **Kontrastverhältnis** | 3:1 bis 5:1 | 5:1 bis 10:1 |
| **Oberflächenveränderung** | Keine Vertiefung, Oxidschicht 50–200 nm | Vertiefung 20–100 µm |
| **Biokompatibilität** | Vollständig erhalten | Lokal verändert, je nach Anwendung |
| **Ermüdungsfestigkeit** | Nicht relevant | Reduziert bei dynamisch belasteten Bauteilen |
| **Passivierungs-Beständigkeit** | Sehr gut (Schicht wird nicht abgelöst) | Reduziert, Vertiefung wird teils aufgefüllt |
| **Codeformat-Kompatibilität** | GS1 DataMatrix, GS1-128, HIBC | GS1 DataMatrix, GS1-128, HIBC |
| **Maschinenlesbarkeit** | Standard | Hoch |
| **Eignung Medizintechnik** | Standard | Selektiv |
| **Eignung Luftfahrt** | Selektiv | Häufig |
| **Investitionskosten Markiergerät** | Mittel (15–60 k€) | Mittel bis hoch (25–80 k€) |
| **Audit-Risiko bei minderwertiger Umsetzung** | Mittel (Kontrast-Qualität) | Hoch (Kerbwirkung) |

*Quelle: GS1 General Specifications, AIM DPM-1, ISO/IEC 15415, ISO/IEC 16022, branchenübliche Praxis aus DACH-Medizintechnik-Zulieferung. Tabelle zu Vergleichszwecken erstellt.*

---

## Siehe auch

Die lasergestützte Rückverfolgbarkeit von Titanbauteilen steht am Ende der Fertigungs- und Dokumentationskette. Die folgenden Artikel dieses Clusters stellen die Bezüge zur Medizintechnik-Konformität, zur Oberflächenvorbehandlung und zur messenden Qualitätssicherung her:

- **Pillar des Clusters:** [Der ultimative Leitfaden zur Titanverarbeitung](/de/blog/ultimative-leitfaden-titanverarbeitung/) — verbindet die Laserbeschriftung mit der Werkstoffwahl, der CNC-Präzisionsfertigung, der Passivierung und der 3D-KMG-Messtechnik und liefert die übergeordnete Audit-Vorbereitung für AS9100 und ISO 13485.
- **Implantat-Konformität und Schmelzrückverfolgbarkeit:** [Medizintechnik-Titan Grade 23 (Ti-6Al-4V ELI) nach ISO 5832-1](/de/blog/medizintechnik-titan-grade-23-ta6v-eli-iso-5832-1/) — liefert die normativen Grundlagen der hier beschriebenen ISO-13485-Rückverfolgbarkeitskette und macht nachvollziehbar, welche UDI-Pflichtinhalte für Klasse-IIb/III-Implantate verbindlich sind.
- **Kontrast-Verifikation per 3D-KMG:** [3D-Koordinatenmesstechnik in der Titanverarbeitung (Zeiss Scanning-Tastkopf)](/de/blog/3d-koordinatenmesstechnik-titan-zeiss-scanning-tastkopf/) — schließt die hier behandelte DataMatrix-Verifikation an die Messunsicherheit nach DIN EN ISO 10360 und die Form-/Lagetoleranzen nach ISO 1101 an und macht die Schnittstelle zwischen Laserkennzeichnung und taktiler/optischer Qualitätsprüfung messbar.

---

## Häufig gestellte Fragen zur Laserbeschriftung und UDI-Kennzeichnung von Titan

**Was ist der Unterschied zwischen Anlassbeschriftung und Direktbeschriftung?**
Die Anlassbeschriftung erzeugt die dunkle Markierung durch lokale Oxidation der TiO₂-Schicht, ohne Material abzutragen. Die Direktbeschriftung trägt Material ab und erzeugt eine Vertiefung mit höherem Kontrast, aber mit möglicher Beeinträchtigung der Biokompatibilität und der Ermüdungsfestigkeit.

**Welches Codeformat ist für UDI am weitesten verbreitet?**
GS1 DataMatrix ist der weltweit dominierende Standard für die direkte Bauteilbeschriftung von Medizinprodukten. Alternativ werden GS1-128 (linearer Barcode) für die logistische Kennzeichnung und HIBC für bestimmte Branchen verwendet.

**Welche Modulgröße ist für Titan-Bauteile optimal?**
150–200 µm für medizintechnische Implantate (kleine Bauteilflächen), 200–250 µm für Luftfahrtbauteile. Die Modulgröße muss auf das Lesegerät und den Verifikations-Score abgestimmt sein.

**Muss die UDI auf dem Bauteil selbst angebracht werden?**
Bei Implantaten der Klasse III ja – die UDI-DI und die Seriennummer müssen direkt auf dem Bauteil angebracht sein. Bei Produkten der Klasse I und IIa genügt oft die Verpackungskennzeichnung.

**Wie lange dauert eine Laserbeschriftung pro Bauteil?**
Bei kleineren Codes (2×2 bis 3×3 mm) etwa 1–3 Sekunden pro Code; bei größeren Codes (5×5 bis 6×6 mm) etwa 5–10 Sekunden. Die Taktzeit ist auch von der Markierstrategie abhängig (On-the-fly-Beschriftung oder Stop-and-Go).

**Welche Laser werden für die Titan-Beschriftung bevorzugt?**
Faserlaser (1,07 µm Wellenlänge) sind Stand der Technik. Sie haben eine hohe Absorption in Titan, eine kompakte Bauform und sind wartungsarm. CO₂-Laser (10,6 µm) werden wegen der schlechteren Absorption in Titan seltener verwendet.

**Welche Oberflächenvorbereitung ist vor der Laserbeschriftung nötig?**
Die Oberfläche sollte sauber, trocken und frei von Passivierungs- oder Polier-Rückständen sein. Die Laserbeschriftung kann vor oder nach der Passivierung erfolgen; bei Anlassbeschriftung nach der Passivierung verstärkt sich der Kontrast, bei Direktbeschriftung wird die Vertiefung teils aufgefüllt.

**Wie wird der Verifikations-Score gemessen?**
Mit einem kalibrierten Verifikationsgerät nach ISO/IEC 15415 oder AIM DPM-1. Das Gerät misst den Kontrast, die Modulgleichmäßigkeit, die Lesbarkeit und den Fehlerkorrektur-Aufwand. Der Gesamt-Score wird in einer Note A bis F angegeben.

---

## Nächste Schritte

Wenn Sie ein Titan-Bauteil mit Laserbeschriftung und UDI-konformer Rückverfolgbarkeit fertigen möchten, können wir Ihnen folgende Unterlagen und Dienstleistungen zur Verfügung stellen:

- Eine RFQ-Checkliste „Laserbeschriftung + UDI" für medizintechnische Titan-Bauteile
- Eine Verfahrensempfehlung Anlassbeschriftung vs. Direktbeschriftung für Ihren spezifischen Anwendungsfall
- Eine Beratung zur GS1-Datenmatrix-Codestruktur und EUDAMED-Registrierung
- Eine Prozessbeschreibung „Laserbeschriftung → Passivierung → Verifikation" mit Audit-Checkliste
- Eine Kostenschätzung pro Bauteilcharge inkl. Verifikations-Dokumentation

Senden Sie Ihre Anfrage über unser [RFQ-Portal](/de/rfq/) oder fordern Sie eine erste beratende Vorerstberatung an. Wir antworten üblicherweise innerhalb eines Werktags mit einer Einschätzung zu Verfahrenswahl, Verifikations-Aufwand und voraussichtlichem Lieferrahmen.