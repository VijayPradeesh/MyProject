--view 
--virtual table

create view myView
as
select * 
from sqlTable1
where [Total Sales]>10000;

alter view myView
as
select * 
from sqlTable1
where [Total Sales]>100000000;

select * from myView;