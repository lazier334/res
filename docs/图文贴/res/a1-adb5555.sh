#!/bin/bash
LOCAL_IP="127.0.0.1"
TARGET_PORT="5555"
echo "请输入配对端口（比如40123）："
read pair_port
echo "正在配对无线调试..."
echo "请输入配对码:"
adb pair $LOCAL_IP:$pair_port

echo "请输入连接端口（比如38307）："
read connect_port
echo "正在连接无线调试..."
adb connect $LOCAL_IP:$connect_port

echo "正在开启5555端口并进行连接..."
adb tcpip 5555
sleep 1
adb disconnect $LOCAL_IP:$connect_port

echo "即将通过目标端口连接...${TARGET_PORT}"
sleep 3
adb connect $LOCAL_IP:$TARGET_PORT

echo "操作完成！"
echo "adb设备列表:"
adb devices