#!/usr/bin/env node

/**
 * 从 GitHub Releases 拉取发布信息，生成本站同源静态快照 public/releases/data.json。
 *
 * 为什么这样做：用户访问「发行版本」页时只读本站 /releases/data.json（同源、走站点自有国内线路），
 *   不在运行时直连 GitHub —— 国内不卡、不受 GitHub/ Gitee 限额影响。
 *   而「拉 GitHub」这步只在构建机 / CI（海外，可达 GitHub）执行：
 *     · 由 package.json 的 prebuild 钩子在每次 `npm run build` 前自动执行；
 *     · 也由 .github/workflows/update-releases.yml 定时 / 发版 / 手动触发，重新生成并提交快照。
 *
 * 字段与 .dumi/theme/builtins/ReleaseNotes.tsx 消费的结构一致。
 * 失败（网络不通 / API 限额 / 私有仓库等）时：打印告警并跳过写入 → 保留既有快照，绝不覆盖成空。
 *
 * 仅用 Node 内置模块（无三方依赖），故 CI 里无需安装依赖即可单独运行。
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const OWNER = 'JadeViewDocs';
const REPO = 'JadeView';
const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`;
const GITEE_TAG_BASE = 'https://gitee.com/ilinxuan/JadeView_library/releases/tag';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../public/releases/data.json');

function fetchReleases() {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'JadeViewDocs',
      Accept: 'application/vnd.github.v3+json',
    };
    // CI 上注入 GITHUB_TOKEN 可把限额从 60/小时 提到 5000/小时（GitHub Actions 自带该变量）
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    https
      .get(API_URL, { headers }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const data = Buffer.concat(chunks).toString('utf-8');
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API 状态码 ${res.statusCode}（可能限额 / 私有 / 不存在）`));
            return;
          }
          try {
            const releases = JSON.parse(data);
            if (releases.message) {
              reject(new Error(`GitHub API: ${releases.message}`));
              return;
            }
            resolve(releases);
          } catch (e) {
            reject(new Error(`解析 GitHub 响应失败: ${e.message}`));
          }
        });
      })
      .on('error', (e) => reject(new Error(`请求失败: ${e.message}`)));
  });
}

// 清理控制字符、统一换行，并把 #123 转成 issue 链接
function processBody(body) {
  if (!body) return '';
  return body
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/(^|[^:])#(\d+)(?![\d])/g, `$1[#$2](https://github.com/${OWNER}/${REPO}/issues/$2)`);
}

function toJson(releases) {
  return JSON.stringify(
    {
      updated_at: new Date().toISOString(),
      releases: releases.map((r) => ({
        tag_name: r.tag_name,
        name: r.name || r.tag_name,
        published_at: r.published_at,
        prerelease: r.prerelease,
        html_url: r.html_url,
        gitee_url: `${GITEE_TAG_BASE}/${r.tag_name}`,
        body: processBody(r.body),
      })),
    },
    null,
    2,
  );
}

async function main() {
  try {
    console.log('从 GitHub 拉取 Releases…');
    const releases = await fetchReleases();
    if (!Array.isArray(releases) || releases.length === 0) {
      console.log('未获取到任何发布，跳过（保留现有快照）');
      return;
    }
    console.log(`获取到 ${releases.length} 个版本（含 prerelease）`);
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, toJson(releases), 'utf-8');
    console.log(`已写入 ${OUTPUT_PATH}`);
  } catch (e) {
    console.warn('⚠️ 更新发行数据失败：', e.message);
    console.warn('跳过更新、保留现有快照，继续构建…');
  }
}

main();
