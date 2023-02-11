async function y() {
   const response = await fetch('test.txt');
   const data = await response.text();

   const regex1 = new RegExp(/<([^<>]+)>(.*?)\n<\/\1>/gms);
   const regex2 = new RegExp(/<([^<>]+)>(.*?)<\/\1>/gms);
   const regex3 = new RegExp(/([^<]*)/ms);
   regex2.dotAll = true

   var globals = regex3.exec(data)[1].split('\n')
   var content = {}
   var color = [];
   var m;
   var bigout = {'settings':{}}
   console.log(globals)
   globals.forEach(st => {
       if (st[st.length-1]==';') {
           const parms = st.split(' >> ');
           try {
               switch (parms[0]) {
                   case 'title':
                       bigout['Title'] = parms[1]
                       break;
                   case 'areas':
                       bigout['AREAS'] = parms[1]
                       break;
                   case 'colors':
                       color = parms[1]
                       break;
                   case 'nolocal;':
                       console.log('ok no more local')
                       break;
                   default:
                       console.log('??!!!!', parms)
                       break;
               }
           } catch (error) {
               console.log('??!!')
           }
           
       } else if (st!='') {
           console.log('??? haha')
       }
   });

   console.log(bigout)

   do {
       m = regex1.exec(data);
       if (m) {
           content[m[1]] = m[2]
       }
   } while (m);

   for (const key in content) {
       let sub = []
       do {
           m = regex2.exec(content[key]);
           if (m) {
               let subs = m[2].split(';\n').slice(1, -1)
               for (let i = 0; i < subs.length; i++) {
                   subs[i] = subs[i].split(' >> ')
               }
               sub.push([m[1], subs])
           }
       } while (m);

       let headers = regex3.exec(content[key])[1].split('\n')

       let out = {'links':{}}

       headers.forEach(st => {
           if (st[st.length-1]==';') {
               const parms = st.split(' >> ');
               const tht = parms[0].replace(/\s/g, '')
               try {
                   switch (tht) {
                       case 'up':
                       case 'down':
                       case 'left':
                       case 'right':
                           out.links[tht] = {
                               'lock': parms[2]? false: true,
                               'code': parms[1]
                           }
                           break;
                       case 'area':
                           out['area'] = parms[1]
                           break;
                       default:
                           console.log('??!!!!', parms)
                           break;
                   }
               } catch (error) {
                   console.log('??!!')
               }
               
           } else if (st.replace(/\s/g, '')!='') {
               console.log('??? haha')
           }
       });
       let modules = []
       let capitalizer = {
           'text':'Text',
           'input':'Input'
       }
       sub.forEach(s => {
           let outt = {'name':capitalizer[s[0]], 'modlets':[]}
           
           s[1].forEach((ttt)=>{
               for (let i = 0; i < ttt.length; i++) {
                   ttt[i] = ttt[i].trim();
               }
               outt.modlets.push([ttt[0], ttt.slice(1)])
           })
           modules.push(outt)
       });


       content[key] = {
           ...out,
           'sub':sub,
           'modules':modules
       }
   }
   bigout['modules'] = content
   console.log(JSON.stringify(bigout, null, 4))
}
y()