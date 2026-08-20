---
title: "3D-Koordinatenmesstechnik in der Titanverarbeitung: Zeiss Scanning-Tastkopf, taktil vs. optisch und Messunsicherheit nach DIN EN ISO 10360"
description: "Engineering-Leitfaden zur 3D-Koordinatenmesstechnik für Titan-Bauteile: Zeiss Koordinatenmessgeräte mit Scanning-Tastkopf vs. Bildverarbeitungs-KMG, taktiler und optischer Messverfahren, Form- und Lagetoleranzen nach ISO 1101, Messunsicherheit nach DIN EN ISO 10360, Rückführbarkeit auf nationale Normale, Integration in CNC-Fertigungslinien und Maßnahmenketten. Mit Schwerpunkt auf Titan-spezifische Mess-Strategien, Luftfahrt- und Medizintechnik-Anforderungen."
pubDate: 2026-08-27T10:00:00.000+08:00
author: "Boze Titanium Manufacturing Center"
category: "Titan-Messtechnik und Qualitätssicherung"
tags: ["Zeiss 3D-Koordinatenmessgerät", "Scanning-Tastkopf Titan", "Bildverarbeitung KMG", "DIN EN ISO 10360 Titan", "Form- und Lagetoleranzen ISO 1101", "taktile Messung Titan", "optische Messung Titan", "Messraum Titan"]
coverImage: "/uploads/blog-titanium-cnc-tolerance-guide-engineering-specifications-cover.jpg"
coverImageAlt: "Zeiss Koordinatenmessgerät mit Scanning-Tastkopf bei der Titan-Bauteil-Prüfung – Symbol für hochgenaue 3D-Koordinatenmesstechnik"
featured: false
lang: "de"
originalSlug: "3d-koordinatenmesstechnik-titan-zeiss-scanning-tastkopf"
---

## Zusammenfassung für Einkauf, Messtechnik und Qualitätssicherung

Die 3D-Koordinatenmesstechnik ist die zentrale Prüfmethode für Titan-Bauteile mit engen Form- und Lagetoleranzen nach ISO 1101. In der DACH-Industrie dominieren Anlagen von Zeiss, Mitutoyo, Renishaw und Wenzel; Zeiss-Koordinatenmessgeräte mit Scanning-Tastkopf sind heute der Standard für mittelgroße Titan-Strukturbauteile und medizintechnische Implantate. Die Verfahrenswahl zwischen taktiler Scanning-Messung und optischer Bildverarbeitung wird durch vier Engineering-Kriterien bestimmt: das erforderliche Messvolumen, die geforderte Messunsicherheit, die geometrische Zugänglichkeit der Messpunkte und die Bauteilchargen. Dieser Artikel erklärt die Funktionsweise beider Verfahren, die Kalibrier- und Rückführungspraxis nach DIN EN ISO 10360, die typischen Kennwerte für Titan-Anwendungen und die Integration in CNC-Fertigungslinien. Er richtet sich an Messtechniker, Qualitätssicherungsingenieure und Einkaufsleiter, die Titanbauteile in Luftfahrt, Medizintechnik oder Sondermaschinenbau verantworten und Messkampagnen definieren oder bewerten müssen.

---

## Inhaltsverzeichnis

- Abschnitt 1 — KMG-Grundlagen: Taktile Scanning-Messung, optische Messung und Bildverarbeitung im Vergleich
- Abschnitt 2 — Zeiss Scanning-Tastkopf: Funktionsprinzip und Kennwerte
- Abschnitt 3 — Bildverarbeitungs-KMG: Einsatzbereiche und Grenzen bei Titan
- Abschnitt 4 — Messunsicherheit und Rückführbarkeit nach DIN EN ISO 10360
- Abschnitt 5 — Integration in die Titan-Fertigung: CNC-KMG-Kopplung und Maßnahmenketten

---

## 1. KMG-Grundlagen: Taktile Scanning-Messung, optische Messung und Bildverarbeitung im Vergleich

