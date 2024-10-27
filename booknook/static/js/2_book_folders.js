var curFolderType;
var curFolderName;

function showAddFolderModal(){
    $('#add_folder_modal').modal('show');
}
function updateFolders(){
    var bookId = document.getElementById("id-info").innerHTML;
    // Get the form info 
    var title = document.getElementById("folder-title").value;
    var query = "bookId="+bookId+"&title="+title;
    $('input:checked').each(function(){
        query += "&type="+this.value;
    });
    // AJAX request
    console.log(query);
    $.ajax({
        'url': "./newFolder?"+query,
        'type': "get",
        'success': onNewFolderResponse
    });
}
function onNewFolderResponse(responseString){
    document.getElementById("folders").innerHTML = responseString;
}
// Showing an individual folder
function showFolder(name, type){
	if(curFolderName === undefined){
		document.getElementById("folderDisplay").style.visibility = "visible";
		curFolderName = name;
		curFolderType = type;
		 $.ajax({
			'url': "./folder?bookId="+bookId+"&folderName="+name+"&contentType="+type,
			'type': "get",
			'success': onOpenFolderResponse
		});
	}
	else{
		document.getElementById("folderDisplay").style.visibility = "hidden";
		curFolderName = undefined;
	}
}
function onOpenFolderResponse(responseString){
	document.getElementById("folderDisplay").innerHTML = responseString + "<button id='addToFolder' onclick='showAddItemModal()'>Add Item</button>";
}

// Adding to a folder
function showAddItemModal(){
	if(curFolderType === undefined) return;
	if(curFolderType === "Text"){
		$('#add_folder_item_text_modal').modal('show');
	}
	else{
		$('#add_folder_item_img_vid_modal').modal('show');
	}
}
function addItem(){
	if(curFolderType === undefined) return;
	if(curFolderType === "Text"){
		var text = document.getElementById("text").value;
		var notes = document.getElementById("text-notes").value;
		$.ajax({
			'url': "./addFolderContent?bookId="+bookId+"&folderName="+curFolderName+"&folderType="+curFolderType+"&field1="+text+"&field2="+notes,
			'method': "get",
			'success': onAddTextResponse
		});
	}
}
function onAddTextResponse(responseString){
	document.getElementById("folderDisplay").innerHTML = responseString + "<button id='addToFolder' onclick='showAddItemModal()'>Add Item</button>";
}