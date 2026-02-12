import fs from 'fs';
import path from 'path';

/** 配置 */
const configType = {
    /** 输出的文件夹 */
    outdir: 'html',
    // TODO
    /** 指定扫描输出目录 "html/" 中的子目录列表 */
    scanDirs: [
        'project-domain.com',
    ],
    /** 处理的文件列表，以及映射使用什么函数进行处理 */
    handleFileMap: {
        /** {@link file://./../README.md#13 清理gtag} */
        'analytics.min.js': handle_gtag,
    },
    /**
     * 手动操作，会传递文件名进来，如果返回 true 则不会再进行其他的处理
     * @param {string} filepath 文件路径
     * @returns {boolean} 如果返回 `真` 则不会继续使用 handleFileMap 处理
     */
    manualHandler(filepath) { },
    /** 操作状态 */
    status: {
        /** 成功列表 */
        TRUE: [],
        /** 失败列表 */
        FALSE: [],
        /** 编辑列表 */
        EDIT: []
    },
    /** 更多日志 */
    moreLog: false
};

export default genHandler;

/**
 * 处理文件夹列表
 * @param {configType} config 
 */
export function genHandler(config) {
    config.scanDirs.forEach(dir => {
        const dirPath = path.join(config.outdir, dir);
        if (fs.existsSync(dirPath)) scanDirectory(dirPath);
        else console.error(`扫描指定的目录不存在: ${dirPath}`);
    });
    if (config.moreLog) console.log('尝试修改文件列表', config.status.EDIT)
    console.info(`已处理完成 编辑数:${config.status.EDIT.length} 成功数:${config.status.TRUE.length} 失败数:${config.status.FALSE.length}`);
    if (0 < config.status.FALSE.length) console.error('修改失败的文件列表', config.status.FALSE);


    /**
     * 扫描文件夹
     * @param {string} dir 文件夹路径
     */
    function scanDirectory(dir) {
        try {
            let files = fs.readdirSync(dir, { withFileTypes: true });
            files.forEach(file => {
                const filepath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    scanDirectory(filepath);
                } else if (config.manualHandler(filepath)) {
                    config.status.EDIT.push(filepath);
                    config.status.TRUE.push(filepath);
                } else if (typeof config.handleFileMap[file.name] == 'function') {
                    // 处理 文件内容 
                    config.status.EDIT.push(filepath);
                    console.log(`正在处理 ${file.name} 文件: ${filepath}`);
                    if (config.handleFileMap[file.name](filepath)) {
                        config.status.TRUE.push(filepath);
                    } else {
                        config.status.FALSE.push(filepath);
                    }
                }
                // 其他自定义的处理
            });
        } catch (err) {
            console.error(`无法读取目录 ${dir}:`, err);
        }
    }
}


/**
 * 关键词替换模式示例
 * 处理 gtag 简单版，基于replaceAndWrite工具函数
 * @param {string} filepath 文件路径
 * @returns {boolean} 操作结果
 */
function handle_simple_gtag(filepath) {
    const keyword = 'https://www.googletagmanager.com/gtag/js?';
    const replaceStr = 'about:blank?';
    return replaceAndWrite(filepath, keyword, replaceStr);
}

/**
 * 关键词替换模式示例
 * 完整的处理 gtag
 * @param {string} filepath 文件路径
 * @returns {boolean} 操作结果
 */
function handle_gtag(filepath) {
    // 读取文件
    let body = fs.readFileSync(filepath, 'utf8');

    // 清理 gtag 
    body = body.replace('https://www.googletagmanager.com/gtag/js?', 'about:blank?');

    // 写回文件中
    fs.writeFileSync(filepath, body);
    return body == fs.readFileSync(filepath, 'utf8');
}

/**
 * 替换并写回文件
 * @param {string} filepath 文件路径
 * @param {string} keyword 关键词
 * @param {string} replaceStr 要替换的内容
 * @return {boolean} 是否修改成功。原始文件与保存后的文件的对比是否不相等
 */
export function replaceAndWrite(filepath, keyword, replaceStr) {
    // 读取文件
    let body = fs.readFileSync(filepath, 'utf8');
    // 替换内容
    let newBody = body.replace(keyword, replaceStr);
    // 写入文件
    fs.writeFileSync(filepath, newBody);
    // 提示信息
    if (body == newBody) console.warn(`处理失败! 文件中可能不存在关键词，或已经替换`, filepath);
    // 返回结果
    return body != fs.readFileSync(filepath, 'utf8');
}