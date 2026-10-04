/* Format adapters for the same document model. Libraries and fonts load only on export. */
globalThis.PlanFiles=(()=>{
 const scripts=new Map();
 function loadScript(url,globalName){if(globalThis[globalName])return Promise.resolve(globalThis[globalName]);if(scripts.has(url))return scripts.get(url);const promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=()=>resolve(globalThis[globalName]);s.onerror=()=>{s.remove();scripts.delete(url);reject(Error('文档组件加载失败，请重试'))};document.head.appendChild(s)});scripts.set(url,promise);return promise}
 function widths(heads){const n=heads.length;return n===2?[28,72]:n===3?(heads[0]==='模块'?[17,57,26]:heads[0]==='待办事项'?[58,26,16]:[27,35,38]):Array(n).fill(100/n)}
 function docxDefinition(model,d){
  const {Document,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,BorderStyle,VerticalAlign,Footer,PageNumber}=d;
  const text=s=>new TextRun({text:String(s),font:{ascii:'Arial',eastAsia:'Noto Sans SC',hAnsi:'Arial'},size:21,color:'222222'});
  const paragraph=(s,extra={})=>new Paragraph({children:[text(s)],spacing:{after:120,line:310},...extra});
  const children=[new Paragraph({text:model.title,heading:HeadingLevel.TITLE,spacing:{after:200}}),paragraph(model.status,{spacing:{after:240}})];
  const border={style:BorderStyle.SINGLE,size:4,color:'D9D9D9'};
  for(const section of model.sections){children.push(new Paragraph({text:section.heading,heading:HeadingLevel.HEADING_1,keepNext:true,spacing:{before:300,after:160}}));for(const b of section.blocks){
   if(b.type==='h2')children.push(new Paragraph({text:b.text,heading:HeadingLevel.HEADING_2,keepNext:true,spacing:{before:220,after:120}}));
   else if(b.type==='p')children.push(paragraph(b.text));
   else if(b.type==='list')for(const item of b.items)children.push(paragraph('• '+item,{indent:{left:160,hanging:160}}));
   else if(b.type==='table'){
    const sizes=widths(b.heads).map(w=>Math.round(w*94));
    children.push(new Table({width:{size:9400,type:WidthType.DXA},columnWidths:sizes,rows:[b.heads,...b.rows].map((row,index)=>new TableRow({tableHeader:index===0,cantSplit:true,children:row.map((cell,i)=>new TableCell({width:{size:sizes[i],type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,margins:{top:95,bottom:95,left:110,right:110},borders:{top:border,bottom:border,left:border,right:border},shading:{fill:index===0?'E8EDF2':index%2===0?'F8F9FA':'FFFFFF'},children:[new Paragraph({children:[new TextRun({text:String(cell),bold:index===0,font:{ascii:'Arial',eastAsia:'Noto Sans SC',hAnsi:'Arial'},size:19,color:'222222'})],spacing:{after:0,line:270}})]}))}))}));children.push(paragraph('',{spacing:{after:100,line:120}}));
   }
  }}
  return new Document({creator:'筹备黑客松指北',title:model.title,description:model.status,styles:{default:{document:{run:{font:{ascii:'Arial',eastAsia:'Noto Sans SC',hAnsi:'Arial'},size:21,color:'222222'},paragraph:{spacing:{line:310,after:120}}}},paragraphStyles:[{id:'Title',name:'Title',basedOn:'Normal',next:'Normal',run:{size:38,bold:true,color:'000000'},paragraph:{spacing:{after:200}}},{id:'Heading1',name:'heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:28,bold:true,color:'000000'},paragraph:{keepNext:true}},{id:'Heading2',name:'heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:23,bold:true,color:'000000'},paragraph:{keepNext:true}}]},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1080,bottom:1440,left:1253,right:1253,footer:720}}},footers:{default:new Footer({children:[new Paragraph({alignment:'center',spacing:{before:0,after:0,line:200},children:[new TextRun({text:model.status+'  |  ',size:17,color:'777777'}),new TextRun({children:[PageNumber.CURRENT],size:17,color:'777777'})]})]})},children}]});
 }
 function pdfDefinition(model,font='NotoSC'){
  const content=[{text:model.title,style:'title'},{text:model.status,margin:[0,0,0,16],fontSize:11}];
  for(const s of model.sections){content.push({text:s.heading,style:'h1',headlineLevel:1});for(const b of s.blocks){
   if(b.type==='p')content.push({text:b.text,margin:[0,0,0,8]});
   else if(b.type==='h2')content.push({text:b.text,style:'h2',headlineLevel:2});
   else if(b.type==='list')content.push({ul:b.items,margin:[0,0,0,10]});
   else if(b.type==='table')content.push({margin:[0,3,0,12],fontSize:9,table:{headerRows:1,dontBreakRows:true,widths:widths(b.heads).map(w=>(w/100)*451-12),body:[b.heads,...b.rows].map((row,i)=>row.map(value=>({text:String(value),fillColor:i===0?'#E8EDF2':i%2===0?'#F8F9FA':'#FFFFFF',color:'#222222',verticalAlignment:'middle'})))},layout:{hLineWidth:()=>.5,vLineWidth:()=>.5,hLineColor:()=>'#D9D9D9',vLineColor:()=>'#D9D9D9',paddingTop:()=>6,paddingBottom:()=>6,paddingLeft:()=>6,paddingRight:()=>6}});
  }}
  return {info:{title:model.title,author:'筹备黑客松指北',subject:model.status},pageSize:'A4',pageMargins:[62,48,62,48],defaultStyle:{font,fontSize:10,lineHeight:1.35,color:'#222222'},styles:{title:{fontSize:21,color:'#000000',margin:[0,0,0,12]},h1:{fontSize:15,color:'#000000',margin:[0,16,0,10]},h2:{fontSize:12,color:'#000000',margin:[0,12,0,7]}},content,footer:(page,total)=>({text:model.status+'  |  '+page+' / '+total,alignment:'center',fontSize:8,color:'#777777',margin:[0,14,0,0]}),pageBreakBefore:(node,container)=>!!node.headlineLevel&&(container.getFollowingNodesOnPage().length===0||node.startPosition?.verticalRatio>.8)};
 }
 async function generate(model,format){
  if(format==='docx'){const d=await loadScript('/vendor/docx-9.6.1.js','docx');return await d.Packer.toBlob(docxDefinition(model,d))}
  if(format!=='pdf')throw Error('不支持的文件格式');
  const pdf=await loadScript('/vendor/pdfmake-0.3.11.js','pdfMake');const font=new URL('/vendor/NotoSansSC-Regular.ttf',location.href).href;pdf.addFonts({NotoSC:{normal:font,bold:font,italics:font,bolditalics:font}});return await pdf.createPdf(pdfDefinition(model)).getBlob();
 }
 return {generate,docxDefinition,pdfDefinition};
})();
