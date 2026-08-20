---
title: "Additive Fertigung vs. Laserschweißen und Laserschneiden bei Titan: DMLS, Fügeverfahren und Wärmebehandlung im Vakuum"
description: "Engineering-Vergleich zwischen additiver Titanfertigung (DMLS), Laserschweißen und Laserschneiden. Mit Schwerpunkt auf Titan-Pulver-Spezifikationen nach ASTM/AMS, Schutzgasatmosphäre beim Schweißen, Verzugskontrolle, Schnittqualität und obligatorischer Vakuum-Wärmebehandlung. Entscheidungsmatrix für Luftfahrt, Medizintechnik und Sondermaschinenbau."
pubDate: 2026-08-24T10:00:00.000+08:00
author: "Boze Titanium Manufacturing Center"
category: "Titan-Additive-Fertigung und Laserverfahren"
tags: ["Titan additive Fertigung", "DMLS Titan", "3D-Druck Titan", "Laserschweißen Titan", "Laserschneiden Titan", "Wärmebehandlung Vakuum Titan", "Fügetechnik Titan", "Titan AMS 4943"]
coverImage: "/uploads/blog-titanium-additive-manufacturing-vs-cnc-machining-cover.jpg"
coverImageAlt: "DMLS-Anlage für Titan-Pulver mit Laserschweißprozess im Bauteil – Symbol für additive Fertigung und Laserverfahren bei Titan"
featured: false
lang: "de"
originalSlug: "additive-fertigung-vs-laserschweissen-laserschneiden-titan"
---

## Zusammenfassung für Einkauf, Verfahrenstechnik und Luftfahrt-Zulassung

Titan-Bauteile werden heute auf vier Wegen hergestellt: subtraktiv durch CNC-Fräsen oder -Drehen, additiv durch pulverbettbasiertes Laserstrahlschmelzen (DMLS, auch als LPBF oder Selective Laser Melting bekannt), durch Fügen mehrerer Halbzeuge mittels Laser- oder WIGschleifen und durch Laser- oder Wasserstrahlschneiden aus Blech, Platte oder Rohr. Jeder dieser Wege hat eigene physikalische Grenzen und eigene normative Vorgaben, die in der Beschaffungspraxis oft vermischt werden. Dieser Artikel ordnet die vier Verfahren entlang von drei Engineering-Fragen zueinander: Welche geometrische Komplexität rechtfertigt DMLS gegenüber CNC-Bearbeitung? Welche Fügeverfahren sind bei Titanbauteilen normativ zugelassen – und unter welchen Bedingungen? Wann ist Laserschneiden die wirtschaftlichste Formgebungsstufe vor der CNC-Bearbeitung? Er richtet sich an Einkaufsleiter, Verfahrenstechniker und Luftfahrt-Zulassungsingenieure im DACH-Raum, die Titanbauteile in additiver oder lasergekoppelter Fertigung verantworten. Im Mittelpunkt steht die Frage, wann DMLS, Laserschweißen und Laserschneiden nicht nur technisch möglich, sondern auch wirtschaftlich und normativ sinnvoll sind – ohne Vermarktung der additiven Fertigung als universelle Lösung.

---

## Inhaltsverzeichnis

- Abschnitt 1 — DMLS und Titan-Pulver: Werkstofftechnische Grundlagen
- Abschnitt 2 — Additive vs. subtraktiv: Wo DMLS die CNC-Bearbeitung ergänzt und wo nicht
- Abschnitt 3 — Laserschweißen von Titan: Nahtqualität, Schutzgas und Verzugskontrolle
- Abschnitt 4 — Laserschneiden und Hybridverfahren: Blech und Rohr
- Abschnitt 5 — Wärmebehandlung im Vakuum: Pflicht nach DMLS und nach dem Schweißen

---

## 1. DMLS und Titan-Pulver: Werkstofftechnische Grundlagen

