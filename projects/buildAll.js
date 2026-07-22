import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

main()

function main() {
    const dirs = fs.readdirSync(import.meta.dirname).filter(name => !['.vitepress'].includes(name) && fs.statSync(path.join(import.meta.dirname, name)).isDirectory());
    buildAll(dirs)
}

function runCmdSync(cmd, options = {}) {
    try {
        const stdout = execSync(cmd, { ...{ cwd: process.cwd(), stdio: 'inherit', timeout: 60000, encoding: 'utf8' }, ...options });
        return { success: true, stdout, stderr: '', status: 0, error: null };
    } catch (error) {
        return {
            success: false,
            stdout: error.stdout ? error.stdout.toString() : '',
            stderr: error.stderr ? error.stderr.toString() : '',
            status: error.status,
            error,
        };
    }
}

async function buildAll(dirs) {
    const results = [];

    for (const dir of dirs) {
        const cmd = `npx vitepress build .`;
        console.log(`\n📦 正在构建: ${dir}`);
        const result = runCmdSync(cmd, {
            cwd: import.meta.dirname,
            stdio: 'inherit',
            timeout: 120000,
            env: { ...process.env, PROJECT_NAME: dir }
        });
        results.push({ dir, ...result });

        if (!result.success) {
            console.error(`❌ 构建失败，停止后续构建。`);
            break;   // 可选：失败则停止
        }
    }

    // 检查最终状态
    const allSuccess = results.every(r => r.success);
    if (allSuccess) {
        console.log('\n🎉 所有目录构建成功！');
    } else {
        console.error('\n⚠️ 部分构建失败，请检查日志。');
        process.exit(1);
    }
}
