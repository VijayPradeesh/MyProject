create table myTable1
(
[customer id] int primary key,
[Name] varchar(20) not null,
[Address] varchar(50) not null
);
insert into myTable1
values
('1','vijay','pondicherry'),
('2','Santhosh','chennai'),
('3','Abhishek','Chennai')

select * from myTable1

create table myTable2
(
[order id] int not null primary key,
[product id] int not null,
[customer id] int not null foreign key references mytable1([customer id]),
[dealer id] int not null
);
--customer id is the foreign key
insert into myTable2
values
('112113','12','1','112'),
('112114','13','2','113')

select * from myTable2

select * from myTable1

insert into myTable2
values
('112115','13','1','112');

select myTable1.Name, myTable1.[customer id],myTable2.[product id],myTable2.[dealer id] from myTable1
left join myTable2 on myTable1.[customer id]=myTable2.[customer id];

insert into myTable2
values
('112116','13','3','115')
