#!/usr/bin/nodejs

var express = require('express');
const router = express.Router();
const path = require("path");
const axios = require('axios');

// endpoint handlers
router.get('/books', function(req, res){
	const {book_retrieve} = req.query;
	console.log(book_retrieve);
	
    var user = req.session.profile.userId;
    var sql = "SELECT * FROM user_books WHERE userId=?";
    res.app.locals.pool.query(sql, [user], function(error, results, fields){
        console.log(results);
        
        let mid_books = [];
        let left_books = [];
        let right_books = [];
        
        for(let i=0; i<results.length; i++){
            if(i%3===0){
                mid_books.push(results[i]);
            }
            else if(i%3==1){
                left_books.push(results[i]);
            }
            else{
                right_books.push(results[i]);
            }
        }
        
        params = {
            'left-books': left_books,
            'mid-books': mid_books,
            'right-books': right_books,
			'alert-display': book_retrieve==="fail"? 'visible' : 'hidden'
        };
        res.render('1_home', params);
    });
});

// npm install express-fileupload !!!!

router.post('/imupload', async function(req, res, next){
    // Get the book info
    const {title, author} = req.body;
	
	//const {image} = req.files;
    // let url = __dirname + '/upload/' + image.name;
    // image.mv("https://booknook.sites.tjhsst.edu/img/upload/"+image.name);
    // url = path.join(__dirname, "../public/img/covers/"+image.name);
    // image.mv(url);
	
	console.log("https://www.googleapis.com/books/v1/volumes?q="+title+"+inauthor:"+author+"&key=AIzaSyBQ9op5gbRW30QeZaCffZVpLvyqByjUhdg");
    
	/*const bookRes = await fetch("https://www.googleapis.com/books/v1/volumes?q="+title+"+inauthor:"+author+"&key=AIzaSyBQ9op5gbRW30QeZaCffZVpLvyqByjUhdg");
	res.json(bookRes); */
	
	fetch("https://www.googleapis.com/books/v1/volumes?q="+title+"+inauthor:"+author+"&key=AIzaSyBQ9op5gbRW30QeZaCffZVpLvyqByjUhdg")
		.then(response => response.json())
		.then(async (response) => {
			let book;
			for(let i=0; i < response.items.length; i++){
				let elem = response.items[i];
				if(elem.volumeInfo.authors.includes(author)){
					book = elem;
					break;
				}
			}
			if(!book){
				res.redirect('./books?book_retrieve=fail');
			}
			else{
				const image = book.volumeInfo.imageLinks.smallThumbnail;
				const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
				  params: {
					'url': image,
					'models': 'properties',
					'api_user': '482605723',
					'api_secret': 'k6gSYWFwawwEw9oV2AFe65dmJth3JiAY',
				  }
				});
				
				const color = response.data.colors.dominant.hex;
				var sql = "CALL addBook(?, ?, ?, ?, ?);";
				res.app.locals.pool.query(sql, [req.session.profile.userId, title, image, author, color], function(error, results, fields){
					res.redirect('./books');
				});
			}
		});
});

module.exports = router;