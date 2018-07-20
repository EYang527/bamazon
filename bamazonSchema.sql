DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
		item_id INT AUTO_INCREMENT NOT NULL,
        product_name VARCHAR(255),
        department_name VARCHAR(255),
        price float,
        stock_quantity int,
        PRIMARY KEY (item_id)
);

--- supervisor View features
USE bamazon_db;

CREATE TABLE departments (
		department_id INT AUTO_INCREMENT NOT NULL,
        department_name VARCHAR(255),
        over_head_costs int,
        PRIMARY KEY (department_id)
);


-- some examples of queries I used 

USE bamazon_db;
set SQL_SAFE_UPDATES=0; --disable sql safe update
update products set product_sales='0' where 1=1; -- update all rows of products_sales to "0" for Math purpose 

-- select all products and group by department_name
select * from products
order by department_name

select stock_quantity from products where item_id="4";

USE bamazon_db;
update products set stock_quantity=stock_quantity+5 where item_id=19;

select * from products ;

insert into products (product_name,department_name,price,stock_quantity) values ("test","testDep",100,4);

USE bamazon_db;
update products set stock_quantity=stock_quantity+5 where item_id=19;

select * from products ;

USE bamazon_db;
select stock_quantity from products where item_id="4";

insert into products (product_name,department_name,price,stock_quantity) values ("test","testDep",100,4);

select * from departments join products on departments.department_name=products.department_name group by department_id;

select department_name,round (sum(product_sales),2) as Product_sales from products group by department_name;

--- group by department_name and join department table and products table
select department_id, departments.department_name,over_head_costs,round (sum(product_sales),2) as ProductSales
from departments 
inner join products on departments.department_name=products.department_name
group by departments.department_name

--- final query for superior view ----
select department_id,departments.department_name, ProductSales-costs as total_profit 
from(
    select over_head_costs as costs,round (sum(product_sales),2) as ProductSales
from departments
inner join products on departments.department_name=products.department_name 
group by departments.department_name
)

