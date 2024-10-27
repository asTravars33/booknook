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
        'url': "./updateTags?tagName="+tagName+"&bookId="+bookId,
        'type': "get",
        'success': onTagsResponse
    };
    $.ajax(ajax_params);
}
function onTagsResponse(responseString){
    console.log(responseString);
    document.getElementById("tags").innerHTML = responseString;
}