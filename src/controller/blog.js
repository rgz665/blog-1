const { exec } = require("../db/mysql");

const getList = (author, keywords) => {

  let sql = `select * from blogs where 1=1 `;

  if (author) {
    sql += `and author=${author} `;
  }
  if (keywords) {
    sql += `and title like '%${keywords}%' `;
  }

  sql += `order by createtime desc `;

  // 返回一个promise
  return exec(sql);

};

const getDetail = (id) => {
  return {
    id: 1,
    title: "标题A",
    content: "内容A",
    createTime: 1111111,
    author: "zhangsan",
  };
};

const newBlog = (blogData = {}) => {
  return {
    id: 3,
  };
};

const updateBlog = (id, blogData = {}) => {
  return true;
};

const deleteBlog = (id) => {
  return true;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
