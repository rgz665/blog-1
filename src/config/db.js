const env = process.env.NODE_ENV;

let MYSQL_CONF;
let REDIS_CONF;

if (env === "dev") {
  MYSQL_CONF = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "18754403145lp",
    database: "myblog",
  };
  REDIS_CONF = {
    port: '6379',
    host: '127.0.0.1'
  }
}

if (env === "production") {
  MYSQL_CONF = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "18754403145lp",
    database: "myblog",
  };
  REDIS_CONF = {
    port: '6379',
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
};
