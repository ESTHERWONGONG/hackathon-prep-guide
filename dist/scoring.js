/* One scoring preset for rules, examples, and exported templates. */
globalThis.ScoreRules=(()=>{
 const presets=[60,70,50];
 function validate(value){if(!presets.includes(value))throw Error('评分方案仅支持60/40、70/30、50/50');return value}
 function profile(value=60){const expert=validate(value),peer=100-expert;return {expert,peer,ratio:expert+'/'+peer,label:'专业 '+expert+'% + 选手互评 '+peer+'%',expertFactor:(expert/100).toFixed(2),peerFactor:(peer/100).toFixed(2)}}
 function score(E,P,value=60){const p=profile(value);if(![E,P].every(n=>Number.isFinite(n)&&n>=0&&n<=100))throw Error('分数须在0–100之间');return (E*p.expert+P*p.peer)/100}
 function text(input,value=60){const p=profile(value),vars={EXPERT_PERCENT:p.expert,PEER_PERCENT:p.peer,SCORE_RATIO:p.ratio,EXPERT_FACTOR:p.expertFactor,PEER_FACTOR:p.peerFactor,EXAMPLE_SCORE:score(85,80,value).toFixed(2)};return String(input).replace(/\{\{([A-Z_]+)\}\}/g,(all,key)=>Object.hasOwn(vars,key)?String(vars[key]):all)}
 return {presets,validate,profile,score,text};
})();
