alter procedure dbo.spGetProductBybrand
@Brand varchar(20)
as
begin
	select [Brand],[category] from  [dbo].[demoRecord]
	where [Brand]=@Brand;
end

exec [dbo].[spGetProductBybrand] 'TAYLOR';

select count([category]) as [no of category] from [dbo].[demoRecord] where brand='' group by [brand];

select * from dbo.demoRecord

select count(category) as [category count] from dbo.demoRecord where brand='AVEENO';

create procedure dbo.spGetNoOfCategories
@brand varchar(20),
@categoryCount int output
as 
begin
	select  @categoryCount=count(category)  from [dbo].[demoRecord] where brand=@brand;
end


declare @total int;
exec spGetNoOfCategories 'taylor', @total output
if(@total is not null and @total>1)
	select @total as [no of categories]
else if(@total is null)
	select @total as [no of categories]
else 
	select @total as [no of categories]



sp_depends spGetNoOfCategories;

sp_depends demoRecord;