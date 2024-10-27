DROP PROCEDURE IF EXISTS addUser;
DROP PROCEDURE IF EXISTS updateUser;

DELIMITER $$

CREATE PROCEDURE addUser(IN cur_username VARCHAR(100), IN cur_email TEXT, IN cur_password TEXT)
BEGIN 

DECLARE next_id INT;
SELECT COUNT(1) INTO next_id FROM users;
INSERT INTO users VALUE(next_id, cur_username, cur_email, cur_password);

SELECT * FROM users WHERE userId = next_id;

END $$

CREATE PROCEDURE updateUser(IN user_id INT, IN cur_username VARCHAR(100), IN cur_email TEXT,  IN cur_password TEXT)
BEGIN

UPDATE users SET username=cur_username WHERE userId=user_id;
UPDATE users SET email=cur_email WHERE userId=user_id;
UPDATE users SET password=cur_password WHERE userId=user_id;

END $$

DELIMITER ;