Das pulverbettbasierte Laserstrahlschmelzen von Titan – im Englischen als „Direct Metal Laser Sintering" (DMLS), „Laser Powder Bed Fusion" (LPBF) oder schlicht „Titan-3D-Druck" bezeichnet – ist ein additives Verfahren, bei dem ein Laserstrahl Titan-Pulver schichtweise aufschmilzt und so ein Volumenbauteil aufbaut. Die Norm-Bezeichnung in ASTM/ISO ist F42 für additive Fertigung; die einschlägigen Werkstoffnormen sind ASTM F3055 für Ti-6Al-4V-Pulver und die ergänzenden Spezifikationen ASTM F3301 für Prozessparameter und ASTM F3475 für Pulver-Qualitätsmanagement.

**Die Pulverqualität entscheidet.**

Titan-Pulver für DMLS wird durch Gasverdüsung (typisch Argon) aus einer Titanschmelze hergestellt. Die Partikelgrößenverteilung liegt je nach Anbieter und Spezifikation zwischen 15 und 63 µm, mit einem Hauptanteil im Bereich 20–45 μm. Die chemische Zusammensetzung muss die Grenzwerte der Ti-6Al-4V-Norm einhalten, einschließlich der Sauerstoffobergrenze – und genau hier liegt eine häufige Fehlerquelle: Pulver, das wiederholt recycelt wird (was im DMLS-Prozess Stand der Technik ist), reichert Sauerstoff an, weil jeder Schmelzzyklus eine kleine Oxidation an der Pulveroberfläche hinterlässt. Nach 8–12 Recyclingszyklen erreicht das Pulver typischerweise die Sauerstoffobergrenze und muss ausgeschleust werden. Die Konsequenz für die Beschaffung: Wer DMLS-Titan bestellt, sollte die Pulver-Charge und die maximale Recycling-Zyklen-Anzahl im RFQ festhalten.

**Die einschlägigen AMS-Spezifikationen für DMLS-Titan:**

- **AMS 7010** – Ti-6Al-4V-Pulver für die additive Fertigung (ersetzt zunehmend die ältere AMS-Pulverklassifizierung)
- **AMS 7011** – Ti-6Al-4V-Bauteile aus DMLS, geglüht (entspricht dem Standard-Wärmebehandlungszustand nach dem Bau)
- **AMS 7012** – Ti-6Al-4V-Bauteile aus DMLS, heißisostatisch gepresst (HIP) und geglüht – für kritische Luftfahrt-Anwendungen Standard
- **AMS 7013–7015** – Varianten für Ti-6Al-4V ELI und weitere Titanlegierungen

Die Bauteileigenschaften im DMLS-Zustand unterscheiden sich deutlich vom gewalzten oder geschmiedeten Halbzeug: Die mechanischen Kennwerte erreichen im geglühten Zustand etwa 90–95 % der Werte von gewalztem Grade-5-Material; im HIP-geglühten Zustand nähern sie sich an, ohne sie ganz zu erreichen. Die Oberflächenrauheit ist mit Ra 5–15 μm deutlich höher als bei CNC-Bearbeitung; eine Nachbearbeitung durch Fräsen, Schleifen oder elektrochemisches Polieren ist für funktionsrelevante Flächen in der Regel erforderlich. Die Anisotropie der mechanischen Eigenschaften – sie ist bauichtungsabhängig – muss in der Bauteilauslegung berücksichtigt werden.

**Was die DMLS-Wirtschaftlichkeit bestimmt.**

Die DMLS-Wirtschaftlichkeit ist geometrieabhängig. Bei kompakten Bauteilen mit hohem Materialanteil ist die CNC-Bearbeitung in der Regel günstiger, weil das Spanvolumen und die Maschinenzeit hoch sind. Bei Bauteilen mit hoher geometrischer Komplexität, mit innenliegenden Kanälen oder mit Leichtbau-Topologien (bionische Strukturen, Gitterstrukturen) ist DMLS häufig die einzige wirtschaftliche Option. Die Amortisationsgrenze liegt typischerweise bei Lotgrößen unter 50 Stück für hochkomplexe Geometrien und über 200 Stück für kompakte Geometrien. Wer DMLS ohne diese Differenzierung bewertet, läuft Gefahr, ein Bauteil additiv zu fertigen, das subtraktiv günstiger wäre, oder umgekehrt ein Bauteil subtraktiv zu fertigen, das in DMLS nur ein Drittel der Bearbeitungszeit benötigt hätte.

