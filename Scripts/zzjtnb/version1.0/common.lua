if zzjtnb == nil then
  zzjtnb = {}
  zzjtnb.debug = true
  zzjtnb.time = 0
  zzjtnb.now = 0
  zzjtnb.JSON = require('JSON') --decode转json       encode转字符串
  zzjtnb.net = {}
  --------------------------------    定义zzjtnb的方法  --------------------------------
  zzjtnb.jsonDecode = function(data)
    local isJSON, data =
      pcall(
      function()
        return zzjtnb.JSON:decode(data)
      end
    )
    return isJSON, data
  end
  zzjtnb.jsonEncode = function(data)
    local isJSON, data =
      pcall(
      function()
        return zzjtnb.JSON:encode(data)
      end
    )
    return isJSON, data
  end
  zzjtnb.debuggerLua = function(str)
    local res = {}
    local isJSON, data = zzjtnb.jsonDecode(str)
    if not isJSON then
      res.type = 'loadstring'
      local fun, err = loadstring(str)
      if fun then
        res.data = fun()
      else
        res.data = err
      end
      zzjtnb.net.sendMsg(res)
    else
      res.type = 'dostring_in'
      isJSON, data = zzjtnb.jsonDecode(net.dostring_in(data.state, data.lua_string))
      res.data = data
      zzjtnb.net.sendMsg(res)
    end
  end
  zzjtnb.isEmptytb = function(tbl)
    if next(tbl) ~= nil then
      return true
    else
      return false
    end
  end
  zzjtnb.changeID = function(data)
    data.playerID = data.id
    data.id = nil
    return data
  end

  zzjtnb.testServer = function(id)
    if id == net.get_server_id() then
      return true
    else
      return false
    end
  end
  zzjtnb.getServerStamp = function()
    return {ucid = '00000000000000000000000000000000', alias = 'SERVER'}
  end
  --------------------------------    定义zzjtnb的net  --------------------------------
  zzjtnb.net.log = function(msg, debug)
    if debug == nil then
      if zzjtnb.debug == true then
        net.log(msg)
      end
    elseif debug == true then
      net.log(msg)
    end
  end
  zzjtnb.net.sendData = function(data)
    zzjtnb.net.log('sendData - > ' .. zzjtnbUDP.host .. ':' .. zzjtnbUDP.port)
    local succ, err = zzjtnbUDP.udp:sendto(data, zzjtnbUDP.host, zzjtnbUDP.port)
    -- local succ, err = zzjtnbUDP.udp:send(data)
    if err then
      zzjtnb.net.log('sendData -> ' .. err)
    end
  end

  zzjtnb.net.sendJSON = function(data)
    zzjtnb.net.log('sendJSON -> ' .. net.lua2json(data))
    zzjtnb.net.sendData(net.lua2json(data))
  end
  zzjtnb.net.getTimeStamp = function()
    return {
      os = os.date('%Y-%m-%d %X', os.time()),
      real = DCS.getRealTime(),
      model = DCS.getModelTime()
    }
  end
  zzjtnb.net.sendMsg = function(msg)
    msg.timeS = zzjtnb.net.getTimeStamp()
    zzjtnb.net.sendJSON(msg)
  end
end
