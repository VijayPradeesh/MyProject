--stored procedure

--non parameterised
create procedure spGetDataByBrandName
as 
begin
	select [Brand],[category],[total sales],[perYear total sales] from sqlTable1
	where [brand]='arden';
end

exec spGetDataByBrandName;

create procedure spGetDataByCategoryName
@category varchar(20)
as
begin
	select * from sqlTable1
	where [category]= @category
end





exec spGetDataByCategoryName 'skin care' ;
--parameterised
create procedure spGetCountBrands
@Category varchar(20),
@Count int output
as
begin
	select @Count= count(Brand) from sqlTable1
	where category=@Category
	
end

declare @C int 
exec spGetCountBrands @Count= @C output , @Category='fragrances'
print @C;
--with input and output parameters