---

## 2. Additive vs. subtraktiv — Wo DMLS die CNC-Bearbeitung ergänzt und wo nicht

Die Gegenüberstellung von DMLS und CNC ist keine Entweder-oder-Frage, sondern eine Ergänzungsfrage. In den meisten Luftfahrt- und Medizintechnik-Programmen kommen beide Verfahren parallel zum Einsatz: DMLS für die geometrische Grundform, CNC für die funktionsrelevanten Endmaße und die Oberflächengüte. Diese Hybridstrategie ist in der industriellen Praxis dominierend; reine DMLS-Bauteile ohne Nachbearbeitung sind die Ausnahme.

**Wo DMLS klare Vorteile hat:**

- Innenliegende Kühlkanäle in Triebwerks- und Strukturbauteilen – die mit konventioneller Bohrtechnik nicht herstellbar sind
- Topologie-optimierte Leichtbaustrukturen – Gewichtsersparnis 30–60 % gegenüber massiver Konstruktion
- Konsolidierung mehrerer Einzelteile zu einem Monoblock – Reduktion der Bauteilanzahl und der Fügestellen
- Patientenspezifische Implantate in der Medizintechnik – jede Geometrie ist eine eigene Charge

**Wo DMLS an Grenzen stößt:**

- Große Bauteile mit Wandstärken unter 0,3 mm – die Wärmeableitung ist im Pulverbett unzureichend, es entstehen Verformungen oder Anschmelzungen
- Bauteile mit hochpräzisen, kleinen Bohrungen oder Gewinden unter M3 – die Auflösung des Laserstrahls reicht für diese Geometrien nicht aus, Nachbearbeitung ist erforderlich
- Bauteile mit dynamisch hochbelasteten Funktionsflächen – die typische DMLS-Oberflächenrauheit erzeugt Kerben, die die Ermüdungsfestigkeit reduzieren
- Stückzahlen über einige hundert pro Jahr bei kompakten Geometrien – die Zykluszeit pro Bauteil ist im DMLS länger

Eine Engineering-Konsequenz: Die Hybridfertigung DMLS plus CNC-Bearbeitung erfordert eine besondere Schnittstellenplanung. Die DMLS-Aufmaße (typisch 0,3–0,5 mm pro bearbeiteter Fläche) müssen so dimensioniert sein, dass die CNC-Bearbeitung die Endgeometrie ohne Verlust an Positionsgenauigkeit erreicht. Die Aufspannung auf der CNC-Maschine erfolgt typischerweise über das DMLS-Original-Interface oder über eingearbeitete Spannleisten, die schon im DMLS-Layout berücksichtigt sind. Die operative Frage, welche Schnittstellen zwischen DMLS und CNC-Bearbeitung sinnvoll sind, ist im [CNC-Präzisionszerspanung Titan-Artikel](/de/blog/cnc-praezisionszerspanung-titan-frasen-drehen-schleifen/) dieses Clusters im Detail dargestellt.

**Was die Beschaffungspraxis oft übersieht.**

DMLS-Titanbauteile benötigen – im Unterschied zu rein subtraktiv gefertigten Bauteilen – zusätzliche Konformitätsdokumentation. Die Prozessparameter (Laserscanstrategie, Schichtdicke, Pulvercharge, Ofenatmosphäre beim HIP) müssen pro Bauteil dokumentiert werden; die einschlägigen AMS-7011/7012-Spezifikationen verlangen eine lückenlose Rückverfolgbarkeit von Pulvercharge zu Bauteil. Die Anschaffung eines DMLS-Bauteils im RFQ sollte daher immer die Frage nach der Pulverrückverfolgbarkeit und der HIP-Verfügbarkeit enthalten – nicht nur die geometrische Zeichnung.

---

