/**
 * FTP诊断脚本 — 列出远程目录内容，检查文件是否已上传
 */
import { Client } from 'basic-ftp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = 'ftp.safetiparts.com';
const USER = 'bozecncti@cnc.bozemetal.com';
const PASS = 'tKFvW139C6P3oSG}';
const REMOTE_ROOT = '/home/safetipa/cnc.bozemetal.com/';

async function check_remote() {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    console.log('🔄 正在连接 FTP...');
    await client.access({
      host: HOST,
      user: USER,
      password: PASS,
      port: 21,
      secure: false,
    });

    await client.send('AUTH', 'TLS');
    await client.send('PBSZ', '0');
    await client.send('PROT', 'P');
    console.log('✅ FTPS 连接成功');

    // 切换到远程根目录
    await client.cd(REMOTE_ROOT);
    console.log(`\n📂 当前远程目录: ${REMOTE_ROOT}`);

    // 列出根目录
    const rootList = await client.list();
    console.log(`\n📋 根目录条目 (${rootList.length}):`);
    rootList.forEach(item => {
      console.log(`   ${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name}  (${item.size || 0} bytes)`);
    });

    // 检查是否有 index.html
    try {
      await client.cd(REMOTE_ROOT);
      const indexStat = await client.list();
      const hasIndex = indexStat.find(f => f.name === 'index.html');
      console.log(`\n🔍 index.html: ${hasIndex ? '✅ 存在' : '❌ 不存在'}`);

      // 检查 _astro 目录
      const hasAstroDir = indexStat.find(f => f.isDirectory && f.name === '_astro');
      console.log(`🔍 _astro/ 目录: ${hasAstroDir ? '✅ 存在' : '❌ 不存在'}`);

      // 检查 zh 目录
      const hasZhDir = indexStat.find(f => f.isDirectory && f.name === 'zh');
      console.log(`🔍 zh/ 目录: ${hasZhDir ? '✅ 存在' : '❌ 不存在'}`);

      // 列出最近修改的文件（前15个）
      if (hasAstroDir) {
        await client.cd('_astro');
        const astroFiles = await client.list();
        console.log(`\n📋 _astro/ 目录: ${astroFiles.length} 个文件`);
        astroFiles.slice(-10).forEach(f => {
          console.log(`   ${f.name}  (${f.size || 0} bytes, modified: ${f.modifiedAt?.toISOString() || 'N/A'})`);
        });
        await client.cd(REMOTE_ROOT);
      }
    } catch (e) {
      console.log(`\n❌ 读取目录时出错: ${e.message}`);
    }

    console.log('\n✅ 诊断完成');
  } catch (err) {
    console.error('❌ 连接失败:', err.message);
  } finally {
    client.close();
  }
}

check_remote();