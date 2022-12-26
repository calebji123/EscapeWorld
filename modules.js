//modules
//text module
class TextMod {
   constructor(state, id, modletLst, loadLst = []) {
      this.name = "text";
      this.locked = admin ? false : state;
      this.id = id;
      this.modletLst = modletLst;
      this.loadLst = loadLst;
      this.firstLoad = true;
      this.htmlElem;
   }

   create() {
      if (this.firstLoad) {
         this.firstLoad = false;
         for (let i = 0; i < this.loadLst.length; i++) {
            unlock(this.loadLst[i]);

         }

      }
      let out = document.createElement("div")
      out.classList.add("flexItem", "textModule")
      out.id = this.id;
      for (let i = 0; i < this.modletLst.length; i++) {
         const item = this.modletLst[i];
         let modletHtml = item.create();
         out.appendChild(modletHtml);
      }
      return out;
   }

   waitCreate() {
      for (let i = 0; i < queue.length; i++) {
         const module = queue[i];
         toDisplay = module.create()
      }
   }

   clear() {
      if (!this.locked && document.getElementById(this.id)) {
         document.getElementById(this.id).remove();
      }
   }
}

//input module
class InputMod {
   constructor(state, id, modletLst) {
      this.name = "input";
      this.locked = admin ? false : state;
      this.modletLst = modletLst;
      this.id = id;
      this.htmlElem;
      this.inputModlets = [];
      this.submitModlet;
      for (let i = 0; i < this.modletLst.length; i++) {
         const element = this.modletLst[i];
         if (element.name != "submit") {
            this.inputModlets.push(element);
         } else {
            this.submitModlet = element
            element.inputMod = this;
         }
      }
   }

   create() {
      let out = document.createElement("div")
      out.classList.add("flexItem", "inptModule")
      out.id = this.id;
      for (let i = 0; i < this.modletLst.length; i++) {
         const item = this.modletLst[i];
         let modletHtml = item.create();
         out.appendChild(modletHtml);
      }
      return out;
   }

   complete() {
      console.log(this)
      update(tile);
      console.log('unlocked^^')
      display.scroll({ top: 150, behavior: "smooth" });

   }

   fail() {
      document.getElementById(this.id).classList.add("shaker");
      let that = this;
      setTimeout(function () {
         document.getElementById(that.id).classList.remove("shaker");
      }, 500);

   }

   answers() {
      let r = []
      for (let i = 0; i < this.inputModlets.length; i++) {
         const item = this.inputModlets[i];
         r.push(item.check())
      }

      return r
   }

   clear() {
      if (!this.locked && document.getElementById(this.id)) {
         document.getElementById(this.id).remove();
      }
   }
}

//image module
class ImgMod {
   constructor(state, id, modletLst) {
      this.name = "img";
      this.locked = admin ? false : state;
      this.id = id;
      this.modletLst = modletLst;
      this.htmlElem;
   }

   create() {
      let out = document.createElement("div")
      out.classList.add("flexItem", "imgModule")
      out.id = this.id;
      for (let i = 0; i < this.modletLst.length; i++) {
         const item = this.modletLst[i];
         let modletHtml = item.create();
         out.appendChild(modletHtml);
      }
      return out;
   }

   clear() {
      if (!this.locked && document.getElementById(this.id)) {
         document.getElementById(this.id).remove();
      }
   }
}







//modulettes
//title modulette
class TitleModlet {
   constructor(id, text) {
      this.name = "title";
      this.text = text;
   }

   create() {
      return (reac(`
       <div class="modulette">
       <div class="dispTitleDiv flexItem">
           <p class="dispTitle">
               ${this.text}
           </p>
       </div>
       `))
   }
}

//paragraph modulette
class ParaModlet {
   constructor(id, text) {
      this.name = "para";
      this.text = text;
   }

   create() {
      return (reac(`
       <div class="modulette">
           <div class="dispParaDiv flexItem">
               <p class="dispParaArr">
               >
               </p>
               <p class="dispPara">
               ${this.text}
               </p>
           </div>
       </div>
       `))
   }
}

//dialogue modulette
class DiaModlet {
   constructor(id, name, text) {
      this.name = "dia";
      this.name = this.hyphened(name);
      this.text = text;
   }

