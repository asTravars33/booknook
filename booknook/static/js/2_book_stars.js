var statuses = new Map();

function prepStars(){
    var paths = document.querySelectorAll("path");
    paths_arr = Array.from(paths);
	var rating = document.getElementById("rating-info").innerHTML;
    paths_arr.forEach(function(elem){
		if(rating > 0){
			statuses.set(elem.id, "#ff9e25");
			elem.style.fill = "#ff9e25";
			rating = rating - 1;
		}
        else{
			statuses.set(elem.id, "");
		}
        elem.addEventListener('click', pathClick);
    });
    console.log(statuses);
}
 
function pathClick(){
	// update statuses
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
	
	// update in backend
	let count = 0;
	for (const [elem, fill] of statuses){
		console.log(fill);
		console.log(fill === "#ff9e25");
		if(fill === "#ff9e25"){
			count = count + 1;
		}
	}
	console.log(count);
	var bookId = document.getElementById("id-info").innerHTML;
	$.ajax({
		'url': "./updateStars?id="+bookId+"&stars="+count,
		'method': "get",
		'success': 'onStarsResponse'
	});
}
function onStarsResponse(){
	console.log("Stars successful");
}

prepStars();