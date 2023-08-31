select * from sqlTable1 where [brand] in ('lux','arden','taylor')
union
select * from sqlTable1 where [brand]='lux' or [Brand]='arden' or [brand]='taylor';

--union combines two select statements into 1 and removes duplicate entries

select * from sqlTable1 where [brand] in ('lux','arden','taylor')
union all
select * from sqlTable1 where [brand]='lux' or [Brand]='arden' or [brand]='taylor';
--union combines two select statements without removing duplicates