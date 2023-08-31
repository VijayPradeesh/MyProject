--aggreate and group by

select min([perYear total sales]) as minimum_value from sqltable1
select max([peryear total sales]) as maximum_value from sqlTable1
--company with miniumum and maximum value
select sum([perYear total sales]) as total,[brand] from sqlTable1
where [brand]='arden'
group by [Brand]
--net value per year
select count([category]) as numberOfCategories ,brand
from sqlTable1
where brand='arden'
group by [Brand]

--arden has market in two categories

select avg([peryear total sales]) as perYearSales, brand 
from sqlTable1
where [brand]='arden'
group by [brand];

select avg([peryear total sales]) from sqlTable1
--avg per year total sales 



