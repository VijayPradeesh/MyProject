--having keyword is used with the aggregate functions

select sum([perYear total sales]) as [Total],[Brand] from sqlTable1
group by [brand]
having sum([perYear total sales])>1000000
order by [Brand] desc;