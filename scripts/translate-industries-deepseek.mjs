/**
 * Cline + DeepSeek 批量翻译脚本
 * 读取 en.json 中指定前缀的 key，对每个目标语言调用 DeepSeek API 翻译
 * 用法: node scripts/translate-industries-deepseek.mjs
 */

import fs from 'fs';
import path from 'path';

const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 目标语言配置
const TARGET_LANGS = {
  de: 'German',
  ja: 'Japanese',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  ko: 'Korean',
  nl: 'Dutch',
  pl: 'Polish',
  ru: 'Russian',
  ar: 'Arabic'
};

// 不需要翻译的标准名称（认证/标准代号，应保持原文）
const STANDARD_NAMES = new Set([
  'AS9100D','NADCAP','AMS 2631','AMS 2645','ISO 13485','FDA 21 CFR 820','ASTM F136','ASTM F2066',
  'ISO 9001:2015','SEMI F57','RoHS','REACH','AS9100','ASTM','ISO','EN 10204','Nadcap',
  'ASME Y14.5','ASME B46.1','MIL-STD-45662','ISO 10012','AMS','AWS D17.1','MIL-STD-188',
  'IATF 16949','NACE','API','SAE','AWS','ISO 14001','OHSAS 18001'
]);

// 需要翻译的 key 前缀
const KEY_PREFIXES = [
  'services.industries.',
  'industries.industryverticalsgrid.',
  'industries.industrycompliancedashboard.',
  'industries.industryctasection.',
  'materials.industries.',
  'nav.industries.',
  'home.industries.'
];

async function translateBatch(texts, targetLang, langName) {
  if (texts.length === 0) return {};

  // 构建翻译请求
  const sourceJson = JSON.stringify(texts, null, 2);
  
  const systemPrompt = `You are a professional ${langName} translator for industrial titanium manufacturing content. 
Rules:
- Keep technical terms like CNC, EDM, CMM, AS9100, ASTM, Grade 23 ELI, SLM/DMLS, CPO exactly as-is
- Keep units like mm, µm, W/m·K, bar, kVA exactly as-is
- Translate naturally to native ${langName} — NOT word-for-word
- Return ONLY a valid JSON object with the exact same keys
- No markdown, no explanation, NO backticks`;

  const userPrompt = `Translate the following English JSON values to ${langName}. Keep all keys exactly the same. Return ONLY the translated JSON object:\n\n${sourceJson}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim() || '';

    // 清理可能存在的 markdown 代码块标记
    const cleaned = resultText.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`  ❌ DeepSeek error: ${err.message}`);
    return {};
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Cline + DeepSeek 批量翻译 — 行业分类');
  console.log('='.repeat(60));

  // 读取 en.json
  const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8'));

  // 收集所有需要翻译的 key
  const sourceKeys = Object.keys(en).filter(k =>
    KEY_PREFIXES.some(p => k.startsWith(p))
  ).sort();

  console.log(`\n📖 English source keys: ${sourceKeys.length}`);
  
  for (const [langCode, langName] of Object.entries(TARGET_LANGS)) {
    console.log(`\n🌐 [${langCode}] ${langName}...`);
    const targetFile = path.join(DIR, `${langCode}.json`);
    const target = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

    // 找出需要翻译的 key（缺失 或 值与 en.json 相同 = 未翻译）
    const needsTranslation = {};
    for (const key of sourceKeys) {
      const val = en[key];
      if (!val || val.length < 3) continue;
      
      // 如果值全部由标准名称组成（用 / 分隔），跳过不翻译
      const parts = val.split(/\s*\/\s*/);
      const allStandards = parts.every(p => {
        const trimmed = p.trim();
        return !trimmed || STANDARD_NAMES.has(trimmed);
      });
      if (allStandards && parts.length > 1) continue;
      
      const existing = target[key];
      if (!existing || existing === val) {
        needsTranslation[key] = val;
      }
    }

    const keysList = Object.keys(needsTranslation);
    if (keysList.length === 0) {
      console.log(`  ✅ 全部已翻译，无需处理`);
      continue;
    }

    console.log(`  待翻译: ${keysList.length} 条`);

    // 分批发送，每批 15 条
    const batchSize = 15;
    let translated = 0;
    let failed = 0;

    for (let i = 0; i < keysList.length; i += batchSize) {
      const batch = keysList.slice(i, i + batchSize);
      const batchObj = {};
      for (const k of batch) batchObj[k] = needsTranslation[k];

      console.log(`  批次 ${Math.floor(i/batchSize)+1}/${Math.ceil(keysList.length/batchSize)} (${batch.length} 条)...`);
      
      const result = await translateBatch(batchObj, langCode, langName);
      
      for (const [key, val] of Object.entries(result)) {
        if (val && typeof val === 'string' && val.length > 0) {
          target[key] = val;
          translated++;
        } else {
          failed++;
        }
      }

      // DeepSeek 限流
      if (i + batchSize < keysList.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // 写回文件
    const sorted = {};
    for (const k of Object.keys(target).sort()) {
      sorted[k] = target[k];
    }
    fs.writeFileSync(targetFile, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
    console.log(`  ✅ 完成: ${translated} 已翻译, ${failed} 失败`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('  🎉 所有语言翻译完成');
  console.log('='.repeat(60));
}

main().catch(console.error);