Ein Koordinatenmessgerät (KMG, englisch Coordinate Measuring Machine, CMM) bestimmt die räumliche Position eines Tastelements relativ zum Bauteil. Die gemessenen Punkte werden im Maschinenkoordinatensystem registriert und durch mathematische Auswertung (Form- und Lagetoleranzen, CAD-Vergleich, Beste-Passung) zu den geforderten Toleranzwerten nach ISO 1101 verrechnet. Die drei dominierenden Messverfahren in der Titan-Bearbeitung sind die taktile Einzelpunktmessung, die taktile Scanning-Messung und die optische Bildverarbeitung.

**Taktile Einzelpunktmessung.**

Bei der taktilen Einzelpunktmessung wird ein rubin- oder silizium-nitrid-bestückter Taststift punktweise an das Bauteil geführt; jede Taststift-Berührung liefert einen 3D-Punkt. Das Verfahren ist robust und genau, aber relativ langsam – typisch 50–200 Punkte pro Minute. Die Einzelpunktmessung wird bevorzugt für einfache Geometrien (Bohrungen, Ebenen, Zylinder) und für die Maschinenabnahme eingesetzt.

**Taktile Scanning-Messung.**

Bei der taktilen Scanning-Messung wird der Taststift kontinuierlich mit hoher Geschwindigkeit (typisch 5–50 mm/s) über die Bauteiloberfläche geführt; ein hochfrequenter Abtastsensor (typisch 1.000–10.000 Punkte pro Sekunde) registriert die Taststift-Auslenkung in mehreren Achsen. Das Ergebnis ist eine dichte Punktewolke mit typisch 100–2.000 Punkten pro Quadratmillimeter, die eine exakte Erfassung der Bauteilgeometrie ermöglicht. Die Messzeit reduziert sich im Vergleich zur Einzelpunktmessung um Faktor 10–100, die Messunsicherheit bleibt vergleichbar oder ist durch Mittelung sogar besser.

**Optische Bildverarbeitung.**

Bei der optischen Bildverarbeitung wird das Bauteil mit einer Kamera und einer strukturierten Beleuchtung (Linienprojektor, Streifenprojektor) erfasst; die Triangulation zwischen Kamera, Projektor und Bauteiloberfläche liefert eine 3D-Punktewolke. Das Verfahren ist berührungslos, schnell (typisch 100.000–1.000.000 Punkte pro Sekunde) und gut geeignet für weiche oder temperaturempfindliche Oberflächen. Bei Titan ist die optische Messung wegen der geringen optischen Absorption und der relativ glatten Oberfläche grundsätzlich gut einsetzbar, aber durch die spiegelnden Eigenschaften der TiO₂-Schicht technisch anspruchsvoll.

**Welches Verfahren wann passt.**

Für Titan-Strukturbauteile in der Luftfahrt (Wandstärke 2–20 mm, Toleranz ±0,1 bis ±0,5 mm) ist die taktile Scanning-Messung der Standard. Für medizintechnische Implantate (kleinere Bauteile, Toleranz ±0,01 bis ±0,05 mm) wird sowohl taktil als auch optisch gemessen, je nach Bauteilgeometrie. Für DMLS-Bauteile mit komplexen Innenstrukturen oder Gitterstrukturen ist die optische Messung oft die einzige praktikable Methode, weil die Taststifte die feinen Strukturen nicht erreichen.

Die materialtechnischen Grundlagen für die Titan-Güteklassen, deren Toleranzen mit KMG geprüft werden, sind im [Titan Güteklassen und Normen-Vergleichsartikel](/de/blog/titan-gueteklassen-normen-ams-astm-vergleich/) zusammengefasst.

---

## 2. Zeiss Scanning-Tastkopf: Funktionsprinzip und Kennwerte

