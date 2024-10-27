#!/usr/bin/nodejs

var express = require('express');
const router = express.Router();
const path = require("path");
const axios = require('axios');

/*** DISPLAYING THE BOOK ***/

function isLight(hex){
	hex = hex.replace('#', '');
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);
	let brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 128;
}

router.get('/book', async function(req, res, next){
    const {bookId} = req.query;
    var sql = "SELECT * FROM books WHERE bookId=?;";
    res.app.locals.pool.query(sql, [bookId], async function(error, results, fields){
        res.locals.param = results[0];
		
		// Determine text color based on background
		if(isLight(results[0].color)){
			res.locals.param.text = "black";
		}
		else{
			res.locals.param.text = "white";
		}
        next();
    });
},
function(req, res, next){
    var sql = "SELECT * FROM tags WHERE bookId=?";
    res.app.locals.pool.query(sql, [res.locals.param.bookId], function(error, results, fields){
        // Retrieve the tags associated with the book 
        let tags = [];
        results.forEach(function(elem){
            tags.push(elem.tag);
        });
        res.locals.tagNames = tags;
		console.log(tags);
        // Move to retrieving the folders
        next();
    });
},
function(req, res, next){
    var sql = "SELECT * FROM folders WHERE bookId=?";
    res.app.locals.pool.query(sql, [res.locals.param.bookId], function(error, results, fields){
        // Retrieve the folder names associated with the book
		console.log(results);
        let folderNames = [];
        results.forEach(elem => {
            folderNames.push(elem.folderName);
        });
        // Update the params that will be passed to the hbs file
        res.locals.param.tagNames = res.locals.tagNames;
        res.locals.param.folders = results;
		next();
    });
}, 
function(req, res, next){
	var sql = "SELECT * FROM notes WHERE bookId=?";
	res.app.locals.pool.query(sql, [res.locals.param.bookId], function(error, results, fields){
        // Retrieve the folder names associated with the book
		console.log(results);
        let notes = [];
        results.forEach(elem => {
            notes.push(elem.note);
        });
        // Update the params that will be passed to the hbs file
		res.locals.param.notes = notes;
        res.render('2_book', res.locals.param);
    });
});

/*** TAGS ***/

router.get('/updateTags', function(req, res, next){
	console.log(req.query);
    const {tagName, bookId} = req.query;
	console.log(`${tagName}, ${bookId}`);
    res.locals.bookId = bookId;
    var sql = "INSERT INTO tags VALUE (?, ?);";
    res.app.locals.pool.query(sql, [bookId, tagName], function(error, results, fields){
        next();
    });
}, 
function(req, res, next){
    var sql = "SELECT * FROM tags WHERE bookId=?";
    res.app.locals.pool.query(sql, [res.locals.bookId], function(error, results, fields){
        // Retrieve the tags associated with the book 
        let tags = [];
        results.forEach(function(elem){
            tags.push(elem.tag);
        });
        // Render to the hbs file
        res.render('2_book_tags', {'tagNames': tags});
    });
});

/*** STARS ***/

router.get('/updateStars', function(req, res){
	const {id, stars} = req.query;
	console.log(`Id: ${id}, Stars: ${stars}`);
	var sql = "UPDATE books SET rating=? WHERE bookId=?;";
	res.app.locals.pool.query(sql, [stars, id], function(error, results, fields){
		res.send("Yes");
	});
});

/*** QUOTES ***/

router.get('/getQuotes', function(req, res){
	const {id} = req.query;
	var sql = "SELECT * FROM quotes WHERE bookId=?;";
	res.app.locals.pool.query(sql, [id], function(error, results, fields){
		res.json(results);
	});
});

router.get('/addQuote', function(req, res){
	const {id, quote} = req.query;
	var sql = "INSERT INTO quotes VALUE (?, ?);";
	res.app.locals.pool.query(sql, [id, quote], function(error, results, fields){
		res.send("Yay");
	});
});

/*** NOTES ***/

router.get('/addNote', function(req, res, next){
	const {id, note} = req.query;
	var sql = "INSERT INTO notes VALUE (?, ?);";
	res.app.locals.pool.query(sql, [id, note], function(error, results, fields){
		res.locals.id = id;
		next();
	});
}, function(req, res, next){
	var sql = "SELECT * FROM notes WHERE bookId=?;";
	res.app.locals.pool.query(sql, [res.locals.id], function(error, results, fields){
		console.log("About to render partial:");
		let notes = [];
        results.forEach(elem => {
            notes.push(elem.note);
        });
		console.log(notes);
		res.render('2_notes_gallery', {'notes' : notes});
	});
});

/***** FOLDERS ******/

router.get('/newFolder', function(req, res, next){
    console.log("Logging:");
    console.log(req.query);
    const {bookId, title, type} = req.query;
    console.log(type);
    var sql = "INSERT INTO folders VALUE (?,?,?);";
    res.app.locals.pool.query(sql, [bookId, title, type], function(error, results, fields){
        res.locals.bookId = bookId;
        next();
    });
},
function(req, res,next){
    var sql = "SELECT * FROM folders WHERE bookId=?";
    res.app.locals.pool.query(sql, [res.locals.bookId], function(error, results, fields){
        // Retrieve the folder names associated with the book
        let folderNames = [];
        results.forEach(elem => {
            folderNames.push(elem.folderName);
        });
        // Render folder section
        res.render('2_folders', {'folderNames': folderNames});
    });
});

// Showing a single folder
router.get('/folder', function(req, res){
    const {bookId, folderName, contentType} = req.query;
    var sql = "SELECT * FROM folderContent WHERE bookId=? AND folderName=?;";
    res.app.locals.pool.query(sql, [bookId, folderName], function(error, results, fields){
        if(contentType === "Text"){
            res.render('2_folder_short_text', {'items': results});
        }
		else if(contentType === "Images"){
			console.log("Image folder");
			console.log(results);
			res.render('2_folder_images', {'items' : results});
		}
    });
});
/*router.get('/updateText', function(req, res){
    const {bookId, folderName, content} = req.query;
    var sql = "INSERT INTO folderContent VALUE (?,?,?);";
    res.app.locals.pool.query(sql, [bookId, folderName, content], function(error, results, fields){
        res.send("Yes");
    });
});*/
router.get('/addFolderContent', function(req, res){
	const {bookId, folderName, folderType, field1, field2} = req.query;
	if(field2 === undefined){
		field2 = "";
	}
	var sql = "INSERT INTO folderContent VALUE (?, ?, ?, ?);";
	res.app.locals.pool.query(sql, [bookId, folderName, field1, field2], function(error, results, fields){
		res.redirect('./folder?bookId='+bookId+'&folderName='+folderName+'&contentType='+folderType);
	});
});

module.exports = router;