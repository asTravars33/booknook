function showAddBookModal(){
    $('#add_book_modal').modal('show');
}
function showBook(bookId){
    window.location.href = "localhost:3000//book?bookId="+bookId;
}