const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '..', 'src', 'i18n', 'translations');
const enPath = path.join(translationsDir, 'en.json');
const koPath = path.join(translationsDir, 'ko.json');

// Read existing files
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ko = JSON.parse(fs.readFileSync(koPath, 'utf8'));

// All missing marine keys with Korean translations
const koTranslations = {
  // ===== PAGE META =====
  "industries.marine.page.title": "해양 및 수중 티타늄 CNC 가공 | 내식성 엔지니어링",
  "industries.marine.page.description": "Grade 2/12 티타늄 수중 인클로저, 해양 체결구 및 해양학 센서 부품의 정밀 CNC 가공.",
  "industries.marine.page.serviceName": "해양 및 수중 티타늄 CNC 가공 서비스",
  "industries.marine.page.serviceCategory": "해양 엔지니어링",
  "industries.marine.page.productName": "수중 인클로저, 압력 용기, 해양 체결구 및 밸브 블록",
  "industries.marine.page.productCategory": "해양 부품",

  // ===== HERO =====
  "industries.marine.hero.h1": "해양 및 수중용 내식성 티타늄 CNC 가공",
  "industries.marine.hero.subtitle": "수심 수 킬로미터의 정수압을 견디도록 설계된 정밀 가공 티타늄 수중 인클로저 및 압력 용기. Grade 2 및 Grade 5 티타늄의 다축 밀링으로 기계적 응력 집중을 제거합니다.",
  "industries.marine.hero.badge": "해양 및 수중",
  "industries.marine.hero.metric1.value": "±0.01mm",
  "industries.marine.hero.metric1.label": "위치 공차",
  "industries.marine.hero.metric2.value": "6000m",
  "industries.marine.hero.metric2.label": "정격 수심",
  "industries.marine.hero.metric3.value": "Ra ≤ 0.8μm",
  "industries.marine.hero.metric3.label": "표면 조도",
  "industries.marine.hero.chip0": "5축 CNC",
  "industries.marine.hero.chip1": "Grade 2/5 Ti",
  "industries.marine.hero.chip2": "수중 등급",
  "industries.marine.hero.chip3": "내식성",
  "industries.marine.hero.chip4": "MTR 추적성",

  // ===== SUBSEA SECTION =====
  "industries.marine.subsea.badge": "수중 엔지니어링",
  "industries.marine.subsea.title.main": "다축 CNC 밀링",
  "industries.marine.subsea.title.suffix": "수중 인클로저, 압력 용기 및 음향 센서 하우징",
  "industries.marine.subsea.desc": "수심 수 킬로미터의 정수압에 정격된 정밀 가공 티타늄 수중 인클로저 및 압력 용기. 후육 Grade 2 및 Grade 5 티타늄의 다축 밀링으로 기계적 응력 집중을 제거합니다.",
  "industries.marine.subsea.entityLabel": "엔티티 클러스터",
  "industries.marine.subsea.entity.0": "다축 CNC 밀링",
  "industries.marine.subsea.entity.1": "수중 인클로저",
  "industries.marine.subsea.entity.2": "압력 용기",
  "industries.marine.subsea.entity.3": "Grade 2 티타늄",
  "industries.marine.subsea.entity.4": "정수압",
  "industries.marine.subsea.card1.title": "심해 압력 용기",
  "industries.marine.subsea.card1.subtitle": "다축 CNC · Grade 2/5 Ti · 정수압 정격",
  "industries.marine.subsea.card1.desc": "Grade 2 및 Grade 5 티타늄으로 제작된 심해 정압 하우징 및 압력 용기는 O-링 밀봉 시트와 ±0.01mm 위치 공차로 정밀 가공되어 수심 6000m에서도 안정적인 밀봉을 보장합니다.",
  "industries.marine.subsea.card1.implLabel": "기술 구현",
  "industries.marine.subsea.card1.item1": "O-링 그루브 밀봉 시트 — ±0.01mm 위치 공차로 수심 6000m에서 안정적인 압력 유지",
  "industries.marine.subsea.card1.item2": "응력 제거 가공 시퀀스 — 후육 압력 경계에서 미세 변형 제거",
  "industries.marine.subsea.card1.item3": "Grade 2 순수 티타늄 — 갈바닉 반응이 없는 탁월한 해수 내식성",
  "industries.marine.subsea.card2.title": "음향 센서 및 카메라 하우징",
  "industries.marine.subsea.card2.subtitle": "박벽 음향 창 · Grade 5 Ti · 6000m 수심",
  "industries.marine.subsea.card2.desc": "수중 음향 센서 및 이미징 카메라는 복잡한 밀봉 형상을 가진 하우징이 필요합니다.",
  "industries.marine.subsea.card2.implLabel": "기술 구현",
  "industries.marine.subsea.card2.item1": "음향 창 밀봉 표면 Ra 0.8μm로 가공",
  "industries.marine.subsea.card2.item2": "6000m 수심 정격 테이퍼 밀봉면을 갖춘 케이블 관통 포트",
  "industries.marine.subsea.card2.item3": "100% 정수압 테스트 검증 가능",

  // ===== CORROSION SECTION =====
  "industries.marine.corrosion.badge": "부식 완화",
  "industries.marine.corrosion.title.main": "정밀 CNC 선삭",
  "industries.marine.corrosion.title.suffix": "Grade 12 티타늄 해양 체결구 및 틈새 부식 완화",
  "industries.marine.corrosion.desc": "해양 체결구 및 비말대 하드웨어용 Grade 12 티타늄(Ti-0.3Mo-0.8Ni) 특수 정밀 선삭.",
  "industries.marine.corrosion.entityLabel": "엔티티 클러스터",
  "industries.marine.corrosion.entity.0": "정밀 CNC 선삭",
  "industries.marine.corrosion.entity.1": "Grade 12 Ti-0.3Mo-0.8Ni",
  "industries.marine.corrosion.entity.2": "해양 체결구",
  "industries.marine.corrosion.entity.3": "밸브 블록",
  "industries.marine.corrosion.entity.4": "틈새 부식",
  "industries.marine.corrosion.card1.title": "Grade 12 티타늄 선삭",
  "industries.marine.corrosion.card1.subtitle": "CNC 선삭 · Ti-0.3Mo-0.8Ni · 해양 체결구",
  "industries.marine.corrosion.card1.desc": "Grade 12 티타늄(Ti-0.3Mo-0.8Ni)은 표준 티타늄 합금이 틈새 부식을 경험할 수 있는 가혹한 해양 환경을 위해 설계되었습니다.",
  "industries.marine.corrosion.card1.implLabel": "기술 구현",
  "industries.marine.corrosion.card1.item1": "Ra ≤ 0.4μm 나사산 마감 — 체결구 나사산의 염화물 피팅 제거",
  "industries.marine.corrosion.card1.item2": "다중 패스 냉간 압연 — 비말대 체결구의 수소 취성 방지",
  "industries.marine.corrosion.card1.item3": "100% 치수 및 표면 조도 검사 — 모든 해양 체결구 사양 검증",
  "industries.marine.corrosion.card2.title": "수중 밸브 블록 제조",
  "industries.marine.corrosion.card2.subtitle": "CNC 선삭 · Ra ≤ 0.4μm · NPT 나사산",
  "industries.marine.corrosion.card2.desc": "수중 유압 시스템은 내식성 유체 채널을 갖춘 밸브 블록을 필요로 합니다.",
  "industries.marine.corrosion.card2.implLabel": "기술 구현",
  "industries.marine.corrosion.card2.item1": "미러 마감 밀봉 표면 — 밸브 본체 연결부의 틈새 부식 부위 제거",
  "industries.marine.corrosion.card2.item2": "수중 유압 시스템용 ASME B1.20.1 기준 NPT/API 나사산",
  "industries.marine.corrosion.card2.item3": "모든 밀봉 표면의 침투탐상검사 — 표면 파손 결함 제로 검증",

  // ===== VALIDATION SECTION =====
  "industries.marine.validation.badge": "검증 및 테스트",
  "industries.marine.validation.title.main": "CMM 치수 검증",
  "industries.marine.validation.title.suffix": "정수압 테스트 및 O-링 밀봉 검증",
  "industries.marine.validation.desc": "ASME Y14.5 GD&T에 따른 CMM 검증을 통한 절대 치수 제어와 문서화된 정수압 테스트.",
  "industries.marine.validation.entityLabel": "엔티티 클러스터",
  "industries.marine.validation.entity.0": "CMM(삼차원 측정기)",
  "industries.marine.validation.entity.1": "정수압 테스트",
  "industries.marine.validation.entity.2": "O-링 글랜드 GD&T",
  "industries.marine.validation.entity.3": "헬륨 누출 테스트",
  "industries.marine.validation.entity.4": "ASME Y14.5",
  "industries.marine.validation.card1.title": "CMM O-링 글랜드 검증",
  "industries.marine.validation.card1.subtitle": "ZEISS CMM · ±1.9μm · 밀봉 표면 GD&T",
  "industries.marine.validation.card1.desc": "수중 밀봉 무결성은 기하학적으로 완벽한 O-링 글랜드에서 시작됩니다.",
  "industries.marine.validation.card1.implLabel": "기술 구현",
  "industries.marine.validation.card1.item1": "O-링 그루브 치수 검증",
  "industries.marine.validation.card1.item2": "밀봉 표면 조도 Ra ≤ 0.4μm — O-링 압축 세트 제어 보장",
  "industries.marine.validation.card1.item3": "ASME Y14.5 기준 로트별 CMM 보고서 제공",
  "industries.marine.validation.card2.title": "정수압 테스트",
  "industries.marine.validation.card2.subtitle": "정격 압력의 1.5배 · 헬륨 누출 테스트 · 문서화 인증",
  "industries.marine.validation.card2.desc": "모든 수중 부품은 정격 수심 압력의 1.5배로 정수압 테스트를 거칩니다.",
  "industries.marine.validation.card2.implLabel": "기술 구현",
  "industries.marine.validation.card2.item1": "문서화된 인증과 함께 정격 압력의 1.5배 정수압 테스트",
  "industries.marine.validation.card2.item2": "중요 어셈블리에 대한 헬륨 누출 테스트 가능",
  "industries.marine.validation.card2.item3": "부품 일련번호로 추적 가능한 테스트 인증서",

  // ===== COMPLIANCE SECTION =====
  "industries.marine.compliance.badge": "소재 인증",
  "industries.marine.compliance.title.main": "소재 추적성",
  "industries.marine.compliance.title.suffix": "해양 서비스를 위한 EN 10204 3.1 MTR, 열 번호 및 저철분 검증",
  "industries.marine.compliance.desc": "모든 해양 등급 부품은 심각각인 열 번호가 표기된 EN 10204 3.1 밀 테스트 리포트가 제공됩니다.",
  "industries.marine.compliance.entityLabel": "엔티티 클러스터",
  "industries.marine.compliance.entity.0": "EN 10204 3.1 MTR",
  "industries.marine.compliance.entity.1": "열 번호",
  "industries.marine.compliance.entity.2": "갈바닉 부식",
  "industries.marine.compliance.entity.3": "저철분 Fe ≤ 0.20%",
  "industries.marine.compliance.entity.4": "NACE SP0198",
  "industries.marine.compliance.pillar1.title": "EN 10204 3.1 및 열 번호 마킹",
  "industries.marine.compliance.pillar1.desc": "모든 Grade 2, Grade 5 및 Grade 12 티타늄 로트는 EN 10204 Type 3.1 문서로 인증됩니다.",
  "industries.marine.compliance.pillar1.item1": "ASTM B265/B348 기준 화학 성분 검증 — Grade 12의 Fe ≤ 0.20%",
  "industries.marine.compliance.pillar1.item2": "각 부품에 심각각인 열 번호 — 영구적인 추적성 확보",
  "industries.marine.compliance.pillar1.item3": "10년 이상 디지털 아카이브 — 규제 감사 시 완전 조회 가능",
  "industries.marine.compliance.pillar2.title": "갈바닉 부식 방지",
  "industries.marine.compliance.pillar2.desc": "해수에서 이종 금속 간 갈바닉 커플은 부식을 가속화합니다.",
  "industries.marine.compliance.pillar2.item1": "티타늄은 스테인리스강, 구리 및 알루미늄에 대해 귀금속적 성질",
  "industries.marine.compliance.pillar2.item2": "NACE SP0198 기준 철 오염 제어",
  "industries.marine.compliance.pillar2.item3": "해양용 티타늄 전용 공구 및 절삭유 라인",
};

// Add missing keys to ko.json
let addedCount = 0;
let skippedCount = 0;
for (const [key, value] of Object.entries(koTranslations)) {
  if (!(key in ko)) {
    ko[key] = value;
    addedCount++;
  } else {
    skippedCount++;
  }
}

// Write updated ko.json with sorted keys
const sortedKo = {};
const sortedKeys = Object.keys(ko).sort();
for (const key of sortedKeys) {
  sortedKo[key] = ko[key];
}

fs.writeFileSync(koPath, JSON.stringify(sortedKo, null, 2) + '\n', 'utf8');

console.log(`=== Marine Korean Translation Summary ===`);
console.log(`Added: ${addedCount} keys`);
console.log(`Skipped (already existed): ${skippedCount} keys`);
console.log(`Total marine keys in ko.json: ${Object.keys(sortedKo).filter(k => k.startsWith('industries.marine.')).length}`);
console.log(`Total keys in ko.json: ${Object.keys(sortedKo).length}`);
console.log(`Done!`);
