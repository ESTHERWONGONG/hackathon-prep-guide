/* A single immutable plan snapshot drives Word and PDF. No account identifiers are exported. */
globalThis.PlanDocument=(()=>{
 const labels={online:'线上',onsite:'线下',hybrid:'混合'},number=n=>Number(Number(n).toFixed(2)).toString();
 const date=t=>t===null?'待确定':new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(t);
 const relative=h=>h===0?'开赛时':(h<0?'开赛前 ':'开赛后 ')+(Number.isInteger(Math.abs(h)/24)?Math.abs(h)/24+' 天':number(Math.abs(h))+' 小时');
 const p=text=>({type:'p',text}),list=items=>({type:'list',items}),table=(heads,rows)=>({type:'table',heads,rows});
 function applicable(t,state,config){return(t.when!=='final'||config.teams>30)&&(t.when!=='onsite'||state.deliveryMode!=='online')}
 function build(input,options={}){
  const state=JSON.parse(JSON.stringify(input.settings)),config=JSON.parse(JSON.stringify(input.config));
  const math=HackathonPlanner.calculate(config),schedule=PrepMath.calculate(state,config),score=ScoreRules.profile(state.scoringPreset),groups=window.PREP_NAV;
  const groupIds=options.groups||groups.filter(g=>!g.onsite||state.deliveryMode!=='online').map(g=>g.id);
  if(!Array.isArray(groupIds)||!groupIds.length||groupIds.some(id=>!groups.some(g=>g.id===id)))throw Error('请至少选择一个有效模块');
  const selected=groups.filter(g=>groupIds.includes(g.id)),allTasks=window.PREP_TASKS.filter(t=>applicable(t,state,config)),done=allTasks.filter(t=>state.done[t.id]===true).length;
  const complete=done===allTasks.length&&allTasks.length>0&&!!state.startLocal&&input.accountLoaded;
  const title=String(options.title||'黑客松筹备方案').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,80)||'黑客松筹备方案';
  const generatedAt=date(input.generatedAt??Date.now()),sections=[],references=new Set();
  const add=(heading,blocks)=>sections.push({heading,blocks});
  const text=x=>ScoreRules.text(x,state.scoringPreset).replaceAll('₂','2');
  const due=t=>t.anchor==='AWARD'?'按奖项公告确定':(schedule.start===null?relative(schedule.anchors[t.anchor]+t.hours):date(PrepMath.due(t,schedule)));
  const selectedTaskIds=new Set(selected.flatMap(g=>g.chapters.map(c=>c[0]))),selectedTasks=allTasks.filter(t=>selectedTaskIds.has(t.chapter));
  add('活动概况',[p(complete?'当前全部适用待办已由组织者勾选完成。本文件汇总导出时的配置与所选模块，供团队执行和交接使用。':'本文件为筹备草稿，汇总当前配置与所选模块。未完成任务及尚待补充的信息列于文末，供团队继续落实。'),p('生成时间 '+generatedAt+'（北京时间 UTC+8）'),table(['项目','当前配置'],[['活动形式',labels[state.deliveryMode]],['制作周期',state.durationHours+' 小时'],['预计开赛',date(schedule.start)+'（UTC+8）'],['预计有效提交',math.teams+' 队／每个独立赛道'],['当前赛制',math.hasFinal?'海选后默认 12 队决赛':'全员单轮评审'],['全局筹备进度',done+' / '+allTasks.length+' 项已勾选完成'],['文件包含模块',selected.map(g=>g.title).join('、')],['已选模块任务',selectedTasks.filter(t=>state.done[t.id]).length+' / '+selectedTasks.length+' 项已勾选完成']]),p(input.accountLoaded?'计划来自当前账户的配置快照。任务状态是组织者的勾选记录，不代表系统已核验合同、付款或执行证据。':'访客试算：本文件使用当前页面参数，未保存到账户。'),p('队伍数不等于现场人数。场地容量、餐量、预算、名单和实际入口仍需由组织者填写确认。')]);
  add('活动时间表',[p('以下为当前制作周期推算的建议节点。制作以外的审核、阅件、申诉和路演时间另计，实际活动须确认后发布。'),table(['节点','相对开赛','北京时间 UTC+8'],schedule.milestones.map(m=>[m.label,relative(m.offset),date(m.time)]))]);
  if(groupIds.includes('rules')){
   add('当前评审与路演方案',[table(['参数','当前值'],[['评分比例',score.label],['总分公式','S = '+score.expertFactor+'E + '+score.peerFactor+'P'],['专业评审',math.teams+' 个作品 × 3 位 × '+number(math.reviewMinutes)+' 分钟 = '+number(math.reviewerHours)+' 评委小时'],['阅件评委',atLeast(math.reviewerCount)+'；每人至多 '+math.capacity+' 件／180 分钟，另备 '+Math.ceil(math.reviewerCount*.2)+' 位（20% 向上取整）'],['选手互评',math.peerReviews+' 份；每队约 40 分钟'],...(math.hasFinal?[['决赛评委','另配 5 名固定评委']]:[]),['路演队伍',math.showcaseTeams+' 队'],['演示与问答',math.showcaseTeams+' ×（3 + 3）= '+math.showcaseTeams*6+' 分钟'],['中场休息',math.breaks+' 次 × 5 = '+math.breakMinutes+' 分钟，每 8 队后休息，末队后不追加'],['切换与评分',math.showcaseTeams+' × '+number(math.switchMinutes)+' = '+number(math.switchTotal)+' 分钟'],['开场／闭场／故障缓冲',[math.openingMinutes,math.closingMinutes,math.bufferMinutes].map(number).join(' / ')+' 分钟'],['直播总时长',number(math.totalMinutes)+' 分钟']]),p(math.hasFinal?'海选 E 为 3 份专业总分的均值，P 为 5 份有效队伍互评总分的中位数；决赛专业分 E2 为 5 名固定评委总分的均值，最终 F = '+score.expertFactor+'E2 + '+score.peerFactor+'P，P 冻结为海选互评。':'E 为 3 份专业总分的均值，P 为 5 份有效队伍互评总分的中位数；本轮异步阅件与一次路演后锁分，不增加第二轮决赛。'),p('缺评、回避、同分、申诉及降级按提前公布的规则处理；不得把缺失分数记为 0。')]);
  }
  for(const group of selected){
   const ids=new Set(group.chapters.map(c=>c[0])),tasks=allTasks.filter(t=>ids.has(t.chapter));
   add(group.title+'筹备清单',[p(group.intro),...(tasks.length?[table(['待办事项','建议截止 UTC+8','当前状态'],tasks.map(t=>[t.label,due(t),state.done[t.id]===true?'已勾选完成':'待完成']))]:[p('当前活动形式不适用本模块的现场任务。本节仅作为参考，不计入全局进度。')])]);
   if(options.details!==false){
    for(const [id,label] of group.chapters){
     const source=window.HANDBOOK_DATA.pages[id];if(!source)continue;
     const blocks=[p('执行参考：以下规则、交付物与字段为筹备建议；未填写的奖项、赛道、合作方、负责人和入口不视为已确认。')];
     for(const b of source.blocks){
      if(b.special||id==='demo'&&['先看30队这条边界','路演时长：基础部分与额外增项','12队决赛时间表示例（默认增项）'].includes(b.title)||id==='journey'&&b.title==='可直接执行的赛程'||id==='scoring'&&b.title.startsWith('{{SCORE_RATIO}}'))continue;
      blocks.push({type:'h2',text:text(b.title)});if(b.paragraph)blocks.push(p(text(b.paragraph)));if(b.list||b.ordered)blocks.push(list((b.list||b.ordered).map(text)));if(b.heads)blocks.push(table(b.heads.map(text),b.rows.map(row=>row.map(text))));if(b.note)blocks.push(p('说明：'+text(b.note)));if(b.refs)for(const ref of b.refs)references.add(ref);
     }
     if(blocks.length>1)add(group.title+' '+label,blocks);
    }
   }
  }
  const missing=allTasks.filter(t=>!state.done[t.id]);
  add('待落实事项',[p(missing.length?'全局还有 '+missing.length+' 项待办。下表包含本次未导出模块中的缺项，取消导出模块不会改变总进度。':'全部适用待办均已勾选完成。再次修改活动形式或队伍规模后，请重新核对新增适用任务。'),...(!state.startLocal?[p('开赛日期尚未填写，文件内暂以相对节点表示。')]:[]),...(missing.length?[table(['模块','待办事项','建议截止 UTC+8'],missing.map(t=>[groups.find(g=>g.chapters.some(c=>c[0]===t.chapter)).title,t.label,due(t)]))]:[]),p('发布前补齐实际信息：活动名称、组织者及联系入口、已采用的赛道和奖项、奖金额度与发放日期、报名与会议链接，以及适用的赞助商、菜单餐量、场地地址和岗位名单。当前网站未记录这些实际决定，不能由勾选状态自动补全。')]);
  if(options.templates&&groupIds.includes('rules'))add('表单模板附录',[p('以下为可修改模板。方括号为待填内容，不是已签署的承诺或真实报名资料。'),...window.HANDBOOK_DATA.templates.flatMap(t=>[{type:'h2',text:t.title},...text(t.text).split('\n').filter(Boolean).map(p)])]);
  if(references.size)add('参考来源',[p('下列来源用于形成筹备建议，不代表采用其全部规则或获得其背书。'),...window.HANDBOOK_SOURCES.filter(s=>references.has(s.id)).flatMap(s=>[p(s.id+' '+s.name),p(s.url)])]);
  return {title,status:complete?'完整方案':'筹备草稿',complete,generatedAt,done,total:allTasks.length,groups:selected.map(g=>g.title),sections,filename:title.replace(/[\\/:*?"<>|]/g,'-')+'-'+(complete?'完整方案':'草稿')};
 }
 function atLeast(n){return '至少 '+n+' 位'}
 return {build,applicable,date};
})();
