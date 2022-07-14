const { login } = require("../controller/user");

const { SuccessModal, ErrorModal } = require("./../modal/resModal");

const { setSession } = require("../db/redis");

const handleUserRouter = (req, res) => {
  const method = req.method;
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then((data) => {
      if (data.username) {
        req.session.username = data.username;
        req.session.realname = data.realname;
        setSession(req.sessionId, req.session);
        return new SuccessModal();
      }
      return new ErrorModal("登录失败");
    });
  }
  // 登录验证
};

module.exports = handleUserRouter;
