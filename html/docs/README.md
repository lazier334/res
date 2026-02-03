<!-- 

如果你看到了这段文字，请先手动访问以下链接进入首页，用于加载 sw.js 服务。

https://lolo.hk/docs/index.html

-->

# 简介
这是个人使用的文档自动挂载项目


<div align="center" style="margin-top: 20px">
<!-- 太阳和雪花动画容器 -->
<div style="position: relative; height: 200px; overflow: hidden; background: linear-gradient(to bottom, #e0f7fa, #bbdefb); border-radius: 20px 20px 0 0;">
    
<!-- 动态太阳 -->
<div style="position: absolute; top: 50px; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background: radial-gradient(circle, #ffeb3b, #ffc107); border-radius: 50%; box-shadow: 0 0 30px #ffeb3b; animation: sunPulse 3s ease-in-out infinite alternate;"></div>

<!-- 雪花飘落效果 -->
<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none;">
<span style="position: absolute; top: -20px; left: 10%; animation: snowFall 8s linear infinite; font-size: 20px;">❄</span>
<span style="position: absolute; top: -20px; left: 30%; animation: snowFall 10s linear infinite 1s; font-size: 18px;">❄</span>
<span style="position: absolute; top: -20px; left: 50%; animation: snowFall 12s linear infinite 2s; font-size: 22px;">❄</span>
<span style="position: absolute; top: -20px; left: 70%; animation: snowFall 9s linear infinite 0.5s; font-size: 16px;">❄</span>
<span style="position: absolute; top: -20px; left: 90%; animation: snowFall 11s linear infinite 1.5s; font-size: 20px;">❄</span>
</div>

</div>

<!-- 主要内容区域 -->
<div style="background: rgba(255, 255, 255, 0.95); padding: 40px 30px; border-radius: 0 0 20px 20px; margin-top: -10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); animation: fadeInUp 2s ease-out;">

<!-- 标题和描述 -->
<h1 style="color: #107c10; margin-bottom: 20px;">✨ 冬日与暖阳</h1>
<p style="color: #c1da9f; font-size: 1.2em; line-height: 1.6;">
就像刚下过雪的院子，格外宁静~<br>
共同筑建，一起准备更多的惊喜吧！🌱
</p>

<!-- 装饰性元素 -->
<div style="margin-top: 30px;">
<span style="color: #bbdefb; font-size: 24px;">✦</span>
<span style="color: #ffb74d; margin: 0 15px; font-size: 24px;">•</span>
<span style="color: #bbdefb; font-size: 24px;">✦</span>
</div>

</div>
</div>

<!-- 内嵌样式确保动画仅在此页面有效 -->
<style>
@keyframes sunPulse {
    0% { transform: translateX(-50%) scale(0.95); opacity: 0.8; }
    100% { transform: translateX(-50%) scale(1.05); opacity: 1; }
}

@keyframes snowFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
    100% { transform: translateY(250px) rotate(360deg); opacity: 0.2; }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>