var constant = {
	strategy_defaultInitDays: 22,
	strategy_defaultPeriodValue: 1, // 策略的默认指标周期为1分钟
	// 时间格式
	pattern_datetime: 'YYYY/MM/DD HH:mm:ss',
	pattern_date: 'YYYY/MM/DD',
	pattern_time: 'HH:mm:ss',
	pattern_hm: 'HH:mm',
	pattern_minuteBarPeriod: 'YYYY/MM/DD HH:mm',
	pattern_secondBarPeriod: 'YYYY/MM/DD HH:mm:ss',
	// 从新浪拉取的主力、次主力合约的基准成交量
	collector_baseVolume: 20000,
	// 主力、次主力合约相除的倍数决定是否收集相应合约行情数据
	collector_volumeTimes: 3
};

module.exports = constant;