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
      filter: (page) => !page.includes('/theme-demo') && !page.includes('/admin') && !page.includes('/thank-you'),
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
          ru: 'ru-RU',
          ar: 'ar-SA',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    rehypePlugins: [
      [rehypeAutoInternalLinksI18n, {
        keywordMap: {
          "3/5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5-Axis CNC Milling": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D CMM inspection": {
            "href": "/products/capabilities/3d-cmm-inspection/"
          },
          "3D Printing SLM/DMLS": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D Printing SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "5-Axis Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "aerospace titanium": {
            "href": "/industries/aerospace/"
          },
          "AMS 4928T": {
            "href": "/materials/grade-5/"
          },
          "anodizing of titanium": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II & Type III)": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "AS9100": {
            "href": "/capabilities/"
          },
          "AS9100D": {
            "href": "/capabilities/"
          },
          "ASTM B348": {
            "href": "/materials/grade-5/"
          },
          "bead blasting": {
            "href": "/products/capabilities/bead-blasting-anodizing-pvd/"
          },
          "Chemical Passivation": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "chemical passivation treatment": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "CMM": {
            "href": "/equipment/cmm/"
          },
          "CNC Machining": {
            "href": "/titanium-cnc-machining-services/"
          },
          "CNC Machining of Fittings & Flanges": {
            "href": "/titanium-cnc-machining-services/"
          },
          "CNC Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Milling & Turning": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Turning & Mill-Turn": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Turning & Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Comprehensive Titanium Manufacturing": {
            "href": "/"
          },
          "Comprehensive Titanium Manufacturing & Processing Services": {
            "href": "/"
          },
          "Custom Industrial Components": {
            "href": "/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "deburring of components": {
            "href": "/products/capabilities/deburring-edge-rounding/"
          },
          "dimensional inspection": {
            "href": "/products/capabilities/100-dimensional-inspection-cmm/"
          },
          "electropolishing": {
            "href": "/products/capabilities/electropolishing/"
          },
          "Forming & Bending": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Grade 1 Titanium": {
            "href": "/materials/grade-1/"
          },
          "Grade 2 Titanium": {
            "href": "/materials/grade-2/"
          },
          "Grade 23 Titanium": {
            "href": "/materials/grade-23/"
          },
          "Grade 5 Titanium": {
            "href": "/materials/grade-5/"
          },
          "Grade 9 Titanium": {
            "href": "/materials/grade-9/"
          },
          "high precision grinding": {
            "href": "/products/capabilities/high-precision-grinding/"
          },
          "ISO 13485": {
            "href": "/capabilities/"
          },
          "ISO 9001": {
            "href": "/capabilities/"
          },
          "ITAR": {
            "href": "/capabilities/"
          },
          "Laser Cutting": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet & Tube)": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "laser welding titanium": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Low-Volume Production": {
            "href": "/titanium-additive-manufacturing/low-volume-production/"
          },
          "marine titanium components": {
            "href": "/industries/marine/"
          },
          "medical implants": {
            "href": "/industries/medical/"
          },
          "NADCAP": {
            "href": "/capabilities/"
          },
          "Pipe Spool Fabrication": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Polishing": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polishing & Sandblasting": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Precision CNC Machining": {
            "href": "/titanium-cnc-machining-services/"
          },
          "Rapid Prototyping": {
            "href": "/nl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Raw Material Preparation": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Raw Material Preparation & Sizing": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "RFQ": {
            "href": "/rfq/"
          },
          "semiconductor titanium components": {
            "href": "/industries/semiconductor/"
          },
          "SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "thread rolling of titanium": {
            "href": "/products/capabilities/thread-rolling/"
          },
          "Ti-6Al-4V ELI": {
            "href": "/materials/grade-23/"
          },
          "Ti-6Al-4V": {
            "href": "/materials/grade-5/"
          },
          "TIG (GTAW) Pipe Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "TIG Welding & Fabrication": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "titanium 3D printing parts": {
            "href": "/titanium-additive-manufacturing/"
          },
          "Titanium Additive Manufacturing": {
            "href": "/titanium-additive-manufacturing/"
          },
          "titanium AI infrastructure components": {
            "href": "/industries/ai-infrastructure/"
          },
          "titanium chemical processing equipment": {
            "href": "/industries/chemical/"
          },
          "Titanium CNC Machining Services": {
            "href": "/titanium-cnc-machining-services/"
          },
          "titanium CNC parts": {
            "href": "/parts/titanium-cnc-parts/"
          },
          "titanium components for the energy industry": {
            "href": "/industries/energy/"
          },
          "titanium components for UAVs and drones": {
            "href": "/industries/uav-drones/"
          },
          "Titanium Extrusion": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "titanium fabricated parts": {
            "href": "/parts/titanium-fabricated-parts/"
          },
          "Titanium Fabrication Services": {
            "href": "/titanium-fabrication-services/"
          },
          "titanium fasteners": {
            "href": "/products/capabilities/cnc-turning-of-bolt-heads-and-threads/"
          },
          "titanium flanges": {
            "href": "/products/capabilities/cnc-machining-of-mating-flanges/"
          },
          "Titanium Forging": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Forming": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forming & Heavy Manufacturing": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "titanium industrial equipment components": {
            "href": "/industries/industrial-equipment/"
          },
          "titanium marine parts": {
            "href": "/parts/titanium-marine-parts/"
          },
          "titanium medical components": {
            "href": "/parts/titanium-medical-components/"
          },
          "titanium motorsport parts": {
            "href": "/parts/titanium-motorsport-parts/"
          },
          "titanium parts": {
            "href": "/parts/"
          },
          "titanium pipe components": {
            "href": "/parts/titanium-pipe-components/"
          },
          "Titanium Rapid Prototyping": {
            "href": "/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Titanium Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Titanium TIG (GTAW) Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "titanium UAV components": {
            "href": "/parts/titanium-uav-components/"
          },
          "Titanium Welding & Assembly": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "ultrasonic cleaning": {
            "href": "/products/capabilities/ultrasonic-cleaning/"
          },
          "Waterjet Cutting": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "waterjet cutting of titanium": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "Wire EDM": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Wire EDM Machining": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "3/5-Achsen-CNC-Bearbeitung": {
            "href": "/de/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D-Druck SLM": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-Druck SLM/DMLS": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Additive Fertigung von Titan": {
            "href": "/de/titanium-additive-manufacturing/"
          },
          "Chemische Passivierung": {
            "href": "/de/titanium-surface-treatment/chemical-passivation/"
          },
          "Titan-Oberflächenbehandlung": {
            "href": "/de/titanium-surface-treatment/"
          },
          "Titanschweißen": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "CNC-Fräsen & Drehen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Titanschweißen & Montage": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "CNC-Fräsen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Drahterodieren (Wire EDM)": {
            "href": "/de/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Eloxieren (Typ II": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Eloxieren (Typ II & Typ III)": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Kleinserienproduktion": {
            "href": "/de/titanium-additive-manufacturing/low-volume-production/"
          },
          "Kundenspezifische Industriekomponenten": {
            "href": "/de/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Laserschneiden (Blech": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Laserschneiden (Blech & Rohr)": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Polieren": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polieren & Sandstrahlen": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Rohmaterialvorbereitung": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Rohmaterialvorbereitung & Zuschnitt": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titan-Blechverarbeitungsdienste": {
            "href": "/de/titanium-fabrication-services/"
          },
          "Titan-CNC-Bearbeitungsdienste": {
            "href": "/de/titanium-cnc-machining-services/"
          },
          "Titan-Strangpressen": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titan-Umformung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titan-Umformung & Schwerindustriefertigung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titanschmieden": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen": {
            "href": "/de/"
          },
          "Wasserstrahlschneiden": {
            "href": "/de/titanium-fabrication-services/waterjet-cutting/"
          },
          "化学的不動態化処理": {
            "href": "/ja/titanium-surface-treatment/chemical-passivation/"
          },
          "カスタム産業用部品": {
            "href": "/ja/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "CNCフライス・旋盤加工": {
            "href": "/ja/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "チタン増材製造（3Dプリンティング）": {
            "href": "/ja/titanium-additive-manufacturing/"
          },
          "チタン押出加工": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "ワイヤー放電加工": {
            "href": "/ja/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "総合チタン加工・製造サービス": {
            "href": "/ja/"
          },
          "3Dプリンティング SLM/DMLS": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "チタン製缶板金サービス": {
            "href": "/ja/titanium-fabrication-services/"
          },
          "チタン表面処理": {
            "href": "/ja/titanium-surface-treatment/"
          },
          "研磨・サンドブラスト": {
            "href": "/ja/titanium-surface-treatment/polishing-sandblasting/"
          },
          "ラピッドプロトタイピング": {
            "href": "/ja/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "チタン溶接・組立": {
            "href": "/ja/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "チタン鍛造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "陽極酸化処理（タイプIIおよびIII）": {
            "href": "/ja/titanium-surface-treatment/anodizing/"
          },
          "チタンCNC加工サービス": {
            "href": "/ja/titanium-cnc-machining-services/"
          },
          "少量生産": {
            "href": "/ja/titanium-additive-manufacturing/low-volume-production/"
          },
          "原材料準備・サイジング": {
            "href": "/ja/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "3Dプリンティング SLM": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "レーザー切断（シート＆チューブ）": {
            "href": "/ja/titanium-fabrication-services/laser-cutting/"
          },
          "ウォータージェット切断": {
            "href": "/ja/titanium-fabrication-services/waterjet-cutting/"
          },
          "チタン成形・重型製造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/"
          },
          "3/5軸CNC加工": {
            "href": "/ja/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodisation (Type II et Type III)": {
            "href": "/fr/titanium-surface-treatment/anodizing/"
          },
          "Extrusion du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Fabrication Additive de Titane": {
            "href": "/fr/titanium-additive-manufacturing/"
          },
          "Forgeage du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Formage du Titane et Fabrication Lourde": {
            "href": "/fr/titanium-forming-heavy-manufacturing/"
          },
          "Découpe Laser (Tôle et Tube)": {
            "href": "/fr/titanium-fabrication-services/laser-cutting/"
          },
          "Usinage par Électroérosion au Fil": {
            "href": "/fr/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Services de Fabrication de Tôlerie Titane": {
            "href": "/fr/titanium-fabrication-services/"
          },
          "Composants Industriels Personnalisés": {
            "href": "/fr/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Préparation et Dimensionnement des Matières Premières": {
            "href": "/fr/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Découpe au Jet d'Eau": {
            "href": "/fr/titanium-fabrication-services/waterjet-cutting/"
          },
          "Fraisage et Tournage CNC": {
            "href": "/fr/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Impression 3D SLM/DMLS": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impression 3D SLM": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Passivation Chimique": {
            "href": "/fr/titanium-surface-treatment/chemical-passivation/"
          },
          "Polissage et Sablage": {
            "href": "/fr/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Production en Faible Volume": {
            "href": "/fr/titanium-additive-manufacturing/low-volume-production/"
          },
          "Prototypage Rapide": {
            "href": "/fr/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Services Complets de Fabrication et de Traitement du Titane": {
            "href": "/fr/"
          },
          "Services d'Usinage CNC du Titane": {
            "href": "/fr/titanium-cnc-machining-services/"
          },
          "Soudage et Assemblage du Titane": {
            "href": "/fr/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Traitement de Surface du Titane": {
            "href": "/fr/titanium-surface-treatment/"
          },
          "Usinage CNC 3/5 Axes": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinage CNC 3": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodizado (Tipo II y Tipo III)": {
            "href": "/es/titanium-surface-treatment/anodizing/"
          },
          "Componentes Industriales Personalizados": {
            "href": "/es/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Corte por Chorro de Agua": {
            "href": "/es/titanium-fabrication-services/waterjet-cutting/"
          },
          "Impresión 3D SLM/DMLS": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Preparación y Dimensionamiento de Materias Primas": {
            "href": "/es/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Impresión 3D SLM": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Conformado de Titanio y Fabricación Pesada": {
            "href": "/es/titanium-forming-heavy-manufacturing/"
          },
          "Producción de Bajo Volumen": {
            "href": "/es/titanium-additive-manufacturing/low-volume-production/"
          },
          "Prototipado Rápido": {
            "href": "/es/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Extrusión de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Mecanizado por Electroerosión por Hilo": {
            "href": "/es/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Fabricación Aditiva de Titanio": {
            "href": "/es/titanium-additive-manufacturing/"
          },
          "Servicios de Fabricación de Titanio": {
            "href": "/es/titanium-fabrication-services/"
          },
          "Pasivación Química": {
            "href": "/es/titanium-surface-treatment/chemical-passivation/"
          },
          "Servicios Integrales de Fabricación y Procesamiento de Titanio": {
            "href": "/es/"
          },
          "Corte Láser (Chapa y Tubo)": {
            "href": "/es/titanium-fabrication-services/laser-cutting/"
          },
          "Forja de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Fresado y Torneado CNC": {
            "href": "/es/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Mecanizado CNC de 3/5 Ejes": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Mecanizado CNC de 3": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Pulido y Chorreado de Arena": {
            "href": "/es/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Servicios de Mecanizado CNC de Titanio": {
            "href": "/es/titanium-cnc-machining-services/"
          },
          "Soldadura y Ensamblaje de Titanio": {
            "href": "/es/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Tratamiento de Superficie de Titanio": {
            "href": "/es/titanium-surface-treatment/"
          },
          "Componentes Industriais Personalizados": {
            "href": "/pt/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Corte a Laser (Chapa e Tubo)": {
            "href": "/pt/titanium-fabrication-services/laser-cutting/"
          },
          "Fresamento e Torneamento CNC": {
            "href": "/pt/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Polimento e Jateamento de Areia": {
            "href": "/pt/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Impressão 3D SLM/DMLS": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Preparação e Dimensionamento de Matéria-Prima": {
            "href": "/pt/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Serviços de Usinagem CNC de Titânio": {
            "href": "/pt/titanium-cnc-machining-services/"
          },
          "Usinagem por Eletroerosão a Fio": {
            "href": "/pt/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Produção de Baixo Volume": {
            "href": "/pt/titanium-additive-manufacturing/low-volume-production/"
          },
          "Passivação Química": {
            "href": "/pt/titanium-surface-treatment/chemical-passivation/"
          },
          "Soldagem e Montagem de Titânio": {
            "href": "/pt/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Manufatura Aditiva de Titânio": {
            "href": "/pt/titanium-additive-manufacturing/"
          },
          "Extrusão de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Forjamento de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Tratamento de Superfície de Titânio": {
            "href": "/pt/titanium-surface-treatment/"
          },
          "Prototipagem Rápida": {
            "href": "/pt/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Anodização (Tipo II e Tipo III)": {
            "href": "/pt/titanium-surface-treatment/anodizing/"
          },
          "Corte a Jato de Água": {
            "href": "/pt/titanium-fabrication-services/waterjet-cutting/"
          },
          "Serviços Abrangentes de Fabricação e Processamento de Titânio": {
            "href": "/pt/"
          },
          "Serviços de Fabricação de Titânio": {
            "href": "/pt/titanium-fabrication-services/"
          },
          "Impressão 3D SLM": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Conformação de Titânio e Fabricação Pesada": {
            "href": "/pt/titanium-forming-heavy-manufacturing/"
          },
          "Usinagem CNC de 3/5 Eixos": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinagem CNC de 3": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodizzazione (Tipo II e Tipo III)": {
            "href": "/it/titanium-surface-treatment/anodizing/"
          },
          "Componenti Industriali Personalizzati": {
            "href": "/it/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Estrusione del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Forgiatura del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Formatura del Titanio e Produzione Pesante": {
            "href": "/it/titanium-forming-heavy-manufacturing/"
          },
          "Fresatura e Tornitura CNC": {
            "href": "/it/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Lavorazione CNC a 3/5 Assi": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione CNC a 3": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione per Elettroerosione a Filo": {
            "href": "/it/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Lucidatura e Sabbiatura": {
            "href": "/it/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Passivazione Chimica": {
            "href": "/it/titanium-surface-treatment/chemical-passivation/"
          },
          "Preparazione e Dimensionamento delle Materie Prime": {
            "href": "/it/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Produzione a Basso Volume": {
            "href": "/it/titanium-additive-manufacturing/low-volume-production/"
          },
          "Produzione Additiva di Titanio": {
            "href": "/it/titanium-additive-manufacturing/"
          },
          "Prototipazione Rapida": {
            "href": "/it/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Saldatura e Assemblaggio del Titanio": {
            "href": "/it/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Servizi Complete di Produzione e Lavorazione del Titanio": {
            "href": "/it/"
          },
          "Servizi di Fabbricazione del Titanio": {
            "href": "/it/titanium-fabrication-services/"
          },
          "Servizi di Lavorazione CNC del Titanio": {
            "href": "/it/titanium-cnc-machining-services/"
          },
          "Stampa 3D SLM/DMLS": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Stampa 3D SLM": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Taglio a Getto d'Acqua": {
            "href": "/it/titanium-fabrication-services/waterjet-cutting/"
          },
          "Taglio Laser (Lamiera e Tubo)": {
            "href": "/it/titanium-fabrication-services/laser-cutting/"
          },
          "Trattamento Superficiale del Titanio": {
            "href": "/it/titanium-surface-treatment/"
          },
          "소량 생산": {
            "href": "/ko/titanium-additive-manufacturing/low-volume-production/"
          },
          "티타늄 용접 및 조립": {
            "href": "/ko/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "티타늄 단조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "티타늄 압출": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "아노다이징 (타입 II 및 III)": {
            "href": "/ko/titanium-surface-treatment/anodizing/"
          },
          "3D 프린팅 SLM/DMLS": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "와이어 방전 가공": {
            "href": "/ko/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "티타늄 표면 처리": {
            "href": "/ko/titanium-surface-treatment/"
          },
          "래피드 프로토타이핑": {
            "href": "/ko/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "원자재 준비 및 사이징": {
            "href": "/ko/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "연마 및 샌드블라스팅": {
            "href": "/ko/titanium-surface-treatment/polishing-sandblasting/"
          },
          "종합 티타늄 가공 및 제조 서비스": {
            "href": "/ko/"
          },
          "티타늄 적층 제조": {
            "href": "/ko/titanium-additive-manufacturing/"
          },
          "티타늄 판금 제작 서비스": {
            "href": "/ko/titanium-fabrication-services/"
          },
          "맞춤형 산업용 부품": {
            "href": "/ko/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "티타늄 CNC 가공 서비스": {
            "href": "/ko/titanium-cnc-machining-services/"
          },
          "티타늄 성형 및 중공업 제조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/"
          },
          "레이저 절단 (시트 및 튜브)": {
            "href": "/ko/titanium-fabrication-services/laser-cutting/"
          },
          "3/5축 CNC 가공": {
            "href": "/ko/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC 밀링 및 선반 가공": {
            "href": "/ko/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "3D 프린팅 SLM": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "화학적 부동태화": {
            "href": "/ko/titanium-surface-treatment/chemical-passivation/"
          },
          "워터젯 절단": {
            "href": "/ko/titanium-fabrication-services/waterjet-cutting/"
          },
          "3/5-Assige CNC-bewerking": {
            "href": "/nl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D-printen SLM/DMLS": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-printen SLM": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Additieve Productie van Titanium": {
            "href": "/nl/titanium-additive-manufacturing/"
          },
          "Anodiseren (Type II": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Anodiseren (Type II & Type III)": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Chemische Passivering": {
            "href": "/nl/titanium-surface-treatment/chemical-passivation/"
          },
          "CNC Frezen en Draaien": {
            "href": "/nl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Draadvonken (Wire EDM)": {
            "href": "/nl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Grondstofvoorbereiding en -bepaling": {
            "href": "/nl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Lasersnijden (Plaat & Buis)": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Lasersnijden (Plaat": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Op maat gemaakte industriële componenten": {
            "href": "/nl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Oppervlaktebehandeling van Titanium": {
            "href": "/nl/titanium-surface-treatment/"
          },
          "Polijsten en Zandstralen": {
            "href": "/nl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Productie in kleine oplage": {
            "href": "/nl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium CNC-bewerkingsdiensten": {
            "href": "/nl/titanium-cnc-machining-services/"
          },
          "Titanium Extrusie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titanium Fabricagediensten": {
            "href": "/nl/titanium-fabrication-services/"
          },
          "Titanium Smeden": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Vormen en Zware Productie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/"
          },
          "Titaniumlassen en Assemblage": {
            "href": "/nl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Uitgebreide Titanium Productie- en Verwerkingsdiensten": {
            "href": "/nl/"
          },
          "Waterjetsnijden": {
            "href": "/nl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Anodowanie (Typ II i Typ III)": {
            "href": "/pl/titanium-surface-treatment/anodizing/"
          },
          "Druk 3D SLM/DMLS": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Druk 3D SLM": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Frezowanie i Toczenie CNC": {
            "href": "/pl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Kucie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Pasywacja Chemiczna": {
            "href": "/pl/titanium-surface-treatment/chemical-passivation/"
          },
          "Usługi Obróbki CNC Tytanu": {
            "href": "/pl/titanium-cnc-machining-services/"
          },
          "Cięcie Laserowe (Blacha i Rura)": {
            "href": "/pl/titanium-fabrication-services/laser-cutting/"
          },
          "Obróbka Powierzchniowa Tytanu": {
            "href": "/pl/titanium-surface-treatment/"
          },
          "Obróbka Elektroerozyjna Drutowa (EDM)": {
            "href": "/pl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Niestandardowe Komponenty Przemysłowe": {
            "href": "/pl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Spawanie i Montaż Tytanu": {
            "href": "/pl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Produkcja Niskonakładowa": {
            "href": "/pl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Usługi Obróbki Plastycznej Tytanu": {
            "href": "/pl/titanium-fabrication-services/"
          },
          "Obróbka CNC 3": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Formowanie Tytanu i Produkcja Ciężka": {
            "href": "/pl/titanium-forming-heavy-manufacturing/"
          },
          "Obróbka CNC 3/5-osiowa": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Cięcie Wodne": {
            "href": "/pl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Kompleksowe Usługi Produkcji i Obróbki Tytanu": {
            "href": "/pl/"
          },
          "Polerowanie i Piaskowanie": {
            "href": "/pl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Przygotowanie i Wymiarowanie Surowca": {
            "href": "/pl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Szybkie Prototypowanie": {
            "href": "/pl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Wyciskanie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Wytwarzanie Addytywne Tytanu": {
            "href": "/pl/titanium-additive-manufacturing/"
          }
      }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-remove-scroll') ||
                id.includes('node_modules/@radix-ui/react-dialog') ||
                id.includes('node_modules/react-style-singleton') ||
                id.includes('node_modules/use-callback-ref') ||
                id.includes('node_modules/use-sidecar') ||
                id.includes('node_modules/@radix-ui/react-dismissable-layer') ||
                id.includes('node_modules/@radix-ui/react-focus-scope') ||
                id.includes('node_modules/@radix-ui/react-focus-guards') ||
                id.includes('node_modules/@radix-ui/react-presence') ||
                id.includes('node_modules/@radix-ui/react-primitive') ||
                id.includes('node_modules/@radix-ui/react-portal') ||
                id.includes('node_modules/@radix-ui/react-use-escape-keydown') ||
                id.includes('node_modules/@radix-ui/react-use-callback-ref') ||
                id.includes('node_modules/@radix-ui/react-use-controllable-state') ||
                id.includes('node_modules/@radix-ui/react-use-layout-effect') ||
                id.includes('node_modules/@radix-ui/react-compose-refs') ||
                id.includes('node_modules/@radix-ui/react-context') ||
                id.includes('node_modules/@radix-ui/react-slot') ||
                id.includes('node_modules/detect-node-es') ||
                id.includes('node_modules/tslib')) {
              return 'vendor-dialog';
            }
            if (id.includes('node_modules/motion') ||
                id.includes('node_modules/framer-motion') ||
                id.includes('node_modules/motion-dom') ||
                id.includes('node_modules/motion-utils')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/react-dom') ||
                id.includes('node_modules/scheduler')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
});
