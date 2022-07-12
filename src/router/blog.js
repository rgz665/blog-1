const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("./../controller/blog");

const { SuccessModal, ErrorModal } = require("./../modal/resModal");

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id;
  if (method === "GET" && req.path === "/api/blog/list") {
    const author = req.query.author || "";
    const keywords = req.query.keywords || "";
    const result = getList(author, keywords);
    return result.then((listData) => {
      return new SuccessModal(listData);
    });
  }
  if (method === "GET" && req.path === "/api/blog/detail") {
    const data = getDetail(id);
    return new SuccessModal(data);
  }
  if (method === "POST" && req.path === "/api/blog/new") {
    const data = newBlog(req.body);
    return new SuccessModal(data);
  }
  if (method === "POST" && req.path === "/api/blog/update") {
    const result = updateBlog(id, req.body);
    if (result) return new SuccessModal();
    return new ErrorModal("更新博客失败");
  }
  if (method === "POST" && req.path === "/api/blog/delete") {
    const result = deleteBlog(id);
    if (result) return new SuccessModal();
    return new ErrorModal("删除博客失败");
  }
};

module.exports = handleBlogRouter;
