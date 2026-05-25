import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const excludeFiles = ['.vitepress'];
const config = withSidebar({
    ignoreDeadLinks: true,
    base: '/docs/',
    title: "Res - lazier334",
    description: "静态资源站点",
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
            level: [2, 3]
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
        const srcBase = path.dirname(__dirname);
        const destBase = siteConfig.outDir;

        console.log('markdown 构建完成！开始复制附加资源...');
        try {
            fs.readdirSync(srcBase).forEach((name:string) => {
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
        fs.cpSync(destBase, path.join(__dirname,'../../html/docs'), { recursive: true, force: true });
        console.log('已移动docs构建产物');
    }
}, {
    documentRootPath: 'docs'
});
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
 * 构建index.md文件
 */
function buildStart() {
    console.log('构建 index.md');
    const docsPath = path.dirname(__dirname);
    const names = fs.readdirSync(docsPath).filter(name => !(excludeFiles.includes(name) ||
        fs.statSync(path.join(docsPath, name)).isFile()));
    const targetFile = path.join(docsPath, 'index.md');
    const actionsMD = names.map(name => `
    - theme: alt
      text: ${name.toUpperCase()}
      link: /${name}`).join('');
    const featuresMD = `
  - title: 全新文档
    details: 提供更佳的阅读体验
  - title: JILI
    details: 去除多重限制并自定义协议
  - title: PG
    details: 还原官方多个版本的协议`;
    let md = `---
layout: home

hero:
  name: "${config.title}"
  text: "${config.description}"
  tagline: <a href="https://github.com/lazier334">lazier334</a> 存放资源与文档使用
  actions:${actionsMD.replace('theme: alt', 'theme: brand')}

features:${featuresMD}
---

`;
    fs.writeFileSync(targetFile, md);
}