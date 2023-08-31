select distinct [brand] from sqlTable1;

select count(*) as numberOfRecords from 
(select distinct [brand]  from sqlTable1 ) as brandcount

--select distinct only shows the distinct values -no duplicates 