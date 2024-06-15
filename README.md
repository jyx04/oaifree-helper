本项目完全依赖Linuxdo始皇大神的服务，致力于更优雅个性化访问new.oaifree站。如您无Linuxdo等级，不必浪费时间部署，本服务对您大概率无用或不好用！！！
# oaifree-helper
### 本项目基于始皇的new站服务。利用单个Worker&Pages优雅访问始皇镜像站，组建合租共享车队。包含直链登陆、前端登陆页、用户管理、token池管理、车队管理、用户注册、用量查询等等功能。全程无需服务器和域名，无需改代码。

# 首先，致敬始皇，致敬所有热佬，没有他们的项目和服务就没有这个项目。
### [体验站](https://oaifreehelper.haibara-ai.workers.dev) 密码linux.do,无功能,请勿填写敏感信息。
### 主要功能
   - 原理是储存`refreshtoken`和`accesstoken`，并调用始皇的各项接口获取`sharetoken`一键直达始皇的new.oaifree.com镜像站
   - 用户使用唯一用户名登陆即可后台自动分配`sharetoken`，自带始皇的聊天隔离功能。包含简易的用户体系，储存各类用户，设置各类用户的限额和限制
   - 支持使用/?un=xxx的直链登陆，分享更省心。
   - 自带注册功能，分享激活码给朋友，不用总手动录入用户
   - 支持组建token池，可前端面板储存token，支持自动判断rt/at，自动解析json
   - 支持token自动刷新，若遇at过期，自动调用始皇接口刷新at
   - 包含多种选车模式，可手动/指定用户专车/顺序轮询/随机选车
   - 支持禁用失效车次
   - 自动检测官方服务状态，如遇官方故障自动禁止用户登陆，甩锅官方
   - 支持人机验证
   - 点击登录页Logo跳转管理面板,包含用户管理、token池管理、用量查询、token批量导出
   - 支持替换Chat页面显示的头像/用户名/邮箱【新】
   - 支持道德审查接口【新】
   <img width="500" alt="image" src="https://github.com/jyx04/oaifree_helper/assets/166741903/3675a0bf-efd4-4cf3-a42b-4e96fab83bb2">
   <img width="500" alt="image" src="https://github.com/jyx04/oaifree-helper/assets/166741903/f440f0b8-7682-4d68-9eb4-9d8be2eccccd">
   <img width="500" alt="image" src="https://github.com/jyx04/oaifree-helper/assets/166741903/0cd4e326-5580-4c45-8868-8474bbaf3756">
   <img width="200" alt="image" src="https://github.com/jyx04/oaifree-helper/assets/166741903/d2cc9a8f-598f-4249-8aa3-4710a3e2ab06">


# Worker 部署（一键直达）
   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jyx04/oaifree_helper)
   - 一键为全家桶，包含主服务/选车面板服务/API服务/反代voice服务，且无需手动关联KV，即点即用
   - 配置完成后，如需添加人机验证器防爆破，请按照下方Turnstile人机验证服务教程，获得`站点密钥`和`密钥`
   - 访问部署域名，在初始界面一键保存各项变量，完成部署！
   - 添加token：在登陆页点击logo，选择Token Management进入token管理面板添加
# Worker 部署（手动部署）
### 1. 配置Turnstile人机验证服务（不建议跳过）
   - 如需跳过，后期将`RemoveTurnstile`参数设置为1即可
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
   - 如需进行修改，位置在KV，而非worker的环境变量！
```
Admin //管理员，用于管理面板的验证使用，且可看所有聊天记录【必填】
TurnstileKeys //turnsile的密钥【必填】
TurnstileSiteKey //turnsile的密钥【必填】
RemoveTurnstile//跳过turnsile人机验证。设置跳过，以上两参数随便填
WebName //站点名称
WorkerURL //站点域名，无需https://若无自己的域名，则为worker默认域名：[worker名].[用户名].workers.dev
LogoURL //图片地址，需https://，若无图床可填图片本地base64编码，不宜过大
ChatLogoURL //chat界面显示的用户头像地址，需https://，若无图床可填图片本地base64编码，不宜过大
ChatUserName //chat界面显示的用户名
ChatMail //chat界面显示的用户邮箱

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

//以下在管理员面板添加更方便
PlusAliveAccounts //plus号池存活序号，以1,2,3格式
FreeAliveAccounts //普号存活序号，以1,2,3格式
rt_1
rt_2
at_1//（若已有rt，at可不填）
at_2
……
```

### 4. 选车面板（可选）
   - 通过文件`free_worker.js`部署worker，即可配置基于普号号池的选车上车界面。（一键部署已包含）
   - 大部分变量同上，可以额外配置以下变量
     ```
     FreeURL //单独的URL
     FreeWebName //选车上车页的站点名
     FreeWebIntro //选车上车页的简介，可用html代码插入文本、超链接等
     ```
     <img width="500" alt="image" src="https://github.com/jyx04/oaifree_helper/assets/166741903/d44a5290-ae04-4be2-affb-26447e4b8050">
     
### 5. API接口（可选）
   - 通过文件`api_worker.js`部署worker，即可配置基于plus号池的api服务。（一键部署已包含）

