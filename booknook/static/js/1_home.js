function showAddBookModal(){
    $('#add_book_modal').modal('show');
}
function showBook(bookId){
    window.location.href = "./book?bookId="+bookId;
}