   hyphened(name) {
      let x = name;
      if (x == "Gilmore") {
         x = "Gil&shy;more";
      }
      return x;
   }

   create() {
      return (reac(`
       <div class="modulette">
           <div class="dispDiaDiv flexItem">
               <p class="dispDiaName">
                   ${this.name}:
               </p>
               <p class="dispDiaPara">
                   "${this.text}"
               </p>
           </div>
       </div>
       `))

   }
}

//character input modulette
class CharModlet {
   constructor(id, val = "") {
      this.name = "char";
      this.id = id;
      this.val = val.toUpperCase();
   }

   create() {
      return (reac(`
       <div class="modulette">
           <div class="charInpDiv flexItem">
               <input class="charInp" type="text" oninput="${inputChange}" onkeydown="${checkDelete}"
               maxlength="2" autocomplete="new-password" id="${this.id}" value="${this.val}">
               </input>
           </div>
       </div>
       `))
   }

   check() {
      return document.getElementById(this.id).value;
   }
}

//word input modulette
class WordModlet {
   constructor(id, oneWord, plc, val) {
      this.name = "word";
      this.id = id;
      this.oneWord = oneWord;
      this.plc = plc ? plc : "";
      this.val = val ? val : "";
   }

   create() {
      let main = document.createElement("div");
      main.classList.add("modulette");
      main.innerHTML =
         `<div class="wordInpDiv flexItem">
           <input type="text" oninput="${inputChange}" class="wordInp" placeholder="${this.plc}"
           autocomplete="new-password" value="${this.val}" id="${this.id}" spellcheck="false">
           </input>
       </div>`

      return main;
   }
   check() {
      return document.getElementById(this.id).value;
   }
}

//colour button Modulette
class ColModlet {
   constructor(id, colLst, valI) {
      this.name = "col";
      this.id = id;
      this.colLst = colLst;
      this.val = valI;
   }

   create() {
      let main = document.createElement("div");
      main.classList.add("modulette");
      main.innerHTML = `
       <div class="colInpDiv flexItem">
           <input type="button" class="colInp" id="${this.id}" onclick="${colChange}"
           style="background-color:${this.colLst[this.val]}">
           </input>
       </div>
       
       `

      return main;
   }

   check() {
      return this.val;
   }
}

//submit button modulette
class SubmitModlet {
   constructor(id, buttonName, local, interactions) {
      this.name = "submit";
      this.id = id;
      this.interactions = interactions;
      this.buttonName = (buttonName || "submit").toUpperCase();
      this.local = local;
      this.inputMod = null;
   }

   create() {

      let main = reac(`
      <div class="modulette">
         <div class="submitInpDiv flexItem">
            <input type="button" class="submitInp" id="${this.id}" 
            value="${this.buttonName} ${this.local != null ? this.local ? '🍃' : '🍂' : null}">
            </input>
         </div>
       </div>
       `)
      main.getElementsByClassName("submitInp")[0].addEventListener("click", this.check.bind(this))
      return main

   }

   check() {
      let inputs = this.inputMod.answers();

      for (let i = 0; i < this.interactions.length; i++) {
         const ans = this.interactions[i];
         let fr = true
         for (let j = 0; j < ans.answers.length; j++) {
            let answer = ans.answers[j]
            if (typeof (ans.answers[j]) == "string" || typeof (ans.answers[j]) == "char") {
               answer = answer.toUpperCase()
            }
            if (answer != null && answer != inputs[j]) {
               fr = false
            }
         }
         if (fr) {
            for (let k = 0; k < ans.unlocks.length; k++) {
               unlock(ans.unlocks[k])
            }
            this.inputMod.complete()
         } else {
            this.inputMod.fail()
         }
      }

   }
}

//image modulette
class ImgModlet {
   constructor(id, url, height) {
      this.name = "imglet";
      this.url = url;
      this.height = height;
   }

   create() {
      let main = document.createElement("div");
      main.classList.add("modulette");
      let inDiv = document.createElement("div");
      inDiv.classList.add("dispImgDiv");
      inDiv.classList.add("flexItem");
      let inElem = document.createElement("img");
      inElem.classList.add("dispImg");
      inElem.src = this.url;
      inElem.style.height = this.height + "px";
      inDiv.appendChild(inElem);
      main.appendChild(inDiv);

      return main;
   }
}