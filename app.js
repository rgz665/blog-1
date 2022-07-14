const querystring = require("query-string");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const { getSession, setSession } = require("./src/db/redis");

const getCookieExpress = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

// session数据
const SESSION_DATA = {};
// 进程内存有限，访问量过大，内存暴增，进程崩溃；
// 正式线上是运行的是多进程，进程之间内存无法共享；
// 操作系统会限制一个进程的最大使用内存；
// session访问频繁，对性能要求极高；
// session数据量不大；
// session可不考虑断电丢失数据的问题；


// nginx
// 高性能的web服务器，开源免费
// 一般做静态服务、负载均衡
// 反向代理

// 处理postData
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    // 数据格式
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 设置返回格式
  res.setHeader("Content-type", "application/json");

  // 获取path
  const url = req.url;
  req.path = url.split("?")[0];

  // 解析query
  req.query = querystring.parse(url.split("?")[1]);

  // 解析cookies
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  // 解析session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  // 没用用户Id
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_ ${Math.random()}`;
    setSession(userId, {});
  }

  req.sessionId = userId;

  getSession(req.sessionId)
    .then((sessionData) => {
      if (sessionData === null) {
        setSession(req.sessionId, {});
        req.session = {};
      } else {
        req.session = sessionData;
      }
      return getPostData(req);
    })
    .then((postData) => {
      req.body = postData;

      // 处理blog路由
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then((blogData) => {
          if (needSetCookie) {
            // 操作cookie
            res.setHeader(
              "Set-Cookie",
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpress()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      // 处理user路由
      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then((userData) => {
          if (needSetCookie) {
            // 操作cookie
            res.setHeader(
              "Set-Cookie",
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpress()}`
            );
          }

          res.end(JSON.stringify(userData));
        });
        return;
      }

      // 404
      res.writeHead(404, {
        "Content-type": "text/plain",
      });
      res.write("404 Not Found\n");
      res.end();
    });
};

module.exports = serverHandle;
