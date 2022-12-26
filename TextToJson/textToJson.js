var a = ""

document.getElementById('inputfile').addEventListener('change', function () {
   var fr = new FileReader();
   fr.onload = function () {
      a = fr.result;
      document.getElementById('a').textContent = pars(a.split(";\n"))
   }

   fr.readAsText(this.files[0]);
})

mods = {
   't': "Text",
   'i': "Input"
}

modls = {
   't': "Title",
   'd': "Dia",
   'p': "Para",
   "c": "Char",
   "w": "Word",
   "o": "Col",
   "s": "Sumbit"
}

function pars(txt) {
   let thes = ""
   txt.forEach(e => {
      if (e[0] == '<') {
         let a = e.match("<(.*)>")[1];
         if (a[0] == "/") {
            thes += (`],\n`)
         } else {
            thes += (`"name":"${mods[a]}",\n"modlets":[\n`)
         }
      } else {
         if (e.split("\n").length == 1) {
            thes += `["${modls[e[0]]}", ["${e.substring(2).split(" >> ").join('", "')}"]],\n`
         } else {
            d = e.split("\n");
            y = ""
            const p = {
               'a': "answers",
               'u': "unlocks"
            }
            for (let i = 0; i < d.length - 1; i++) {

               y += `{"${p[d[i + 1].substring(0, 1)]}": ${d[i + 1].substring(2).replace(/ \^\^ /g, ', ')}}${i == d.length - 2 ? "" : ","}\n`
            }
            thes += `[["${modls[e[0]]}", ["${d[0].substring(2).split(" >> ").join('", "')}"],
[${y}]],\n]`
         }
      }

   });
   console.log(thes)
   return thes
}