import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';


const lc = {
    rootDir: path.join(_dirname(), '../docs'),
    outdir: path.join(_dirname(), '../html'),
    indir: '下方代码进行填充',
    // 复制时排除指定的文件，使用 "/" 和 "\\" 都可以
    excludeList: [
        'docs/build-docs.js',
    ],
    // TODO 清理复制完成后输出目录的指定文件
    clearList: [
        // 'aa/bb/c'
    ],
    // TODO 映射复制的文件与目标目录
    dirMap: {
        'docs': 'docs',
    }
};


console.log(lc)

export default lc;

/**
 * 
 * @returns {string} 当前文件夹的路径
 */
function _dirname() {
    return path.dirname(fileURLToPath(import.meta.url))
}