Der Zeiss Scanning-Tastkopf (in der Industrie als „VAST", „VAST gold" oder „VAXT" bezeichnet) ist das am weitesten verbreitete Scanning-System für mittelgroße bis große KMG-Anlagen. Zeiss entwickelt die Scanning-Technologie seit den 1990er Jahren kontinuierlich weiter; die aktuelle Generation (VAST gold / VAXT) arbeitet mit einem piezo-elektrisch vorgespannten Taststift-System, das die Taststift-Auslenkung in Echtzeit misst und in das Maschinenkoordinatensystem einrechnet.

**Aufbau und Funktionsprinzip.**

Ein Zeiss Scanning-Tastkopf besteht aus den folgenden Hauptkomponenten:

- **Taststift** – Rubin- oder Silizium-Nitrid-Kugel mit typisch 2–8 mm Durchmesser, montiert an einem Taststifthalter aus Stahl oder Titan
- **Sensorik** – Piezo-elektrische oder induktive Sensoren messen die Taststift-Auslenkung in X, Y und Z mit einer Auflösung im Bereich 0,1 µm
- **Antrieb** – Servomotorisch angetriebene Achsen, die den Taststift mit konstanter Scangeschwindigkeit (5–50 mm/s) über die Oberfläche führen
- **Kalibrierblock** – ein Kalibriernormal (typisch eine Kugel mit definiertem Durchmesser und Form), das bei der Maschinen-Kalibrierung und bei jedem Taststift-Wechsel verwendet wird

Die Kalibrierung des Scanning-Tastkopfs ist ein entscheidender Schritt für die Messgenauigkeit. Bei jedem Taststift-Wechsel muss der Taststift-Durchmesser, die Taststift-Form und die Taststift-Auslenkungs-Charakteristik neu kalibriert werden. Die Kalibrierung wird in der Regel mit einer Kalibrierkugel ausgeführt, die in mehreren Positionen und mit verschiedenen Taststift-Winkeln angefahren wird.

**Kennwerte und Spezifikationen.**

Die relevanten Kennwerte eines Zeiss-Scanning-Systems sind:

- **Taststift-Durchmesser** – 2 mm Standard, 1 mm oder 0,5 mm für kleine Geometrien. Je kleiner der Taststift, desto höher die laterale Auflösung, aber desto empfindlicher gegen Verschmutzung und Beschädigung.
- **Scangeschwindigkeit** – 5–50 mm/s Standard, höhere Geschwindigkeiten (bis 100 mm/s) bei Zeiss Prismo Anlagen für Großbauteile
- **Punktrate** – 1.000–10.000 Punkte pro Sekunde, je nach Anlagenkonfiguration und Scangeschwindigkeit
- **Messunsicherheit** – typisch 2–6 µm (MPE_E nach DIN EN ISO 10360) für ein Zeiss Prismo oder Zeiss CenterMax mit VAST gold
- **Wiederholgenauigkeit** – typisch 1–2 µm bei ruhigter Umgebung

Die in der Industrie am häufigsten verwendeten Zeiss-Anlagen für Titan-Bauteile sind die Modelle Prismo (für Bauteile bis 1.200×1.600×1.000 mm), CenterMax (für Bauteile bis 700×1.000×400 mm) und die kompakteren Reihe für medizintechnische Implantate.

**Taststift-Wechsel und Taststift-Sets.**

In der Titan-Bearbeitung werden typischerweise Taststift-Sets mit mehreren Taststiften verschiedener Geometrien verwendet, um die optimale Kombination aus Zugänglichkeit und Messunsicherheit zu erreichen. Ein typisches Set enthält einen langen Taststift (für tiefe Bohrungen), einen kurzen Taststift (für Grundmaße), einen Winkel-Taststift (für Hinterschneidungen) und einen Stern-Taststift (für Mehrfach-Punkte). Die Auswahl und der Wechsel des Taststifts sind in der Audit-Praxis eine häufige Fehlerquelle, weil die Kalibrierung oft nicht konsequent für jeden Taststift dokumentiert wird.

---

## 3. Bildverarbeitungs-KMG: Einsatzbereiche und Grenzen bei Titan

Bildverarbeitungs-KMG (auch als „optische KMG" oder „video-CMM" bezeichnet) erfassen die Bauteilgeometrie durch Triangulation mit einer oder mehreren Kameras und einer strukturierten Beleuchtung. Die dominierenden Hersteller in der DACH-Industrie sind Zeiss (O-INSPECT), Werth (VideoCheck), Keyence und Mitutoyo (Quick Vision).

**Funktionsprinzip und Kennwerte.**

Ein Bildverarbeitungs-KMG besteht aus den folgenden Hauptkomponenten:

- **Kamera** – typisch eine CMOS-Kamera mit 5–20 Megapixel Auflösung, montiert an einem vertikalen Achsensystem
- **Beleuchtung** – ein LED-Ring oder eine LED-Kalotte mit strukturierter Beleuchtung (Hellfeld, Dunkelfeld, koaxial)
- **Objektive** – telezentrische Objektive mit konstanter Vergrößerung über das Messfeld
- **Auswertung** – Bildverarbeitungs-Algorithmen, die Kanten, Bohrungsmittelpunkte, Linien und andere Primitive aus dem Kamerabild extrahieren

Die typischen Kennwerte sind:

- **Messfeld** – 10×10 bis 200×200 mm pro Bildausschnitt; das gesamte Messfeld wird durch Verfahrbewegung der Kameras aufgebaut
- **Laterale Auflösung** – 1–5 µm, abhängig vom Objektiv und der Kameraauflösung
- **Tiefenauflösung** – 0,5–2 µm, abhängig von der Beleuchtung und der Oberflächenreflexion
- **Punktrate** – typisch 100.000–1.000.000 Punkte pro Sekunde bei 3D-Modus (Streifenprojektion)
- **Messunsicherheit** – typisch 1,5–4 µm (MPE_E nach DIN EN ISO 10360) für ein Zeiss O-INSPECT oder Werth VideoCheck

**Einsatzbereiche bei Titan.**

Bildverarbeitungs-KMG werden bei Titan bevorzugt für folgende Anwendungen eingesetzt:

- **Medizintechnische Implantate** – die kleinen Bauteile (oft unter 50 mm) lassen sich vollständig im Messfeld erfassen, die hohe laterale Auflösung ermöglicht die exakte Vermessung von Mikro-Strukturen
- **DMLS-Bauteile mit Gitterstrukturen** – die feinen Strukturen sind taktil nicht zugänglich, optische Messung ist oft die einzige praktikable Methode
- **Dünne Titanfolien** – die berührungslose Messung vermeidet Verformung der Folie durch die Taststift-Kraft
- **Kleine, präzise Bauteile** – Uhrenteile, Federn, Steckverbinder-Komponenten

**Grenzen der optischen Messung bei Titan.**

Die optische Messung hat bei Titan drei wesentliche Grenzen:

- **Spiegelnde Oberfläche** – die TiO₂-Schicht wirkt wie ein Spiegel; die strukturierte Beleuchtung wird reflektiert statt diffus gestreut. Die Folge sind Glanzlichter, die die Bildauswertung erschweren. Abhilfe schafft eine Mattierung der Oberfläche durch Beschichtung mit Mattierspray oder durch Aufrauen mit fehlendem Schmiergelp, was aber die Messung verändert.
- **Geometrische Zugänglichkeit** – Hinterschneidungen und tiefe Bohrungen sind mit optischer Messung nicht zugänglich; die Kamera „sieht" nur die direkt zugänglichen Flächen.
- **Transparente Oxidschicht** – die TiO₂-Schicht ist teils transparent für sichtbares Licht; die effektive Oberfläche kann von der geometrischen Oberfläche abweichen, was zu systematischen Messabweichungen führt.

Die Bildverarbeitungs-KMG sind deshalb für Titan nicht der Universalmessplatz, sondern eine wertvolle Ergänzung für spezielle Anwendungsfälle. Für die meisten Titan-Strukturbauteile bleibt die taktile Scanning-Messung das bevorzugende Verfahren.

---

## 4. Messunsicherheit und Rückführbarkeit nach DIN EN ISO 10360

Die Messunsicherheit ist die zentrale Kenngröße für jede Messung mit einem KMG. Die internationale Norm DIN EN ISO 10360 definiert die Prüfverfahren und die Angabe der Messunsicherheit für KMG.

**Die MPE-Werte nach DIN EN ISO 10360.**

Die Norm definiert mehrere Kennwerte für die Messunsicherheit:

- **MPE_E (Maximum Permissible Error)** – der maximale zulässige Längenmessfehler, angegeben in µm für eine bestimmte Messlänge. Typische Werte für Zeiss Prismo: 2,5–6 µm je nach Achslänge.
- **MPE_P (Maximum Permissible Error for Probing Error)** – der maximale zulässige Antastfehler, angegeben in µm. Typische Werte für Zeiss Prismo mit VAST gold: 2–4 µm.
- **MPE_L (Maximum Permissible Error for Length)** – die maximale zulässige Abweichung der Längenmessung. Wird für die Maschinenabnahme und die regelmäßige Überprüfung verwendet.

Die MPE-Werte werden vom Hersteller angegeben und durch eine Werksabnahme verifiziert; im Feldeinsatz werden sie durch regelmäßige Kalibrierung mit Normalen (z. B. Endmaße, Kugel-Stab-Normale) überprüft. Die typischen Kalibrierintervalle in der Industrie sind 6–12 Monate, je nach Anlagenintensität und Audit-Anforderungen.

**Rückführbarkeit auf nationale Normale.**

Die Rückführbarkeit ist die Kette von Vergleichsmessungen, die das Messergegerät mit dem nationalen Normal verbindet. In Deutschland ist die Physikalisch-Technische Bundesanstalt (PTB) das nationale Normal für Länge; die Kalibrierung mit Endmaßen oder mit Laser-Interferometern verbindet die KMG-Messung mit dem Normal.

In der Audit-Praxis wird die Rückführbarkeit durch zwei Dokumente nachgewiesen:

- **Kalibrierschein** – ausgestellt von einem akkreditierten Kalibrierlabor (z. B. PTB, DAkkS-akkreditierte Labore), mit dem MPE-Wert und der Messunsicherheit des Normals
- **Werksabnahmeprüfzeugnis** – ausgestellt vom KMG-Hersteller (z. B. Zeiss) bei der Auslieferung oder bei einer Wiederholungsprüfung, mit dem MPE-Wert und der Messunsicherheit des KMG

Eine ISO-13485- oder AS9100-Auditierung verlangt, dass beide Dokumente aktuell und aufeinander abgestimmt sind. Eine KMG-Anlage mit abgelaufenem Kalibrierschein oder mit einer Messunsicherheit, die nicht zur geforderten Bauteiltoleranz passt, ist nicht audit-konform.

**Die Frage der Messunsicherheit vs. Toleranz.**

In der industriellen Praxis wird die Messunsicherheit oft als „klein genug" angenommen, ohne sie explizit zur geforderten Bauteiltoleranz ins Verhältnis zu setzen. Die anerkannte Regel ist die **4:1- oder 10:1-Regel**: Die Messunsicherheit sollte 1/4 bis 1/10 der geforderten Toleranz betragen, um die Messung als „fähig" zu betrachten.

Für ein Titan-Bauteil mit einer Toleranz von ±0,05 mm (50 µm) bedeutet das eine maximal zulässige Messunsicherheit von 5–12 µm. Eine Zeiss Prismo mit MPE_E = 6 µm ist in diesem Fall gerade noch fähig; eine Zeiss CenterMax mit MPE_E = 4 µm ist komfortabel fähig. Für eine Toleranz von ±0,01 mm (10 µm) wird die Messunsicherheit kritisch – hier ist die optische Messung mit MPE_E = 1,5–3 µm oft die einzige fähige Option.

---

## 5. Integration in die Titan-Fertigung: CNC-KMG-Kopplung und Maßnahmenketten

Die 3D-Koordinatenmesstechnik ist heute nicht mehr ein isolierter Schritt nach der CNC-Bearbeitung, sondern ein integraler Bestandteil der Fertigungslinie. Die CNC-KMG-Kopplung erlaubt die direkte Rückführung der Messdaten in den CNC-Prozess und die statistische Prozesslenkung (SPC) der Maßhaltigkeit.

**Die CNC-KMG-Kopplung.**

Bei der CNC-KMG-Kopplung wird das Bauteil direkt auf der CNC-Maschine oder auf einer benachbarten Mess-Station gemessen; die Messdaten werden in Echtzeit an das CNC-System zurückgemeldet. Das CNC-System kann anschließend die Bearbeitungsparameter korrigieren (Werkzeugkorrekturen, Nullpunkt-Verschiebung) oder das Bauteil als „konform" oder „nachzubearbeiten" klassifizieren.

In der Titan-Bearbeitung wird die CNC-KMG-Kopplung vor allem in der Luftfahrt-Fertigung eingesetzt, wo die Maßhaltigkeit über mehrere hundert Teile pro Charge stabil sein muss. Die typische Anwendung ist die Kontrolle der Wandstärke und der Bohrungslage bei Strukturbauteilen; bei einer Abweichung von mehr als 0,02 mm wird das Bauteil automatisch zur Nachbearbeitung markiert.

Die CNC-KMG-Kopplung erfordert eine geeignete Spannvorrichtung, die auf der CNC-Maschine und auf dem KMG identisch ist; oft wird die gleiche Vorrichtung verwendet, um den Spann-Verzug zu eliminieren. Die CNC-KMG-Kopplung ist im [CNC-Präzisionszerspanung Titan-Artikel](/de/blog/cnc-praezisionszerspanung-titan-frasen-drehen-schleifen/) im Detail dargestellt. Die für die Maßhaltigkeit kritische Vorbehandlung ist im [Passivieren und Elektropolieren-Artikel](/de/blog/passivieren-elektropolieren-titan-ams-4944/) erläutert. Die Bearbeitung der Halbzeuge ist im [Additive Fertigung und Laserverfahren-Artikel](/de/blog/additive-fertigung-vs-laserschweissen-laserschneiden-titan/) zusammengefasst.

**Maßnahmenketten und Toleranzketten.**

In der Titan-Bearbeitung sind die Maßnahmenketten oft komplex: ein Bauteil kann in mehreren Schritten bearbeitet werden (Drehen, Fräsen, Schleifen, Passivieren), und jeder Schritt trägt eine eigene Toleranz bei. Die Gesamttoleranz am Ende ist die Wurzel-Summe der Einzelteleranzen (RSS-Wert, Root Sum of Squares).

Eine typische Maßnahmenkette für ein Titan-Luftfahrtbauteil:

1. Halbzeug-Toleranz (warmgewalzt oder geschmiedet): ±0,5 mm
2. CNC-Schruppen: ±0,2 mm
3. CNC-Schlichten: ±0,1 mm
4. Schleifen (falls zutreffend): ±0,05 mm
5. Passivieren/Eloxieren: keine signifikante Toleranzveränderung
6. Messen mit KMG: Messunsicherheit ±0,005 mm

Die resultierende Gesamt-Toleranz ist etwa ±0,25 mm bei RSS-Berechnung – das ist größer als die Zeichnungstoleranz von ±0,1 mm. Die Folge ist, dass die Maßnahmenkette durch die Auswahl der Halbzeug-Toleranz, der CNC-Bearbeitungsstrategie und der Schleifzugaben sorgfältig ausgelegt werden muss. Eine Massnahmenkette, die in einem Schritt bereits die halbe End-Toleranz aufbraucht, ist nicht audit-fähig.

**Tabelle 1: KMG-Verfahren im Vergleich — Taktil, Scanning, Optisch**

| Kriterium | Taktil (Einzelpunkt) | Taktil (Scanning, Zeiss VAST) | Optisch (Bildverarbeitung) |
|---|---|---|---|
| **Messverfahren** | Punkt-für-Punkt Tastung | Kontinuierliche Abtastung | Triangulation mit Kamera |
| **Punktrate (typisch)** | 50–200/min | 1.000–10.000/s | 100.000–1.000.000/s |
| **MPE_E (typisch)** | 2–5 µm | 2–6 µm | 1,5–4 µm |
| **Laterale Auflösung** | 0,5–2 mm (Punktabstand) | 50–500 µm (Punktabstand) | 1–5 µm (Pixelgröße) |
| **Berührungslos** | Nein (Tastkraft 0,1–1 N) | Nein (Tastkraft 0,05–0,2 N) | Ja |
| **Eignung Titan-Strukturbauteile** | Mittel (langsam) | Hoch (Standard) | Mittel (Spiegelung) |
| **Eignung Titan-Implantate** | Mittel | Hoch | Sehr hoch |
| **Eignung DMLS-Bauteile** | Eingeschränkt (Zugänglichkeit) | Mittel | Hoch (Gitterstrukturen) |
| **Eignung Titan-Folien** | Nicht geeignet | Eingeschränkt (Verformung) | Hoch |
| **Investitionskosten (Anlage)** | 50–150 k€ | 150–800 k€ | 80–400 k€ |
| **Audit-Risiko bei minderwertiger Umsetzung** | Mittel (Taststift-Verschleiß) | Mittel (Kalibrierung) | Hoch (Spiegelung) |

*Quelle: DIN EN ISO 10360, Zeiss Werksunterlagen Prismo/CenterMax/O-INSPECT, branchenübliche Praxis aus DACH-Luftfahrt und Medizintechnik. Tabelle zu Vergleichszwecken erstellt.*

---

## Siehe auch

Die 3D-Koordinatenmesstechnik steht am Ende der Titan-Fertigungskette und schließt die Schleife zwischen Bearbeitung, Beschriftung und Erstmusterfreigabe. Die folgenden Artikel dieses Clusters stellen die Bezüge zur CNC-Bearbeitung, zur Oberflächentechnik und zur rückverfolgbaren Bauteilbeschriftung her:

- **Pillar des Clusters:** [Der ultimative Leitfaden zur Titanverarbeitung](/de/blog/ultimative-leitfaden-titanverarbeitung/) — verbindet die hier beschriebene KMG-Messstrategie mit der Werkstoffauswahl, der CNC-Präzisionsfertigung und der Oberflächentechnik und liefert die übergeordnete Audit-Vorbereitung für AS9100 und ISO 13485.
- **CNC-KMG-Kopplung und Spanntechnik:** [CNC-Präzisionszerspanung von Titan (Fräsen, Drehen, Schleifen)](/de/blog/cnc-praezisionszerspanung-titan-frasen-drehen-schleifen/) — beschreibt die Spannvorrichtung, die auf CNC und KMG identisch sein muss, und die operativen Schnittstellen zwischen Bearbeitung und taktiler Scanning-Messung.
- **Oberflächenvorbehandlung für die Messung:** [DataMatrix-Laserbeschriftung und UDI-Rückverfolgbarkeit für Titanbauteile](/de/blog/datamatrix-laserbeschriftung-titan-rueckverfolgbarkeit-udi/) — erläutert die für die Mess-Stabilität kritische Oberflächenvorbehandlung und macht nachvollziehbar, welcher Kontrast nach Beizen → Passivierung → Laserkennzeichnung messbar bleibt.

---

## Häufig gestellte Fragen zur 3D-Koordinatenmesstechnik in der Titanverarbeitung

**Welches KMG-Verfahren ist für Titan am besten geeignet?**
Für Titan-Strukturbauteile die taktile Scanning-Messung (z. B. Zeiss Prismo mit VAST gold). Für medizintechnische Implantate eine Kombination aus taktil und optisch. Für DMLS-Bauteile mit Gitterstrukturen bevorzugt optisch (Bildverarbeitung mit Streifenprojektion).

**Was kostet eine Zeiss Prismo-Anlage?**
Eine neue Zeiss Prismo mit VAST gold und kompletter Ausstattung liegt typisch bei 400–800 k€. Eine gebrauchte oder generalüberholte Anlage ist bei 150–350 k€ erhältlich, oft mit kürzerer Werksgarantie.

**Wie oft muss ein KMG kalibriert werden?**
Die KMG-Anlage selbst wird durch den Hersteller kalibriert (Werksabnahmeprüfzeugnis). Im Feldeinsatz erfolgt eine regelmäßige Überprüfung mit Kalibriernormalen (Endmaße, Kugel-Stab) im Abstand von 6–12 Monaten. Bei intensivem Einsatz oder nach Taststift-Wechseln häufiger.

**Welche Messunsicherheit ist für Titan-Implantate erforderlich?**
Für Implantate der Klasse III (z. B. Hüftendoprothesen) ist eine Messunsicherheit von 2–5 µm typisch erforderlich. Für Strukturbauteile der Luftfahrt 5–10 µm. Für industrielle Komponenten 10–50 µm, je nach Toleranzangabe in der Zeichnung.

**Was ist der Unterschied zwischen MPE_E und MPE_P?**
MPE_E ist der maximale Längenmessfehler über die Messlänge (z. B. 5 µm bei 1.000 mm Achslänge). MPE_P ist der maximale Antastfehler (Fehler bei der Berührung des Taststifts mit dem Bauteil), typisch 2–4 µm.

**Wie wird die Taststift-Kalibrierung in der Audit-Praxis dokumentiert?**
Jeder Taststift-Wechsel wird mit Datum, Taststift-Identifikation, Kalibrierkugel-Position protokolliert. Die Aufzeichnung wird im QM-System abgelegt und ist Teil der Audit-Dokumentation. Fehlende Aufzeichnungen sind eine häufige Audit-Beanstandung.

**Kann ein KMG Titan-Bauteile mit komplexer Geometrie vollständig messen?**
Ja, mit modernen Scanning-Systemen und CAD-basierter Messprogrammierung. Die Zugänglichkeit wird durch Taststift-Auswahl und Mehrachsig-Scanning optimiert. Bei DMLS-Bauteilen mit Gitterstrukturen ist die optische Messung oft die einzige praktikable Methode.

**Was ist die typische Messzeit für ein Titan-Strukturbauteil?**
Für ein typisches Titan-Strukturbauteil mit 200–500 mm Abmessung und 50–150 Messpunkten liegt die Messzeit bei 5–20 Minuten mit taktiler Scanning-Messung. Mit optischer Messung 1–5 Minuten. Die Programmierzeit (Offline) beträgt 2–8 Stunden pro Bauteil.

---

## Nächste Schritte

Wenn Sie ein Titan-Bauteil mit 3D-Koordinatenmesstechnik prüfen oder eine Messkampagne für Titan-Bauteile definieren möchten, können wir Ihnen folgende Unterlagen und Dienstleistungen zur Verfügung stellen:

- Eine Verfahrensempfehlung Taktil vs. Optisch für Ihren spezifischen Anwendungsfall
- Eine Messunsicherheits-Berechnung nach DIN EN ISO 10360 (GUM-konform) für Ihre Toleranzvorgaben
- Eine RFQ-Checkliste „KMG-Messung Titan" mit Audit-relevanten Punkten
- Eine Programmierung Offline-Messprogramm (CALYPSO, Metrolog X, PC-DMIS)
- Eine Erstmusterprüfung (EMPB/PPAP) mit Messbericht und statistischer Auswertung

Senden Sie Ihre Anfrage über unser [RFQ-Portal](/de/rfq/) oder fordern Sie eine erste messtechnische Vorerstberatung an. Wir antworten üblicherweise innerhalb eines Werktags mit einer Einschätzung zu Verfahrenswahl, Messunsicherheit und voraussichtlichem Lieferrahmen.