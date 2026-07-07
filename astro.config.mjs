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
          "Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen": {
            "href": "/de/"
          },
          "総合チタン加工・製造サービス": {
            "href": "/ja/"
          },
          "Services Complets de Fabrication et de Traitement du Titane": {
            "href": "/fr/"
          },
          "Servicios Integrales de Fabricación y Procesamiento de Titanio": {
            "href": "/es/"
          },
          "Serviços Abrangentes de Fabricação e Processamento de Titânio": {
            "href": "/pt/"
          },
          "Servizi Complete di Produzione e Lavorazione del Titanio": {
            "href": "/it/"
          },
          "종합 티타늄 가공 및 제조 서비스": {
            "href": "/ko/"
          },
          "Uitgebreide Titanium Productie- en Verwerkingsdiensten": {
            "href": "/nl/"
          },
          "Kompleksowe Usługi Produkcji i Obróbki Tytanu": {
            "href": "/pl/"
          },
          "Titanium CNC Machining Services": {
            "href": "/titanium-cnc-machining-services/"
          },
          "Titan-CNC-Bearbeitungsdienste": {
            "href": "/de/titanium-cnc-machining-services/"
          },
          "チタンCNC加工サービス": {
            "href": "/ja/titanium-cnc-machining-services/"
          },
          "Services d'Usinage CNC du Titane": {
            "href": "/fr/titanium-cnc-machining-services/"
          },
          "Servicios de Mecanizado CNC de Titanio": {
            "href": "/es/titanium-cnc-machining-services/"
          },
          "Serviços de Usinagem CNC de Titânio": {
            "href": "/pt/titanium-cnc-machining-services/"
          },
          "Servizi di Lavorazione CNC del Titanio": {
            "href": "/it/titanium-cnc-machining-services/"
          },
          "티타늄 CNC 가공 서비스": {
            "href": "/ko/titanium-cnc-machining-services/"
          },
          "Titanium CNC-bewerkingsdiensten": {
            "href": "/nl/titanium-cnc-machining-services/"
          },
          "Usługi Obróbki CNC Tytanu": {
            "href": "/pl/titanium-cnc-machining-services/"
          },
          "3/5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5-Achsen-CNC-Bearbeitung": {
            "href": "/de/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5軸CNC加工": {
            "href": "/ja/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinage CNC 3/5 Axes": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinage CNC 3": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Mecanizado CNC de 3/5 Ejes": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Mecanizado CNC de 3": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinagem CNC de 3/5 Eixos": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinagem CNC de 3": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione CNC a 3/5 Assi": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione CNC a 3": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5축 CNC 가공": {
            "href": "/ko/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5-Assige CNC-bewerking": {
            "href": "/nl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Obróbka CNC 3/5-osiowa": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Obróbka CNC 3": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC Milling & Turning": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC-Fräsen & Drehen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC-Fräsen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNCフライス・旋盤加工": {
            "href": "/ja/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Fraisage et Tournage CNC": {
            "href": "/fr/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Fresado y Torneado CNC": {
            "href": "/es/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Fresamento e Torneamento CNC": {
            "href": "/pt/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Fresatura e Tornitura CNC": {
            "href": "/it/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC 밀링 및 선반 가공": {
            "href": "/ko/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Frezen en Draaien": {
            "href": "/nl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Frezowanie i Toczenie CNC": {
            "href": "/pl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Wire EDM Machining": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Drahterodieren (Wire EDM)": {
            "href": "/de/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "ワイヤー放電加工": {
            "href": "/ja/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Usinage par Électroérosion au Fil": {
            "href": "/fr/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Mecanizado por Electroerosión por Hilo": {
            "href": "/es/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Usinagem por Eletroerosão a Fio": {
            "href": "/pt/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Lavorazione per Elettroerosione a Filo": {
            "href": "/it/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "와이어 방전 가공": {
            "href": "/ko/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Draadvonken (Wire EDM)": {
            "href": "/nl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Obróbka Elektroerozyjna Drutowa (EDM)": {
            "href": "/pl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Custom Industrial Components": {
            "href": "/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Kundenspezifische Industriekomponenten": {
            "href": "/de/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "カスタム産業用部品": {
            "href": "/ja/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Composants Industriels Personnalisés": {
            "href": "/fr/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Componentes Industriales Personalizados": {
            "href": "/es/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Componentes Industriais Personalizados": {
            "href": "/pt/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Componenti Industriali Personalizzati": {
            "href": "/it/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "맞춤형 산업용 부품": {
            "href": "/ko/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Op maat gemaakte industriële componenten": {
            "href": "/nl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Niestandardowe Komponenty Przemysłowe": {
            "href": "/pl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Titanium Additive Manufacturing": {
            "href": "/titanium-additive-manufacturing/"
          },
          "Additive Fertigung von Titan": {
            "href": "/de/titanium-additive-manufacturing/"
          },
          "チタン増材製造（3Dプリンティング）": {
            "href": "/ja/titanium-additive-manufacturing/"
          },
          "Fabrication Additive de Titane": {
            "href": "/fr/titanium-additive-manufacturing/"
          },
          "Fabricación Aditiva de Titanio": {
            "href": "/es/titanium-additive-manufacturing/"
          },
          "Manufatura Aditiva de Titânio": {
            "href": "/pt/titanium-additive-manufacturing/"
          },
          "Produzione Additiva di Titanio": {
            "href": "/it/titanium-additive-manufacturing/"
          },
          "티타늄 적층 제조": {
            "href": "/ko/titanium-additive-manufacturing/"
          },
          "Additieve Productie van Titanium": {
            "href": "/nl/titanium-additive-manufacturing/"
          },
          "Wytwarzanie Addytywne Tytanu": {
            "href": "/pl/titanium-additive-manufacturing/"
          },
          "3D Printing SLM/DMLS": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D Printing SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-Druck SLM/DMLS": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-Druck SLM": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3Dプリンティング SLM/DMLS": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3Dプリンティング SLM": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impression 3D SLM/DMLS": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impression 3D SLM": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impresión 3D SLM/DMLS": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impresión 3D SLM": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impressão 3D SLM/DMLS": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impressão 3D SLM": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Stampa 3D SLM/DMLS": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Stampa 3D SLM": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D 프린팅 SLM/DMLS": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D 프린팅 SLM": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-printen SLM/DMLS": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-printen SLM": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Druk 3D SLM/DMLS": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Druk 3D SLM": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Rapid Prototyping": {
            "href": "/nl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "ラピッドプロトタイピング": {
            "href": "/ja/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Prototypage Rapide": {
            "href": "/fr/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Prototipado Rápido": {
            "href": "/es/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Prototipagem Rápida": {
            "href": "/pt/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Prototipazione Rapida": {
            "href": "/it/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "래피드 프로토타이핑": {
            "href": "/ko/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Szybkie Prototypowanie": {
            "href": "/pl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Low-Volume Production": {
            "href": "/titanium-additive-manufacturing/low-volume-production/"
          },
          "Kleinserienproduktion": {
            "href": "/de/titanium-additive-manufacturing/low-volume-production/"
          },
          "少量生産": {
            "href": "/ja/titanium-additive-manufacturing/low-volume-production/"
          },
          "Production en Faible Volume": {
            "href": "/fr/titanium-additive-manufacturing/low-volume-production/"
          },
          "Producción de Bajo Volumen": {
            "href": "/es/titanium-additive-manufacturing/low-volume-production/"
          },
          "Produção de Baixo Volume": {
            "href": "/pt/titanium-additive-manufacturing/low-volume-production/"
          },
          "Produzione a Basso Volume": {
            "href": "/it/titanium-additive-manufacturing/low-volume-production/"
          },
          "소량 생산": {
            "href": "/ko/titanium-additive-manufacturing/low-volume-production/"
          },
          "Productie in kleine oplage": {
            "href": "/nl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Produkcja Niskonakładowa": {
            "href": "/pl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium Fabrication Services": {
            "href": "/titanium-fabrication-services/"
          },
          "Titan-Blechverarbeitungsdienste": {
            "href": "/de/titanium-fabrication-services/"
          },
          "チタン製缶板金サービス": {
            "href": "/ja/titanium-fabrication-services/"
          },
          "Services de Fabrication de Tôlerie Titane": {
            "href": "/fr/titanium-fabrication-services/"
          },
          "Servicios de Fabricación de Titanio": {
            "href": "/es/titanium-fabrication-services/"
          },
          "Serviços de Fabricação de Titânio": {
            "href": "/pt/titanium-fabrication-services/"
          },
          "Servizi di Fabbricazione del Titanio": {
            "href": "/it/titanium-fabrication-services/"
          },
          "티타늄 판금 제작 서비스": {
            "href": "/ko/titanium-fabrication-services/"
          },
          "Titanium Fabricagediensten": {
            "href": "/nl/titanium-fabrication-services/"
          },
          "Usługi Obróbki Plastycznej Tytanu": {
            "href": "/pl/titanium-fabrication-services/"
          },
          "Laser Cutting (Sheet & Tube)": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laserschneiden (Blech & Rohr)": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Laserschneiden (Blech": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "レーザー切断（シート＆チューブ）": {
            "href": "/ja/titanium-fabrication-services/laser-cutting/"
          },
          "Découpe Laser (Tôle et Tube)": {
            "href": "/fr/titanium-fabrication-services/laser-cutting/"
          },
          "Corte Láser (Chapa y Tubo)": {
            "href": "/es/titanium-fabrication-services/laser-cutting/"
          },
          "Corte a Laser (Chapa e Tubo)": {
            "href": "/pt/titanium-fabrication-services/laser-cutting/"
          },
          "Taglio Laser (Lamiera e Tubo)": {
            "href": "/it/titanium-fabrication-services/laser-cutting/"
          },
          "레이저 절단 (시트 및 튜브)": {
            "href": "/ko/titanium-fabrication-services/laser-cutting/"
          },
          "Lasersnijden (Plaat & Buis)": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Lasersnijden (Plaat": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Cięcie Laserowe (Blacha i Rura)": {
            "href": "/pl/titanium-fabrication-services/laser-cutting/"
          },
          "Waterjet Cutting": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "Wasserstrahlschneiden": {
            "href": "/de/titanium-fabrication-services/waterjet-cutting/"
          },
          "ウォータージェット切断": {
            "href": "/ja/titanium-fabrication-services/waterjet-cutting/"
          },
          "Découpe au Jet d'Eau": {
            "href": "/fr/titanium-fabrication-services/waterjet-cutting/"
          },
          "Corte por Chorro de Agua": {
            "href": "/es/titanium-fabrication-services/waterjet-cutting/"
          },
          "Corte a Jato de Água": {
            "href": "/pt/titanium-fabrication-services/waterjet-cutting/"
          },
          "Taglio a Getto d'Acqua": {
            "href": "/it/titanium-fabrication-services/waterjet-cutting/"
          },
          "워터젯 절단": {
            "href": "/ko/titanium-fabrication-services/waterjet-cutting/"
          },
          "Waterjetsnijden": {
            "href": "/nl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Cięcie Wodne": {
            "href": "/pl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Titanium Welding & Assembly": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanschweißen & Montage": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanschweißen": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "チタン溶接・組立": {
            "href": "/ja/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Soudage et Assemblage du Titane": {
            "href": "/fr/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Soldadura y Ensamblaje de Titanio": {
            "href": "/es/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Soldagem e Montagem de Titânio": {
            "href": "/pt/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Saldatura e Assemblaggio del Titanio": {
            "href": "/it/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "티타늄 용접 및 조립": {
            "href": "/ko/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titaniumlassen en Assemblage": {
            "href": "/nl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Spawanie i Montaż Tytanu": {
            "href": "/pl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Forming & Heavy Manufacturing": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forming": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titan-Umformung & Schwerindustriefertigung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titan-Umformung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "チタン成形・重型製造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/"
          },
          "Formage du Titane et Fabrication Lourde": {
            "href": "/fr/titanium-forming-heavy-manufacturing/"
          },
          "Conformado de Titanio y Fabricación Pesada": {
            "href": "/es/titanium-forming-heavy-manufacturing/"
          },
          "Conformação de Titânio e Fabricação Pesada": {
            "href": "/pt/titanium-forming-heavy-manufacturing/"
          },
          "Formatura del Titanio e Produzione Pesante": {
            "href": "/it/titanium-forming-heavy-manufacturing/"
          },
          "티타늄 성형 및 중공업 제조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Vormen en Zware Productie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/"
          },
          "Formowanie Tytanu i Produkcja Ciężka": {
            "href": "/pl/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forging": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanschmieden": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "チタン鍛造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Forgeage du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Forja de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Forjamento de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Forgiatura del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "티타늄 단조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Smeden": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Kucie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Extrusion": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titan-Strangpressen": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "チタン押出加工": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Extrusion du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Extrusión de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Extrusão de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Estrusione del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "티타늄 압출": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titanium Extrusie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Wyciskanie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Raw Material Preparation & Sizing": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Raw Material Preparation": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Rohmaterialvorbereitung & Zuschnitt": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Rohmaterialvorbereitung": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "原材料準備・サイジング": {
            "href": "/ja/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Préparation et Dimensionnement des Matières Premières": {
            "href": "/fr/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Preparación y Dimensionamiento de Materias Primas": {
            "href": "/es/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Preparação e Dimensionamento de Matéria-Prima": {
            "href": "/pt/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Preparazione e Dimensionamento delle Materie Prime": {
            "href": "/it/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "원자재 준비 및 사이징": {
            "href": "/ko/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Grondstofvoorbereiding en -bepaling": {
            "href": "/nl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Przygotowanie i Wymiarowanie Surowca": {
            "href": "/pl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titanium Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Titan-Oberflächenbehandlung": {
            "href": "/de/titanium-surface-treatment/"
          },
          "チタン表面処理": {
            "href": "/ja/titanium-surface-treatment/"
          },
          "Traitement de Surface du Titane": {
            "href": "/fr/titanium-surface-treatment/"
          },
          "Tratamiento de Superficie de Titanio": {
            "href": "/es/titanium-surface-treatment/"
          },
          "Tratamento de Superfície de Titânio": {
            "href": "/pt/titanium-surface-treatment/"
          },
          "Trattamento Superficiale del Titanio": {
            "href": "/it/titanium-surface-treatment/"
          },
          "티타늄 표면 처리": {
            "href": "/ko/titanium-surface-treatment/"
          },
          "Oppervlaktebehandeling van Titanium": {
            "href": "/nl/titanium-surface-treatment/"
          },
          "Obróbka Powierzchniowa Tytanu": {
            "href": "/pl/titanium-surface-treatment/"
          },
          "Anodizing (Type II & Type III)": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Eloxieren (Typ II & Typ III)": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Eloxieren (Typ II": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "陽極酸化処理（タイプIIおよびIII）": {
            "href": "/ja/titanium-surface-treatment/anodizing/"
          },
          "Anodisation (Type II et Type III)": {
            "href": "/fr/titanium-surface-treatment/anodizing/"
          },
          "Anodizado (Tipo II y Tipo III)": {
            "href": "/es/titanium-surface-treatment/anodizing/"
          },
          "Anodização (Tipo II e Tipo III)": {
            "href": "/pt/titanium-surface-treatment/anodizing/"
          },
          "Anodizzazione (Tipo II e Tipo III)": {
            "href": "/it/titanium-surface-treatment/anodizing/"
          },
          "아노다이징 (타입 II 및 III)": {
            "href": "/ko/titanium-surface-treatment/anodizing/"
          },
          "Anodiseren (Type II & Type III)": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Anodiseren (Type II": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Anodowanie (Typ II i Typ III)": {
            "href": "/pl/titanium-surface-treatment/anodizing/"
          },
          "Chemical Passivation": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "Chemische Passivierung": {
            "href": "/de/titanium-surface-treatment/chemical-passivation/"
          },
          "化学的不動態化処理": {
            "href": "/ja/titanium-surface-treatment/chemical-passivation/"
          },
          "Passivation Chimique": {
            "href": "/fr/titanium-surface-treatment/chemical-passivation/"
          },
          "Pasivación Química": {
            "href": "/es/titanium-surface-treatment/chemical-passivation/"
          },
          "Passivação Química": {
            "href": "/pt/titanium-surface-treatment/chemical-passivation/"
          },
          "Passivazione Chimica": {
            "href": "/it/titanium-surface-treatment/chemical-passivation/"
          },
          "화학적 부동태화": {
            "href": "/ko/titanium-surface-treatment/chemical-passivation/"
          },
          "Chemische Passivering": {
            "href": "/nl/titanium-surface-treatment/chemical-passivation/"
          },
          "Pasywacja Chemiczna": {
            "href": "/pl/titanium-surface-treatment/chemical-passivation/"
          },
          "Polishing & Sandblasting": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polishing": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polieren & Sandstrahlen": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polieren": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "研磨・サンドブラスト": {
            "href": "/ja/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polissage et Sablage": {
            "href": "/fr/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Pulido y Chorreado de Arena": {
            "href": "/es/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polimento e Jateamento de Areia": {
            "href": "/pt/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Lucidatura e Sabbiatura": {
            "href": "/it/titanium-surface-treatment/polishing-sandblasting/"
          },
          "연마 및 샌드블라스팅": {
            "href": "/ko/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polijsten en Zandstralen": {
            "href": "/nl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polerowanie i Piaskowanie": {
            "href": "/pl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Ti-6Al-4V": {
            "href": "/materials/grade-5/"
          },
          "Grade 5 Titanium": {
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
          "AMS 4928T": {
            "href": "/materials/grade-5/"
          },
          "NADCAP": {
            "href": "/capabilities/"
          },
          "5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Wire EDM": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "CMM": {
            "href": "/equipment/cmm/"
          },
          "SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "RFQ": {
            "href": "/rfq/"
          }
      }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});