const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("./../controller/blog");

const { SuccessModal, ErrorModal } = require("./../modal/resModal");

// 统一的登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModal("尚未登录"));
  }
};

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id;

  if (method === "GET" && req.path === "/api/blog/list") {
    let author = req.query.author || "";
    const keywords = req.query.keywords || "";

    if (req.query.isadmin) {
      // 登录验证
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) {
        return loginCheckResult;
      }
      author = req.session.username;
    }

    const result = getList(author, keywords);
    return result.then((listData) => {
      return new SuccessModal(listData);
    });
  }
  if (method === "GET" && req.path === "/api/blog/detail") {
    // 登录验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const result = getDetail(id);
    return result.then((data) => {
      return new SuccessModal(data);
    });
  }
  if (method === "POST" && req.path === "/api/blog/new") {
    // 登录验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then((data) => {
      return new SuccessModal(data);
    });
  }
  if (method === "POST" && req.path === "/api/blog/update") {
    // 登录验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const result = updateBlog(id, req.body);
    return result.then((val) => {
      if (val) return new SuccessModal();
      return new ErrorModal("更新博客失败");
    });
  }
  if (method === "POST" && req.path === "/api/blog/delete") {
    // 登录验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheckResult;
    }

    const author = req.session.username;
    const result = deleteBlog(id, author);
    return result.then((val) => {
      if (val) return new SuccessModal();
      return new ErrorModal("删除博客失败");
    });
  }
};

module.exports = handleBlogRouter;
