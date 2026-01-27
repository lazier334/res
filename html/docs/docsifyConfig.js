/**
 * 可以配置在 window.$docsify 里
 * @link https://yzqtpl.github.io/docsify-vitepress/configuration.html 配置文档
 * @example
 * <script>
 *   window.$docsify = {
 *     repo: 'docsifyjs/docsify',
 *     maxLevel: 3,
 *     coverpage: true
 *   }
 * </script>
 */
class DocsifyConfig {
    /**
     * docsify初始化的挂载元素，可以是CSS选择器，若不存在则绑定在body上
     * @type {string}
     * @default '#app'
     */
    el = '#app';

    /**
     * 仓库地址或username/repo字符串，用于在页面右上角渲染GitHub Corner挂件
     * @type {string}
     * @default null
     * @example
     * {
     *  repo: 'docsifyjs/docsify',
     *  // or
     *  repo: 'https://github.com/docsifyjs/docsify/'
     * }
     */
    repo = null;

    /**
     * 抓取文档标题渲染目录的最大层级
     * @type {number}
     * @default 6
     */
    maxLevel = 6;

    /**
     * 加载自定义导航栏，true加载_navbar.md，也可自定义文件名
     * @link https://yzqtpl.github.io/docsify-vitepress/custom-navbar.html 定制导航栏
     * @type {boolean|string}
     * @default false
     * @example
     * {
     *  // 加载 _navbar.md
     *  loadNavbar: true,
     *
     *  // 加载 nav.md
     *  loadNavbar: 'nav.md'
     * }
     */
    loadNavbar = false;

    /**
     * 加载自定义侧边栏，true加载_sidebar.md，也可自定义文件名
     * @link https://yzqtpl.github.io/docsify-vitepress/more-pages.html 多页文档
     * @type {boolean|string}
     * @default false
     * @example
     * {
     *  // 加载 _sidebar.md
     *  loadSidebar: true,
     *
     *  // 加载 summary.md
     *  loadSidebar: 'summary.md'
     * }
     */
    loadSidebar = false;

    /**
     * 自定义侧边栏后生成目录的最大层级（默认自定义侧边栏后不生成目录）
     * @type {number}
     * @default 0
     */
    subMaxLevel = 0;

    /**
     * 切换页面后是否自动跳转到页面顶部
     * @type {boolean}
     * @default false
     */
    auto2top = false;

    /**
     * 首页文件加载路径
     * @type {string}
     * @default 'README.md'
     * @example
     * {
     *  // 入口文件改为 /home.md
     *  homepage: 'home.md',
     * 
     *  // 文档和仓库根目录下的 README.md 内容一致
     *  homepage: 'https://raw.githubusercontent.com/docsifyjs/docsify/master/README.md'
     * }
     */
    homepage = 'README.md';

    /**
     * 文档加载的根路径，支持二级路径或其他域名路径
     * @type {string}
     * @default ''
     * @example
     * {
     *  basePath: '/path/',
     *
     *  // 直接渲染其他域名的文档
     *  basePath: 'https://docsify.js.org/',
     *
     *  // 甚至直接渲染其他仓库 readme
     *  basePath: 'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/'
     * }
     */
    basePath = '';

    /**
     * 启用封面页，true加载_coverpage.md，也可自定义文件名或多封面配置
     * @link https://yzqtpl.github.io/docsify-vitepress/cover.html 封面页
     * @type {boolean|string|Array<string>|Object}
     * @default false
     * @example
     * {
     *  coverpage: true,
     *
     *  // 自定义文件名
     *  coverpage: 'cover.md',
     *
     *  // mutiple covers
     *  coverpage: ['/', '/'],
     *
     *  // mutiple covers and custom file name
     *  coverpage: {
     *    '/': 'cover.md',
     *    '/': 'cover.md'
     *  }
     * }
     */
    coverpage = false;

    /**
     * 侧边栏中显示的网站图标，可通过CSS修改大小
     * @type {string | '/_media/icon.svg'}
     * @default ''
     */
    logo = '';

    /**
     * 文档标题，显示在侧边栏顶部
     * @type {string | 'docsify'}
     * @default ''
     */
    name = '';

    /**
     * 点击文档标题后跳转的链接地址，支持按路由切换
     * @type {string|Object}
     * @default window.location.pathname
     * @example
     * {
     *  nameLink: '/',
     *  // 按照路由切换
     *  nameLink: {
     *    '/': '/',
     *    '/': '/'
     *  }
     * }
     */
    nameLink = window.location.pathname;

    /**
     * Markdown配置，支持对象或函数形式
     * @link https://yzqtpl.github.io/docsify-vitepress/markdown.html markdown配置
     * @type {Object|Function}
     * @default {}
     * @example
     * {
     *  // object
     *  markdown: {
     *    smartypants: true,
     *    renderer: {
     *      link: function() {
     *        // ...
     *      }
     *    }
     *  },
     *
     *  // function
     *  markdown: function(marked, renderer) {
     *    // ...
     *    return marked;
     *  }
     *
     * }
     */
    markdown = {};

    /**
     * 替换主题色，利用CSS3变量特性，老浏览器有polyfill处理
     * @link https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties  CSS3 支持变量
     * @type {string | '#3F51B5'}
     * @default ''
     */
    themeColor = '';

