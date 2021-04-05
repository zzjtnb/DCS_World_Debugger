const oicq = require("oicq");
const path = require('path');
const axios = require('axios')

const { uin, password_md5, help, qq_group } = require('../config/qq');
oicq.setGlobalConfig({ cache_root: path.join(__dirname, './data') })
if (!uin || !password_md5 || !qq_group) return;
const bot = oicq.createClient(uin, {
  //日志等级，默认info
  //往屏幕打印日志会降低性能，若消息量巨大建议重定向或设置为"warn"屏蔽一般消息日志
  log_level: "off",
  //1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad
  platform: 5,
  //被踢下线是否在3秒后重新登陆，默认false
  kickoff: true,
  //数据存储文件夹，需要可写权限，默认主目录下的data文件夹
  data_dir: path.join(__dirname, './data'),
});
// 登陆成功
bot.once("system.online", () => {
  console.log('登录成功');
});

bot.on('message.private', (data) => {
  bot.sendPrivateMsg(data.user_id, data.message[0].data.text);
})
bot.on("message.group", async data => {

  let text = ''
  if (qq_group.includes(data.group_id) && data.message[0].data.qq == uin) {
    const expr = data.message[1].data.text.split(" ")[1]
    switch (expr) {
      case "help": case '帮助':
        // bot.sendGroupMsg(data.group_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]\n${help}`);
        break
      case "userInfo": case "个人信息":
        // let model = await userInfoModel.findOne({ where: { qq: data.user_id } })
        // if (!model) return bot.sendGroupMsg(data.group_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]\n[CQ:face,id=10]暂未找到与该QQ绑定的用户`);
        // let info = model.dataValues
        // text = `用户名:${info.name}\n误伤:${info.friendly_fire || 0}次\n自杀:${info.self_kill || 0}次\n坠毁:${info.crash || 0}次\n弹射:${info.eject || 0}次 \n 起飞:${info.takeoff || 0}次\n降落:${info.landing || 0}次\n飞行员死亡:${info.pilot_death || 0}次`
        // bot.sendGroupMsg(data.group_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]\n${text}`);
        // console.log(`${data.user_id}信息已发送`);
        break;
      case "killInfo": case "击杀详情":
        // if (!userModel && killModel.count == 0) return bot.sendPrivateMsg(data.user_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]\n[CQ:face,id=10]暂未找到与该QQ绑定的用户`);
        // if (userModel && killModel.count == 0) return bot.sendPrivateMsg(data.user_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]\n[CQ:face,id=10] 没有击杀记录`);
        // bot.sendPrivateMsg(data.user_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]\n${text}`);
        // console.log(`${data.user_id}信息已发送`);
        break;
      default:
        let httpUrl = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${encodeURI(expr)}`
        res = await axios.get(httpUrl)
        if (res.status == 200) {
          bot.sendGroupMsg(data.group_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]  ${res.data.content}`)
        } else {
          bot.sendGroupMsg(data.group_id, `[CQ:at,qq=${data.user_id},text=@${data.sender.nickname}]  ${expr}`)
        }
        break;
    }
  }
})
bot.on("request", (data) => {
  // console.log(data)
})
bot.on("system.offline", (data) => {
  console.log(data)
})
bot.on("notice", (data) => {
  // console.log(data)
})
//使用密码登录(password可以是MD5或原文密码)
bot.login(password_md5);

module.exports = bot