## 3. Laserschweißen von Titan: Nahtqualität, Schutzgas und Verzugskontrolle

Das Schweißen von Titan unterscheidet sich vom Schweißen von Stahl in einem physikalischen Detail, das alle Engineering-Überlegungen dominiert: Titan reagiert bei Temperaturen über 400 °C spontan mit Sauerstoff, Stickstoff und Wasserstoff aus der Atmosphäre. Die Folge sind Oxidation (Verfärbung), Versprödung durch Stickstoffaufnahme und Wasserstoffversprödung. Eine Titan-Schweißnaht, die nicht durch eine inerte Schutzgasatmosphäre geschützt ist, hat in der Regel keine ausreichende Korrosionsbeständigkeit und keine ausreichende mechanische Festigkeit.

**Die Schutzgaslogik beim Laserschweißen.**

Beim Laserstrahlschweißen von Titan werden drei Schutzgasbereiche unterschieden:

- **Hauptschutzgas** – deckt das Schmelzbad von oben ab. Typisch reines Argon 4.6 oder höher, Durchflussrate 8–15 l/min, je nach Nahtlänge und Schweißgeschwindigkeit.
- **Unterseitenschutzgas** – schützt die Schweißnaht-Wurzel, falls beidseitig geschweißt wird oder falls die Wurzel nicht durchgedringt werden soll. Argon oder Argon-Helium-Gemisch, Durchflussrate 5–10 l/min.
- **Nachlaufschutz** – schützt die gerade erstarrte Naht und die Wärmeeinflusszone (WEZ) während der Abkühlphase. Dies ist der am häufigsten unterschätzte Bereich; eine zu kurze Nachschutzstrecke verursacht Verfärbung an der bereits fertigen Naht, die in einer Endprüfung als unzulässig bewertet wird.

Die Farbe der erstarrten Naht ist das einfachste Inspektionskriterium für die Schutzgasqualität: Eine silber-hellgelbe Naht zeigt eine gute Schutzgasabdeckung, eine violette Naht leichte Verfärbung (zulässig für untergeordnete Bauteile), eine dunkelblaue oder graue Naht signalisiert unzureichenden Schutz (nicht zulässig). In der Luftfahrt und Medizintechnik ist nur die silber-hellgelbe Naht tolerierbar.

**Nahtqualität und Schweißparameter.**

Beim Laserstrahlschweißen werden drei Verfahrensvarianten unterschieden: Wärmeleitungsschweißen (niedrige Leistung, breite Naht), Tiefschweißen (hohe Leistung, tiefe Naht mit hohem Tiefen-Breiten-Verhältnis) und das sogenannte „Keyhole-Schweißen" (sehr hohe Leistung, dampfkanalgestützte Naht). Für Titan-Strukturbauteile in der Luftfahrt wird überwiegend das Tiefschweißen angewendet; das Keyhole-Schweißen wird bei Hochleistungsanwendungen eingesetzt, ist aber bei Titan wegen der Porenbildung risikoreicher.

Die typischen Parameter für Ti-6Al-4V-Laserschweißen liegen bei:

- Laserleistung 1,5–4 kW (je nach Nahtvorbereitung und Blechdicke)
- Schweißgeschwindigkeit 1–4 m/min (höhere Geschwindigkeit erzeugt schmalere, tiefere Nähte)
- Fokuslage auf oder knapp unter der Werkstückoberfläche
- Drahtlos oder mit Zusatzdraht (in der Luftfahrt üblich)

Eine kritische Variable ist die Verzugskontrolle. Titan hat eine hohe Wärmeausdehnung (etwa 8,6 µm/m·K) und reagiert empfindlich auf Schweißverzug. Bei dünnen Blechen unter 2 mm ist die Verformung oft so stark, dass nachfolgende Richtarbeiten oder Press-Vorgänge erforderlich werden. Eine bewährte Strategie ist die symmetrische Schweißfolge (Naht 1, Naht 3, Naht 2, Naht 4) und das Vorheizen auf 80–150 °C bei dickeren Querschnitten. Bei komplexen Geometrien hilft die Simulation des Schweißverzugs vorab, um die Schweißreihenfolge und die Einspannung zu optimieren.

