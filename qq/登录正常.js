/**
 * 一个简单的控制台，仅用来调试
 * "npm test"或"node ./test"启动
 */
const oicq = require("oicq");
const path = require("path");
const crypto = require("crypto");
var bot = null;
function account() {
  console.log("请输入账号：");
  process.stdin.once("data", (input) => {
    try {
      input = parseInt(input.toString().trim());
      bot = oicq.createClient(input, {
        //日志等级，默认info
        //往屏幕打印日志会降低性能，若消息量巨大建议重定向或设置为"warn"屏蔽一般消息日志
        log_level: "debug",
        //1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad
        platform: 1,
        //被踢下线是否在3秒后重新登陆，默认false
        kickoff: true,
        //数据存储文件夹，需要可写权限，默认主目录下的data文件夹
        data_dir: path.join(__dirname, './data'),
        //手动指定ip和port
        //默认使用msfwifi.3g.qq.com:8080进行连接，若要修改建议优先更改该域名hosts指向而不是手动指定ip
        //@link https://site.ip138.com/msfwifi.3g.qq.com/ 端口通常以下四个都会开放：80,443,8080,14000
        // remote_ip: string,
        // remote_port: number,
      });

      //处理滑动验证码事件
      bot.on("system.login.slider", () => {
        process.stdin.once("data", (input) => {
          bot.sliderLogin(input);
        });
      });

      //处理图片验证码事件
      bot.on("system.login.captcha", () => {
        process.stdin.once("data", (input) => {
          bot.captchaLogin(input);
        });
      });

      //处理设备锁验证事件
      bot.on("system.login.device", (data) => {
        process.stdin.once("data", () => {
          bot.login();
        });
      });

      //处理其他登陆失败事件
      bot.on("system.login.error", (data) => {
        if (data.message.includes("密码错误"))
          password();
        else
          bot.terminate();
      });

      // 登陆成功
      bot.once("system.online", loop);

      // 下线
      bot.once("system.offline", (data) => {
        console.log(data);
      });

      bot.on("internal.timeout", (data) => {
        console.log(data);
      });

      bot.on("request", (data) => {
        console.log("收到request事件", data);
      });
      bot.on("notice", (data) => {
        console.log("收到notice事件", data);
      });
      bot.on("message", (data) => {
        // console.log("收到message事件", data);
      });
    } catch (e) {
      console.log(e.message);
      return account();
    }
    password();
  });
}
function password() {
  console.log("请输入密码：");
  process.stdin.once("data", (input) => {
    input = input.toString().trim();
    const password_md5 = crypto.createHash("md5").update(input).digest('hex');
    console.log(password_md5.toString());
    bot.login(password_md5);
  });
}
function loop() {
  const help = `※友情提示：将log_level设为trace可获得详细的收发包信息。
※发言: send target msg
※退出: bye
※执行任意代码: eval code`;
  console.log(help);
  const listener = async function (input) {
    input = input.toString().trim();
    const cmd = input.split(" ")[0];
    const param = input.replace(cmd, "").trim();
    switch (cmd) {
      case "bye":
        bot.logout();
        process.stdin.destroy();
        break;
      case "send":
        const abc = param.split(" ");
        const target = parseInt(abc[0]);
        let res;
        if (bot.gl.has(target))
          res = await bot.sendGroupMsg(target, abc[1]);
        else
          res = await bot.sendPrivateMsg(target, abc[1]);
        console.log("发送消息结果", res);
        break;
      case "eval":
        try {
          let res = eval(param);
          if (res instanceof Promise)
            res = await res;
          console.log("执行结果", res);
        } catch (e) {
          console.log(e.stack);
        }
        break;
      default:
        console.log("指令错误。");
        console.log(help);
        break;
    }
  };
  process.stdin.on("data", listener);
}

if (!bot) {
  console.log("欢迎来到调试台！");
  account();
}
// const password_md5 = crypto.createHash("md5").update('').digest('hex');
// console.log(password_md5.toString());
module.exports = bot