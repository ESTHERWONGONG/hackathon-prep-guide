/* Pure planning math shared by the visible calculator and WebMCP. */
globalThis.HackathonPlanner = (() => {
  const defaults = {teams:20, reviewMinutes:10, switchMinutes:2, openingMinutes:10, closingMinutes:10, bufferMinutes:10};
  const limits = {teams:[6,120,1], reviewMinutes:[1,60,0.5], switchMinutes:[0,15,0.5], openingMinutes:[0,60,0.5], closingMinutes:[0,60,0.5], bufferMinutes:[0,60,0.5]};
  function validate(config){
    for(const [key,[min,max,step]] of Object.entries(limits)){
      const value=config[key];
      if(!Number.isFinite(value)||value<min||value>max||Math.abs(value/step-Math.round(value/step))>1e-8)throw new Error(key==='teams'?'队伍数须为6–120的整数':'时长超出范围或不符合0.5分钟步长');
    }
    return config;
  }
  function calculate(config){
    const c=validate({...defaults,...config}),hasFinal=c.teams>30,showcaseTeams=hasFinal?12:c.teams;
    const breaks=Math.floor((showcaseTeams-1)/8),breakMinutes=breaks*5;
    const baseMinutes=showcaseTeams*6+breakMinutes,switchTotal=showcaseTeams*c.switchMinutes;
    const extrasMinutes=switchTotal+c.openingMinutes+c.closingMinutes+c.bufferMinutes;
    const capacity=Math.floor(180/c.reviewMinutes),reviewerCount=Math.max(3,Math.ceil(3*c.teams/capacity));
    return {...c,hasFinal,showcaseTeams,breaks,breakMinutes,baseMinutes,switchTotal,extrasMinutes,totalMinutes:baseMinutes+extrasMinutes,capacity,reviewerCount,reviewerHours:3*c.teams*c.reviewMinutes/60,peerReviews:c.teams*5};
  }
  return {defaults,limits,validate,calculate};
})();
