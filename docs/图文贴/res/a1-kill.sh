#!/bin/bash
set -euo pipefail

# 初始化命令前缀和包名数组（关键：提前初始化避免-u选项触发未定义变量错误）
FORCE_STOP_CMD=""
APP_PACKAGES=()

# 函数：校验ADB方式是否可用
check_adb_available() {
    echo -e "正在检测ADB环境..."
    # 执行一个无副作用的adb命令，检查返回码
    if adb shell echo "test" > /dev/null 2>&1; then
        FORCE_STOP_CMD="adb shell am force-stop"
        echo -e "✅ 检测到ADB环境可用，将使用ADB方式执行命令"
        return 0
    else
        echo -e "⚠️ ADB方式不可用，尝试检测本地Shell环境..."
        return 1
    fi
}

# 函数：校验本地Shell方式是否可用
check_shell_available() {
    # 检查am命令是否存在且有权限执行
    if command -v am > /dev/null 2>&1 && am force-stop --help > /dev/null 2>&1; then
        FORCE_STOP_CMD="am force-stop"
        echo -e "✅ 检测到本地Shell环境可用，将使用本地方式执行命令"
        return 0
    else
        echo -e "❌ 本地Shell方式也不可用"
        return 1
    fi
}
check_shell_available() {
    # 合并两个条件：先检查am命令存在，再检查am help可执行；同时区分错误类型
    if command -v am > /dev/null 2>&1 && am help > /dev/null 2>&1; then
        FORCE_STOP_CMD="am force-stop"
        echo -e "✅ 检测到本地Shell环境可用，将使用本地方式执行命令"
        return 0
    else
        # 区分错误原因：是命令不存在，还是有命令但无执行权限
        if ! command -v am > /dev/null 2>&1; then
            echo -e "❌ 本地Shell环境不可用：未找到am命令"
        else
            echo -e "❌ 本地Shell环境不可用：无am命令执行权限"
        fi
        return 1
    fi
}

main(){
    # 初始化包名列表
    init_app_packages
    
    # 校验包名列表是否为空（可选但推荐，避免无意义执行）
    if [ ${#APP_PACKAGES[@]} -eq 0 ]; then
        echo -e "❌ 错误：应用包名列表为空，请检查init_app_packages函数！"
        exit 1
    fi

    # 主逻辑：权限校验
    echo -e "===== 开始权限/环境校验 ====="
    if ! check_adb_available; then
        if ! check_shell_available; then
            echo -e "❌ 错误：ADB和本地Shell方式均无法运行相关命令，请检查权限或环境！"
            exit 1
        fi
    fi

    # 执行强制停止操作
    echo -e "\n===== 开始强制停止应用 ====="
    for package in "${APP_PACKAGES[@]}"; do
        # 执行强制停止命令
        ${FORCE_STOP_CMD} "${package}"
        # 检查命令执行结果
        if [ $? -eq 0 ]; then
            echo -e "✅ 成功停止：${package}"
        else
            echo -e "❌ 停止失败：${package}"
        fi
    done

    echo -e "\n===== 所有应用停止操作执行完成 ====="
}

# 初始化要强制停止的应用包名列表
init_app_packages(){
    APP_PACKAGES=(
        "system"
        "com.catchingnow.icebox"
        "com.ss.android.ugc.aweme"
        "com.tencent.mm"
        "com.milink.service"
        "com.xiaomi.market"
        "com.xiaomi.xmsf"
        "com.tencent.mobileqq"
        "com.google.android.gms"
        "com.mi.health"
        "com.xiaomi.aicr"
        "com.catchingnow.np:Service"
        "com.miui.gallery"
        "com.miui.home"
        "com.android.vending"
        "com.tencent.mm:push"
        "com.android.mms"
        "com.baidu.input"
        "com.tencent.mobileqq:MSF"
        "com.android.htmlviewer"
        "com.miui.guardprovider"
        "com.miui.personalassistant"
        "com.android.quicksearchbox"
        "com.mi.health:device"
        "com.milink.service.persistent"
        "com.android.vending:background"
        "com.mi.health:widgetProvider"
        "com.kugou.android.lite:widgetProvider"
        "com.miui.miwallpaper"
        "com.xiaomi.market:widgetProvider"
        "android.process.media"
        "com.wpengapp.lightstart:service"
        "com.google.android.documentsui"
        "com.android.permissioncontroller"
        "com.xiaomi.aicr:actionprovider"
        "com.lbe.security.miui"
        "com.miui.systemAdSolution"
        "com.xiaomi.xmsf:kit6"
        "com.xiaomi.metoknlp"
        "com.miui.screenrecorder"
        "com.android.providers.media.module"
        "com.xiaomi.vtcamera"
        "com.xiaomi.xmsf:persistent"
        "com.android.camera"
        "com.google.android.gms.unstable"
        "com.milink.crossdeviceservice"
        "com.miui.misound"
        "com.android.mms:mms_service"
        "com.xiaomi.xmsf:kit7"
        "com.google.android.gms:snet"
        "android.process.acore"
        "com.milink.service:ui"
        "com.miui.cloudservice"
        "com.google.android.gms.persistent"
        "com.miui.hybrid"
        "com.xiaomi.account"
        "android.ext.services"
        "com.xiaomi.xmsf:services"
        "com.xiaomi.xmsfkeeper"
        "com.tencent.soter.soterserver"
        "org.ifaa.aidl.manager"
        "com.android.htmlviewer:remote"
        "com.miui.voiceassist:core"
        "com.catchingnow.icebox:Service"
        "com.miui.core"
        "com.milink.service:core"
        "com.android.calendar"
        "com.milink.runtime"
        "com.miui.analytics"
        "com.miui.micloudsync"
        "com.milink.service:audio"
        "com.xiaomi.simactivate.service"
        "com.milink.service:provider"
        "com.google.android.webview:webview_service"
        "com.android.deskclock"
        "com.google.android.webview:webview_apk"
        "com.android.providers.calendar"
        "com.miui.phrase"
        "com.xiaomi.mibrain.speech"
        "com.miui.cloudbackup"
        "com.xiaomi.aicr:cognitionService"
        "com.android.externalstorage"
        "com.xiaomi.aicr:coreService"
        "com.miui.contentextension"
    )
}

# 启动主逻辑
main