---

## 4. Laserschneiden und Hybridverfahren: Blech und Rohr

Laserschneiden von Titan ist in der industriellen Praxis für zwei Anwendungsfelder dominant: das Schneiden von Blechen und Bändern als Vorbereitung für die CNC-Bearbeitung (Schneiden der Rohteil-Form) und das Schneiden von Rohren und Profilen für Wärmetauscher, Hydraulik- und Kraftstoffleitungen.

**Faserlaser oder CO₂-Laser.**

Für Titan-Blech wird heute überwiegend der Faserlaser eingesetzt. Die Wellenlänge des Faserlasers (1,07 µm) wird von Titan deutlich besser absorbiert als die Wellenlänge des CO₂-Lasers (10,6 µm), was höhere Schnittgeschwindigkeiten bei gleichzeitig besserer Schnittqualität ermöglicht. Typische Schnittgeschwindigkeiten für Ti-6Al-4V-Blech mit Faserlaser:

- 0,5 mm Blech: 8–12 m/min mit Stickstoff als Schneidgas
- 1,0 mm Blech: 5–8 m/min mit Stickstoff
- 2,0 mm Blech: 2,5–4 m/min mit Stickstoff
- 3,0 mm Blech: 1,5–2,5 m/min mit Stickstoff oder Sauerstoff

Stickstoff als Schneidgas liefert eine oxidfreie, saubere Schnittkante, die für nachfolgende Schweißprozesse optimal ist. Sauerstoff erzeugt eine dünnere Schnittfuge, aber mit Oxidschicht; die Schnittkante muss dann durch Beizen oder Schleifen nachbehandelt werden.

**Schnittqualität und Gratminimierung.**

Die Schnittqualität beim Laserstrahlschneiden wird durch drei Größen beschrieben: Schnittrauhheit (typisch Ra 3–12 µm bei Titan), Schnittfugenbreite (0,1–0,3 mm) und Gratbildung an der Unterseite. Bei Titan ist die Gratbildung wegen der hohen Schmelzviskosität relativ gering; bei Blechen über 4 mm Dicke kann die untere Schnittkante jedoch Aufwurf zeigen, der durch Bürsten oder leichtes Schleifen entfernt werden muss.

Für Rohre und Profile wird das Laser-Rohrschneiden zunehmend eingesetzt. Das Rohr wird in einer Spannvorrichtung rotiert, während der Laser senkrecht zur Rohrachse schneidet; die Kombination aus Rotation und Laser ermöglicht das Ausschneiden komplexer Konturen aus Rohren – etwa die Kontur eines Strukturbauteils aus einem geraden Titan-Rohr. Diese Technik ist in der Luftfahrt für die Herstellung von Strukturbauteilen aus Rohrhalbzeug Stand der Technik.

**Hybridverfahren Laser+CNC.**

Eine zunehmend verbreitete Anwendung ist die Kombination aus Laserschneiden und CNC-Bearbeitung in einer Maschine: Das Laserschneiden erzeugt die Grundkontur und die Bohrungen, die CNC-Maschine übernimmt die finale Maßbearbeitung und die Funktionsflächen. Die Vorteile liegen in der Reduktion der Spann-Operationen und in der Verkürzung der Durchlaufzeit. Die Investitionskosten für eine solche Hybridmaschine sind hoch, weshalb sie eher bei mittelständischen Lohnfertigern und in Luftfahrt-Zulieferbetrieben mit Volumen anzutreffen ist als in kleinen Werkstätten.

---

## 5. Wärmebehandlung im Vakuum: Pflicht nach DMLS und nach dem Schweißen

Die Vakuum-Wärmebehandlung ist bei Titan das einzige Verfahren, das die Aufnahme von Sauerstoff und Stickstoff während der Glühphase sicher ausschließt. Sie ist nach DMLS-Bau, nach dem Schweißen und nach dem Umformen in der Regel obligatorisch, wenn die Endbauteile mechanisch oder korrosiv belastet werden. Die einschlägige AMS-Spezifikation ist AMS 2774 für die Wärmebehandlung von Titanlegierungen.

