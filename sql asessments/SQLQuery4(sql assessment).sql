--and,or,not

select distinct [brand] from sqlTable1
where [category]='fragrances' and [perYear total sales]>5903612.00;

select distinct [brand] from sqlTable1
where [category]='fragrances' or category='hair care'

select distinct brand from sqltable1
where [category]!='fragrances' or [category]!='skin care'

select count(brand) from 
(select distinct brand from sqltable1
where [category]!='fragrances' or [category]!='skin care' ) as tb;

select * from sqlTable1