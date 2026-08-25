/**
 * src/lib/entity-graph.ts
 * ================================================================
 * F3 閳?Entity 閳?Schema.org @id Resolver
 *
 * Purpose:
 *   鐏?entity-registry.json 娑擃厾娈?867 娑擃亣顕㈡稊澶婄杽娴ｆ搫绱濋弰鐘茬殸娑?schema.org JSON-LD
 *   閸欘垳娲块幒銉ョ穿閻劎娈?"@id" 閼哄倻鍋ｉ妴渚篖M crawler 闁俺绻冩潻娆庣昂 @id 閸︺劋绗夐崥宀勩€夐棃銏㈡畱 JSON-LD
 *   娑擃厼缂撶粩瀣杽娴ｆ挸鍙ч懕鏃撶礄"site-wide entity graph"閿涘鈧? *
 * Design:
 *   - 閸楁洑绔撮弶鍐ㄢ枆濠?(SSO) 娴犲秵妲?entity-registry.json閿涙稒婀板Ο鈥虫健閸欘亣顕版稉宥呭晸閵? *   - 缂傛挸鐡ㄩ敍姘崇箻缁嬪鍞存＃鏍偧鐠嬪啰鏁ら弮璺烘倱濮濄儴顕伴崣?+ 鐟欙絾鐎芥稉鈧▎鈽呯礉閸氬海鐢?O(1) 閸涙垝鑵戦妴? *   - 閸愭瑦妞傛稉鈧懛瀛樷偓褝绱癳ntity-registry.json 閸欐ɑ娲块崥搴礉娑撳顐奸弸鍕紦閼奉亜濮╅柌宥堫嚢閿涘牊妫ゆ潻娑氣柤閻樿埖鈧焦鐣悾娆欑礆閵? *
 * Schema.org 缁鐎烽弰鐘茬殸閿涘牐顕㈡稊澶嬫付閹恒儴绻庨惃鍕暭閺傚湱琚崹瀣剁礆閿? *   product       閳?Product
 *   service       閳?Service
 *   process       閳?Service   (capability 閺勵垰鍩楅柅鐘虫箛閸?
 *   material      閳?DefinedTerm   (閺夋劘宸?閸氬牓鍣剧粔宥囪閻?DefinedTerm 濮?Material 閺囨潙鍣?
 *   standard      閳?DefinedTerm   (ASTM/AMS/ISO 閺嶅洤鍣悽?DefinedTerm)
 *   industry      閳?Place         (鐞涘奔绗?= 鎼存梻鏁ら崷鐑樻珯缁屾椽妫?
 *   application   閳?CreativeWork  (鎼存梻鏁ゅ鍫滅伐 = 娴ｆ粌鎼?閺傝顢?
 *   case-study    閳?Article
 *
 * @id 鐟欏嫬鍨敍? *   https://www.bozemetal.com{page_url}#entity
 *   娓氬绱癶ttps://www.bozemetal.com/products/titanium-3d-printed-ergonomic-mouse/#entity
 *   閿涘牅绮庤ぐ?page_url 鐎涙ê婀弮璁圭幢閸氾箑鍨稉宥堢箲閸?@id閿涘矁鐨熼悽銊︽煙鎼存棁鐑︽潻鍥风礆
 *
 * 閻劍纭剁粈杞扮伐閿? *   import { getEntityRef, getEntitiesByCategory } from '@/lib/entity-graph';
 *   const refs = getEntitiesByCategory('product').slice(0, 30).map(getEntityRef);
 *   // 閳?閻劋绨?Organization.knowsAbout 閹?WebPage.mentions
 * ================================================================
 */

import fs from 'node:fs';
import path from 'node:path';

const REGISTRY_PATH = path.resolve(process.cwd(), 'data', 'entities', 'entity-registry.json');

export interface EntityRecord {
  id: string;
  slug?: string;
  /** Original filename slug used by the registry builder (e.g. "aerospace-defense"
   *  for the file src/content/industries/aerospace-defense.json). May differ
   *  from `slug` (the routing slug used by Astro pages). Optional because
   *  legacy/manual entries may not have it. */
  _source_slug?: string;
  category: string;
  subcategory?: string;
  canonical_name: string;
  aliases?: string[];
  page_url?: string;
  seo?: {
    page_title?: string;
    meta_description?: string;
  };
  description?: string;
}

const CATEGORY_TYPE: Record<string, string> = {
  product: 'Product',
  service: 'Service',
  process: 'Service',
  material: 'DefinedTerm',
  standard: 'DefinedTerm',
  industry: 'Place',
  application: 'CreativeWork',
  'case-study': 'Article',
};

const SITE_ORIGIN = 'https://www.bozemetal.com';

// 閳光偓閳光偓 Cache 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
let _cache: EntityRecord[] | null = null;

