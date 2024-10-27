var notebg;

function showAddNoteModal(){
    $('#add_note_modal').modal('show');
}
function updateNotes(){
	let note = document.getElementById("note").value;
	notebg = document.body.style.backgroundColor;
	$.ajax({
		'url': './addNote?id='+bookId+'&note='+note,
		'method': 'get',
		'success': onAddNoteSuccess
	});
}
function onAddNoteSuccess(responseString){
	console.log(notebg);
	console.log(document.getElementsByClassName("note"));
	document.getElementsByClassName("notes-gallery")[0].innerHTML = responseString;
	const notes = document.getElementsByClassName("note");
	for(let i=0; i < notes.length; i++){
		notes[i].style.backgroundColor = notebg;
	}
}

