DROP PROCEDURE IF EXISTS addBook;

DELIMITER $$

CREATE PROCEDURE addBook(IN user_id INT, IN cur_title TEXT, IN cur_img TEXT, IN cur_author VARCHAR(100), IN cur_color TEXT)
BEGIN

DECLARE book_id INT;
SELECT COUNT(1) INTO book_id FROM user_books;

INSERT INTO user_books VALUE(user_id, book_id, cur_img);

INSERT INTO books VALUE(book_id, cur_title, cur_img, cur_author, 0, "", cur_color);

CALL add_folders(book_id);

END $$ 

DELIMITER ;