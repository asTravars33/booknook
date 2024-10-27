var quotes;
var carouselId = 0;
const bookId = document.getElementById("id-info").innerHTML;

function renderCarousel(){
	document.getElementById("carousel-display").innerHTML="<p>"+quotes[carouselId].quote+"</p>";
}
function getQuotes(){
	$.ajax({
		'url': './getQuotes?id=' + bookId,
		'method': 'get',
		'success': onQuotesResponse
	});
}
function onQuotesResponse(responseJson){
	quotes = responseJson;
	console.log(quotes);
	renderCarousel();
}

function showAddQuoteModal(){
    $('#add_quote_modal').modal('show');
}
function updateQuotes(){
	let quote = document.getElementById("quote").value;
	quotes.push({
		bookId: bookId,
		quote: quote
	});
	console.log(quotes);
	$.ajax({
		'url': './addQuote?id='+bookId+'&quote='+quote,
		'method': 'get',
		'success': onAddQuoteSuccess
	});
}
function onAddQuoteSuccess(responseString){
	carouselId = quotes.length-1;
	renderCarousel();
}

function carouselPrev(){
	carouselId = (quotes.length + carouselId-1) % quotes.length;
	renderCarousel();
}
function carouselNext(){
	carouselId = (carouselId+ 1) % quotes.length;
	renderCarousel();
}

getQuotes();