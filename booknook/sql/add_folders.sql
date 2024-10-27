DROP PROCEDURE IF EXISTS add_folders;

DELIMITER $$

CREATE PROCEDURE add_folders (IN book_id INT) 
BEGIN 

INSERT INTO folders VALUE(book_id, "fanart", "Images");
INSERT INTO folders VALUE(book_id, "fanfics", "Text");
INSERT INTO folders VALUE(book_id, "fan edits", "Video");

END $$ 

DELIMITER ;