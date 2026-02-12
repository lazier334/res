import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const configType = {
    /** 输出文件夹 */
    outdir: 'html',
    /** 输入文件夹 */
    indir: 'web',
    /** 复制时排除指定的文件，使用 "/" 和 "\\" 都可以 */
    excludeList: [
        // 'web/a',
        // 'web\\b',
    ],
    /** 清理复制完成后输出目录的指定文件 */
    clearList: [
        // 'aa/bb/c'
    ],
    /** 映射复制的文件与目标目录 */
    dirMap: {
        ...{// 自定义文件夹映射
            // 'aa': '/',
            // 'aa/bb': '/'
        }, ...Object.fromEntries([
            // 会生成列表中的文件夹映射 {'dir1': 'dir1', 'dir2': 'dir2'}
            // 'dir1',
            // 'dir2',
        ].map(domain => [domain, domain]))
    }
};

export default genCopy;
export const funs = {
    _dirname,
    genCopy,
    fs,
    path
}
/**
 * 
 * @param {configType} config 
 * @returns 
 */
export function genCopy(config) {
    const startTime = Date.now();
    let errInfo = null;
    console.log('正在复制文件中...');
    try {
        copyFiles(config.dirMap, config.indir, config.outdir, config.excludeList);
        clearFiles(config.clearList, config.outdir);
    } catch (err) {
        err, console.error('打包时发生错误:', err);
    }
    console.log(`操作已${errInfo ? '结束' : '完成'}，耗时${Date.now() - startTime}ms\n存放目录: ${config.outdir}`)
    return
};


/**
 * 
 * @returns {string} 默认传递 import.meta.url 当前文件夹的路径
 */
export function _dirname(p) {
    return path.dirname(fileURLToPath(p))
}

function clearFiles(fileList, outdir = '') {
    const paths = [];
    fileList.forEach(file => {
        const filepath = path.join(outdir, file);
        if (fs.existsSync(filepath)) {
            paths.push(filepath);
            fs.rmSync(filepath, { recursive: true, force: true });
        }
    });
    console.log('已清理完成', paths)
}

/**
 * 复制文件
 * @param {{'aa': '/'}} dirMap 
 * @param {'web'} indir 
 * @param {'html'} outdir 
 * @param {['a/b/c.html']} excludeList 
 * @returns 
 */
function copyFiles(dirMap, baseInDir, baseOutDir, excludeList) {
    const errorList = [];
    const paths = [];
    const nullDirs = [];
    for (const k in dirMap) {
        try {
            const inputPath = path.join(baseInDir, k);
            const outputPath = path.join(baseOutDir, dirMap[k]);
            const exclude = excludeList.find(p => inputPath.replaceAll('/', '\\').includes(p.replaceAll('/', '\\')));
            if (exclude) {
                console.log('排除目录:', inputPath, '规则:', exclude)
            } else {
                if (fs.existsSync(inputPath)) {
                    console.log('复制中', inputPath, outputPath)
                    fs.cpSync(inputPath, outputPath, { recursive: true, force: true });
                    paths.push(inputPath)
                } else {
                    nullDirs.push(inputPath)
                }
            }
        } catch (err) {
            errorList.push(err);
        }
    }
    console.log('已复制完成:', paths, '不存在的目录列表:', nullDirs);
    if (0 < errorList.length) {
        console.error('打包时发生的错误列表详细内容:')
        console.log(errorList)
        throw new Error('\n打包时发生的错误列表:\n' + errorList.map(e => e.message).join('\n'))
    };
}
