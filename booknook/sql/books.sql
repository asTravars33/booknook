DROP TABLE IF EXISTS user_books;
CREATE TABLE user_books (userId INT, bookId INT, coverImg TEXT);

DROP TABLE IF EXISTS books;
CREATE TABLE books (bookId INT, title TEXT, img TEXT, author VARCHAR(100), rating INT, notes TEXT);

DROP TABLE IF EXISTS tags;
CREATE TABLE tags(bookId INT, tag VARCHAR(100));

DROP TABLE IF EXISTS folders;
CREATE TABLE folders(bookId INT, folderName VARCHAR(100), contentType TEXT);

DROP TABLE IF EXISTS folderContent;
CREATE TABLE folderContent(bookId INT, folderName VARCHAR(100), link TEXT);