### 6. 反代始皇的Voice服务（新增）
   - 通过文件`voice_worker.js`部署voice服务的反代worker。（一键部署已包含）
   - 需在系统KV配置变量`VoiceURL`为此worker的链接（无需https://）
   - 点击镜像页中间的logo，优雅访问voice服务

# 使用教程
### 1. 管理面板
   - 配置完成后，点击登录页面的logo，可进入管理面板

### 2. Token管理
   - 见管理员面板的Token Management功能
   - 获取token：可通过[始皇的服务](https://token.oaifree.com/auth)获取普号或Plus号的rt/at（需linux.do高级用户）。也可自行通过网页获取at（自行查询教程）
   - 添加token：可批量输入 rt/at，以','分割，支持自动识别token类型。也可粘贴单个token的完整json，自动提取添加。添加的token将自动识别普号/plus，将序号加入对应的AliveAccountLists索引。随token添加的user为跟车用户，自动绑定车号，若设置ForceAN则强制以该车号登录。
   - 更新token：若存有rt，at过期将自动刷新。若无rt，将在登陆页提醒at过期
   - 禁用token：AliveAccountLists存有所有有效token的序号。通过账号登录页面可报告账号问题，删除序号。也可通过API调用，自动删除失效token的序号。

### 3. 批量导出号池token功能（新增）
   - 见管理员面板的ExportTokens功能
   - 可选导出Plus/Free号池
   - 可选生成导出链接or直接下载txt文件
   - txt文件格式为每行一个token，便于挪至其他服务使用

### 4. 用户和车次管理
   - 见管理员面板的User Management功能
   - 用户添加：VIPUser的有效期最长，无用量限制；User为普通用户；FreeUser为受限用户。
   - 用户车号选择：`SetAN`不填则用户手动选，序号则所有用户以该序号登录，True则由系统选。
   - 系统车号选择：当`SetAN`为True，可在`PlusMode`填入Random或Order，应用VIPUSer和User的自动选车模式。在`FreeMode`填入Random/Order或Plus，应用FreeUser的自动选车模式。Random为随机，Order为顺序，Plus为使用Plus号池和模式。
     
### 5. 用户注册
   - `CDKEY`内存有效激活码，`AutoDeleteCDK`非空则激活码只能使用一次，否则用后自动删除
     
### 6. 用量查询
   - 见管理员面板的Query User Usage功能
   - 若输入管理员账号，可分别查询用户和免费用户的用量，可储存和为用户名打码
   - 若输入非管理员账号，则查询当前用户用量

### 7. API接口（同样基于始皇的转API服务）
   - 本接口同样采用始皇的服务，使用plus号池内账号的token，随机调取，失效自动禁用
   - api的BaseURL为api worker的地址，`apikey`为admin密码，支持的服务请参考始皇的服务文档
   - OneAPI/NewAPI示例：
   - <img width="300" alt="image" src="https://github.com/jyx04/oaifree-helper/assets/166741903/a01912c5-f43e-4c62-8b76-d47d80aeca00">


### 8. 接入道德审查功能（新增）
   - 此功能代码完全来自[Linux.do-Lvguanjun](https://linux.do/t/topic/99742)，感谢大佬！
   - 如需启用此功能，需在KV中新增变量`ModerationApiKey`,填入始皇oaipro的apikey

### 9. 个性化和杂项
   - 参考以下环境变量
     ```
     WebName //站点名称
     WorkerURL //站点域名，无需https://若无自己的域名，贼为worker默认域名：[worker名].[用户名].workers.dev【必填】
     LogoURL //图片地址，需https://，若无图床可填图片本地base64编码，不宜过大
     ChatLogoURL //chat界面显示的用户头像地址，需https://，若无图床可填图片本地base64编码，不宜过大
     ChatUesrName //chat界面显示的用户名
     ChatMail //chat界面显示的用户邮箱
     FreeWebName //选车上车页的站点名
     FreeWebIntro //选车上车页的简介，可用html代码插入文本、超链接等
     ```
   - 如需修改用户的默认用量限制等，请修改worker的`getShareToken`函数，内有详细注释

### 10. 常见问题
   - 一些功能（如自定义头像/道德审查等），如无需使用，可在fork的项目代码内注释掉，避免聊天过程中频繁请求KV造成额度不足。
   - 若用量较大导致KV额度不足，建议将以上个性化参数都定义进代码，避免网页请求都频繁调用KV

     
### 11. About
   - 本服务实质是Token储存和分发，所有功能和实际服务都基于始皇大神的付出。再次向大神致敬！
   - Bug反馈和功能建议请在Github提交issues。故障反馈需包含log
   - 本项目不会收费也不会引流，个人代码能力有限，会尽力维护
     
# 日志
 - 建立GitHub项目
 - 创建一键部署，新增选车界面和api服务
 - 优化用量查询功能
 - 新增token导出功能，可导出所选号池的rt/at为txt文件
 - 支持反代始皇新彩蛋：voice服务
 - 支持替换Chat页面显示的头像/用户名/邮箱
 - 新增Chat页面用户名显示车次的功能
 - 优化token批量导出功能和转api功能，确保at自动刷新
 - 支持接入道德审查接口
