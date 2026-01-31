#!/bin/bash

# 定义输出文件路径
OUTPUT_FILE="./data.txt"
# 定义过滤阈值(KB)
SWAP_THRESHOLD=1000
# 定义限制扫描一个包所拥有的最多的pid数量
PID_NUMBER_MAX=200

# 清空输出文件（避免旧数据干扰）
> ${OUTPUT_FILE}

# 检查ADB设备连接状态
if ! adb devices | grep -q "device$"; then
    echo "[ERROR] 未检测到已连接的Android设备，请开启USB调试并重试！"
    exit 1
fi

echo "[INFO] 正在获取运行中的应用包名列表..."
echo "预计耗时2分钟左右, 请耐心等待..."
# 获取去重后的应用包名（兼容不同Android版本ps列顺序）
PACKAGE_LIST=$(adb shell ps -A | awk '/u0_a/ {print ($NF ~ /^com\./) ? $NF : $9}' | sort -u)

# 遍历每个包名提取数据
for PACKAGE in ${PACKAGE_LIST}
do
    # 获取当前包名对应的所有PID（精确匹配，排除同名干扰）
    PID_LIST=$(adb shell ps -A | grep -w "${PACKAGE}" | awk '{print $2}')
    PID_LIST_OBJECT=($PID_LIST)
    
    # 拿到PID列表的长度
    pid_count=${#PID_LIST_OBJECT[@]}
    
    #如果PID数量超过20个，则跳过此包
    if [ "$pid_count" -gt "$PID_NUMBER_MAX" ]; then
        echo "[INFO] 跳过包 \"${PACKAGE}\" 因为PID数量限制${PID_NUMBER_MAX}，当前数量: ${pid_count}"
        continue  # 跳过当前包，继续下一个
    fi
     
    # 遍历每个PID查询Swap内存
    for PID in ${PID_LIST}
    do
        # 读取/proc/PID/status，提取VmSwap数值（忽略错误输出）
        VMSWAP_LINE=$(adb shell "cat /proc/${PID}/status 2>/dev/null | grep VmSwap")
        # 提取数值部分（单位：KB）
        SWAP_VALUE=$(echo ${VMSWAP_LINE} | awk '{print $2}')
        SWAP_UNIT=$(echo ${VMSWAP_LINE} | awk '{print $3}')

        # 处理空值或非数字情况
        if [[ -z ${SWAP_VALUE} || ! ${SWAP_VALUE} =~ ^[0-9]+$ ]]; then
            SWAP_VALUE=0
            SWAP_UNIT="KB"
        fi

        # 过滤小于阈值的记录
        if [[ ${SWAP_VALUE} -ge ${SWAP_THRESHOLD} ]]; then
            SWAP_INFO="${SWAP_VALUE} ${SWAP_UNIT}"
            echo "${PACKAGE} | ${PID} | ${SWAP_INFO}"
            # 写入文件
            echo "${PACKAGE} | ${PID} | ${SWAP_INFO}" >> ${OUTPUT_FILE}
        fi
    done
done

echo "[SUCCESS] 任务完成！符合条件的数据已保存至 ${OUTPUT_FILE}"