**Wärmebehandlung nach DMLS.**

DMLS-Bauteile aus Ti-6Al-4V werden nach dem Bau typischerweise in zwei Schritten wärmebehandelt:

- **Stress-Relief-Glühung** bei 700–760 °C für 1–2 Stunden unter Vakuum (> 10⁻³ mbar), um die Eigenspannungen aus dem schichtweisen Aufbau abzubauen. Dieser Schritt ist fast immer erforderlich, weil die schichtweise Erstarrung erhebliche Restspannungen erzeugt.
- **HIP (Heißisostatisches Pressen)** bei 920–955 °C und 100–200 MPa Argondruck für 2–4 Stunden, um die Porosität im Bauteil zu reduzieren und die mechanischen Eigenschaften zu homogenisieren. HIP wird für Luftfahrt-Bauteile der Klassen 1 und 2 in AMS 7012 explizit gefordert; in der Medizintechnik ist HIP üblich, aber nicht zwingend vorgeschrieben.

Die Reihenfolge der Wärmebehandlungsschritte ist nicht beliebig: HIP vor der Endwärmebehandlung verbessert die Dichte, aber die Spannungsabbau-Glühung vor HIP reduziert die Verformung während des HIP-Prozesses. In der industriellen Praxis wird oft die Sequenz „Stress-Relief → HIP → Lösungsglühen und Auslagern" gefahren.

**Wärmebehandlung nach dem Schweißen.**

Eine Titan-Schweißnaht hat im erstarrten Zustand eine martensitische α'-Phase, die versprödet ist. Die Standard-Wärmebehandlung nach dem Schweißen ist:

- Spannungsarm-Glühen bei 540–650 °C für 1–2 Stunden unter Vakuum – reduziert die Eigenspannungen aus dem Schweißen, ohne die Festigkeit wesentlich zu reduzieren
- Vollständige Lösungsglühung und Auslagerung bei 720–790 °C (Lösung) und 480–650 °C (Auslagerung), 1 Stunde pro Phase, unter Vakuum – stellt das α-β-Gefüge und die Standard-Festigkeit wieder her

Die Ofenatmosphäre ist bei allen Glühungen Vakuum oder zumindest Argon mit Reinheit 4.6 oder besser. Eine Wärmebehandlung unter Luft oder unter Stickstoff-Schutzgas würde die Titan-Oberfläche oxidieren und die mechanischen Eigenschaften der Randschicht verschlechtern.

**Was die Audit-Praxis prüft.**

NADCAP-Auditoren und ISO-13485-Auditoren prüfen bei Titan-Wärmebehandlung drei Dinge: die Ofen-Temperaturprotokollierung mit Zeit-Temperatur-Kurve pro Charge, die Vakuum- oder Schutzgasprotokollierung mit Druck- oder Reinheitsnachweis, und die physische Trennung von Titan-Ofen und Stahl-Ofen (um Kreuzkontamination zu vermeiden). Eine Charge, die in einem Ofen wärmebehandelt wurde, in dem zuvor Stahl unter Luft geglüht wurde, hat eine messbare Aufkohlung an der Oberfläche – bei Titan in Form einer Alpha-Case-Bildung, die in der Endprüfung als Oberflächenfehler bewertet wird. Die Pflicht zur Ofen-Trennung ist die häufigste Ursache für die Audit-Beanstandung „unzureichende Prozessisolation".

Die Materialgrundlagen für die Titan-Güteklassen, die in DMLS, Laser und Wärmebehandlung verarbeitet werden, sind im [Titan Güteklassen und Normen im Vergleich](/de/blog/titan-gueteklassen-normen-ams-astm-vergleich/) zusammengefasst. Die CNC-Bearbeitung als Endstufe der additiv-gefertigten Bauteile ist im [CNC-Präzisionszerspanung Titan-Artikel](/de/blog/cnc-praezisionszerspanung-titan-frasen-drehen-schleifen/) dieses Clusters im Detail dargestellt.

