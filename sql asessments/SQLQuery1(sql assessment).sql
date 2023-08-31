create database sqlAssessments;--creating a database

create table sqlTable1 -- creating a table
(
[Brand] varchar(20) not null,
[category] varchar(30) not null,
[Total Sales] money not null,
[perYear total sales] money not null
);

delete from sqlTable1 where [brand]='' or [category]='' or [Total Sales]='' or [perYear total sales]='';

select count([brand]) as totalEntities from sqlTable1;

--2964 entities in the table