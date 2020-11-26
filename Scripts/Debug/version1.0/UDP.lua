if UDP == nil then
  net.log("正在加载UDP.lua ...")
  UDP = {}
  UDP.receive = nil
  UDP.socket = require("socket")
  UDP.host = "127.0.0.1"
  UDP.port = "9092"
  UDP.udp = UDP.socket.udp()
  UDP.udp:settimeout(0)
  net.log("UDP.lua加载完毕")
end