**Tabelle 1: DMLS, Laserschweißen und Laserschneiden von Titan – Eignung nach Anwendungsfeld**

| Verfahren | Typische Anwendung | Typische Halbzeug-Form | Notwendige Nachbehandlung | Eignung Luftfahrt | Eignung Medizintechnik | Wirtschaftlichkeit (Losgröße) |
|---|---|---|---|---|---|---|
| **DMLS** | Topologie-optimierte Strukturen, Kanäle | Titan-Pulver Ti-6Al-4V | Stress-Relief + HIP + CNC | Hoch (AMS 7012) | Hoch (HIP + Passivierung) | Klein bis mittel (1–500) |
| **Laserschweißen** | Fügen von Halbzeugen, Rohren, Blechen | Blech, Stange, Rohr | Spannungsarmglühen + Passivierung | Hoch (AMS 2774) | Hoch (ISO 13485) | Mittel bis groß (50–10.000) |
| **Laserschneiden** | Rohteilform, Rohrkontur | Blech, Band, Rohr | Entgraten, ggf. Beizen | Hoch | Hoch | Mittel bis groß |
| **Hybrid Laser+CNC** | Komplexe Bauteile aus Blech | Blech | CNC-Endbearbeitung | Hoch | Hoch | Mittel bis groß (50–5.000) |

*Quelle: ASTM F3055, AMS 7010/7011/7012, AMS 2774, branchenübliche Praxis aus DACH-Luftfahrt-Zulieferung. Tabelle zu Vergleichszwecken erstellt.*

---

## Siehe auch

Additive Fertigung und Laserverfahren ergänzen die subtraktive Titan-Fertigung, ersetzen sie aber nicht. Die folgenden Artikel dieses Clusters stellen die Bezüge zu Werkstoffgrundlagen, CNC-Endbearbeitung und Messtechnik her:

- **Pillar des Clusters:** [Der ultimative Leitfaden zur Titanverarbeitung](/de/blog/ultimative-leitfaden-titanverarbeitung/) — verbindet DMLS, Laserschweißen und Laserschneiden mit der übergeordneten Titan-Werkstoffauswahl, der CNC-Bearbeitung als Endstufe additiv gefertigter Bauteile und der nachgelagerten 3D-KMG-Messtechnik.
- **Pulver- und Werkstoffgrundlagen:** [Titan Güteklassen und Normen im Vergleich (AMS, ASTM, ISO, DIN)](/de/blog/titan-gueteklassen-normen-ams-astm-vergleich/) — liefert die AMS 7010–7015 ↔ ASTM F3055 ↔ ISO/ASTM 52900-Mapping-Tabelle für DMLS-Pulver und die normativen Grenzwerte für Titan-Schmelzchargen.
- **CNC-Bearbeitung als Endstufe:** [CNC-Präzisionszerspanung von Titan (Fräsen, Drehen, Schleifen)](/de/blog/cnc-praezisionszerspanung-titan-frasen-drehen-schleifen/) — beschreibt die Aufmaße, Spanntechnik und Schnittdaten für die CNC-Nachbearbeitung von DMLS-Halbzeugen und die operative Schnittstellenplanung zwischen additiver und subtraktiver Fertigung.

---

## Häufig gestellte Fragen zu additiver Fertigung und Laserverfahren bei Titan

**Was ist der Unterschied zwischen DMLS und SLM?**
Beide bezeichnen das pulverbettbasierte Laserstrahlschmelzen. DMLS ist der von EOS geprägte Markenname, SLM der von SLM Solutions. In der Normsprache nach ASTM F42 werden beide als „Laser Powder Bed Fusion" (LPBF) bezeichnet. Die Prozessparameter und die resultierenden Bauteileigenschaften sind weitgehend vergleichbar.

