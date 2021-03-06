const Class = require('iguzhi/class');
const eelogger = require('../../lib/logger').tengine;
const Order = require('../base/order');
const dict = require('../base/dict');

function Engine() {
	this.$superConstructor(arguments);
	this.engineName = dict.EngineName_Firm;
}

(function() {

  this.subscribeMarket = function(ctp) {
    var instrumentIDList = this.strategy.subscribeInstrumentIDList;
    eelogger.info("SubscribeMarket: %s", ctp.md.SubscribeMarketData(instrumentIDList, instrumentIDList.length));
  };

	/**
   * @param {Object} order 订单, 用于填充Order实例, 需要提供如下字段:
   * {
	 *		InstrumentID: 'rb1710', // 合约
	 *		Direction: dict.Direction_Buy || dict.Direction_Sell, // 买卖
	 *		CombOffsetFlag: dict.OffsetFlag_Open || dict.OffsetFlag_Close || dict.OffsetFlag_CloseToday || dict.OffsetFlag_CloseYesterday, // 开平
	 *		LimitPrice: 3200, // 价格
	 *		VolumeTotalOriginal: 100 // 数量
   * }
   * 发送订单
   */
  this.sendOrder = function(order) {
    // if (!this.isTradable(getProductID(order.InstrumentID))) {
    //   return;
    // }

  	var o = new Order();

  	o.OrderPriceType = dict.PriceType_LimitPrice;
  	o.CombHedgeFlag = dict.HedgeFlag_Speculation;
  	o.TimeCondition = dict.TimeCondition_GFD;
  	o.VolumeCondition = dict.VolumeCondition_AV;
  	o.MinVolume = 1;
  	o.ContingentCondition = dict.ContingentCondition_Immediately;
  	o.ForceCloseReason = dict.ForceCloseReason_NotForceClose;
  	o.IsAutoSuspend = dict.IsAutoSuspend_No;
  	o.UserForceClose = dict.UserForceClose_No;

  	o.InstrumentID = order.InstrumentID;
  	o.Direction = order.Direction;
  	o.CombOffsetFlag = order.CombOffsetFlag;
  	o.LimitPrice = order.LimitPrice;
  	o.VolumeTotalOriginal = order.VolumeTotalOriginal;

    o.OrderRef = this.nOrderRef();

  	var ctp = this.ctp;
  	var account = ctp.getAccountByUserID(ctp.accountID);

  	o.BrokerID = account.BrokerID;
  	o.UserID = account.UserID;
  	o.InvestorID = account.InvestorID;

  	ctp.reqOrderInsert(o, ctp.nRequestID());
  };

  /**
   * @param {Object} order 订单
   * 撤单
   */
  this.cancelOrder = function(order) {
    // if (!this.isTradable(getProductID(order.InstrumentID))) {
    //   return;
    // }

    var ctp = this.ctp;

    var data = {
      InstrumentID: order.InstrumentID,
      ActionFlag: dict.ActionFlag_Delete,
      OrderRef: order.OrderRef
    };

    ctp.ReqOrderAction(data, ctp.nRequestID());
  };

  /**
   * 查询账户资金
   */
  this.queryAccount = function() {
  	var ctp = this.ctp;
  	ctp.td.ReqQryTradingAccount(ctp.getAccountByUserID(ctp.accountID), ctp.nRequestID());
  };

  /**
   * 查询持仓
   */
  this.queryPosition = function(instrumentID) {
  	var ctp = this.ctp;
    var account = ctp.getAccountByUserID(ctp.accountID);

    var data = {
      BrokerID: account.BrokerID,
      InvestorID: account.InvestorID
    };

    instrumentID && (data.InstrumentID = instrumentID);

    ctp.td.ReqQryInvestorPosition(data, ctp.nRequestID());
  };

  // function getProductID(instrumentID) {
  //   return instrumentID.replace(/\d+/, '');
  // }

}).call(Engine.prototype);

Class.inherit(Engine, require('../base/engine'));

module.exports = Engine;

