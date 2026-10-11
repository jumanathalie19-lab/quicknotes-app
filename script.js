const noteText=document.getElementById("noteText");
const charCount=document.getElementById("charCount");
const wordCount=document.getElementById("wordCount");
const clearBtn=document.getElementById("clearBtn");
const themeBtn=document.getElementById("themeBtn");
const form=document.getElementById("note-form");
const list=document.getElementById("notes-list");
const noteCountEl=document.getElementById("note-count");
const category=document.getElementById("category");
const searchInput=document.getElementById("searchInput");
const errorMsg=document.getElementById("errorMsg");

function updateCounts(){
 const len=noteText.value.length;
 charCount.textContent=`${len} / 200 characters`;
 wordCount.textContent=`${noteText.value.trim()===""?0:noteText.value.trim().split(/\s+/).length} words`;
 charCount.classList.remove("warning","over");
 if(len>=200) charCount.classList.add("over");
 else if(len>=160) charCount.classList.add("warning");
 localStorage.setItem("draft",noteText.value);
}
function getNotes(){return JSON.parse(localStorage.getItem("quicknotes")||"[]")}
function saveNotes(n){localStorage.setItem("quicknotes",JSON.stringify(n))}
function renderNotes(filter=""){
 const notes=getNotes();
 const filtered=notes.filter(n=>n.text.toLowerCase().includes(filter.toLowerCase()));
 list.innerHTML="";
 filtered.forEach((note,i)=>{
  const li=document.createElement("li");
  li.className=note.category;
  li.innerHTML=`<span><strong>[${note.category}]</strong> ${note.text}</span>
  <span><button onclick="deleteNote(${i})">Delete</button></span>`;
  list.appendChild(li);
 });
 const c=notes.length;
 noteCountEl.textContent=c===0?`You have 0 notes`:c===1?`You have 1 note`:`You have ${c} notes`;
}
window.deleteNote=(i)=>{const n=getNotes(); n.splice(i,1); saveNotes(n); renderNotes(searchInput.value)}

form.addEventListener("submit",e=>{
 e.preventDefault();
 const text=noteText.value.trim();
 if(!text){errorMsg.textContent="Note cannot be empty!"; return}
 if(text.length>200){errorMsg.textContent="Note must be under 200 characters!"; return}
 errorMsg.textContent="";
 const notes=getNotes();
 notes.push({id:Date.now(), text, category:category.value, timestamp:new Date().toISOString()});
 saveNotes(notes); noteText.value=""; localStorage.removeItem("draft"); updateCounts(); renderNotes(searchInput.value);
});
noteText.addEventListener("input",updateCounts);
clearBtn.addEventListener("click",()=>{noteText.value=""; localStorage.removeItem("draft"); updateCounts()});
searchInput.addEventListener("input",()=>renderNotes(searchInput.value));
themeBtn.addEventListener("click",()=>{
 document.body.classList.toggle("dark");
 const d=document.body.classList.contains("dark");
 localStorage.setItem("theme",d?"dark":"light");
 themeBtn.textContent=d?"Light Mode":"Dark Mode";
});
window.addEventListener("DOMContentLoaded",()=>{
 const draft=localStorage.getItem("draft"); if(draft) noteText.value=draft;
 if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark"); themeBtn.textContent="Light Mode"}
 updateCounts(); renderNotes();
});