#!/bin/bash

# 脚本功能：读取adb设备列表，取第一个设备执行adb usb命令
# 作者：辅助脚本
# 日期：2026

# 第一步：获取已连接的第一个设备序列号
# 过滤掉"List of devices attached"行、空行，提取第一列（设备序列号），取第一行
DEVICE=$(adb devices | grep -v "List of devices attached" | grep -v "^$" | awk '{print $1}' | head -n 1)

# 第二步：检查是否获取到设备序列号
if [ -z "$DEVICE" ]; then
    echo "错误：未检测到任何已连接的adb设备！"
    exit 1  # 退出脚本，返回错误码1
fi

echo "检测到第一个设备序列号：$DEVICE"

# 第三步：执行adb usb命令（指定设备）
echo "正在对设备 $DEVICE 执行 adb usb 命令..."
adb -s "$DEVICE" usb

# 第四步：检查命令执行结果
if [ $? -eq 0 ]; then
    echo "成功：设备 $DEVICE 已执行 adb usb 命令（切换回USB模式）"
else
    echo "错误：设备 $DEVICE 执行 adb usb 命令失败，请检查设备连接状态！"
    exit 1
fi

exit 0