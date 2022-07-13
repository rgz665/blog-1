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
  const sql = `select * from blogs where id = ${id}`;
  return exec(sql).then((rows) => {
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createtime = Date.now();

  const sql = `insert into blogs (title, content, createtime, author) 
  values ('${title}', '${content}', ${createtime}, '${author}')`;

  return exec(sql).then((insertDate) => {
    return {
      id: insertDate.insertId,
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const sql = `
  update blogs set title='${title}', content='${content}' where id=${id}
  `;
  return exec(sql).then((updateData) => {
    // 影响了几行
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const deleteBlog = (id, author) => {
  const sql = `
    delete from blogs where id=${id} and author='${author}'
  `;
  return exec(sql).then((delData) => {
    // 影响了几行
    if (delData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
