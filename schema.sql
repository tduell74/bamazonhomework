CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id integer auto_increment primary key,
    product_name varchar(100) not null,
    department_name varchar(100) not null,
    price integer(100) not null,
    stock integer(100) not null);
    
INSERT INTO `bamazon`.`products` (`product_name`, `department_name`, `price`, `stock`) VALUES ('TV', 'electroics', '150', '25');

SELECT * FROM products;