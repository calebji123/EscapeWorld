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
         addNew(this.loadLst);
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

   clear() {
      if (!this.locked && document.getElementById(this.id)) {
         document.getElementById(this.id).remove();
      }
   }
}

//input module
class InputMod {
   constructor(state, id, modletLst, cpltList, unlocks) {
      this.name = "input";
      this.locked = admin ? false : state;
      this.modletLst = modletLst;
      this.id = id;
      this.cpltList = cpltList;
      this.unlocks = unlocks;
      this.htmlElem;

      this.inputModlets = [];
      this.submitButton;
      for (let i = 0; i < this.modletLst.length; i++) {
         const element = this.modletLst[i];
         if (element.name != "submit") {
            this.inputModlets.push(element);
         } else {
            this.submitButton = element
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
      addNew(this.cpltList);
      this.submitButton.complete = true;
      console.log(this)
      for (const x in tile.neighbors) {
         if (tile.neighbors[x] && this.unlocks.includes(tile.neighbors[x].code)) {
            tile.neighbors[x].lock = false;

            //go from code to opposite tile back to original tile
            let link = tiles.find(obj => obj.code == tile.neighbors[x].code);
            Object.entries(link.neighbors).forEach(([key, info]) => {
               if (info && info.code == tile.code) {
                  link.neighbors[key].lock = false;
               }
            });
         }
      }
      update(tile);
      console.log('unlocked^^')
      display.scroll({ top: 150, behavior: "smooth" });

   }

   fail() {
      document.getElementById(this.id).classList.add("shaker");
      this.submitButton.complete = false;
      let that = this;
      setTimeout(function () {
         document.getElementById(that.id).classList.remove("shaker");
      }, 500);

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
   constructor(id, ans, val = "") {
      this.name = "char";
      this.id = id;
      this.ans = ans.toUpperCase();
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
      return this.ans == document.getElementById(this.id).value;
   }
}

//word input modulette
class WordModlet {
   constructor(id, ans, plc, oneWord) {
      this.name = "word";
      this.id = id;
      this.ans = ans.toUpperCase();
      this.plc = plc;
      this.val = "";
      this.oneWord = oneWord;
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
      return this.ans == document.getElementById(this.id).value;
   }
}

//colour button Modulette
class ColModlet {
   constructor(id, colLst, ansI, valI) {
      this.name = "col";
      this.id = id;
      this.colLst = colLst;
      this.ans = ansI;
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
      return this.ans == this.val;
   }
}

//submit button modulette
class SubmitModlet {
   constructor(id, buttonName, local) {
      this.name = "submit";
      this.id = id;
      this.buttonName = (buttonName || "submit").toUpperCase();
      this.local = local;
      this.complete = false;

   }

   create() {
      let main = document.createElement("div");
      main.classList.add("modulette");
      main.innerHTML = `
       <div class="submitInpDiv flexItem">
           <input type="button" class="submitInp" onclick="${submit}" id="${this.id}"
           value="${this.buttonName} ${this.complete ? '✓' : (this.local ? '🍃' : '🍂')}">
           </input>
       </div>
       `

      return main;

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