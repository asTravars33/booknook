var statuses = new Map();

function prepStars(){
    var paths = document.querySelectorAll("path");
    paths_arr = Array.from(paths);
    paths_arr.forEach(function(elem){
        statuses.set(elem.id, elem.style.fill);
        elem.addEventListener('click', pathClick);
    });
    console.log(statuses);
}

function pathClick(){
    console.log(statuses.get(this.id));
    if(statuses.get(this.id)===""){
        statuses.set(this.id, "#ff9e25");
        this.style.fill = "#ff9e25";
    }
    else{
        statuses.set(this.id, "");
        this.style.fill = "";
    }
    console.log(statuses);
}

function showAddTagModal(){
    $('#add_tag_modal').modal('show');
}

function updateTags(){
    // Get the new tag name and book id
    var tagName = document.getElementById("tag").value;
    var bookId = document.getElementById("id-info").innerHTML;
    console.log(bookId+" "+tagName);
    // Update the tags in server
    var ajax_params = {
        'url': "https://booknook.sites.tjhsst.edu/updateTags?tagName="+tagName+"&bookId="+bookId,
        'type': "get",
        'success': onTagsResponse
    };
    $.ajax(ajax_params);
}
function onTagsResponse(responseString){
    console.log(responseString);
    document.getElementById("tags").innerHTML = responseString;
}

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
        'url': "https://booknook.sites.tjhsst.edu/newFolder?"+query,
        'type': "get",
        'success': onFolderResponse
    });
}
function onFolderResponse(responseString){
    document.getElementById("folders").innerHTML = responseString;
}
// Showing an individual folder
function showFolder(name, type){
    var bookId = document.getElementById("id-info").innerHTML;
    window.location.href = "https://booknook.sites.tjhsst.edu/folder?bookId="+bookId+"&folderName="+name+"&contentType="+type;
}
prepStars();