    /**
     * 定义路由别名，支持正则，可自由定义路由规则
     * @type {Object}
     * @default {}
     * @example
     * {
     * alias: {
     *   '/foo/(+*)': '/bar/$1', // supports regexp
     *   '/changelog': '/changelog',
     *   '/changelog':
     *     'https://raw.githubusercontent.com/docsifyjs/docsify/master/CHANGELOG',
     *   // 下面属性的*和/中间有一个空格需要删除
     *   '/.* /_sidebar.md': '/_sidebar.md' // See #301
     * }
     * }
     */
    alias = {};

    /**
     * 同时设置loadSidebar使用，根据_sidebar.md内容自动为每个页面增加标题
     * @link https://github.com/docsifyjs/docsify/issues/78 关联信息
     * @type {boolean}
     * @default false
     */
    autoHeader = false;

    /**
     * 执行文档里script标签中的脚本（只执行第一个），Vue存在时自动开启
     * @link https://yzqtpl.github.io/docsify-vitepress/themes.html demo地址
     * @type {boolean}
     * @default false
     */
    executeScript = false;

    /**
     * 禁用emoji解析
     * @type {boolean}
     * @default false
     */
    noEmoji = false;

    /**
     * 小屏设备下合并导航栏到侧边栏
     * @type {boolean}
     * @default false
     */
    mergeNavbar = false;

    /**
     * 格式化{docsify-updated}变量显示的文档更新日期，支持字符串或函数
     * @link https://github.com/lukeed/tinydate#patterns 参考文档
     * @type {string|Function}
     * @default ''
     * @example
     * {
     *  formatUpdated: '{MM}/{DD} {HH}:{mm}',
     *  formatUpdated: function(time) {
     *      // ...
     *      return time;
     *  }
     * }
     */
    formatUpdated = '';

    /**
     * 外部链接的打开方式
     * @type {string | '_blank' | '_self'}
     * @default '_blank'
     */
    externalLinkTarget = '_blank';

    /**
     * 路由模式
     * @type {string | 'hash' | 'history'}
     * @default 'hash'
     */
    routerMode = 'hash';

    /**
     * 不需要docsify处理的链接列表，支持正则
     * @link https://github.com/docsifyjs/docsify/issues/203 参考文档
     * @type {Array<string>}
     * @default []
     * @example
     * {
     *  noCompileLinks: ['/foo', '/bar/.*']
     * }
     */
    noCompileLinks = [];

    /**
     * 设置请求资源的请求头
     * @type {Object}
     * @default {}
     * @example
     * {
     *  requestHeaders: {
     *      'x-token': 'xxx'
     *  }
     * }
     */
    requestHeaders = {};

    /**
     * 资源的文件扩展名
     * @type {string}
     * @default '.md'
     */
    ext = '.md';

    /**
     * 语言列表，请求翻译文档不存在时显示默认语言同名文档
     * @type {Array<string>}
     * @default []
     * @example
     * {
     *  fallbackLanguages: ['zh', 'en']
     * }
     */
    fallbackLanguages = [];

    /**
     * 找不到指定页面时加载的404页面配置，支持布尔、字符串、对象
     * @type {boolean|string|Object}
     * @default false
     * @example
     * {
     *  notFoundPage: true,
     *  notFoundPage: 'my404.md',
     *  notFoundPage: {
     *      '/': '_404.md',
     *      '/de': 'de/_404.md'
     *  }
     * }
     */
    notFoundPage = false;

    /**
     * @param {DocsifyConfig}
     */
    constructor(docsifyConfig) {
        for (const k in docsifyConfig) {
            const v = docsifyConfig[k];
            this[k] = v;
        }
    }
}

(() => {
    /** @type {DocsifyConfig} */
    const dc = {};
    // 编写配置
    dc.repo = 'https://github.com/lazier334/res';
    // 右上角导航栏
    dc.loadNavbar = '_navbar.md';
    // 左侧导航栏
    dc.loadSidebar = '_sidebar.md';
    dc.subMaxLevel = 3;
    dc.auto2top = true;
    dc.basePath = '/docs';
    // 封面页
    dc.coverpage = '_coverpage.md';
    dc.logo = 'res/favicon.ico';
    dc.name = 'Lazier334';
    dc.autoHeader = true;
    dc.executeScript = true;
    dc.mergeNavbar = true;
    dc.formatUpdated = '{MM}/{DD} {HH}:{mm}';
    dc.fallbackLanguages = ['zh', 'en'];
    dc.notFoundPage = '_404.md';

    // 搜索插件的配置
    dc.search = {
        paths: 'auto',            // 可选，'auto' 或手动指定文件路径数组
        placeholder: '搜索...',   // 搜索框占位文字
        noData: '找不到相关内容',   // 无结果时显示的文字
        depth: 6,                 // 可选，搜索标题的最大层级（1-6）
        maxAge: 86400000,         // 可选，索引过期时间（毫秒，默认一天）
    }

    // 复制插件的配置
    dc.copyCode = {
        buttonText: 'copy',         // 复制按钮默认文本
        errorText: '复制失败！',     // 复制失败提示文本
        successText: '复制成功！',   // 复制成功提示文本
        timeout: 2000,              // 提示文本显示时长（毫秒）
        align: 'bottom',            // 按钮位置：top/bottom/top right/bottom right
        color: 'var(--theme-color)' // 按钮颜色（适配docsify主题）
    }

    // 使用
    window.$docsify = dc;
})()