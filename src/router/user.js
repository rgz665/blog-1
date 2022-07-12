const { loginCheck } = require("../controller/user");

const { SuccessModal, ErrorModal } = require("./../modal/resModal");

const handleUserRouter = (req, res) => {
  const method = req.method;
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    const result = loginCheck(username, password);
    if (result) return new SuccessModal();
    return new ErrorModal("登录失败");
  }
};

module.exports = handleUserRouter;
