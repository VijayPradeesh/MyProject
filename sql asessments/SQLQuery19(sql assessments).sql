--index


select * from myNewTable ;

select * into myNewTable 
from sqlTable1
where [Total Sales]>1000000;

create index ixmyNewIndex
on myNewTable(brand);
--since index is available the search operation is faster


select * from myNewTable
where Brand='arden';