function loadRegistry(): EntityRecord[] {
  if (_cache) return _cache;
  if (!fs.existsSync(REGISTRY_PATH)) {
    // 閸?build / dev 閸氼垰濮╅弮鎯板 registry 缂傚搫銇戦敍宀冪箲閸ョ偟鈹栭弫鎵矋閼板奔绗夐弰顖涘闁挎瑱绱?
    // 娣囨繆鐦?schema 濞撳弶鐓嬫稉宥夋▎婵夌儑绱欑紓鍝勩亼鐏忓棔浜?console.warn 娑撳﹥濮ら敍澶堚偓?    // eslint-disable-next-line no-console
    console.warn(`[entity-graph] entity-registry.json not found at ${REGISTRY_PATH} 閳?JSON-LD entity refs will be empty.`);
    _cache = [];
    return _cache;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.entities) ? raw.entities : [];
    _cache = arr.filter((e: EntityRecord) => e && typeof e === 'object');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[entity-graph] Failed to parse entity-registry.json: ${(err as Error).message}`);
    _cache = [];
  }
  return _cache;
}

/** 瀵搫鍩楅梽鎰扳偓鐕傜窗閸?schema 濞撳弶鐓嬬仦鍌欑瑝鎼存柨寮芥径宥嗙缂傛挸鐡ㄩ妴鍌滄晸娴溠勭€鐑樻埂闂?registry 閺勵垰褰х拠鑽ゆ畱閵?*/
export function clearEntityGraphCache(): void {
  _cache = null;
}

// 閳光偓閳光偓 Public API 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓

/** 鐠侊紕鐣荤€圭偘缍嬬€电懓绨查惃?schema.org @id閵嗗倹妫?page_url 鏉╂柨娲?null閵?*/
export function entitySchemaId(entity: EntityRecord): string | null {
  if (!entity.page_url || !entity.page_url.startsWith('/')) return null;
  return `${SITE_ORIGIN}${entity.page_url.replace(/\/$/, '')}/#entity`;
}

/** 閹跺﹤宕熸稉顏勭杽娴ｆ挸甯囬幍浣疯礋 JSON-LD 娑擃厼褰插鏇犳暏閻ㄥ嫨鈧苯鐤勬担鎾崇穿閻劊鈧秷濡悙鐧哥礄閸?@id + @type + name閿涘鈧?*/
export function getEntityRef(entity: EntityRecord): Record<string, unknown> | null {
  const id = entitySchemaId(entity);
  if (!id) return null;
  const ref: Record<string, unknown> = {
    '@id': id,
    '@type': CATEGORY_TYPE[entity.category] || 'Thing',
    name: entity.canonical_name,
  };
  if (Array.isArray(entity.aliases) && entity.aliases.length > 0) {
    ref.alternateName = entity.aliases.filter((a) => a && a !== entity.canonical_name);
  }
  if (entity.description) {
    ref.description = entity.description;
  }
  return ref;
}

/** 閹跺﹤宕熸稉顏勭杽娴ｆ挸甯囬幍浣疯礋閵嗗苯鐣弫?Thing 閼哄倻鍋ｉ妴宥忕礄閻劋绨?schema.org DefinedTermSet 缁涘娓剁憰浣哥杽娴ｆ挾娈戦崷鐑樻珯閿涘鈧?*/
export function getEntityNode(entity: EntityRecord): Record<string, unknown> | null {
  const ref = getEntityRef(entity);
  if (!ref) return null;
  if (entity.seo?.meta_description) {
    ref.description = entity.seo.meta_description;
  }
  if (entity.subcategory) {
    ref.additionalType = entity.subcategory;
  }
  return ref;
}

/** 閹?category 缁涙盯鈧鈧竣ategory 娑撳秴灏柊宥堢箲閸ョ偟鈹栭弫鎵矋閵?*/
export function getEntitiesByCategory(category: string): EntityRecord[] {
  return loadRegistry().filter((e) => e.category === category);
}

/** 閹?id 閺屻儱鐤勬担鎿勭礄閻劋绨禒?mention 閸掓銆冮崣宥嗙叀閿涘鈧?*/
export function getEntityById(id: string): EntityRecord | null {
  return loadRegistry().find((e) => e.id === id) || null;
}

/** 閹?page_url 閺屻儱鐤勬担鎿勭礄閻劋绨禒?URL 閸欏秵鐓￠敍澶堚偓?*/
export function getEntityByPageUrl(pageUrl: string): EntityRecord | null {
  return loadRegistry().find((e) => e.page_url === pageUrl) || null;
}

/** 閹?entity registry id 閸掓銆?閳?schema.org @id 瀵洜鏁ら弫鎵矋閿涘湹ebPage.mentions 閻㈩煉绱氶妴?*/
export function refsFromIds(ids: string[]): Record<string, unknown>[] {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const out: Record<string, unknown>[] = [];
  for (const id of ids) {
    const e = getEntityById(id);
    if (e) {
      const r = getEntityRef(e);
      if (r) out.push(r);
    }
  }
  return out;
}

/** 閸忋劑鍎寸€圭偘缍嬮敍鍫濆嚒閹?id 閹烘帒绨敍澶堚偓?*/
export function getAllEntities(): EntityRecord[] {
  return loadRegistry();
}

/** 閸忋劑鍎撮崣顖濐潌 @id 瀵洜鏁ら敍鍧ge_url 鐎涙ê婀惃鍕杽娴ｆ搫绱氶妴?*/
export function getAllEntityRefs(): Record<string, unknown>[] {
  return loadRegistry().map(getEntityRef).filter((r): r is Record<string, unknown> => r !== null);
}

/** 缁鍩嗛崚鍡楃閿涘牅绗?entity-registry.json 閻?meta.by_category 娑撯偓閼疯揪绱濇笟?schema 娑擃厺姘﹂崣澶愮崣鐠囦緤绱氶妴?*/
export function getCategoryCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of loadRegistry()) {
    out[e.category] = (out[e.category] || 0) + 1;
  }
  return out;
}

