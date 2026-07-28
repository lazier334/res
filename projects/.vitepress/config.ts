import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

const ProjectName = process.env.PROJECT_NAME || 'docs';
const api = `/${ProjectName}/`;
const inputDir = path.join(import.meta.dirname, '../', ProjectName);
const outputDir = path.join(import.meta.dirname, '../../html', ProjectName);
const excludeFiles = ['.vitepress'];
console.log('inputDir:', inputDir)
console.log('outputDir:', outputDir)
var projectConfig = {};
const projectConfigFile = path.join(inputDir, 'config.json');
if (fs.existsSync(projectConfigFile)) {
    try {
        projectConfig = JSON.parse(fs.readFileSync(projectConfigFile, 'utf8'));
        console.log(`当前项目${ProjectName}的配置:`, projectConfig);
    } catch (err) {
        console.log('读取配置失败!', err);
    }
}
const config = appendObjCore(
    // 项目私有配置覆盖默认配置
    projectConfig,
    withSidebar(
        {
            ignoreDeadLinks: true,
            base: api,
            srcDir: inputDir,
            outDir: outputDir,
            title: "Res - lazier334",
            description: "静态资源站点",
            vite: {
                server: {
                    port: 3000,
                    host: true,
                    allowedHosts: true,
                },
            },
            themeConfig: {
                externalLinkIcon: true,
                nav: [
                    { text: '首页', link: '/' },
                    { text: '文档', link: '/start' }
                ],
                socialLinks: [
                    { icon: 'github', link: 'https://github.com/lazier334' },
                ],
                outline: {
                    label: '目录',
                    level: [2, 5]
                },
                search: {
                    provider: 'local',
                    options: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭'
                                }
                            }
                        }
                    }
                }
            },
            async buildEnd(siteConfig) {
                const srcBase = siteConfig.srcDir;
                const destBase = siteConfig.outDir;

                console.log('markdown 构建完成！开始复制附加资源...');
                try {
                    fs.readdirSync(srcBase).forEach((name: string) => {
                        if (!excludeFiles.includes(name)) {
                            copyWithConflictCheck(path.join(srcBase, name), path.join(destBase, name), (srcPath: string, destPath: string) => {
                                // 不允许复制的文件列表
                                const basename = path.basename(srcPath);
                                if (excludeFiles.includes(basename)) {
                                    return false;
                                }
                                // 不允许复制的文件后缀
                                if (basename.endsWith('.md')) return false;
                                return true;
                            });
                        }
                    });
                } catch (error) {
                    console.error('复制资源时出错：', error);
                }
                console.info('附加资源已复制完成！');
                // 复制打包产物到输出目录
                // fs.cpSync(destBase, path.join(__dirname, '../../html/docs'), { recursive: true, force: true });
                // console.log('已移动docs构建产物');
            }
        },
        {
            documentRootPath: path.relative(process.cwd(), inputDir)
        }
    )
);
buildStart();
export default defineConfig(config);

/**
 * 递归复制目录/文件，支持冲突检测
 * @param src - 源路径
 * @param dest - 目标路径
 * @param copyHandler - 决定是否复制的处理函数 (src, dest) => boolean
 */
function copyWithConflictCheck(src: string, dest: string, copyHandler: (src: string, dest: string) => boolean) {
    if (fs.statSync(src).isDirectory()) {
        // 确保目标目录存在
        if (!fs.existsSync(dest)) {
            // 目标路径不存在，创建文件夹
            fs.mkdirSync(dest, { recursive: true });
        }
        // 递归处理子项
        const items = fs.readdirSync(src);
        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            copyWithConflictCheck(srcPath, destPath, copyHandler);
        }
    } else {
        // 调用检测，由返回值决定是否复制
        if (copyHandler(src, dest)) fs.cpSync(src, dest, { recursive: true, force: true });
        // else console.log('跳过复制', src);
    }
}

/**
 * 把org覆盖到def对象上, 如果类型不同则不覆盖, def未定义(def===undefined)的情况下org也覆盖
 * @param org 局部目标对象
 * @param def 完整原始对象
 * @param re 新对象
 */
function appendObjCore(org: any, def: any, k?: any): any {
    if (typeof org == 'object') {
        // 如果org是null, 那么返回 def
        if (org == null) return def;
        // 如果是 org 和 def 都是数组/buffer则覆盖
        if (Array.isArray(org) && Array.isArray(def)) return org;
        if (ArrayBuffer.isView(org) && ArrayBuffer.isView(def)) return org;
        // 如果 def 是一个 null 那么覆盖
        if (typeof def != 'object' || def == null) return org;
        // 遍历普通对象属性
        Object.entries(org).forEach(([k, v]) => {
            def[k] = appendObjCore(v, def[k], k);
        });
        return def;
    }
    // 如果 def 不是 undefined 而且类型不同则使用 def
    return def !== undefined && typeof def != typeof org ? def : org
}

/**
 * 构建index.md文件
 */
function buildStart() {
    console.log(`构建 ${ProjectName} 项目的 index.md `);
    const names = fs.readdirSync(inputDir).filter(name => !(excludeFiles.includes(name) ||
        fs.statSync(path.join(inputDir, name)).isFile()));
    const targetFile = path.join(inputDir, 'index.md');
    let template = `---
layout: home

hero:
  name: {name}
  text: {text}
  tagline: {tagline}
  actions: {actions}

features:
  - title: 文档
    details: 提供更佳的阅读体验
  - title: item1
    details: details1
  - title: item2
    details: details2
---

`;
    const templateFile = path.join(inputDir, 'index.md.template');
    if (fs.existsSync(templateFile)) {
        template = fs.readFileSync(templateFile, 'utf8');
    }
    const actionsMD = names.map(name => `
    - theme: alt
      text: ${name.toUpperCase()}
      link: /${name}`).join('');

    const md = template.replaceAll('{name}', config.title || 'name')
        .replaceAll('{text}', config.description || 'text')
        .replaceAll('{tagline}', config.tagline || 'tagline')
        .replaceAll('{actions}', actionsMD.replace('theme: alt', 'theme: brand'))
        .replaceAll('{date}', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }))

    fs.writeFileSync(targetFile, md);
}