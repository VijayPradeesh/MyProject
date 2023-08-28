--/****** Script for SelectTopNRows command from SSMS  ******/
--SELECT TOP (1000) [ADDITIONAL_INFO_TRANS_ID]
--      ,[ADDITIONAL_INFO_ID]
--      ,[JOB_ID]
--      ,[VALUE]
--      ,[ISACTIVE]
--      ,[CREATED_ON]
--      ,[CREATED_BY]
--      ,[MODIFIED_ON]
--      ,[MODIFIED_BY]
--      ,[JOB_PAYITEM_ID]
--      ,[ITEM_ORDER]
--      ,[WORK_ORDER_NUMBER]
--  FROM [CrewLink.Prod.FEB2023.01].[dbo].[CL_DFR_ADDITIONAL_INFO_TRANS_T]
--  order by JOB_ID desc 

create table #tmp001
(
	Value nvarchar(50),
	Section nvarchar(50),
	Infoname nvarchar(50),
	ItemOrder int
)
create table #tmp002
(
	Section nvarchar(50),
	Feet nvarchar(50),
	Location nvarchar(50),

)
  
insert into #tmp001 (Value,Section, Infoname, ItemOrder )  
select  trans.value as Value,master.SECTION as section, master.ADDITIONAL_INFO_NAME as infoname, trans.ITEM_ORDER  as ItemOrder from CL_DFR_ADDITIONAL_INFO_MASTER_T as master
  left join CL_DFR_ADDITIONAL_INFO_TRANS_T as trans
  on master.ADDITIONAL_INFO_ID = trans.ADDITIONAL_INFO_ID and master.DFR_ID = 25
  where ADDITIONAL_INFO_NAME in ('location', 'feet') and JOB_ID = 1522551
  
  select * from #tmp001 where section = 'main'
  Declare @max int = 0
  declare @min int = 0;
  select @max = MAX(ItemOrder) from #tmp001

  while @min <= @max 
	begin 
		-- inserting main
		insert into #tmp002 (Section, Feet, Location)
		values(
		(select top 1 Section from #tmp001 where Section = 'main' and ItemOrder = @min), 
		(select top 1 Value from #tmp001 where Section = 'main' and ItemOrder = @min and Infoname = 'feet'),
		((select top 1 Value from #tmp001 where Section = 'main' and ItemOrder = @min and Infoname = 'location'))
		)
		-- inserting lateral 
		insert into #tmp002 (Section, Feet, Location)
		values(
		(select top 1 Section from #tmp001 where Section = 'lateral' and ItemOrder = @min), 
		(select top 1 Value from #tmp001 where Section = 'lateral' and ItemOrder = @min and Infoname = 'feet'),
		((select top 1 Value from #tmp001 where Section = 'lateral' and ItemOrder = @min and Infoname = 'location'))
		)

		set @min = @min+1;
		end
  
  select * from #tmp002
    select * from #tmp001


  
