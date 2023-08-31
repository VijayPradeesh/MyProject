--index 
--clustered

select * from mynewtable;

create clustered index mynewindex2
on mynewtable(brand asc, category asc);

--first indexed by brand and then indexed by category
--a table can have only one cluster index
--a default cluster is the primary key
--in this table there is no primary key

select * from mynewTable;