addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  //const pathname =url.pathname;
    event.respondWith(handleRequest(event.request,url.pathname));
  
})

// @ts-ignore
const KV = oai_global_variables;

function parseJwt(token) {
  const base64Url = token.split('.')[1];// 获取载荷部分
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);// 返回载荷解析后的 JSON 对象
}


async function refreshAT(tochecktoken,an) {
  const accessTokenKey = `at_${an}`;
const token = tochecktoken || await KV.get(accessTokenKey) ||'';
if (token && token !== "Bad_RT" && token !== "Old_AT")
{
 const payload = parseJwt(token);
const currentTime = Math.floor(Date.now() / 1000);
if (payload.exp > currentTime ){
  return token
}
}
  const refreshTokenKey = `rt_${an}`;
  const url = 'https://token.oaifree.com/api/auth/refresh';
 const refreshToken = await KV.get(refreshTokenKey);
 if (refreshToken) {
  // 发送 POST 请求
 const response = await fetch(url, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
     },
     body: `refresh_token=${refreshToken}`
 });

 // 检查响应状态
   if (response.ok) {
     const data = await response.json();
     const newAccessToken = data.access_token;
     await KV.put(accessTokenKey, newAccessToken);
     return newAccessToken;
     } else {
     await KV.put(accessTokenKey, "Bad_RT");
     return '';
      }
} 
else {
  await KV.put(accessTokenKey, "Old_AT");
  return '';
}

}





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

if (aliveAccountList.length > 0) {
  // 从 aliveAccountList 中随机选一个
    const accountNumber = aliveAccountList[Math.floor(Math.random() * aliveAccountList.length)];
    const newaccesstoken = await refreshAT('',accountNumber);
    //console.log(`Selected account number: ${accountNumber}, Access token: ${newaccesstoken}`);

    // 构建API请求
    const apiRequest = new Request(`https://api.oaifree.com${pathname}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${newaccesstoken}`
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




