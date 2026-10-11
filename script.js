const noteText=document.getElementById("noteText");
const charCount=document.getElementById("charCount");
const wordCount=document.getElementById("wordCount");
const clearBtn=document.getElementById("clearBtn");
const themeBtn=document.getElementById("themeBtn");
const form=document.getElementById("note-form");
const list=document.getElementById("notes-list");
const noteCountEl=document.getElementById("note-count");
const category=document.getElementById("category");
const searchInput=document.getElementById("search-input");
const errorMsg=document.getElementById("error-message");
const emptySearch=document.getElementById("empty-search");

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
 if(filtered.length===0 && filter){
   emptySearch.style.display="block";
 } else {
   emptySearch.style.display="none";
 }
 if(filtered.length===0 && !filter){
   list.innerHTML="<li style='border:none;'>No notes yet. Add one above!</li>";
 }

 filtered.forEach((note)=>{
  const li=document.createElement("li");
  li.className=`category-${note.category}`;

  const leftDiv=document.createElement("div");
  const catStrong=document.createElement("strong");
  catStrong.textContent=`[${note.category}] `;
  const textSpan=document.createElement("span");
  textSpan.textContent=note.text; // SECURE: textContent prevents XSS

  const timeSmall=document.createElement("small");
  timeSmall.style.display="block";
  timeSmall.style.color="#666";
  timeSmall.textContent=new Date(note.timestamp).toLocaleString();

  leftDiv.appendChild(catStrong);
  leftDiv.appendChild(textSpan);
  leftDiv.appendChild(timeSmall);

  const rightDiv=document.createElement("div");
  const delBtn=document.createElement("button");
  delBtn.textContent="Delete";
  delBtn.addEventListener("click",()=>deleteNoteById(note.id));
  rightDiv.appendChild(delBtn);

  li.appendChild(leftDiv);
  li.appendChild(rightDiv);
  list.appendChild(li);
 });

 const c=notes.length;
 noteCountEl.textContent=c===0?`You have 0 notes`:c===1?`You have 1 note`:`You have ${c} notes`;
}

function deleteNoteById(id){
 const notes=getNotes();
 const updated=notes.filter(n=>n.id!==id);
 saveNotes(updated);
 renderNotes(searchInput.value);
}

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