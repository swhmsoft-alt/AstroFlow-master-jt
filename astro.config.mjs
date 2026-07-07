// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import normalizeTrailingSlash from '@reunmedia/astro-normalize-trailing-slash';
import { rehypeAutoInternalLinksI18n } from './src/lib/rehype-auto-internal-links-i18n';

// https://astro.build
export default defineConfig({
  site: 'https://cnc.bozemetal.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    normalizeTrailingSlash(),
    sitemap({
      filter: (page) => !page.includes('/theme-demo') && !page.includes('/admin'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          ja: 'ja-JP',
          fr: 'fr-FR',
          es: 'es-ES',
          pt: 'pt-PT',
          it: 'it-IT',
          ko: 'ko-KR',
          nl: 'nl-NL',
          pl: 'pl-PL',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    rehypePlugins: [
      [rehypeAutoInternalLinksI18n, {
        // 由 AI 动态生成 - 请运行 scripts/generate-internal-links.mjs 更新此映射
        keywordMap: {
          "Comprehensive Titanium Manufacturing & Processing Services": {
            "href": "/"
          },
          "Comprehensive Titanium Manufacturing": {
            "href": "/"
          },
          "Titanium CNC Machining Services": {
            "href": "/titanium-cnc-machining-services/"
          },
          "3/5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC Milling & Turning": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Wire EDM Machining": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Wire EDM": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Custom Industrial Components": {
            "href": "/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Titanium Additive Manufacturing": {
            "href": "/titanium-additive-manufacturing/"
          },
          "3D Printing SLM/DMLS": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D Printing SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Rapid Prototyping": {
            "href": "/nl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Low-Volume Production": {
            "href": "/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium Fabrication Services": {
            "href": "/titanium-fabrication-services/"
          },
          "Laser Cutting (Sheet & Tube)": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Waterjet Cutting": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "Titanium Welding & Assembly": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Forming & Heavy Manufacturing": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forming": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forging": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Extrusion": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Raw Material Preparation & Sizing": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Raw Material Preparation": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titanium Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Anodizing (Type II & Type III)": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Chemical Passivation": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "Polishing & Sandblasting": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polishing": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Ti-6Al-4V": {
            "href": "/materials/grade-5/"
          },
          "Grade 5 Titanium": {
            "href": "/materials/grade-5/"
          },
          "AMS 4928T": {
            "href": "/materials/grade-5/"
          },
          "Ti-6Al-4V ELI": {
            "href": "/materials/grade-23/"
          },
          "Grade 23 Titanium": {
            "href": "/materials/grade-23/"
          },
          "Grade 2 Titanium": {
            "href": "/materials/grade-2/"
          },
          "Grade 1 Titanium": {
            "href": "/materials/grade-1/"
          },
          "Grade 9 Titanium": {
            "href": "/materials/grade-9/"
          },
          "AS9100": {
            "href": "/capabilities/"
          },
          "AS9100D": {
            "href": "/capabilities/"
          },
          "ISO 9001": {
            "href": "/capabilities/"
          },
          "ISO 13485": {
            "href": "/capabilities/"
          },
          "ITAR": {
            "href": "/capabilities/"
          },
          "NADCAP": {
            "href": "/capabilities/"
          },
          "CMM": {
            "href": "/equipment/cmm/"
          },
          "RFQ": {
            "href": "/rfq/"
          },
          "Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen": {
            "href": "/de/"
          },
          "Titan-CNC-Bearbeitungsdienste": {
            "href": "/de/titanium-cnc-machining-services/"
          },
          "3/5-Achsen-CNC-Bearbeitung": {
            "href": "/de/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC-Fräsen & Drehen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC-Fräsen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Drahterodieren (Wire EDM)": {
            "href": "/de/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Kundenspezifische Industriekomponenten": {
            "href": "/de/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Additive Fertigung von Titan": {
            "href": "/de/titanium-additive-manufacturing/"
          },
          "3D-Druck SLM/DMLS": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-Druck SLM": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Kleinserienproduktion": {
            "href": "/de/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titan-Blechverarbeitungsdienste": {
            "href": "/de/titanium-fabrication-services/"
          },
          "Laserschneiden (Blech & Rohr)": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Laserschneiden (Blech": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Wasserstrahlschneiden": {
            "href": "/de/titanium-fabrication-services/waterjet-cutting/"
          },
          "Titanschweißen & Montage": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanschweißen": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titan-Umformung & Schwerindustriefertigung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titan-Umformung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titanschmieden": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titan-Strangpressen": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Rohmaterialvorbereitung & Zuschnitt": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Rohmaterialvorbereitung": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titan-Oberflächenbehandlung": {
            "href": "/de/titanium-surface-treatment/"
          },
          "Eloxieren (Typ II & Typ III)": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Eloxieren (Typ II": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Chemische Passivierung": {
            "href": "/de/titanium-surface-treatment/chemical-passivation/"
          },
          "Polieren & Sandstrahlen": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polieren": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "総合チタン加工・製造サービス": {
            "href": "/ja/"
          },
          "チタンCNC加工サービス": {
            "href": "/ja/titanium-cnc-machining-services/"
          },
          "3/5軸CNC加工": {
            "href": "/ja/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNCフライス・旋盤加工": {
            "href": "/ja/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "ワイヤー放電加工": {
            "href": "/ja/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "カスタム産業用部品": {
            "href": "/ja/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "チタン増材製造（3Dプリンティング）": {
            "href": "/ja/titanium-additive-manufacturing/"
          },
          "3Dプリンティング SLM/DMLS": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3Dプリンティング SLM": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "ラピッドプロトタイピング": {
            "href": "/ja/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "少量生産": {
            "href": "/ja/titanium-additive-manufacturing/low-volume-production/"
          },
          "チタン製缶板金サービス": {
            "href": "/ja/titanium-fabrication-services/"
          },
          "レーザー切断（シート＆チューブ）": {
            "href": "/ja/titanium-fabrication-services/laser-cutting/"
          },
          "ウォータージェット切断": {
            "href": "/ja/titanium-fabrication-services/waterjet-cutting/"
          },
          "チタン溶接・組立": {
            "href": "/ja/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "チタン成形・重型製造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/"
          },
          "チタン鍛造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "チタン押出加工": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "原材料準備・サイジング": {
            "href": "/ja/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "チタン表面処理": {
            "href": "/ja/titanium-surface-treatment/"
          },
          "陽極酸化処理（タイプIIおよびIII）": {
            "href": "/ja/titanium-surface-treatment/anodizing/"
          },
          "化学的不動態化処理": {
            "href": "/ja/titanium-surface-treatment/chemical-passivation/"
          },
          "研磨・サンドブラスト": {
            "href": "/ja/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Services Complets de Fabrication et de Traitement du Titane": {
            "href": "/fr/"
          },
          "Services d'Usinage CNC du Titane": {
            "href": "/fr/titanium-cnc-machining-services/"
          },
          "Usinage CNC 3/5 Axes": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinage CNC 3": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Fraisage et Tournage CNC": {
            "href": "/fr/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Usinage par Électroérosion au Fil": {
            "href": "/fr/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Composants Industriels Personnalisés": {
            "href": "/fr/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Fabrication Additive de Titane": {
            "href": "/fr/titanium-additive-manufacturing/"
          },
          "Impression 3D SLM/DMLS": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impression 3D SLM": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Prototypage Rapide": {
            "href": "/fr/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Production en Faible Volume": {
            "href": "/fr/titanium-additive-manufacturing/low-volume-production/"
          },
          "Services de Fabrication de Tôlerie Titane": {
            "href": "/fr/titanium-fabrication-services/"
          },
          "Découpe Laser (Tôle et Tube)": {
            "href": "/fr/titanium-fabrication-services/laser-cutting/"
          },
          "Découpe au Jet d'Eau": {
            "href": "/fr/titanium-fabrication-services/waterjet-cutting/"
          },
          "Soudage et Assemblage du Titane": {
            "href": "/fr/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Formage du Titane et Fabrication Lourde": {
            "href": "/fr/titanium-forming-heavy-manufacturing/"
          },
          "Forgeage du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Extrusion du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Préparation et Dimensionnement des Matières Premières": {
            "href": "/fr/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Traitement de Surface du Titane": {
            "href": "/fr/titanium-surface-treatment/"
          },
          "Anodisation (Type II et Type III)": {
            "href": "/fr/titanium-surface-treatment/anodizing/"
          },
          "Passivation Chimique": {
            "href": "/fr/titanium-surface-treatment/chemical-passivation/"
          },
          "Polissage et Sablage": {
            "href": "/fr/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Servicios Integrales de Fabricación y Procesamiento de Titanio": {
            "href": "/es/"
          },
          "Servicios de Mecanizado CNC de Titanio": {
            "href": "/es/titanium-cnc-machining-services/"
          },
          "Mecanizado CNC de 3/5 Ejes": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Mecanizado CNC de 3": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Fresado y Torneado CNC": {
            "href": "/es/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Mecanizado por Electroerosión por Hilo": {
            "href": "/es/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Componentes Industriales Personalizados": {
            "href": "/es/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Fabricación Aditiva de Titanio": {
            "href": "/es/titanium-additive-manufacturing/"
          },
          "Impresión 3D SLM/DMLS": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impresión 3D SLM": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Prototipado Rápido": {
            "href": "/es/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Producción de Bajo Volumen": {
            "href": "/es/titanium-additive-manufacturing/low-volume-production/"
          },
          "Servicios de Fabricación de Titanio": {
            "href": "/es/titanium-fabrication-services/"
          },
          "Corte Láser (Chapa y Tubo)": {
            "href": "/es/titanium-fabrication-services/laser-cutting/"
          },
          "Corte por Chorro de Agua": {
            "href": "/es/titanium-fabrication-services/waterjet-cutting/"
          },
          "Soldadura y Ensamblaje de Titanio": {
            "href": "/es/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Conformado de Titanio y Fabricación Pesada": {
            "href": "/es/titanium-forming-heavy-manufacturing/"
          },
          "Forja de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Extrusión de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Preparación y Dimensionamiento de Materias Primas": {
            "href": "/es/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Tratamiento de Superficie de Titanio": {
            "href": "/es/titanium-surface-treatment/"
          },
          "Anodizado (Tipo II y Tipo III)": {
            "href": "/es/titanium-surface-treatment/anodizing/"
          },
          "Pasivación Química": {
            "href": "/es/titanium-surface-treatment/chemical-passivation/"
          },
          "Pulido y Chorreado de Arena": {
            "href": "/es/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Serviços Abrangentes de Fabricação e Processamento de Titânio": {
            "href": "/pt/"
          },
          "Serviços de Usinagem CNC de Titânio": {
            "href": "/pt/titanium-cnc-machining-services/"
          },
          "Usinagem CNC de 3/5 Eixos": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinagem CNC de 3": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Fresamento e Torneamento CNC": {
            "href": "/pt/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Usinagem por Eletroerosão a Fio": {
            "href": "/pt/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Componentes Industriais Personalizados": {
            "href": "/pt/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Manufatura Aditiva de Titânio": {
            "href": "/pt/titanium-additive-manufacturing/"
          },
          "Impressão 3D SLM/DMLS": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impressão 3D SLM": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Prototipagem Rápida": {
            "href": "/pt/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Produção de Baixo Volume": {
            "href": "/pt/titanium-additive-manufacturing/low-volume-production/"
          },
          "Serviços de Fabricação de Titânio": {
            "href": "/pt/titanium-fabrication-services/"
          },
          "Corte a Laser (Chapa e Tubo)": {
            "href": "/pt/titanium-fabrication-services/laser-cutting/"
          },
          "Corte a Jato de Água": {
            "href": "/pt/titanium-fabrication-services/waterjet-cutting/"
          },
          "Soldagem e Montagem de Titânio": {
            "href": "/pt/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Conformação de Titânio e Fabricação Pesada": {
            "href": "/pt/titanium-forming-heavy-manufacturing/"
          },
          "Forjamento de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Extrusão de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Preparação e Dimensionamento de Matéria-Prima": {
            "href": "/pt/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Tratamento de Superfície de Titânio": {
            "href": "/pt/titanium-surface-treatment/"
          },
          "Anodização (Tipo II e Tipo III)": {
            "href": "/pt/titanium-surface-treatment/anodizing/"
          },
          "Passivação Química": {
            "href": "/pt/titanium-surface-treatment/chemical-passivation/"
          },
          "Polimento e Jateamento de Areia": {
            "href": "/pt/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Servizi Complete di Produzione e Lavorazione del Titanio": {
            "href": "/it/"
          },
          "Servizi di Lavorazione CNC del Titanio": {
            "href": "/it/titanium-cnc-machining-services/"
          },
          "Lavorazione CNC a 3/5 Assi": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione CNC a 3": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Fresatura e Tornitura CNC": {
            "href": "/it/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Lavorazione per Elettroerosione a Filo": {
            "href": "/it/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Componenti Industriali Personalizzati": {
            "href": "/it/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Produzione Additiva di Titanio": {
            "href": "/it/titanium-additive-manufacturing/"
          },
          "Stampa 3D SLM/DMLS": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Stampa 3D SLM": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Prototipazione Rapida": {
            "href": "/it/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Produzione a Basso Volume": {
            "href": "/it/titanium-additive-manufacturing/low-volume-production/"
          },
          "Servizi di Fabbricazione del Titanio": {
            "href": "/it/titanium-fabrication-services/"
          },
          "Taglio Laser (Lamiera e Tubo)": {
            "href": "/it/titanium-fabrication-services/laser-cutting/"
          },
          "Taglio a Getto d'Acqua": {
            "href": "/it/titanium-fabrication-services/waterjet-cutting/"
          },
          "Saldatura e Assemblaggio del Titanio": {
            "href": "/it/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Formatura del Titanio e Produzione Pesante": {
            "href": "/it/titanium-forming-heavy-manufacturing/"
          },
          "Forgiatura del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Estrusione del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Preparazione e Dimensionamento delle Materie Prime": {
            "href": "/it/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Trattamento Superficiale del Titanio": {
            "href": "/it/titanium-surface-treatment/"
          },
          "Anodizzazione (Tipo II e Tipo III)": {
            "href": "/it/titanium-surface-treatment/anodizing/"
          },
          "Passivazione Chimica": {
            "href": "/it/titanium-surface-treatment/chemical-passivation/"
          },
          "Lucidatura e Sabbiatura": {
            "href": "/it/titanium-surface-treatment/polishing-sandblasting/"
          },
          "종합 티타늄 가공 및 제조 서비스": {
            "href": "/ko/"
          },
          "티타늄 CNC 가공 서비스": {
            "href": "/ko/titanium-cnc-machining-services/"
          },
          "3/5축 CNC 가공": {
            "href": "/ko/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC 밀링 및 선반 가공": {
            "href": "/ko/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "와이어 방전 가공": {
            "href": "/ko/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "맞춤형 산업용 부품": {
            "href": "/ko/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "티타늄 적층 제조": {
            "href": "/ko/titanium-additive-manufacturing/"
          },
          "3D 프린팅 SLM/DMLS": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D 프린팅 SLM": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "래피드 프로토타이핑": {
            "href": "/ko/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "소량 생산": {
            "href": "/ko/titanium-additive-manufacturing/low-volume-production/"
          },
          "티타늄 판금 제작 서비스": {
            "href": "/ko/titanium-fabrication-services/"
          },
          "레이저 절단 (시트 및 튜브)": {
            "href": "/ko/titanium-fabrication-services/laser-cutting/"
          },
          "워터젯 절단": {
            "href": "/ko/titanium-fabrication-services/waterjet-cutting/"
          },
          "티타늄 용접 및 조립": {
            "href": "/ko/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "티타늄 성형 및 중공업 제조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/"
          },
          "티타늄 단조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "티타늄 압출": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "원자재 준비 및 사이징": {
            "href": "/ko/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "티타늄 표면 처리": {
            "href": "/ko/titanium-surface-treatment/"
          },
          "아노다이징 (타입 II 및 III)": {
            "href": "/ko/titanium-surface-treatment/anodizing/"
          },
          "화학적 부동태화": {
            "href": "/ko/titanium-surface-treatment/chemical-passivation/"
          },
          "연마 및 샌드블라스팅": {
            "href": "/ko/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Uitgebreide Titanium Productie- en Verwerkingsdiensten": {
            "href": "/nl/"
          },
          "Titanium CNC-bewerkingsdiensten": {
            "href": "/nl/titanium-cnc-machining-services/"
          },
          "3/5-Assige CNC-bewerking": {
            "href": "/nl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC Frezen en Draaien": {
            "href": "/nl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Draadvonken (Wire EDM)": {
            "href": "/nl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Op maat gemaakte industriële componenten": {
            "href": "/nl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Additieve Productie van Titanium": {
            "href": "/nl/titanium-additive-manufacturing/"
          },
          "3D-printen SLM/DMLS": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-printen SLM": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Productie in kleine oplage": {
            "href": "/nl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium Fabricagediensten": {
            "href": "/nl/titanium-fabrication-services/"
          },
          "Lasersnijden (Plaat & Buis)": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Lasersnijden (Plaat": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Waterjetsnijden": {
            "href": "/nl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Titaniumlassen en Assemblage": {
            "href": "/nl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Vormen en Zware Productie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Smeden": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Extrusie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Grondstofvoorbereiding en -bepaling": {
            "href": "/nl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Oppervlaktebehandeling van Titanium": {
            "href": "/nl/titanium-surface-treatment/"
          },
          "Anodiseren (Type II & Type III)": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Anodiseren (Type II": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Chemische Passivering": {
            "href": "/nl/titanium-surface-treatment/chemical-passivation/"
          },
          "Polijsten en Zandstralen": {
            "href": "/nl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Kompleksowe Usługi Produkcji i Obróbki Tytanu": {
            "href": "/pl/"
          },
          "Usługi Obróbki CNC Tytanu": {
            "href": "/pl/titanium-cnc-machining-services/"
          },
          "Obróbka CNC 3/5-osiowa": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Obróbka CNC 3": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Frezowanie i Toczenie CNC": {
            "href": "/pl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Obróbka Elektroerozyjna Drutowa (EDM)": {
            "href": "/pl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Niestandardowe Komponenty Przemysłowe": {
            "href": "/pl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Wytwarzanie Addytywne Tytanu": {
            "href": "/pl/titanium-additive-manufacturing/"
          },
          "Druk 3D SLM/DMLS": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Druk 3D SLM": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Szybkie Prototypowanie": {
            "href": "/pl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Produkcja Niskonakładowa": {
            "href": "/pl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Usługi Obróbki Plastycznej Tytanu": {
            "href": "/pl/titanium-fabrication-services/"
          },
          "Cięcie Laserowe (Blacha i Rura)": {
            "href": "/pl/titanium-fabrication-services/laser-cutting/"
          },
          "Cięcie Wodne": {
            "href": "/pl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Spawanie i Montaż Tytanu": {
            "href": "/pl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Formowanie Tytanu i Produkcja Ciężka": {
            "href": "/pl/titanium-forming-heavy-manufacturing/"
          },
          "Kucie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Wyciskanie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Przygotowanie i Wymiarowanie Surowca": {
            "href": "/pl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Obróbka Powierzchniowa Tytanu": {
            "href": "/pl/titanium-surface-treatment/"
          },
          "Anodowanie (Typ II i Typ III)": {
            "href": "/pl/titanium-surface-treatment/anodizing/"
          },
          "Pasywacja Chemiczna": {
            "href": "/pl/titanium-surface-treatment/chemical-passivation/"
          },
          "Polerowanie i Piaskowanie": {
            "href": "/pl/titanium-surface-treatment/polishing-sandblasting/"
          }
      }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});