**Welche Titan-Pulver sind für DMLS geeignet?**
Ti-6Al-4V (Grade 5) ist der Standard, Ti-6Al-4V ELI (Grade 23) ist für Medizintechnik verfügbar. Spezielle Legierungen (Ti-6242, Ti-5553) werden für Hochtemperatur- und Luftfahrtanwendungen eingesetzt, sind aber nur über wenige Pulverhersteller verfügbar. Die Partikelgrößenverteilung 15–63 µm ist Branchenstandard.

**Wie viele Pulver-Recyclingszyklen sind möglich?**
Typisch 8–12 Zyklen, danach erreicht der Sauerstoffgehalt die obere AMS-Grenze. Die exakte Anzahl hängt von der Prozessparameterwahl und der Anlagenkonfiguration ab. Eine genaue Pulver-Chargen-Dokumentation im RFQ schützt vor unzulässigen Bauteilzusammensetzungen.

**Welche Schutzgasqualität ist beim Laserschweißen erforderlich?**
Argon 4.6 oder höher (mindestens 99,996 % Reinheit), Haupt- und Unterseitenschutzgas, dazu ein Nachlaufschutz für die bereits erstarrte Naht. Die Farbe der erstarrten Naht ist das einfachste Prüfkriterium: silber-hellgelb = gut, dunkelblau oder grau = unzureichend.

**Wann ist HIP nach DMLS zwingend?**
In der Luftfahrt für sicherheitskritische Bauteile nach AMS 7012 explizit gefordert. In der Medizintechnik üblich, aber abhängig von der Bauteilanwendung. Bei nicht-sicherheitskritischen Industrieteilen kann auf HIP verzichtet werden, wenn die mechanischen Anforderungen es zulassen.

**Welche Schnittgeschwindigkeit ist beim Laserschneiden von Titan-Blech erreichbar?**
Mit Faserlaser und Stickstoff als Schneidgas: 8–12 m/min bei 0,5 mm Blech, 5–8 m/min bei 1 mm, 2,5–4 m/min bei 2 mm, 1,5–2,5 m/min bei 3 mm. CO₂-Laser erreicht etwa 60–70 % dieser Geschwindigkeiten.

**Welche Vakuum-Wärmebehandlung ist nach DMLS Pflicht?**
Mindestens die Stress-Relief-Glühung bei 700–760 °C unter Vakuum. Für Luftfahrt-Anwendungen zusätzlich HIP bei 920–955 °C unter Argondruck. Die Ofenatmosphäre muss Vakuum (> 10⁻³ mbar) oder Argon mit Reinheit 4.6 sein.

**Können DMLS-Bauteile ohne CNC-Nachbearbeitung eingesetzt werden?**
In untergeordneten Anwendungen (Konstruktionshilfen, Funktionsmuster) ja. Für funktionsrelevante Bauteile mit engen Toleranzen, mit dynamischer Belastung oder mit Gleitflächen ist eine CNC-Nachbearbeitung oder ein elektrochemisches Polieren in der Regel erforderlich.

---

## Nächste Schritte

Wenn Sie ein Titan-Bauteil in additiver Fertigung umsetzen oder eine lasergekoppelte Titan-Fertigung aufbauen möchten, können wir Ihnen folgende Unterlagen zur Verfügung stellen:

- Eine Werkstoff- und Pulver-Mapping-Tabelle AMS 7010–7015 ↔ ASTM F3055 ↔ ISO/ASTM 52900
- Eine Prozessbeschreibung „DMLS-Strangaufbau → HIP → CNC-Endbearbeitung" mit Parameterbeispiel
- Eine Schweißverfahrensprüfung (WPS) für Ti-6Al-4V nach DIN EN ISO 15614
- Eine virtuelle Betriebsbesichtigung unserer DMLS-Anlage, Laserschweißzelle und Vakuum-Wärmebehandlungsöfen

Senden Sie Ihre Anfrage über unser [RFQ-Portal](/de/rfq/) oder fordern Sie eine erste verfahrenstechnische Vorerstberatung an. Wir antworten üblicherweise innerhalb eines Werktags mit einer Einschätzung zu Verfahrenswahl, Pulververfügbarkeit und voraussichtlichem Lieferrahmen.