If OBJECT_ID('tempdb..#tmpSC') is not null 
		Drop Table #tmpSC;
		Create table #tmpSC
		(
			
   			Value nvarchar(400),
   			Section nvarchar(50),
   			Infoname nvarchar(50),
   			ItemOrder int,
			Active bit
		)

Insert into #tmpSC (Value,Section, Infoname, ItemOrder, Active )  
			Select  
			
			trans.value									as Value
			,master.SECTION								as section
			,master.ADDITIONAL_INFO_NAME				as infoname
			,trans.ITEM_ORDER 							as ItemOrder
			,trans.ISACTIVE								as Active 

			from CL_DFR_ADDITIONAL_INFO_MASTER_T		as master

 			left join CL_DFR_ADDITIONAL_INFO_TRANS_T	as trans
 			on master.ADDITIONAL_INFO_ID = trans.ADDITIONAL_INFO_ID 
			and trans.JOB_ID = 1522581 
			and trans.ISACTIVE = 1

 			where master.DFR_ID = (select top 1 DFR_ID from CL_DFR_MASTER_T where UNIQUE_KEY = 'SPIRE SEWER CAMERA')


--select * from #tmpSC

select top 1 ActivityType, County, Phase, TruckId, Comments,Inspector from #tmpSC
pivot( Min(Value) for [Infoname] in ([ActivityType], [County], [Phase], [TruckId], [Comments],[Inspector] )) as pivotTable1

select Section, ItemOrder, Location, Feet  from #tmpSC
pivot( Min(Value) for [Infoname] in ([Location], [Feet]) ) as pivotTable
where Section is not null