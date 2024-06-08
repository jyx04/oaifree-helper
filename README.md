# oaifree-helper
### 本项目基于始皇的new站服务。利用单个Worker&Pages优雅访问始皇镜像站，组建合租共享车队。包含直链登陆、前端登陆页、用户管理、token池管理、车队管理、用户注册、用量查询等等功能。全程无需服务器和域名，无需改代码。
## 首先，致敬始皇，致敬所有热佬，没有他们的项目和服务就没有这个项目。
### [体验站](https://oaifreehelper.haibara-ai.workers.dev) 密码linux.do,无有效功能
### 主要功能
   - 原理是储存`refreshtoken`和`accesstoken`，并调用始皇的各项接口获取`sharetoken`一键直达始皇的new.oaifree.com镜像站
   - 用户使用唯一用户名登陆即可后台自动分配·sharetoken·，自带始皇的聊天隔离功能。包含简易的用户体系，储存各类用户，设置各类用户的限额和限制
   - 支持使用/?un=xxx的直链登陆，分享更省心。
   - 自带注册功能，分享激活码给朋友，不用总手动录入用户
   - 支持组建token池，可前端面板储存token，支持自动判断rt/at，自动解析json
   - 支持token自动刷新，若遇at过期，自动调用始皇接口刷新at
   - 包含多种选车模式，可手动/指定用户专车/顺序轮询/随机选车
   - 支持禁用失效车次
   - 自动检测官方服务状态，如遇官方故障自动禁止用户登陆，甩锅官方
   - 支持人机验证
   - 点击登录页Logo跳转管理面板,包含用户管理、token池管理、用量查询、token批量导出
   <img width="500" alt="image" src="https://github.com/jyx04/oaifree_helper/assets/166741903/3675a0bf-efd4-4cf3-a42b-4e96fab83bb2">

# Worker 部署（一键直达）
   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jyx04/oaifree_helper)
   - 配置完成后，请按照下方配置Turnstile人机验证服务教程，获得`站点密钥`和`密钥`
   - 访问部署域名，在初始界面一键保存各项变量，完成部署！
# Worker 部署（手动版）
### 1. 配置Turnstile人机验证服务
   - 注册/登陆你的cloudflare，右上角可设置语言为中文。
   - 左侧找到`Turnstile`，选择`添加站点`
   - `站点名称`随意，`域`为：`workers.dev`或你自己的域名
   - 创建，记录好`站点密钥`和`密钥`，备用
     
### 2. 部署 Cloudflare Worker：
   - 在左侧列表找到`Worker和Pages`
   - 选择`KV`，创建一个名为`oai_global_variables`的KV备用
   - 选择`概述`-`创建应用程序`-`Worker`，为项目命名，并创建worker
   - 进入`worker`-`设置`-`变量`，在`KV 命名空间绑定`添加绑定KV，变量名`oai_global_variables`
   - 【可选】在worker的`设置`-`触发器`-`添加自定义域`绑定自己的域名
   - 回到本GitHub项目，复制`_worker.js`中的全部内容，在worker配置页面点击 `编辑代码`，清空原有内容粘贴后点右上角`部署`
   - 大功告成！
   - 访问`自定义的域名`，或点击`部署`-`查看版本`,在初始面板一键保存各项环境变量（初次保存后后该页面自动禁用，若需更改请至KV中调整）
     
### 3. 环境变量
   - 以下是所有变量，全部无需手动填写，部署完项目后直接第一次进入可前端面板一键保存。
```
Admin //管理员，用于管理面板的验证使用，且可看所有聊天记录【必填】
TurnstileKeys //turnsile的密钥【必填】
TurnstileSiteKey //站点密钥【必填】
WebName //站点名称
WorkerURL //站点域名，无需https://若无自己的域名，贼为worker默认域名：[worker名].[用户名].workers.dev【必填】
LogoURL //图片地址，需https://

Users //默认用户，以aaa,bbb,ccc形式填写，能访问所有车牌
VIPUsers //vip用户，即私车用户，无速率和时间限制
FreeUsers //限制用户，有速率和时间限制

ForceAN //强制选车，若设置为1，用户名为xxx_n的私车用户用登陆强制进入n号车，忽略登陆所选车号
SetAN //选车模式。如只有一辆车则填1。如多辆车用户手动选则留空。如需开启随机或顺序轮询，填True，并用下面两个变量控制
PlusMode //plus号随机的轮询方式，Order或者Random
FreeMode //普号随机的轮询方式，Order/Random或Plus（使用plus号池和配置）

CDKEY //注册可用的激活码，以aaa,bbb,ccc格式
AutoDeleteCDK //设置为1则激活码只可用一次
FKDomain //把sharetoken当at用时，走的默认域名
Status //服务状态，若为非空，无视openai官方故障通告，始终允许登陆
TemporaryAN //强制启用临时聊天的车牌，以1,2,3格式

PlusAliveAccounts //plus号池存活序号，以1,2,3格式
FreeAliveAccounts //普号存活序号，以1,2,3格式
rt_1
rt_2
at_1//（若已有rt，at可不填）
at_2
……
```

### 4. 选车面板（可选）
   - 通过文件`free_worker.js`部署worker，即可配置基于普号号池的选车上车界面。（一件部署已包含）
   - 大部分变量同上，可以额外配置以下变量
     ```
     FreeWebName //选车上车页的站点名
     FreeWebIntro //选车上车页的简介，可用html代码插入文本、超链接等
     ```
     <img width="500" alt="image" src="https://github.com/jyx04/oaifree_helper/assets/166741903/d44a5290-ae04-4be2-affb-26447e4b8050">
     
### 5. API接口（可选）
   - 通过文件`api_worker.js`部署worker，即可配置基于plus号池的api服务。（一件部署已包含）
   - 本接口同样采用始皇的服务，使用plus号池内账号的token，随机调取，失效自动禁用
   - api地址请参考始皇的服务文档，api key为admin密码

### 6. 反代始皇的Voice服务（新增）
   - 通过文件`voice_worker.js`部署voice服务的反代worker。（一件部署已包含）
   - 需在系统KV配置变量`VoiceURL`为此worker的链接（无需https://）

### 7. 批量导出号池token功能（新增）
   - 见管理员面板的ExportTokens功能
   - 可选导出Plus/Free号池
   - 可选生成导出链接or直接下载txt文件
   - txt文件格式为每行一个token，便于挪至其他服务使用
     

# 日志
 - 建立GitHub项目
 - 创建一键部署，新增选车界面和api服务
 - 优化用量查询功能
 - 新增token导出功能，可导出所选号池的rt/at为txt文件
 - 支持反代始皇新彩蛋：voice服务
