function addContent(){
    $('#add_content_modal').modal('show');
}
function updateContent(bookId, folderName){
    var addText = document.getElementById("addtext").value;
    var contentBlock = document.getElementById("content");
    contentBlock.innerHTML = contentBlock.innerHTML + "<p>"+addText+"</p><br>";
    $.ajax({
        'url': "https://booknook.sites.tjhsst.edu/updateText?bookId="+bookId+"&folderName"+folderName+"&content="+addText,
        'method': "get",
        'success': onResponse
    });
}
function onResponse(responseString){
    console.log("Yes");
}