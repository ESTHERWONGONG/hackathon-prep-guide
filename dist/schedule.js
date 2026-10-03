globalThis.PrepMath=(()=>{
 const HOUR=3600000;
 function parseStart(value){if(!value)return null;if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))throw Error('请输入完整开赛日期与时刻');const t=Date.parse(value+':00+08:00');if(!Number.isFinite(t)||new Date(t+8*3600000).toISOString().slice(0,16)!==value)throw Error('开赛时间无效');return t}
 function calculate(settings,config){
  const duration=settings.durationHours;if(![24,48,72,96].includes(duration))throw Error('周期须为24/48/72/96小时');
  const plan=HackathonPlanner.calculate(config),start=parseStart(settings.startLocal),h=duration;
  const anchors={T0:0,MID:h/2,PRECHECK:h-2,D:h,R:h+84,LIVE:h+(plan.hasFinal?144:108)};
  anchors.EVENT_END=anchors.LIVE+plan.totalMinutes/60;
  anchors.SCORE_LOCK=plan.hasFinal?anchors.R:anchors.EVENT_END+12;
  anchors.FINAL_PUBLISH=anchors.EVENT_END+24;anchors.FINAL_LOCK=anchors.FINAL_PUBLISH+48;
  const milestones=[
   ['报名开放',-336],['规则与资源确认',-168],['技术彩排',-48],['签到',-.5],['开赛 / 命题公布',0],['成员与基线冻结',2],['中途检查',h/2],['提交预检',h-2],['制作截止',h],['资格审核完成',h+12],['72h阅件与互评结束',h+84]
  ];
  if(plan.hasFinal)milestones.push(['海选入围申诉截止',h+108]);
  milestones.push([plan.hasFinal?'12队决赛':'全员单轮路演',anchors.LIVE],['暂定最终成绩',anchors.FINAL_PUBLISH],['最终成绩申诉截止',anchors.FINAL_LOCK],['作品馆与回顾',anchors.EVENT_END+168]);
  return {start,durationHours:duration,plan,anchors,milestones:milestones.map(([label,offset])=>({label,offset,time:start===null?null:start+offset*HOUR}))};
 }
 function due(task,schedule){const offset=schedule.anchors[task.anchor];return offset===undefined?null:(schedule.start===null?null:schedule.start+(offset+task.hours)*HOUR)}
 function phases(s,at=Date.now()){
  const entries=[['筹备启动',null],['报名开放',-336],['开赛',0],['中途检查',s.durationHours/2],['制作截止',s.anchors.D],['阅件结束',s.anchors.R],[s.plan.hasFinal?'决赛路演':'全员路演',s.anchors.LIVE],['回顾归档',s.anchors.EVENT_END+168]];
  let current=0;
  if(s.start!==null)entries.forEach((entry,i)=>{if(i>0&&s.start+entry[1]*HOUR<=at)current=i});
  return entries.map(([label,offset],i)=>({label,offset,time:offset===null||s.start===null?null:s.start+offset*HOUR,state:i<current?'past':i===current?'current':'future',status:i<current?'已过节点':i===current?'当前阶段':s.start===null?'待排期':'未到时间'}));
 }
 return {parseStart,calculate,due,phases,HOUR};
})();
