addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  //const pathname =url.pathname;
    event.respondWith(handleRequest(event.request,url.pathname));
  
})


// @ts-ignore
const KV = oai_global_variables;

async function handleRequest(request,pathname) {
  // 检查Authorization头是否包含正确的秘钥
  const auth = request.headers.get('Authorization');
  const adminKeys = await KV.get('Admin');
  const adminKeyList = adminKeys.split(',');

  if (!auth || !adminKeyList.includes(auth.replace('Bearer ', ''))) {
    return new Response('Succeed', { status: 200 });
  }

  // 从请求中获取用户的数据
  const requestData = await request.json();

  // 获取 aliveaccount 的值并解析
  const aliveAccount = await KV.get('PlusAliveAccounts');
  let aliveAccountList = aliveAccount.split(',');

  const keys = await KV.list();
  // 过滤出以 "at_" 开头且符合 aliveAccountList 中的键
  const anKeys = keys.keys.filter(key => {
    const keySuffix = key.name.split('_')[1];
    return key.name.startsWith('at_') && aliveAccountList.includes(keySuffix);
  });

  if (anKeys.length > 0) {
    // 从过滤出的键中随机选一个
    const randomKey = anKeys[Math.floor(Math.random() * anKeys.length)];
    const randomValue = await KV.get(randomKey.name);
    // 从值中提取access_token
    const access_token = randomValue;
    const accountNumber = randomKey.name.split('_')[1];
    //console.log(`Selected account number: ${accountNumber}, Access token: ${access_token}`);

    // 构建API请求
    const apiRequest = new Request(`https://api.oaifree.com${pathname}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify(requestData)
    });

    // 发送API请求并获取响应
    const apiResponse = await fetch(apiRequest);
    const responseBody = await apiResponse.text();

    
    // 记录响应状态和响应体
    //console.log(`Request: ${JSON.stringify(requestData)}`);
    //console.log(`Response status: ${apiResponse.status}, Response body: ${responseBody}`);

    if (apiResponse.status === 401) {
      // 如果状态码是401，从 aliveAccountList 中删除对应的序号
      aliveAccountList = aliveAccountList.filter(account => account !== accountNumber.toString());
      await KV.put('PlusAliveAccounts', aliveAccountList.join(','));
   //   console.log(`Removed account number: ${accountNumber} from aliveAccountList`);
      await deletelog('API', accountNumber,'Plus')
    }

    // 返回API响应给用户
    return new Response(responseBody, {
      status: apiResponse.status,
      headers: apiResponse.headers
    });
  }
}

async function deletelog(userName, accountNumber,antype) {
  const currentTime = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const logEntry = {
      user: userName,
      time: currentTime,
      accountNumber: accountNumber
  };
  // Retrieve the existing log array or create a new one if it doesn't exist
  // @ts-ignore
  const lastDeleteLogs = await KV.get(`${antype}DeleteLogs`);
  let logArray = [];
  if (lastDeleteLogs) {
      logArray = JSON.parse(lastDeleteLogs);
  }
  logArray.push(logEntry);
  // @ts-ignore
  await KV.put(`${antype}DeleteLogs`, JSON.stringify(logArray));
}

