import { _dirname, genCopy, funs } from '../utils/gen-copy.js';
import { replaceAndWrite, genHandler } from '../utils/gen-handler.js';
const { path, fs } = funs;

const copyConfig = {
    indir: path.join(_dirname(import.meta.url), '..'),
    outdir: path.join(_dirname(import.meta.url), '../html'),
    excludeList: [],
    clearList: [
        'docs/build-docs.js',
    ],
    dirMap: {
        'docs': 'docs',
    },
};
const handlerConfig = {
    mdFlag: '${MD_TEXT}',
    urlSuffixFlag: '${URL_SUFFIX}',
    urlSuffix: '.html',
    index: fs.readFileSync(path.join(_dirname(import.meta.url), 'index.html'), { encoding: 'utf8' }),
    outdir: path.join(_dirname(import.meta.url), '../html'),
    scanDirs: [
        'docs',
    ],
    handleFileMap: {},
    /**
     * 
     * @param {string} filepath 
     */
    manualHandler(filepath) {
        if (filepath.endsWith('.md')) {
            const newPath = filepath + '.html';
            const md = fs.readFileSync(filepath, { encoding: 'utf8' });
            const encoder = new TextEncoder();
            let html = this.index.replaceAll(this.mdFlag, encoder.encode(md)).replaceAll(this.urlSuffixFlag, this.urlSuffix);
            fs.writeFileSync(newPath, html);
            fs.unlinkSync(filepath);
            console.log('已处理md文件:', filepath, '->', newPath);
            return true;
        }
    },
    status: {
        TRUE: [],
        FALSE: [],
        EDIT: []
    },
    moreLog: false
};


console.log(handlerConfig);
buildCopy();



export default buildCopy;

/**
 * 打包时用于复制目标文件 的插件
 */
export async function buildCopy() {
    genCopy(copyConfig);
    genHandler(handlerConfig);
}
