let addBtn = document.getElementById("add-button");
let notesElm = document.getElementById("notes");
let index=1;

addBtn.addEventListener("click", function(e) {
    let addTxt = document.getElementById("add-note");
    let titleTxt=document.getElementById("note-title");
    let html="";
    html += `
    <div class="noteCard my-2 mx-2 card" style="width: 18rem;" id="${index}-note">
            <div class="card-body">
                <h5 class="card-title" style="font-weight:600;">${titleTxt.value}</h5>
                <p class="card-text"> ${addTxt.value}</p>
                <button id="${index}"onclick="deleteNote(this.id)" class="btn btn-primary" style="background-color:red;border:none">Delete</button>
            </div>
        </div>`;
    
    notesElm.innerHTML+=html;  
    index++;  
    titleTxt.value="";
    addTxt.value = "";
});

function deleteNote(index) {
    let delNote = document.getElementById(`${index}-note`);
    delNote.remove();
}






// addBtn.addEventListener("click", function(e) {
//   let addTxt = document.getElementById("add-note");
//   let notes = localStorage.getItem("notes");
//   if (notes == null) {
//     notesObj = [];
//   } else {
//     notesObj = JSON.parse(notes);
//   }
//   notesObj.push(addTxt.value);
//   localStorage.setItem("notes", JSON.stringify(notesObj));
//   addTxt.value = "";
//   showNotes();
// });

// function showNotes() {
//   let notes = localStorage.getItem("notes");
//   if (notes == null) {
//     notesObj = [];
//   } else {
//     notesObj = JSON.parse(notes);
//   }
//   let html = "";
//   notesObj.forEach(function(element, index) {
//     html += `
//             <div class="noteCard my-2 mx-2 card" style="width: 18rem;">
//                     <div class="card-body">
//                         <h5 class="card-title" style="font-weight:600;">Note ${index + 1}</h5>
//                         <p class="card-text"> ${element}</p>
//                         <button id="${index}"onclick="deleteNote(this.id)" class="btn btn-primary" style="background-color:red;border:none">Delete</button>
//                     </div>
//                 </div>`;
//   });
//   let notesElm = document.getElementById("notes");
//   if (notesObj.length != 0) {
//     notesElm.innerHTML = html;
//   } else {
//     notesElm.innerHTML = `<p id="no-notes-mssg">No notes found! Add a note please.</p>`;
//   }
// }


// function deleteNote(index) {
//   let notes = localStorage.getItem("notes");
//   if (notes == null) {
//     notesObj = [];
//   } else {
//     notesObj = JSON.parse(notes);
//   }

//   notesObj.splice(index, 1);
//   localStorage.setItem("notes", JSON.stringify(notesObj));
//   showNotes();
// }
