/* eslint-disable */
var Moment = require('moment');
var StringMap = require("stringmap");
angular.module('app.export').controller('bulkDFRRevenueReportController', bulkDFRRevenueReportController);

function bulkDFRRevenueReportController($translate,$log, $scope,homeService,foremanSettingsService, $rootScope, notificationService, bulkDFRReportService, exportSharedService, dfrService, coreService, $window, $sce,$http,dataService) {
    $rootScope.showNavBar = true;
    var vm = this;
    $rootScope.showDetailsBar = false;
    $scope.isRevenueExport = false;
    $rootScope.showFooter = false;
    $scope.reportType = 'REVENUE';
    $scope.selectAll=false;
    $scope.singleSelect=false;
    $scope.singleSelectAddress = false;
    $scope.singleSelectWorkOrder = false;
    $scope.selectAllApp = false;
    $scope.selectSingleApp = false;
    $scope.standardNotVectren = false;
    $scope.resurfacingApplicable = false;
    $scope.fileCounter = 0;
    $scope.isWorkOrder = false;
    $scope.isAddress = false;
    $scope.isWorkOrderStill = true;
    $scope.isAddressStill = true;
    $scope.removeSelectAll = removeSelectAll;
    $scope.addSelectAll = addSelectAll;
    $scope.removeSelectAllOption = removeSelectAllOption;
    $scope.addSelectAllOption = addSelectAllOption;
    // $scope.selectAllForeman = selectAllForeman;
    $scope.selectAllContract = selectAllContract;
    $scope.removeSelectAll = removeSelectAll;
    $scope.addSelectAll = addSelectAll;
    $scope.removeSelectAllOption = removeSelectAllOption;
    $scope.addSelectAllOption = addSelectAllOption;
    $scope.SelectAllCheckBoxByColumn = SelectAllCheckBoxByColumn;
    $scope.selectAllSuperintendent = selectAllSuperintendent;
    $scope.handleAddressChange = handleAddressChange;
    $scope.selectAllAddress = selectAllAddress;
    $scope.removeAllAddress = removeAllAddress;
    $scope.handleWorkOrderChange = handleWorkOrderChange;
    $scope.selectAllWorkOrder = selectAllWorkOrder;
    $scope.removeAllWorkOrder = removeAllWorkOrder;
    $scope.userData = $rootScope.userData;
    $scope.handleContractChange = handleContractChange;
    vm.flagMessageStatusToRead = flagMessageStatusToRead;
    //Function to initialise objects
    function flagMessageStatusToRead() {
        angular.element('#systemNotification').modal('hide');
        // initialize();
        vm.isViewed = false;
      }
    $scope.showRevenueExport = function() {
        var path =  '/beta/revenueExport';
        coreService.location.path(path)
    }
    $scope.initializeBulkDFRReportData = function () {
        retrieveNotifications();
        $scope.companies = [];
        $scope.contracts = [];
        $scope.foreman = [];
        $scope.allSuperintendentsData = [];
        $scope.allForemanData = [];
        $scope.allDFRTemplateData = [];
        $scope.superintendent = null;
        $scope.superintendents = [];
        $scope.DFRTemplates = [];
        $scope.DFRTemplate = null;
        $scope.dfrSection = true;
        $scope.dfrJobList = [];
        $scope.JobIds = [];
        $scope.isStandardDFRApplicable = true;
        $scope.isSpireApplicable = false;
        $scope.isTecoTampaApplicable = false;
        $scope.isDteApplicable = false;
        $scope.isNipscoApplicable = false;
        $scope.isWglApplicable = false;
        $scope.isWglVaApplicable = false;
        $scope.isPngApplicable = false;
        $scope.isXcelApplicable = false;
        $scope.isPecoApplicable = false;
        $scope.isPecoFLRApplicable = false;
        $scope.standardNotVectren = false;
        //$scope.display = "block";
        $scope.selectedDfr = {job:[],Selected:false};
        $scope.selectedDfrList = [];
        $scope.selectedDfrTemplate = {};
        $scope.selectedDfrTemplate.labor = false;
        $scope.selectedDfrTemplate.equipment = false;
        $scope.selectedDfrTemplate.payItem = false;
        // $scope.isVisible='none';
        $scope.isAllDfrSelected = false;
        // $scope.isAllLaborSelected = false;
        // $scope.isAllEquipmentSelected = false;
        // $scope.isAllPayItemSelected = false;
        // $scope.isAllForemanCmtSelected = false;
        // $scope.isAllApproverCmtSelected = false;
        $scope.isSelectAllDisabled = true;
        $scope.isDownloadDisabled= true;
        $scope.isEmptyList=true;
        $scope.selectedWorkorder="";
        $scope.selectSuperintendentModel = [];
        $scope.isAllChkbx=true;
        $scope.tecoTampaContracts =[];
        /*Dev1 - CL2IFS-20 - 23/02*/
        $scope.reportList = [];
        $scope.loaderStyle={"display": "none","width": "100%", "margin-left": "-3%","background-color":"rgba(0,0,0,0.5)"};
        $scope.getCompanies()
        .then(function (response) {
            if (response.status == 200) {
                $scope.companies = response.data;
                // exportRevenueService.setCompanies($scope.companies);
                 $scope.getTecoCompaniesContracts()
                 .then(function (responseData){
                    var tecoCompanies = responseData.data.companyList;
                    var tecoContracts = responseData.data.contractList;
                    $scope.tecoTampaCompanies = [];
                    $scope.tecoTampaContracts = [];
                    tecoCompanies.forEach(function(company) {
                        $scope.tecoTampaCompanies.push({company_Code: company.companyCode, wI_Company_ID: company.id})
                    });
                    tecoContracts.forEach(function(contract) {
                        $scope.tecoTampaContracts.push({id: contract.id, label: contract.contractNumber})
                    });
                 });
                
            }
            else if (response.status == 404) {
                notificationService.error($translate.instant(exportCtrlConfig.noCompaniesAvailable));
                $scope.companies = [];
                $scope.tecoTampaCompanies = [];
            }
            else if (response.status == 417) {
                notificationService.error($translate.instant(exportCtrlConfig.errorFetchingCompanies));
                $scope.companies = [];
                $scope.tecoTampaCompanies = [];
            }
        });
        /*CL2IFS-20 End*/
    }
    $scope.getTecoCompaniesContracts = function () {
        return exportSharedService.getTecoCompaniesContracts();
    }
    $scope.loadAllContractsDFrExport = function (selectedCompany) {
        $scope.exportSection = true;
        if($scope.exportSection){
        $scope.allContractsData = [];
        $scope.selectContractsModel = []; 
        $scope.selectedContracts = null; 
        $scope.allSuperintendentsData = [];  
       
        $scope.selectSuperintendentModel = null;
       
        

        $scope.getContracts(selectedCompany)
            .then(function (response) {
                if (response.status == 200) {
                    $scope.contracts = response.data;
                    $scope.contracts.forEach(function(contract) {
                        $scope.allContractsData.push({id: contract.contract_ID, label: contract.contract_Number})
                    });
                    $scope.selectAll = false;
                }
                else if (response.status == 404) {
                    $scope.contracts = [];
                    notificationService.error($translate.instant(exportCtrlConfig.noSuperintendentsAvailable));
                }
                else if (response.status == 417) {
                    $scope.contracts = [];
                    notificationService.error($translate.instant(exportCtrlConfig.errorFetchingSuperintendets));
                }
                
            });
       
    }
   
    }
$scope.SelectAllDfr= function() {
    if($scope.dfrJobList.length === 0) {
        $scope.isAllDfrSelected = false;
        notificationService.warning($translate.instant('Norecordsavailable'));
        return;
    }
    if($scope.isAllDfrSelected) {
        $scope.isDownloadDisabled = false;
        if (!$scope.resurfacingApplicable) {
        $scope.isAllLaborSelected = true;
        $scope.isAllEquipmentSelected = true;
        $scope.isAllPayItemSelected = true;
        $scope.isAllApproverCmtSelected = ($scope.selectDFRTemplateModel==7 || $scope.selectDFRTemplateModel==8 || $scope.selectDFRTemplateModel==9) ? true : false;
        $scope.isAllForemanCmtSelected = ($scope.selectDFRTemplateModel==7 || $scope.selectDFRTemplateModel==8 || $scope.selectDFRTemplateModel==9 || $scope.selectDFRTemplateModel==14) ? true : false;
        $scope.isAllRentalsSelected = ($scope.selectDFRTemplateModel == 31)? true:false;
        $scope.isAllDailyFieldNotesSelected = ($scope.selectDFRTemplateModel == 31) ? true:false;
        $scope.isAllStationsSelected = ($scope.selectDFRTemplateModel == 31) ? true:false;
        }
        $scope.isAllImageAttachmentsSelected = ($scope.selectDFRTemplateModel==4 || $scope.selectDFRTemplateModel == 27 || $scope.selectDFRTemplateModel == 31 || $scope.selectDFRTemplateModel == 34)?true : false;
        if ($scope.resurfacingApplicable) {
            $scope.isAllRestorationSelected = ($scope.selectDFRTemplateModel==4)?true : false;
            $scope.isAllCutSheetsSelected = ($scope.selectDFRTemplateModel==4)?true : false;
        }
    angular.forEach($scope.dfrJobList,function(job){
        job.ShowDfr = true;
        job.ShowLabor = (!$scope.resurfacingApplicable) ? true : false;
        job.ShowEquipment = (!$scope.resurfacingApplicable) ? true : false;
        job.ShowPayItem = (!$scope.resurfacingApplicable) ? true : false;
        job.ShowForemanComments = ($scope.selectDFRTemplateModel==7 || $scope.selectDFRTemplateModel==8 || $scope.selectDFRTemplateModel==9 || $scope.selectDFRTemplateModel==14)?true:false;
        job.ShowApproverReviewerComments = ($scope.selectDFRTemplateModel==7 || $scope.selectDFRTemplateModel==8 || $scope.selectDFRTemplateModel==9)?true:false;
        job.ShowImageAttachments = ($scope.selectDFRTemplateModel==4 || $scope.selectDFRTemplateModel == 27 || $scope.selectDFRTemplateModel == 31 || $scope.selectDFRTemplateModel == 34)?true : false;
        job.ShowNotesbypayitem = ($scope.selectDFRTemplateModel==3)?true : false;
        job.ShowRentalEquipments = ($scope.selectDFRTemplateModel == 31)? true:false;
        job.ShowDailyFieldNotes = ($scope.selectDFRTemplateModel == 31) ? true:false;
        job.ShowStations = ($scope.selectDFRTemplateModel == 31) ? true: false;
        if ($scope.resurfacingApplicable) {
            job.ShowCutSheets = ($scope.selectDFRTemplateModel==4)?true : false;
            job.ShowRestoration = ($scope.selectDFRTemplateModel==4)?true : false;
        }
        if (!$scope.resurfacingApplicable) {
            checkForDisabledSection(job);
            checkForShowDfr(job);
        }
    });
    }
    else {
        $scope.isDownloadDisabled = true;
        $scope.isAllLaborSelected = false;
        $scope.isAllEquipmentSelected = false;
        $scope.isAllPayItemSelected = false;
        $scope.isAllApproverCmtSelected = false;
        $scope.isAllForemanCmtSelected = false;
        $scope.isAllImageAttachmentsSelected = false;
        $scope.isAllRentalsSelected = false;
        $scope.isAllStationsSelected = false;
        $scope.isAllDailyFieldNotesSelected = false;
        if ($scope.resurfacingApplicable) {
            $scope.isAllRestorationSelected = false;
            $scope.isAllCutSheetsSelected = false;
        }
        angular.forEach($scope.dfrJobList, function(job) {
            job.ShowDfr = false;
            job.ShowLabor = false;
            job.ShowEquipment = false;
            job.ShowPayItem = false;
            job.ShowForemanComments = false;
            job.ShowApproverReviewerComments = false;
            job.ShowImageAttachments = false;
            job.ShowNotesbypayitem = false;
            job.ShowRentalEquipments = false;
            job.ShowStations = false;
            job.ShowDailyFieldNotes = false;
            if ($scope.resurfacingApplicable) {
                job.ShowCutSheets = false;
                job.ShowRestoration = false;
            }
        });
    }
}
function SelectAllCheckBoxByColumn(columnName) {
    $scope.dfrCount=0;
    switch(columnName) {
        case "Labor":
            if($scope.isAllLaborSelected) {
                $scope.isDownloadDisabled = false;
            angular.forEach($scope.dfrJobList, function(job) {
                job.ShowLabor = true;
                job.ShowDfr = true;
                checkForDisabledSection(job);
                checkForShowDfr(job);
            });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowLabor = false;
                    if($scope.selectDFRTemplateModel == 31) {
                        if (!job.ShowEquipment && !job.ShowLabor && !job.ShowPayItem && !job.ShowImageAttachments && !job.ShowRentalEquipments && !job.ShowStations && !job.ShowDailyFieldNotes) {
                            job.ShowDfr = false;
                        }
                    } else {
                        if(!job.ShowPayItem && !job.ShowEquipment && !job.ShowForemanComments && !job.ShowApproverReviewerComments
                            && !job.ShowImageAttachments)
                        job.ShowDfr = false;
                    }
                    if(job.ShowDfr)
                        $scope.isDownloadDisabled = false;
                });
            }
            break;
        case "Equipment":
            if($scope.isAllEquipmentSelected) {
                $scope.isDownloadDisabled = false;
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowEquipment = true;
                    job.ShowDfr = true;
                    checkForDisabledSection(job);
                    checkForShowDfr(job);
                });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowEquipment = false;
                    if($scope.selectDFRTemplateModel == 31) {
                        if (!job.ShowEquipment && !job.ShowLabor && !job.ShowPayItem && !job.ShowImageAttachments && !job.ShowRentalEquipments && !job.ShowStations && !job.ShowDailyFieldNotes) {
                            job.ShowDfr = false;
                        }
                    } else {
                        if(!job.ShowPayItem && !job.ShowEquipment && !job.ShowForemanComments && !job.ShowApproverReviewerComments
                            && !job.ShowImageAttachments)
                        job.ShowDfr = false;
                    }
                    if(job.ShowDfr)
                        $scope.isDownloadDisabled = false;
                });
            }
            break;
        case "PayItem":
            if($scope.isAllPayItemSelected) {
                $scope.isDownloadDisabled = false;
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowPayItem = true;
                    job.ShowDfr = true;
                    checkForDisabledSection(job);
                    checkForShowDfr(job);
                });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowPayItem = false;
                    if($scope.selectDFRTemplateModel == 31) {
                        if (!job.ShowEquipment && !job.ShowLabor && !job.ShowPayItem && !job.ShowImageAttachments && !job.ShowRentalEquipments && !job.ShowStations && !job.ShowDailyFieldNotes) {
                            job.ShowDfr = false;
                        }
                    } else {
                        if(!job.ShowPayItem && !job.ShowEquipment && !job.ShowForemanComments && !job.ShowApproverReviewerComments
                            && !job.ShowImageAttachments)
                        job.ShowDfr = false;
                    }
                    if(job.ShowDfr)
                        $scope.isDownloadDisabled = false;
                });
            }
            break;
        case "ForemanCmt":
            if($scope.isAllForemanCmtSelected) {
                $scope.isDownloadDisabled = false;
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowForemanComments = true;
                    job.ShowDfr = true;
                });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowForemanComments = false;
                    if(!job.ShowEquipment && !job.ShowPayItem && !job.ShowLabor && !job.ShowApproverReviewerComments)
                        job.ShowDfr = false;
                });
            }
            break;
        case "ApproverCmt":
            if($scope.isAllApproverCmtSelected) {
                $scope.isDownloadDisabled = false;
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowApproverReviewerComments = true;
                    job.ShowDfr = true;
                });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowApproverReviewerComments = false;
                    if(!job.ShowEquipment && !job.ShowPayItem && !job.ShowLabor && !job.ShowForemanComments)
                        job.ShowDfr = false;
                });
            }
            break;
        case "ImageAttachments":
            if($scope.isAllImageAttachmentsSelected) {
                $scope.isDownloadDisabled = false;
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowImageAttachments = true;
                    job.ShowDfr = true;
                    if (!$scope.resurfacingApplicable) {
                        checkForDisabledSection(job);
                        checkForShowDfr(job);
                    }
                });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowImageAttachments = false;
                    if(!$scope.resurfacingApplicable && !job.ShowEquipment && !job.ShowPayItem && !job.ShowLabor)
                        job.ShowDfr = false;
                    if($scope.resurfacingApplicable && !job.ShowRestoration && !job.ShowCutSheets)
                        job.ShowDfr = false;
                });
            }
            break;
        case "Rentals":
            if($scope.isAllRentalsSelected) {
                $scope.isDownloadDisabled = false;
            angular.forEach($scope.dfrJobList, function(job) {
                job.ShowRentalEquipments = true;
                job.ShowDfr = true;
                checkForDisabledSection(job);
                checkForShowDfr(job);
            });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowRentalEquipments = false;
                    if(!job.ShowPayItem && !job.ShowEquipment && !job.ShowRentalEquipments && !job.ShowDailyFieldNotes && !job.ShowStations
                        && !job.ShowImageAttachments)
                    job.ShowDfr = false;
                    if(job.ShowDfr)
                        $scope.isDownloadDisabled = false;
                });
            }
            break;
            case "DailyFieldNotes":
                if($scope.isAllDailyFieldNotesSelected) {
                    $scope.isDownloadDisabled = false;
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowDailyFieldNotes = true;
                    job.ShowDfr = true;
                    checkForDisabledSection(job);
                    checkForShowDfr(job);
                });
                }
                else {
                    angular.forEach($scope.dfrJobList, function(job) {
                        job.ShowDailyFieldNotes = false;
                        if(!job.ShowPayItem && !job.ShowEquipment && !job.ShowRentalEquipments && !job.ShowDailyFieldNotes && !job.ShowStations
                            && !job.ShowImageAttachments)
                        job.ShowDfr = false;
                        if(job.ShowDfr)
                            $scope.isDownloadDisabled = false;
                    });
                }
                break;
                case "Stations":
                    if($scope.isAllStationsSelected) {
                        $scope.isDownloadDisabled = false;
                    angular.forEach($scope.dfrJobList, function(job) {
                        job.ShowStations = true;
                        job.ShowDfr = true;
                        checkForDisabledSection(job);
                        checkForShowDfr(job);
                    });
                    }
                    else {
                        angular.forEach($scope.dfrJobList, function(job) {
                            job.ShowStations = false;
                            if(!job.ShowPayItem && !job.ShowEquipment && !job.ShowRentalEquipments && !job.ShowDailyFieldNotes && !job.ShowStations
                                && !job.ShowImageAttachments)
                            job.ShowDfr = false;
                            if(job.ShowDfr)
                                $scope.isDownloadDisabled = false;
                        });
                    }
                    break;
        case "CutSheets":
            if($scope.isAllCutSheetsSelected) {
                $scope.isDownloadDisabled = false;
            angular.forEach($scope.dfrJobList, function(job) {
                job.ShowCutSheets = true;
                job.ShowDfr = true;
            });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowCutSheets = false;
                    if(!job.ShowCutSheets && !job.ShowRestoration && !job.ShowImageAttachments)
                    job.ShowDfr = false;
                    if(job.ShowDfr)
                        $scope.isDownloadDisabled = false;
                });
            }
            break;
        case "Restoration":
            if($scope.isAllRestorationSelected) {
                $scope.isDownloadDisabled = false;
            angular.forEach($scope.dfrJobList, function(job) {
                job.ShowRestoration = true;
                job.ShowDfr = true;
            });
            }
            else {
                angular.forEach($scope.dfrJobList, function(job) {
                    job.ShowRestoration = false;
                    if(!job.ShowCutSheets && !job.ShowRestoration && !job.ShowImageAttachments)
                    job.ShowDfr = false;
                    if(job.ShowDfr)
                        $scope.isDownloadDisabled = false;
                });
            }
            break;
    }
    angular.forEach($scope.dfrJobList, function(job) {
        if(job.ShowDfr)
        {
            $scope.dfrCount += 1;
        }
    });

    if($scope.dfrCount==$scope.dfrJobList.length && $scope.isAllEquipmentSelected
        && $scope.isAllLaborSelected && $scope.isAllPayItemSelected && !$scope.resurfacingApplicable) {
            // console.log($scope.isAllImageAttachmentsSelected);
            if($scope.selectDFRTemplateModel === 27) {
                if($scope.isAllImageAttachmentsSelected) {
                    $scope.isAllDfrSelected = true;
                } else {
                    $scope.isAllDfrSelected = false;
                }
            }
            else
            {
            if($scope.selectDFRTemplateModel != 4 && $scope.selectDFRTemplateModel !=5)
            {
                if($scope.isAllForemanCmtSelected && $scope.isAllApproverCmtSelected) {
                    $scope.isAllDfrSelected = true;
                }
                else if($scope.selectDFRTemplateModel == 14 && $scope.isAllForemanCmtSelected)
                {
                    $scope.isAllDfrSelected = true;
                }
                else if($scope.selectDFRTemplateModel == 34 && $scope.isAllImageAttachmentsSelected)
                {
                    $scope.isAllDfrSelected = true;
                }
                else {
                    $scope.isAllDfrSelected = false;
                }
            }
            else if($scope.selectDFRTemplateModel == 4 || $scope.selectDFRTemplateModel == 27)
            {
                // console.log('.,.,.,.,.,');
                if($scope.isAllImageAttachmentsSelected)
                    $scope.isAllDfrSelected = true;
                else
                    $scope.isAllDfrSelected = false;
            }
            else if($scope.selectDFRTemplateModel == 27)
            {
                // console.log($scope.isAllImageAttachmentsSelected);
                if($scope.isAllImageAttachmentsSelected)
                    $scope.isAllDfrSelected = true;
                else
                    $scope.isAllDfrSelected = false;
            }
            else
            {
                $scope.isAllDfrSelected = true;
            }
        }
        } else if ($scope.dfrCount==$scope.dfrJobList.length &&  $scope.resurfacingApplicable) {
            if($scope.isAllImageAttachmentsSelected && $scope.isAllCutSheetsSelected && $scope.isAllRestorationSelected)
                $scope.isAllDfrSelected = true;
            else {
                $scope.isAllDfrSelected = false;
            }
        }
        else{
            if($scope.dfrCount<=0){
                $scope.isDownloadDisabled = true;
            }
            $scope.isAllDfrSelected = false;
        }
}
$scope.dfrCheckBoxSelection=function(jobId){
    var dfrCount=0;
    if (!$scope.resurfacingApplicable) {
        // console.log('...');
        $scope.isAllLaborSelected = true;
        $scope.isAllPayItemSelected = true;
        $scope.isAllEquipmentSelected = true;
        $scope.isAllForemanCmtSelected = true;
        $scope.isAllApproverCmtSelected = true;
        if($scope.selectDFRTemplateModel == 31) {
            $scope.isAllRentalsSelected = true;
            $scope.isAllDailyFieldNotesSelected = true;
            $scope.isAllStationsSelected = true;
        }
    }
    $scope.isAllImageAttachmentsSelected = true;
    if ($scope.resurfacingApplicable) {
        $scope.isAllCutSheetsSelected = true;
        $scope.isAllRestorationSelected = true;
    }
    angular.forEach($scope.dfrJobList,function(job) {
        if(job.ShowDfr && (jobId==job.activityId || jobId == job.resurfacingId)) {
            dfrCount++;
            $scope.isDownloadDisabled = false;
            if (!$scope.resurfacingApplicable) {
                job.ShowLabor=($scope.selectDFRTemplateModel==6 ||$scope.selectDFRTemplateModel==2||$scope.selectDFRTemplateModel==3 )?false: true;
                job.ShowEquipment=($scope.selectDFRTemplateModel==6 ||$scope.selectDFRTemplateModel==2||$scope.selectDFRTemplateModel==3)?false: true;
                job.ShowPayItem=($scope.selectDFRTemplateModel==6 ||$scope.selectDFRTemplateModel==2||$scope.selectDFRTemplateModel==3)?false: true;
                job.ShowForemanComments = ($scope.selectDFRTemplateModel==7 || $scope.selectDFRTemplateModel==8 || $scope.selectDFRTemplateModel==9 || $scope.selectDFRTemplateModel==14)?true:false;
                job.ShowApproverReviewerComments = ($scope.selectDFRTemplateModel==7 || $scope.selectDFRTemplateModel==8|| $scope.selectDFRTemplateModel==9)?true:false;
                job.ShowImageAttachments = ($scope.selectDFRTemplateModel==4 || $scope.selectDFRTemplateModel==27 || $scope.selectDFRTemplateModel == 31 || $scope.selectDFRTemplateModel == 34)?true:false;
                job.ShowNotesbypayitem = ($scope.selectDFRTemplateModel==3)?true : false;
                job.ShowRentalEquipments = ($scope.selectDFRTemplateModel == 31)?true:false;
                job.ShowDailyFieldNotes = ($scope.selectDFRTemplateModel == 31)?true:false;
                job.ShowStations = ($scope.selectDFRTemplateModel == 31)?true:false;
                checkForDisabledSection(job);
            }
            if ($scope.resurfacingApplicable) {
                job.ShowCutSheets = ($scope.selectDFRTemplateModel==4)?true : false;
                job.ShowRestoration = ($scope.selectDFRTemplateModel==4)?true : false;
                job.ShowLabor = false;
                job.ShowEquipment = false;
                job.ShowPayItem = false;
                job.ShowForemanComments = false;
                job.ShowApproverReviewerComments = false;
                job.ShowImageAttachments = ($scope.selectDFRTemplateModel==4)?true:false;
                job.ShowNotesbypayitem = false;
            }
        }
        else if(!job.ShowDfr && (jobId==job.activityId || jobId == job.resurfacingId)){
            $scope.isAllDfrSelected = false;
            job.ShowLabor=false;
            job.ShowEquipment=false;
            job.ShowPayItem=false;
            job.ShowForemanComments = false;
            job.ShowApproverReviewerComments = false;
            job.ShowImageAttachments = false;
            job.ShowNotesbypayitem = false;
            job.ShowRentalEquipments = false;
            job.ShowDailyFieldNotes = false;
            job.ShowStations = false;
            if ($scope.resurfacingApplicable) {
                job.ShowCutSheets = false;
                job.ShowRestoration = false;
            }
        }
        else if(job.ShowDfr && jobId!=job.activityId && jobId != job.resurfacingId){
            $scope.isDownloadDisabled = false;
            dfrCount++;
        }
        checkForAllJobSelected(job);
    });
    if(dfrCount>=1) {
        $scope.isDownloadDisabled = false;
        if($scope.selectDFRTemplateModel == 6 && dfrCount == $scope.dfrJobList.length)
        $scope.isAllDfrSelected = true;
        if($scope.selectDFRTemplateModel == 27 && dfrCount == $scope.dfrJobList.length)
        {
            $scope.isAllDfrSelected = true;
        }
        if($scope.selectDFRTemplateModel == 31 && dfrCount == $scope.dfrJobList.length)
        {
            $scope.isAllDfrSelected = true;
        }
        if($scope.selectDFRTemplateModel == 3 && dfrCount == $scope.dfrJobList.length)
        {
            $scope.isAllDfrSelected = true;
        }
        if(dfrCount==$scope.dfrJobList.length && $scope.isAllEquipmentSelected && $scope.isAllLaborSelected && $scope.isAllPayItemSelected && !$scope.resurfacingApplicable)
        {
            if($scope.selectDFRTemplateModel ==  27)
            {
                $scope.isAllDfrSelected = true;
            }
            else if($scope.selectDFRTemplateModel == 25 )
            {
                $scope.isAllDfrSelected = true;
            }
            else
            {
            if($scope.selectDFRTemplateModel != 4 && $scope.selectDFRTemplateModel !=5)
            {
                if($scope.isAllForemanCmtSelected && $scope.isAllApproverCmtSelected) {
                    $scope.isAllDfrSelected = true;
                }
                else if($scope.selectDFRTemplateModel == 14 && $scope.isAllForemanCmtSelected)
                {
                    $scope.isAllDfrSelected = true;
                }
                else if($scope.selectDFRTemplateModel == 34 && $scope.isAllImageAttachmentsSelected)
                {
                    $scope.isAllDfrSelected = true;
                }
                else
                {
                    $scope.isAllDfrSelected = false;
                }
            }
            else if($scope.selectDFRTemplateModel == 4 || $scope.selectDFRTemplateModel == 27)
            {
                if($scope.isAllImageAttachmentsSelected)
                    $scope.isAllDfrSelected = true;
                else
                    $scope.isAllDfrSelected = false;
            }
            else
            {
                $scope.isAllDfrSelected = true;
            }
        }
        } else if (dfrCount==$scope.dfrJobList.length && $scope.resurfacingApplicable) {
            if($scope.isAllImageAttachmentsSelected && $scope.isAllCutSheetsSelected && $scope.isAllRestorationSelected)
                $scope.isAllDfrSelected = true;
            else {
                $scope.isAllDfrSelected = false;
            }
        }
    }
    else {
        $scope.isDownloadDisabled = true;
        $scope.isAllDfrSelected = false;
    }
}
$scope.checkBoxSelection=function(){
     $scope.dfrCount=0;
     if (!$scope.resurfacingApplicable) {
        $scope.isAllLaborSelected = true;
        $scope.isAllPayItemSelected = true;
        $scope.isAllEquipmentSelected = true;
        $scope.isAllForemanCmtSelected = true;
        $scope.isAllApproverCmtSelected = true;
        if($scope.selectDFRTemplateModel == 31) {
            $scope.isAllRentalsSelected = true;
            $scope.isAllDailyFieldNotesSelected = true;
            $scope.isAllStationsSelected = true;
        }
     }
     if ($scope.resurfacingApplicable) {
        $scope.isAllCutSheetsSelected = true;
        $scope.isAllRestorationSelected = true;
     }
     $scope.isAllImageAttachmentsSelected = true;
    angular.forEach($scope.dfrJobList,function(job){

       if(!job.ShowLabor&& !job.ShowEquipment && !job.ShowPayItem && !job.ShowForemanComments
         && !job.ShowApproverReviewerComments && !job.ShowImageAttachments && !job.ShowCutSheets
         && !job.ShowRestoration && !job.ShowRentalEquipments && !job.ShowDailyFieldNotes && !job.ShowStations) {
            job.ShowDfr = false;
        }
        else if(job.ShowLabor || job.ShowEquipment || job.ShowPayItem || job.ShowForemanComments
            || job.ShowApproverReviewerComments || job.ShowImageAttachments || job.ShowCutSheets || job.ShowRestoration || job.ShowRentalEquipments || job.ShowStations || job.ShowDailyFieldNotes) {
            $scope.dfrCount=$scope.dfrCount + 1;
            job.ShowDfr = true;
                $scope.isDownloadDisabled = false;
            }
            checkForAllJobSelected(job);
    });
    if($scope.dfrCount==$scope.dfrJobList.length && $scope.isAllEquipmentSelected
        && $scope.isAllLaborSelected && $scope.isAllPayItemSelected && !$scope.resurfacingApplicable){
            if($scope.selectDFRTemplateModel == 27) {

                if($scope.isAllImageAttachmentsSelected)
                $scope.isAllDfrSelected = true;
                else
                $scope.isAllDfrSelected = false;
            }
            if( $scope.selectDFRTemplateModel == 31) {
                if($scope.isAllRentalsSelected == true && $scope.isAllImageAttachmentsSelected && $scope.isAllStationsSelected && $scope.isAllDailyFieldNotesSelected) {
                    $scope.isAllDfrSelected = true;
                } else{
                    $scope.isAllDfrSelected = false;
                }
            }
            else
            {
            if($scope.selectDFRTemplateModel != 4 && $scope.selectDFRTemplateModel !=5)
            {
                if($scope.isAllForemanCmtSelected && $scope.isAllApproverCmtSelected) {
                $scope.isAllDfrSelected = true;
                }
                else if($scope.selectDFRTemplateModel == 14 && $scope.isAllForemanCmtSelected)
                {
                    $scope.isAllDfrSelected = true;
                }
                else if($scope.selectDFRTemplateModel == 34 && $scope.isAllImageAttachmentsSelected)
                {
                    $scope.isAllDfrSelected = true;
                }
                else
                {
                $scope.isAllDfrSelected = false;
                }
            }
            else if($scope.selectDFRTemplateModel == 4)
            {
                if($scope.isAllImageAttachmentsSelected)
                $scope.isAllDfrSelected = true;
                else
                $scope.isAllDfrSelected = false;
            }
            else
            {
                $scope.isAllDfrSelected = true;
            }
        }
        } else if ($scope.dfrCount==$scope.dfrJobList.length && $scope.resurfacingApplicable) {
            if($scope.isAllImageAttachmentsSelected && $scope.isAllCutSheetsSelected && $scope.isAllRestorationSelected)
                $scope.isAllDfrSelected = true;
            else {
                $scope.isAllDfrSelected = false;
            }
        }
        else{
            if($scope.dfrCount<=0){
                $scope.isDownloadDisabled = true;
            }
            $scope.isAllDfrSelected = false;
        }

}
    $scope.showDFR = function(){
        $scope.dfrSection = true;
        $scope.resurfacingApplicable = false;
        $scope.ClearSearchFilter();
    }

    $scope.showResurfacingDFR = function () {
        $scope.AddressDropDown = false;
        $scope.WorkOrderDropDown = false;
        $scope.isStandardDFRApplicable = true;
        $scope.dfrSection = true;
        $scope.ClearSearchFilter();
        $scope.resurfacingApplicable = true;
        $scope.allDFRTemplateData = [];
        $scope.allDFRTemplateData.push({id: 4, label: 'Standard DFR'});
        $scope.selectDFRTemplateModel = $scope.allDFRTemplateData[0].id;
        $scope.isSpireApplicable = false;
        $scope.isTecoTampaApplicable = false;
        $scope.isDteApplicable = false;
        $scope.isNipscoApplicable = false;
        $scope.isWglApplicable = false;
        $scope.isWglVaApplicable = false;
        $scope.isPngApplicable = false;
        $scope.isXcelApplicable = false;
        $scope.isPecoApplicable = false;
        $scope.isPecoFLRApplicable = false;
        $scope.standardNotVectren = false;
    }

    //Function to get List of companies
    $scope.getCompanies = function () {
        return exportSharedService.getCompanies();
    }

    //Function to get List of contacts for selected Company
    $scope.getContracts = function (company) {
        return exportSharedService.getContracts(company);
    }
    $scope.getSuperintendent = function (selectedCompany) {
        return exportSharedService.getSuperintendentsBulkDFR(selectedCompany);
    }
    $scope.getDFRTemplates = function (contracts) {
        return exportSharedService.getDFRTemplates(contracts);
    }
    $scope.getApproverContractList = function (userId) {
        return bulkDFRReportService.getApproverContractList(userId);
    }
    $scope.ClearSelection= function(){

        if($scope.dfrJobList.length!=0){
            $scope.isDownloadDisabled=true;
            $scope.isAllDfrSelected=false;
            $scope.isSelectAllDisabled=false;
            $scope.isAllLaborSelected = false;
               $scope.isAllEquipmentSelected = false;
               $scope.isAllPayItemSelected = false;
               $scope.isAllForemanCmtSelected = false;
               $scope.isAllApproverCmtSelected = false;
               $scope.isAllImageAttachmentsSelected = false;
               $scope.isAllCutSheetsSelected = false;
               $scope.isAllRestorationSelected = false;
            angular.forEach($scope.dfrJobList,function(job){
                job.ShowDfr = false;
                job.ShowLabor=false;
                job.ShowEquipment=false;
                job.ShowPayItem=false;
                job.ShowForemanComments = false;
                job.ShowApproverReviewerComments = false;
                job.ShowImageAttachments = false;
                job.ShowNotesbypayitem = false;
                job.ShowCutSheets = false;
                job.ShowRestoration = false;
                job.selectedWorkorder="";
            });
    }
    }
$scope.ClearSearchFilter=function(){
    $scope.selectedCompany = null;
    $scope.selectSuperintendentModel = null;
    $scope.isAllChkbx=true;
    $scope.AddressDropDown = false;
    $scope.selectedContracts=[];
    $scope.selectedForeman = [];
    $scope.selectAllAdd = false;
    $scope.Addresses = [];
    $scope.selectedAddress = [];
    $scope.selectedStartDate="";
    $scope.selectedEndDate="";
    $scope.selectAll = false;
    $scope.selectAllApp = false;
   $scope.selectAllAddWorkOrder = false;
   $scope.WorkOrders = [];
   $scope.selectedWorkOrder = [];
   $scope.selectAllWorkOrder = false;
   $scope.selectAllAppWorkOrder = false;
   $scope.WorkOrderDropDown = false;

    if($scope.userData.userType==="Reviewer"){
        $scope.selectSuperintendentModel=[];
        $scope.allContractData=[];
    }
    if(!$scope.resurfacingApplicable) {
        $scope.selectDFRTemplateModel=[];
        $scope.allDFRTemplateData=[];
    }
    if($scope.allContractData.length==0){
        $scope.isEmptyList=true;
    }
    if($scope.allSuperintendentsData.length==0)
                $scope.isEmptyUserList=true;
    if(angular.isDefined($scope.dfrJobList)){
        $scope.dfrJobList=[];
        $scope.isAllDfrSelected=false;
        $scope.isSelectAllDisabled=true;
    }
    $scope.isDownloadDisabled = true;
    $scope.isAllLaborSelected = false;
    $scope.isAllEquipmentSelected = false;
    $scope.isAllPayItemSelected = false;
    $scope.isAllForemanCmtSelected = false;
    $scope.isAllApproverCmtSelected = false;
    $scope.isAllImageAttachmentsSelected = false;
    $scope.isAllCutSheetsSelected = false;
    $scope.isAllRestorationSelected = false;
}

function checkForDisabledSection(job) {
    if (!$scope.resurfacingApplicable) {
        if (job.disableEquipment) {
            job.ShowEquipment = false;
        }
        if (job.disableImageUpload) {
            job.ShowImageAttachments = false;
        }
        if (job.disableLabor) {
            job.ShowLabor = false;
        }
        if (job.disablePayItem) {
            job.ShowPayItem = false;
        }
    }
}

function checkForShowDfr(job) {
    if (!$scope.resurfacingApplicable) {
        if($scope.selectDFRTemplateModel == 31) {

            if (!job.ShowEquipment && !job.ShowLabor && !job.ShowPayItem && !job.ShowImageAttachments && !job.ShowRentalEquipments && !job.ShowStations && !job.ShowDailyFieldNotes) {
                job.ShowDfr = false;
            }
        } else {
            if (!job.ShowEquipment && !job.ShowLabor && !job.ShowPayItem && !job.ShowImageAttachments) {
                job.ShowDfr = false;
            }
        }
    }
}

function checkForAllJobSelected(job) {
    if (!$scope.resurfacingApplicable) {
        if (!job.ShowLabor && !job.disableLabor)
            $scope.isAllLaborSelected = false;
        if (!job.ShowEquipment && !job.disableEquipment)
            $scope.isAllEquipmentSelected = false;
        if (!job.ShowPayItem && !job.disablePayItem)
            $scope.isAllPayItemSelected = false;
        if (!job.ShowApproverReviewerComments)
            $scope.isAllApproverCmtSelected = false;
        if (!job.ShowForemanComments)
            $scope.isAllForemanCmtSelected = false;
        if (!job.ShowImageAttachments && !job.disableImageUpload)
            $scope.isAllImageAttachmentsSelected = false;
        if (!job.ShowRentalEquipments && !job.disableRentals)
            $scope.isAllRentalsSelected = false;
        if (!job.ShowDailyFieldNotes && !job.disableDailyFieldNotes)
            $scope.isAllDailyFieldNotesSelected = false;
        if (!job.ShowStations && !job.disableStations)
            $scope.isAllStationsSelected = false;
    } else if ($scope.resurfacingApplicable) {
        if (!job.ShowImageAttachments)
            $scope.isAllImageAttachmentsSelected = false;
        if (!job.ShowCutSheets)
            $scope.isAllCutSheetsSelected = false;
        if (!job.ShowRestoration)
            $scope.isAllRestorationSelected = false;
    }
}

function addSelectAll()
{
    if( $scope.selectAll){
        $scope.selectedContracts.unshift("all");
    }
}

function removeSelectAll()
{
    if( $scope.selectAll){
        var index = $scope.selectedContracts.indexOf("all");
        if (index > -1) {
            $scope.selectedContracts.splice(index, 1);
        }

    }
}

function addSelectAllOption()
{
   if( $scope.selectAllApp){
        $scope.selectSuperintendentModel.unshift("all");
    }

}

function removeSelectAllOption()
{
    if( $scope.selectAllApp){
        var index = $scope.selectSuperintendentModel.indexOf("all");
        if (index > -1) {
            $scope.selectSuperintendentModel.splice(index, 1);
        }

    }

}

function selectAllAddress()
{
    if(!$scope.isAddress && !$scope.isAddressStill) {
        $scope.dfrJobList = [];
        $scope.selectedWorkOrder = [];
        $scope.isSelectAllDisabled = true;
        $scope.isAllChkbx = true;
        $scope.isAllDfrSelected = false;
        $scope.isAllLaborSelected = false;
        $scope.isAllEquipmentSelected = false;
        $scope.isAllPayItemSelected = false;
        $scope.isAllImageAttachmentsSelected = false;
    }
    if( $scope.selectAllAdd && $scope.isAddressStill){
        $scope.selectedAddress.unshift("all");
     }
     $scope.isAddressStill = true;
     $scope.isWorkOrderStill = false;

    $scope.isAddress = true;
    $scope.isWorkOrder = false;

}

    function removeAllAddress()
    {
      $scope.isAddress = false;
      if( $scope.selectAllAdd){
        var index = $scope.selectedAddress.indexOf("all");
        if (index > -1) {
            $scope.selectedAddress.splice(index, 1);
        }

    }
}

    function handleAddressChange() {
        /*if(typeof $scope.selectedAddress === 'undefined') {
            $scope.selectedAddress = [];
            $scope.selectedAddress.splice('all');
        }
        else{
            var index = $scope.selectedAddress.indexOf('all');
            if(index === 0 && $scope.selectedAddress.length === 1) {
                // $scope.selectedAddress.push($scope.Addresses);
                $scope.selectedAddress=$scope.selectedAddress.concat($scope.Addresses.map(function(e){
                    return e;
                   }));
            }
            else if($scope.selectedAddress.length != $scope.Addresses.length) {
                // console.log('...');
                $scope.selectedAddress.splice('all');
            }
            else if(index === -1 && $scope.selectedAddress.length === $scope.Addresses.length )
            {
                $scope.selectedAddress.push('all');
            }
            else{
                $scope.selectedAddress.splice()
            }

            console.log($scope.selectedAddress);
        }*/
        $scope.isAllLaborSelected = false;
                        $scope.isAllEquipmentSelected = false;
                        $scope.isAllPayItemSelected = false;
                        $scope.isAllImageAttachmentsSelected = false;
        var selectAllValue = false;
        var singleSelectVal = false;
        if($scope.selectedAddress==null) {
            // $scope.singleSelectAddress = false;
            // $scope.selectAllAdd = false;
            singleSelectVal = false;
            selectAllValue = false;
        }
        else{
        var index = $scope.selectedAddress.indexOf("all");
        var selectAllVal = $scope.selectAllAdd;
        var singleSelectVal = $scope.singleSelectAddress;
        if(index!=-1)
        {
            if(index==0)
            {
                if($scope.selectedAddress.length-1==0 && $scope.Addresses.length==1 && $scope.selectAllAdd==true)
                {
                    selectAllVal = false;
                    singleSelectVal = true;
                }
                else if($scope.selectedAddress.length === $scope.Addresses.length) {
                    $scope.selectedAddress.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
                else {
                    selectAllVal = true;
                    singleSelectVal = false;
                }
            }
            else if(index == $scope.selectedAddress.length-1) {
                if(singleSelectVal) {
                    selectAllVal = true;
                    singleSelectVal = false;
                }
                else if($scope.selectedAddress.length === $scope.Addresses.length-1) {
                    $scope.selectedAddress.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
                else{
                    $scope.selectedAddress.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
            }
        }
        else {

            if($scope.selectedAddress.length === $scope.Addresses.length && !selectAllVal) {
                $scope.selectedAddress.push("all");
                selectAllVal = true;
                singleSelectVal=false;
            }
            else {
                selectAllVal = false;
                singleSelectVal=true;

            }

        }
        $scope.selectAllAdd = selectAllVal;
        $scope.singleSelectAddress = singleSelectVal;
        var selectAllValue= selectAllVal;
        }
        if(selectAllValue) {
            $scope.selectedAddress=$scope.selectedAddress.concat($scope.Addresses.map(function(e){
             return e;
            }));
         }
         else {
            if ($scope.selectedAddress!=null && $scope.selectedAddress.length === $scope.Addresses.length && $scope.singleSelectAddress) {
                        $scope.selectedAddress = [];
                        // console.log('..');
                    }
         }

        $scope.newSelectedAddress = [];
        angular.forEach($scope.selectedAddress, function(element) {
            if($scope.newSelectedAddress.indexOf(element) === -1) {
                $scope.newSelectedAddress.push(element);
            }
        });
        $scope.selectedAddress = $scope.newSelectedAddress
        var temp = [];
        angular.forEach($scope.selectedAddress, function(element){
            angular.forEach($scope.tempJobList, function(item) {
                if(element.activityId === item.activityId){
                    item.ShowDfr = false;
                        item.ShowLabor = false;
                        item.ShowImageAttachments = false;
                        item.ShowPayItem = false;
                        item.ShowEquipment = false;
                        $scope.isAllLaborSelected = false;
                        $scope.isAllEquipmentSelected = false;
                        $scope.isAllPayItemSelected = false;
                        $scope.isAllImageAttachmentsSelected = false;
                    if(temp.indexOf(item) === -1) {
                        temp.push(item);
                    }
                }
            });
        });
        $scope.dfrJobList = temp;
        if($scope.dfrJobList.length === 0) {
            $scope.isSelectAllDisabled = true;
            $scope.isAllChkbx = true;
        }
        else{
            $scope.isSelectAllDisabled = false;
            $scope.isAllChkbx = false;
        }
        $scope.isAllDfrSelected = false;
    }

    function selectAllWorkOrder()
    {
        if(!$scope.isWorkOrder && !$scope.isWorkOrderStill) {
        $scope.dfrJobList = [];
        $scope.selectedAddress = [];
        $scope.isSelectAllDisabled = true;
        $scope.isAllChkbx = true;
        $scope.isAllDfrSelected = false;
        $scope.isAllLaborSelected = false;
        $scope.isAllEquipmentSelected = false;
        $scope.isAllPayItemSelected = false;
        $scope.isAllImageAttachmentsSelected = false;
        }
        if( $scope.selectAllAddWorkOrder && $scope.isWorkOrderStill){
            $scope.selectedWorkOrder.unshift("all");
         }
        $scope.isWorkOrderStill = true;
        $scope.isAddressStill = false;

        $scope.isAddress = false;
        $scope.isWorkOrder = true;

    }

    function removeAllWorkOrder()
    {
          $scope.isWorkOrder = false;
        if( $scope.selectAllAddWorkOrder){
            var index = $scope.selectedWorkOrder.indexOf("all");
            if (index > -1) {
                $scope.selectedWorkOrder.splice(index, 1);
            }

        }
    }
    function handleWorkOrderChange() {

        $scope.isAllLaborSelected = false;
                        $scope.isAllEquipmentSelected = false;
                        $scope.isAllPayItemSelected = false;
                        $scope.isAllImageAttachmentsSelected = false;
        var selectAllValue = false;
        var singleSelectVal = false;
        if($scope.selectedWorkOrder==null) {
            singleSelectVal = false;
            selectAllValue = false;
        }
        else{
        var index = $scope.selectedWorkOrder.indexOf("all");
        var selectAllVal = $scope.selectAllAddWorkOrder;
        var singleSelectVal = $scope.singleSelectWorkOrder;
        if(index!=-1)
        {
            if(index==0)
            {
                if($scope.selectedWorkOrder.length-1==0 && $scope.WorkOrders.length==1 && $scope.selectAllAddWorkOrder==true)
                {
                    selectAllVal = false;
                    singleSelectVal = true;
                }
                else if($scope.selectedWorkOrder.length === $scope.WorkOrders.length) {
                    $scope.selectedWorkOrder.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
                else {
                    selectAllVal = true;
                    singleSelectVal = false;
                }
            }
            else if(index == $scope.selectedWorkOrder.length-1) {
                if(singleSelectVal) {
                    selectAllVal = true;
                    singleSelectVal = false;
                }
                else if($scope.selectedWorkOrder.length === $scope.WorkOrders.length-1) {
                    $scope.selectedWorkOrder.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
                else{
                    $scope.selectedWorkOrder.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
            }
        }
        else {

            if($scope.selectedWorkOrder.length === $scope.WorkOrders.length && !selectAllVal) {
                $scope.selectedWorkOrder.push("all");
                selectAllVal = true;
                singleSelectVal=false;
            }
            else {
                selectAllVal = false;
                singleSelectVal=true;

            }

        }
        $scope.selectAllAddWorkOrder = selectAllVal;
        $scope.singleSelectWorkOrder = singleSelectVal;
        var selectAllValue= selectAllVal;
        }
        if(selectAllValue) {
            $scope.selectedWorkOrder=$scope.selectedWorkOrder.concat($scope.WorkOrders.map(function(e){
             return e;
            }));
         }
         else {
            if ($scope.selectedWorkOrder!=null && $scope.selectedWorkOrder.length === $scope.WorkOrders.length && $scope.singleSelectWorkOrder) {
                        $scope.selectedWorkOrder = [];
                        // console.log('..');
                    }
         }

        $scope.newSelectedWorkOrder = [];
        angular.forEach($scope.selectedWorkOrder, function(element) {
            if($scope.newSelectedWorkOrder.indexOf(element) === -1) {
                $scope.newSelectedWorkOrder.push(element);
            }
        });
        $scope.selectedWorkOrder = $scope.newSelectedWorkOrder
        var temp = [];
        angular.forEach($scope.selectedWorkOrder, function(element){
            angular.forEach($scope.tempJobList, function(item) {
                if(element.activityId === item.activityId){
                    item.ShowDfr = false;
                        item.ShowLabor = false;
                        item.ShowImageAttachments = false;
                        item.ShowPayItem = false;
                        item.ShowEquipment = false;
                        $scope.isAllLaborSelected = false;
                        $scope.isAllEquipmentSelected = false;
                        $scope.isAllPayItemSelected = false;
                        $scope.isAllImageAttachmentsSelected = false;
                    if(temp.indexOf(item) === -1) {
                        temp.push(item);
                    }
                }
            });
        });
        $scope.dfrJobList = temp;
        if($scope.dfrJobList.length === 0) {
            $scope.isSelectAllDisabled = true;
            $scope.isAllChkbx = true;
        }
        else{
            $scope.isSelectAllDisabled = false;
            $scope.isAllChkbx = false;
        }
        $scope.isAllDfrSelected = false
    }

    // function selectAllForeman() {
    //     if($scope.selectedForeman == null) {
    //         $scope.singleSelect = false;
    //         $scope.selectAll = false;
    //         var selectAllValue = false;
    //     }
    //     else {
    //         var index = $scope.selectedForeman.indexOf("all");
    //         var selectAllVal = $scope.selectAll;
    //         var singleSelectVal = $scope.singleSelect;
    //         if(index != -1) {
    //             if(index == 0) {
    //                 selectAllVal = true;
    //                 singleSelectVal = false;
    //             } else if(index == $scope.selectedForeman.length-1) {
    //                 if(singleSelectVal) {
    //                     selectAllVal = true;
    //                     singleSelectVal = false;
    //                 } else {
    //                     $scope.selectedForeman.splice(index, 1);
    //                     selectAllVal = false;
    //                     singleSelectVal = true;
    //                 }
    //             }
    //         }else {
    //             if($scope.selectedForeman.length === $scope.allForemanData.length && !selectAllVal) {
    //                 $scope.selectedForeman.push("all");
    //                 selectAllVal = true;
    //                 singleSelectVal=false;
    //             }
    //             else {
    //                 selectAllVal = false;
    //                 singleSelectVal=true;

    //             }

    //         }
    //         $scope.selectAll = selectAllVal;
    //         $scope.singleSelect = singleSelectVal;
    //         var selectAllValue= selectAllVal;
    //     }
    //     if(selectAllValue) {
    //         $scope.selectedForeman = $scope.selectedForeman.concat($scope.allForemanData.map(function(e){
    //             return e.id;
    //         }));
    //      }
    //      else {
    //         if ($scope.selectedForeman !=null && $scope.selectedForeman.length === $scope.allForemanData.length && $scope.singleSelect) {
    //             $scope.selectedForeman = [];
    //             if (!$scope.resurfacingApplicable) {
    //                 $scope.selectDFRTemplateModel = [];
    //                 $scope.allDFRTemplateData = [];
    //             }
    //         }
    //      }
    // }

    function selectAllContract() {

        // console.log($scope.allContractsData);
        if($scope.selectedContracts==null) {
            $scope.singleSelect = false;
            $scope.selectAll = false;
            var selectAllValue = false;
        }
        else{
        var index = $scope.selectedContracts.indexOf("all");
        var selectAllVal = $scope.selectAll;
        var singleSelectVal = $scope.singleSelect;
        if(index!=-1)
        {
            if(index==0)
            {
            selectAllVal = true;
            singleSelectVal = false;
            }
            else if(index == $scope.selectedContracts.length-1) {
                if(singleSelectVal) {
                    selectAllVal = true;
                    singleSelectVal = false;
                }
                else{
                    $scope.selectedContracts.splice(index,1);
                    selectAllVal = false;
                    singleSelectVal = true;
                }
            }
        }
        else {

            if($scope.selectedContracts.length === $scope.allContractData.length && !selectAllVal) {
                $scope.selectedContracts.push("all");
                selectAllVal = true;
                singleSelectVal=false;
            }
            else {
                selectAllVal = false;
                singleSelectVal=true;

            }

        }
        $scope.selectAll = selectAllVal;
        $scope.singleSelect = singleSelectVal;
        var selectAllValue= selectAllVal;
        }
        if(selectAllValue) {
            $scope.selectedContracts=$scope.selectedContracts.concat($scope.allContractsData.map(function(e){
             return e.id;
            }));
         }
         else {
            if ($scope.selectedContracts!=null && $scope.selectedContracts.length === $scope.allContractsData.length && $scope.singleSelect) {
                        $scope.selectedContracts = [];
                        if (!$scope.resurfacingApplicable) {
                            $scope.selectDFRTemplateModel = [];
                            $scope.allDFRTemplateData = [];
                        }
                    }
         }


        if($scope.selectedContracts!=null && $scope.selectedContracts.length>=1 && !$scope.resurfacingApplicable){
            $scope.DFRTemplates.forEach(function(DFRTemplate) {
                if(DFRTemplate.id !== 10 && DFRTemplate.id !== 1010) {
                    $scope.allDFRTemplateData.push({id: DFRTemplate.id, label: DFRTemplate.name})
                }
            });
        $scope.getDFRTemplates($scope.selectedContracts)
        .then(function(response){
            $scope.allDFRTemplateData=[];
            $scope.DFRTemplates = [];
            $scope.selectDFRTemplateModel="";
            if (response.status == 200) {
                $scope.DFRTemplates = response.data.dfrList;
                // console.log($scope.DFRTemplates); // console.log($scope.DFRTemplates);
                $scope.DFRTemplates = $scope.DFRTemplates.filter(function(e) { return e.uniqueKey.toUpperCase() !== 'DUKE CENTRAL CORRIDOR'});
                $scope.DFRTemplates = $scope.DFRTemplates.filter(function(e) { return e.uniqueKey.toUpperCase() !== 'WGL LANDOVER PH5'});
                $scope.DFRTemplates = $scope.DFRTemplates.filter(function(e) { return e.uniqueKey.toUpperCase() !== 'BHNE LINCOLN MMO 22-25'});
                $scope.DFRTemplates = $scope.DFRTemplates.filter(function(e) { return e.uniqueKey.toUpperCase() !== 'TM TE DFR'});
                // $scope.DFRTemplates = $scope.DFRTemplates.filter(function(e) { return e.uniqueKey.toUpperCase() !== 'DUKE LINE 469 PIPELINE'});
                // console.log($scope.DFRTemplates);
                $scope.DFRTemplates.forEach(function(DFRTemplate) {
                    if(DFRTemplate.id !== 10 && DFRTemplate.id !== 1010) {
                        $scope.allDFRTemplateData.push({id: DFRTemplate.id, label: DFRTemplate.name})
                        // console.log($scope.allDFRTemplateData);
                    }
                });
            }
            else if (response.status == 404) {
                notificationService.error($translate.instant(exportCtrlConfig.noSuperintendentsAvailable));
            }
            else if (response.status == 417) {
                notificationService.error($translate.instant(exportCtrlConfig.errorFetchingSuperintendets));
            }
            if($scope.selectedContracts.length!=0)
                $scope.isEmptyList=false;
        }).then(function() {
            // console.log('handleContractChange');
            handleContractChange();
        });
    }
    else{
        if (!$scope.resurfacingApplicable) {
            $scope.selectDFRTemplateModel=[];
            $scope.allDFRTemplateData = [];
        } else {
            handleContractChange();
        }
    }
            // $scope.loadAllForeman();
    }
    $scope.loadAllContractsRevenueExport = function (selectedCompany) {
        $scope.allSuperintendentsData = [];  
        $scope.selectDFRTemplateModel = null;
        $scope.selectSuperintendentModel = null;
        $scope.allDFRTemplateData = [];
        if($scope.exportSection){
        $scope.allContractsData = [];
        $scope.selectContractsModel = [];     

        $scope.getContracts(selectedCompany)
            .then(function (response) {
                if (response.status == 200) {
                    $scope.contracts = response.data;
                    $scope.tecoTampaContracts.forEach(function(contract) {
                    $scope.contracts = $scope.contracts
                                      .filter(function(item) { return item.contract_ID !== contract.id && item.contract_Number !== contract.label });
                    });
                    $scope.contracts.forEach(function(contract) {
                        $scope.allContractsData.push({id: contract.contract_ID, label: contract.contract_Number});
                    });
                    $scope.selectAll = false;
                }
                else if (response.status == 404) {
                    $scope.contracts = [];
                    notificationService.error($translate.instant(exportCtrlConfig.noSuperintendentsAvailable));
                }
                else if (response.status == 417) {
                    $scope.contracts = [];
                    notificationService.error($translate.instant(exportCtrlConfig.errorFetchingSuperintendets));
                }
                
            });
       
    }
   
    }
    $scope.loadAllContracts = function (selectedApprover) {
        $scope.allContractData = [];
        $scope.selectedContracts = [];
        if ($scope.contracts != null) {
            $scope.contracts.forEach(function(contract) {
                // if (selectedApprover.length == 1 ) {
                //     if (selectedApprover[0]==contract.userId) {
                //         $scope.allContractData.push({id: contract.contractId, label: contract.contractNumber});
                //     }
                // }
                // // else if(selectedApprover.length>1){
                // //     var index = selectedApprover.findIndex(function(record) { return record === contract.userId; });
                // //     if(index!= -1 && $scope.allContractData.filter(e => e.id == contract.contractId).length == 0) {
                // //         $scope.allContractData.push({id: contract.contractId, label: contract.contractNumber});
                // //     }
                // else if(selectedApprover.length>1){
                //     var index = selectedApprover.findIndex(function(record) { return record === contract.userId; });
                //     if(index!= -1 && $scope.allContractData.filter(function(e) {return e.id === contract.contractId; }).length == 0) {
                //         $scope.allContractData.push({id: contract.contractId, label: contract.contractNumber});
                //     }
                // }
                $scope.allContractData.push({id: contract.contractId, label: contract.contractNumber});
            });
            if($scope.allContractData.length != 0) {
                $scope.isEmptyList = false;
            }
            else {
                $scope.isEmptyList = true;
                if (!$scope.resurfacingApplicable) {
                    $scope.allDFRTemplateData = [];
                    $scope.selectDFRTemplateModel = [];
                }
            }
        }
    }

    // $scope.loadAllForeman = function() {
    //     $scope.allForemanData = [];
    //     $scope.selectedForeman = [];
    //     if($scope.foreman != null){
    //         if($scope.selectedContracts != null) {
    //             // filter foreman that values do not match selected contract.
    //             var filteredForemanList = $scope.foreman.filter(function(foreman) {
    //                 return $scope.selectedContracts.some(function(contractId) {
    //                     return contractId === foreman.contractId;
    //                 });
    //             });

    //             filteredForemanList.forEach(function(foreman) {
    //                 // prevent deleted entries from being added to Foreman dropdown.
    //                 if(foreman.activityJobStatusId == 5) return;
    //                 // prevents duplicates from being added when multiple contracts are selected.
    //                 if(!$scope.allForemanData.some(function(element) { return element.foremanId === foreman.foremanId })) {
    //                     $scope.allForemanData.push(foreman);
    //                 }
    //             })
    //         }
    //     }
    // }

    function selectAllSuperintendent() {
        // console.log($scope.selectSuperintendentModel);
        $scope.selectAll = false;
        var selectAllVal = false;
        var singleSelectVal = false;
        if ($scope.selectSuperintendentModel == null) {
            singleSelectVal = false;
            selectAllVal = false;
        }
        else {

            var index = $scope.selectSuperintendentModel.indexOf("all");
            selectAllVal = $scope.selectAllApp;
            singleSelectVal = $scope.selectSingleApp;
            if(index!=-1)
            {
                if(index==0)
                {
                    if($scope.selectSuperintendentModel.length-1==0 && $scope.allSuperintendentsData.length==1 && $scope.selectAllApp==true)
                    {
                        selectAllVal = false;
                        singleSelectVal = true;
                    }
                    else {
                        selectAllVal = true;
                        singleSelectVal = false;
                    }
                }
                else if(index == $scope.selectSuperintendentModel.length-1) {
                    if(singleSelectVal) {
                        selectAllVal = true;
                        singleSelectVal = false;
                    }
                    else {
                        $scope.selectSuperintendentModel.splice(index,1);
                        selectAllVal = false;
                        singleSelectVal = true;
                    }
                }
            }
            else {

                if($scope.selectSuperintendentModel.length === $scope.allSuperintendentsData.length && !selectAllVal) {
                    $scope.selectSuperintendentModel.push("all");
                    selectAllVal = true;
                    singleSelectVal = false;
                }
                else {
                    selectAllVal = false;
                    singleSelectVal = true;

                }

            }
        }
        $scope.selectAllApp = selectAllVal;
        $scope.selectSingleApp = singleSelectVal;
        var selectAllValue = selectAllVal;
        if (selectAllValue) {
            $scope.selectSuperintendentModel=$scope.selectSuperintendentModel.concat($scope.allSuperintendentsData.map(function(e){
                return e.id;
            }));
        }
        else {
            if ($scope.selectSuperintendentModel != null && $scope.selectSuperintendentModel.length === $scope.allSuperintendentsData.length && $scope.selectSingleApp) {
                $scope.selectSuperintendentModel = [];
                // console.log(',,,,');
                $scope.allContractData = [];
                $scope.selectedContracts = [];
                if (!$scope.resurfacingApplicable) {
                    $scope.allDFRTemplateData = [];
                    $scope.selectDFRTemplateModel = [];
                }
            }
            if($scope.selectSuperintendentModel== null || ($scope.selectSuperintendentModel != null && $scope.selectSuperintendentModel.length==0)){
                $scope.allContractData = [];
                        $scope.selectedContracts = [];
                        if (!$scope.resurfacingApplicable) {
                            $scope.allDFRTemplateData = [];
                            $scope.selectDFRTemplateModel = [];
                        }
            }
        }
        if ($scope.selectSuperintendentModel != null && $scope.selectSuperintendentModel.length != 0) {
                // $scope.loadAllContracts($scope.selectSuperintendentModel);
        }
    }

    $scope.calendarEndDate = new Date();

    $scope.clickedSearchReport = function (formValid, formError) {
        if(angular.isDefined($scope.selectedStartDate) && angular.isDefined($scope.selectedEndDate) && $scope.selectedStartDate > $scope.selectedEndDate)
        {
            formValid=false;
        }
        if (formValid) {
            var approverSelected=[];
            // console.log($scope.selectSuperintendentModel);
            if($scope.userData.userType!='Reviewer'){
                approverSelected.push(+$scope.selectSuperintendentModel);
            }
            else{
                approverSelected=$scope.selectSuperintendentModel;
            }
            // console.log(approverSelected);
            $scope.SearchDFRReport($scope.selectedContracts,approverSelected,$scope.selectedStartDate,$scope.selectedEndDate,$scope.selectDFRTemplateModel) // Error is in here.
            .then(function (response) {
               $scope.dfrJobList=[];
               $scope.selectAllAdd = false;
               // Show only jobs by selected Formeman.
                // if($scope.selectedForeman.length != 0) {
                //     angular.forEach(response.data.activity, function(activity) {
                //         if($scope.selectedForeman.find(function(foreman) { return foreman == activity.foremanId }) == activity.foremanId){
                //             $scope.dfrJobList.push(activity);
                //         };
                //     });
                // } else {
                //     $scope.dfrJobList = response.data.activity;
                // }
                // console.log(response.data.activity);
                $scope.dfrJobList = response.data.activity;
                $scope.tempJobList = $scope.dfrJobList;
                $scope.dfrJobList;
                $scope.JobIds = [];
               angular.forEach($scope.dfrJobList, function(element) {
                   // console.log(element.jobId);
                   if(element.dfrTemplateId === 27) {
                       // console.log(element.dfrTemplateId);
                       var jobid = element.activityId;
                        $scope.JobIds.push(jobid);
                   }
               });
               // console.log($scope.JobIds);
               if($scope.selectDFRTemplateModel === 27) {
                if($scope.JobIds.length!=0) {
                    bulkDFRReportService.getAddresses($scope.JobIds)
                    .then(function(response){
                        // console.log(response.data);
                        $scope.Addresses = response.data.idAndAddress;
                        if($scope.Addresses.length != 0) {
                            $scope.dfrJobList = [];
                            $scope.isSelectAllDisabled = true;
                            $scope.isAllChkbx = true;
                        }

                    }
                    );
                    bulkDFRReportService.getWorkOrders($scope.JobIds)
                    .then(function(response){
                        $scope.WorkOrders = response.data.idAndworkOrders;
                        $scope.isWorkOrderStill = false;
                        $scope.isAllDfrSelected = false;
                        if($scope.WorkOrders.length != 0) {
                            $scope.dfrJobList = [];
                            $scope.isSelectAllDisabled = true;
                            $scope.isAllChkbx = true;
                        }

                    }
                    );
                }
               }

               if($scope.dfrJobList.length!=0){
                $scope.isAllChkbx=false;
               }
               $scope.isDownloadDisabled=true;
               $scope.isAllLaborSelected = false;
               $scope.isAllEquipmentSelected = false;
               $scope.isAllPayItemSelected = false;
               $scope.isAllForemanCmtSelected = false;
               $scope.isAllApproverCmtSelected = false;
               $scope.isAllImageAttachmentsSelected = false;
               angular.forEach($scope.dfrJobList,function(job) {
                   job.ShowDfr = false;
                   job.ShowLabor = false;
                   job.ShowEquipment = false;
                   job.ShowPayItem = false;
                   job.ShowApproverReviewerComments = false;
                   job.ShowForemanComments = false;
                   job.ShowImageAttachments = false;
                   job.ShowNotesbypayitem = false;
                   if (!$scope.resurfacingApplicable)
                   getWorkOrder(job);
               });
                if (!$scope.resurfacingApplicable) {
                    angular.forEach($scope.dfrJobList,function(job) {
                        job.disableLabor = true;
                        job.disableEquipment = true;
                        job.disablePayItem = true;
                        job.disableImageUpload = true;
                    });
                    angular.forEach($scope.dfrJobList,function(job) {
                        angular.forEach(job.mappingInfo,function(mapping) {
                            if(mapping.isActive) {
                                job['disable' + mapping.actionName.replace(/ /g,'')] = false;
                            } else {
                                job['disable' + mapping.actionName.replace(/ /g,'')] = true;
                            }
                        });
                    });
                }
                // console.log($scope.selectDFRTemplateModel);
               switch($scope.selectDFRTemplateModel){
                    case 2:
                    case 3:
                            $scope.isSpireApplicable = true;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                            break;
                    case 4:
                            $scope.isStandardDFRApplicable=true;
                            $scope.isSpireApplicable= false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = true;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                            break;
                    case 5:
                            $scope.isStandardDFRApplicable=true;
                            $scope.isSpireApplicable= false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 6:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = true;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 7:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = true;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 8:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = true;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 9:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = true;
                            $scope.standardNotVectren = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 12:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = true;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 14:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = true;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 17:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = true;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 18:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = true;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 19:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = true;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 20:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = true;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 21:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = true;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 22:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = true;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
                    case 23:
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isSpireApplicable= false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = true;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = true;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isTecoTampaApplicable = false;
                            break;
                    case 25:
                            $scope.isBHDfr = false;
                            $scope.isTnMDFR = false;
                            $scope.isSpireApplicable = true;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isTecoTampaApplicable = false;
                            break;
                    case 27:
                        $scope.isDteStandardDfr = true;
                        $scope.isSpireApplicable = false;
                        $scope.isStandardDFRApplicable=true;
                        $scope.isDteApplicable = false;
                        $scope.isNipscoApplicable = false;
                        $scope.isWglApplicable = false;
                        $scope.isWglVaApplicable = false;
                        $scope.standardNotVectren = true;
                        $scope.isPngApplicable = false;
                        $scope.isNashvilleDFRApplicable = false;
                        $scope.isXcelApplicable = false;
                        $scope.isPecoApplicable = false;
                        $scope.isPecoFLRApplicable = false;
                        $scope.AddressDropDown = true;
                        $scope.WorkOrderDropDown = true;
                        $scope.isTecoTampaApplicable = false;
                        break;
                    case 28:
                        $scope.resurfacingApplicable = false;
                        $scope.isBHDfr = true;
                        $scope.isTnMDFR = false;
                        $scope.isDteStandardDfr = false;
                        $scope.isSpireApplicable = false;
                        $scope.isStandardDFRApplicable=false;
                        $scope.isDteApplicable = false;
                        $scope.isNipscoApplicable = false;
                        $scope.isWglApplicable = false;
                        $scope.isWglVaApplicable = false;
                        $scope.standardNotVectren = false;
                        $scope.isPngApplicable = false;
                        $scope.isXcelApplicable = false;
                        $scope.isPecoApplicable = false;
                        $scope.isPecoFLRApplicable = false;
                        $scope.AddressDropDown = false;
                        $scope.WorkOrderDropDown = false;
                        $scope.isNashvilleDFRApplicable = false;
                        $scope.isTecoTampaApplicable = false;
                        break;
                        case 29:
                            $scope.resurfacingApplicable = false;
                            $scope.isBHDfr = true;
                            $scope.isTnMDFR = true;
                            $scope.isDteStandardDfr = false;
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isTecoTampaApplicable = false;
                            break;
                        case 31:
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isNashvilleDFRApplicable = true;
                            $scope.isTecoTampaApplicable = false;
                        break;
                        case 34:
                            $scope.isTecoTampaApplicable = true;
                            $scope.isSpireApplicable = false;
                            $scope.isStandardDFRApplicable=false;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isNashvilleDFRApplicable = false;
                        break;
                    default:
                            $scope.isSpireApplicable = false;
                            $scope.isNashvilleDFRApplicable = false;
                            $scope.isStandardDFRApplicable=true;
                            $scope.isDteApplicable = false;
                            $scope.isNipscoApplicable = false;
                            $scope.isWglApplicable = false;
                            $scope.isWglVaApplicable = false;
                            $scope.standardNotVectren = false;
                            $scope.isPngApplicable = false;
                            $scope.isXcelApplicable = false;
                            $scope.isPecoApplicable = false;
                            $scope.isPecoFLRApplicable = false;
                            $scope.AddressDropDown = false;
                            $scope.WorkOrderDropDown = false;
                            $scope.isTecoTampaApplicable = false;
                        break;
               }
               $scope.isAllDfrSelected = false;
               $scope.isSelectAllDisabled=true;
               $scope.isAllChkbx = true;
               if ($scope.dfrJobList.length) {
                $scope.isSelectAllDisabled=false;
                $scope.isAllChkbx = false;
               }
            })
        }
        else if (!formValid) {
            $scope.isDownloadDisabled=true;
            $scope.isAllChkbx=true;

            if(angular.isUndefined($scope.selectSuperintendentModel) || $scope.selectSuperintendentModel.length==0)
            notificationService.error($translate.instant("Approverisrequired"));

            if(angular.isUndefined($scope.selectedContracts) || $scope.selectedContracts.length==0)
            notificationService.error($translate.instant("Contractisrequired"));

            if(angular.isUndefined($scope.selectDFRTemplateModel) || $scope.selectDFRTemplateModel.length==0)
            notificationService.error($translate.instant("DFRTemplateisrequired"));

            if(angular.isUndefined($scope.selectedStartDate) || $scope.selectedStartDate=="")
                notificationService.error($translate.instant("Startdateisrequired"));

            if(angular.isUndefined($scope.selectedEndDate) || $scope.selectedEndDate=="")
                notificationService.error($translate.instant("Enddateisrequired"));

            if(angular.isDefined($scope.selectedStartDate) && angular.isDefined($scope.selectedEndDate) && $scope.selectedStartDate!="" &&$scope.selectedEndDate!=""&& $scope.selectedStartDate > $scope.selectedEndDate)
                notificationService.error($translate.instant("StartdateshouldbelesserthanEnddate"));

        }
    }
      $scope.GetSelectedDfr= function(job, sendMethod) {
        angular.element(document.getElementById("loadingGif")).hide();
        $scope.isDownloadDisabled = true;
        $scope.selectedDfrList = [];
        // console.log($scope.selectDFRTemplateModel);
        angular.forEach(job,function(eachJob) {
            if(($scope.selectDFRTemplateModel==4 || $scope.selectDFRTemplateModel==5) && !$scope.resurfacingApplicable && (eachJob.ShowDfr && (eachJob.ShowLabor ||eachJob.ShowEquipment ||eachJob.ShowPayItem))) {
                $scope.selectedDfrList.push(eachJob);
            }
            else if(($scope.selectDFRTemplateModel!=4 || $scope.selectDFRTemplateModel!=5) && (eachJob.ShowDfr)){
                $scope.selectedDfrList.push(eachJob);
            } else if($scope.selectDFRTemplateModel == 4 && $scope.resurfacingApplicable && (eachJob.ShowDfr && (eachJob.ShowCutSheets || eachJob.ShowRestoration || eachJob.ShowImageAttachments))) {
                $scope.selectedDfrList.push(eachJob);
            }
        });
        // console.log($scope.selectedDfrList);
        $scope.generateDfrReport(sendMethod);
    }
    $scope.generateDfrReport = function(sendMethod) {
        if (!validateDfrSelection()) return;
        requestDfrToken(true, sendMethod); // Get DFR with signature - New Tab action
      }
       // Validate DFR Selection
  function validateDfrSelection() {
    // Check for atleast 1 DFR template selection
    if($scope.selectedDfrList == null || $scope.selectedDfrList.length==0) {
      notificationService.warning($translate.instant(
        coreService.window.dfrConfig.atleastOneSelection
      ));
      return false;
    }
    // If Universal DFR is selected, check for atleast 1 sub selection
   else if ($scope.selectDFRTemplateModel==4 || $scope.selectDFRTemplateModel==5)
     {
      angular.forEach($scope.selectedDfrList,function(dfr){
         if(!dfr.ShowLabor && !dfr.ShowEquipment && !dfr.ShowPayItem && !dfr.ShowImageAttachments && !$scope.resurfacingApplicable){
            var message =
            $scope.selectDFRTemplateModel == 5
                ? coreService.window.dfrConfig.atleastOneUniversalDfrSelection
                : coreService.window.dfrConfig.atleastOneStandardDfrSelection;

            notificationService.warning($translate.instant(message));
            $scope.selectedDfrList=[];
            return false;
         } else if (!dfr.ShowRestoration && !dfr.ShowCutSheets && !dfr.ShowImageAttachments && $scope.resurfacingApplicable) {
            var message = coreService.window.dfrConfig.atleatOneResurfacingSelection;
            notificationService.warning($translate.instant(message));
            $scope.selectedDfrList=[];
            return false;
         }
      });
    }
    else if($scope.selectDFRTemplateModel === 27) {
        // console.log($scope.selectedAddress);
        var address = [];
        var workOrders = [];
        // console.log(address);
        angular.forEach($scope.selectedDfrList, function (dfr){
            angular.forEach($scope.selectedAddress, function(item){
                if(dfr.activityId === item.activityId) {
                    // console.log(dfr);
                    var add = item.address + ',' + item.activityId;
                    address.push(add);
                }
            });
            dfr.address = address;
            // console.log(dfr); 
            address=[];
        });
        angular.forEach($scope.selectedDfrList, function (dfr){
            angular.forEach($scope.selectedWorkOrder, function(item){
                if(dfr.activityId === item.activityId) {
                    // console.log(dfr);
                    var add = item.workOrder + ',' + item.activityId;
                    workOrders.push(add);
                }
            });
            dfr.workOrders = workOrders;
            // console.log(dfr);
            workOrders=[];
        });
    }
    return true;
  }
  function getWorkOrder(job){

    dfrService
    .getWorkOrderList(job.activityId)
    .then(function(data) {
        job.workorderList = data ? data.data.workOrderList : [];

    });

  }

  // Request DFR Token
  function requestDfrToken(param, sendMethod) {
    // Generate fileName and dateStamp for token generation
    var selectedDFRWithFileName = [];
    var count=0;
    var counter = 0;
    var listLength = 0;
    var FileLists=[];
    // console.log($scope.selectedDfrList);
    angular.forEach($scope.selectedDfrList,function(dfr){
        dfr.workOrderNumber = (angular.isUndefined(dfr.selectedWorkorder))?"All":dfr.selectedWorkorder;
        if(dfr.workOrderNumber == "")
            dfr.workOrderNumber = "All";
        if((dfr.workOrderNumber == "All") && ($scope.selectDFRTemplateModel == 2 || $scope.selectDFRTemplateModel == 3 || $scope.selectDFRTemplateModel == 7 ||
            $scope.selectDFRTemplateModel == 9 || $scope.selectDFRTemplateModel == 12 || $scope.selectDFRTemplateModel == 14 || $scope.selectDFRTemplateModel == 23 ||
            $scope.selectDFRTemplateModel == 25 || $scope.selectDFRTemplateModel == 17 || $scope.selectDFRTemplateModel == 18 || $scope.selectDFRTemplateModel == 19 ||
            $scope.selectDFRTemplateModel == 20 || $scope.selectDFRTemplateModel == 21 || $scope.selectDFRTemplateModel == 22)) {
            listLength = listLength + dfr.workorderList.length;
        } else {
            listLength = listLength + 1;
        }

    })
    angular.forEach($scope.selectedDfrList,function(dfr){
        count++;
        if((dfr.workOrderNumber == "All") && ($scope.selectDFRTemplateModel == 2 || $scope.selectDFRTemplateModel == 3 || $scope.selectDFRTemplateModel == 7 ||
            $scope.selectDFRTemplateModel == 9 || $scope.selectDFRTemplateModel == 12 || $scope.selectDFRTemplateModel == 14 || $scope.selectDFRTemplateModel == 23 ||
            $scope.selectDFRTemplateModel == 25 || $scope.selectDFRTemplateModel == 17 || $scope.selectDFRTemplateModel == 18 || $scope.selectDFRTemplateModel == 19 ||
            $scope.selectDFRTemplateModel == 20 || $scope.selectDFRTemplateModel == 21 || $scope.selectDFRTemplateModel == 22)) {
            angular.forEach(dfr.workorderList,function(dfrWorkOrder){
            var selectedDFRWithFileName = [];
                count++;
                dfr.workOrderNumber = dfrWorkOrder.workOrderNumber;
                if (!$scope.resurfacingApplicable){
                    // Getting last name from dfr.foremanName
                    var fmName = dfr.foremanName;
                    fmName = fmName.split(" ").pop(); // Find where there is a space.
                    fmName = fmName.split(".").pop(); // Find where there is a period.

                    // Reformat the date string inside dfr.activityDate in mmddyyyy
                    var jobActivityDate = dfr.activityDate.substring(0, dfr.activityDate.indexOf('T'));
                    var [yyyy, mm, dd] = jobActivityDate.split("-");
                    var formattedActivityDate = `${mm}${dd}${yyyy}`;
                    var file = bulkDFRReportService.generateFileName(dfr.activityId, count, fmName, formattedActivityDate);
                    // var file = bulkDFRReportService.generateFileName(dfr.activityId, count);
                } else {
                    // Getting last name from dfr.foremanName
                    var fmName = dfr.foremanName;
                    fmName = fmName.split(" ").pop(); // Find where there is a space.
                    fmName = fmName.split(".").pop(); // Find where there is a period.

                    // Reformat the date string inside dfr.activityDate in mmddyyyy
                    var jobActivityDate = dfr.activityDate.substring(0, dfr.activityDate.indexOf('T'));
                    var [yyyy, mm, dd] = jobActivityDate.split("-");
                    var formattedActivityDate = `${mm}${dd}${yyyy}`;

                    // var dateValue = dfr.activityDate.substring(0,dfr.activityDate.indexOf('T')).replace(/-/g, '');
                    var file = bulkDFRReportService.generateFileName(dfr.resurfacingId, count, fmName, formattedActivityDate);
                    // var file = bulkDFRReportService.generateFileName(dfr.resurfacingId, count);
                }

                if ($scope.selectDFRTemplateModel == 14) {
                    var fmName = dfr.foremanName;
                    fmName = fmName.split(" ").join("");
                    fmName = fmName.split("'").join("");
                    var dateValue = dfr.activityDate.substring(0,dfr.activityDate.indexOf('T')).replace(/-/g, '');
                    var workOrderValue = dfr.workOrderNumber.replace(/ /g, '');
                    file = bulkDFRReportService.generateFileNameForPECO(fmName,dateValue,dfr.jobNumber,workOrderValue);
                }
                var dfrFileName = {dfr:dfr, fileName:file};
                selectedDFRWithFileName.push(dfrFileName);
                processDfrRequest(selectedDFRWithFileName, param, listLength);
            })
        } else {
            var selectedDFRWithFileName = [];
            if (!$scope.resurfacingApplicable) {
                // Getting last name from dfr.foremanName
                var fmName = dfr.foremanName;
                fmName = fmName.split(" ").pop(); // Find where there is a space.
                fmName = fmName.split(".").pop(); // Find where there is a period.

                // Reformat the date string inside dfr.activityDate in mmddyyyy
                var jobActivityDate = dfr.activityDate.substring(0, dfr.activityDate.indexOf('T'));
                var [yyyy, mm, dd] = jobActivityDate.split("-");
                var formattedActivityDate = `${mm}${dd}${yyyy}`;

                 // var dateValue = dfr.activityDate.substring(0,dfr.activityDate.indexOf('T')).replace(/-/g, '');
                var file = bulkDFRReportService.generateFileName(dfr.activityId, count, fmName, formattedActivityDate);
                if ($scope.selectDFRTemplateModel == 14) {
                    var fmName = dfr.foremanName;
                    fmName = fmName.split(" ").join("");
                    fmName = fmName.split("'").join("");
                    var dateValue = dfr.activityDate.substring(0,dfr.activityDate.indexOf('T')).replace(/-/g, '');
                    var workOrderValue = dfr.workOrderNumber.replace(/ /g, '');
                    file = bulkDFRReportService.generateFileNameForPECO(fmName,dateValue,dfr.jobNumber,workOrderValue);
                }
            } else {
                // Getting last name from dfr.foremanName
                var fmName = dfr.foremanName;
                fmName = fmName.split(" ").pop(); // Find where there is a space.
                fmName = fmName.split(".").pop(); // Find where there is a period.

                // Reformat the date string inside dfr.activityDate in mmddyyyy
                var jobActivityDate = dfr.activityDate.substring(0, dfr.activityDate.indexOf('T'));
                var [yyyy, mm, dd] = jobActivityDate.split("-");
                var formattedActivityDate = `${mm}${dd}${yyyy}`;

                // var dateValue = dfr.activityDate.substring(0,dfr.activityDate.indexOf('T')).replace(/-/g, '');
                var file = bulkDFRReportService.generateFileName(dfr.resurfacingId, count, fmName, formattedActivityDate);
                // var file = bulkDFRReportService.generateFileName(dfr.resurfacingId, count);
            }
            var dfrFileName = {dfr:dfr, fileName:file};
            selectedDFRWithFileName.push(dfrFileName);
            // console.log(listLength);
            processDfrRequest(selectedDFRWithFileName, param, listLength);
        }
    });

    function processDfrRequest(selectedDFRWithFileName, param, length) {
    dateTimeStamp = dfrService.getDateTimeStamp();
    var DFRType = null;
    // console.log(selectedDFRWithFileName);
    switch ($scope.selectDFRTemplateModel) {
      case 1:
        dfrPath = 'dfr';
        break;
      case 3:
        dfrPath = 'dprhourlywork';
        DFRType = 'spirehourly';
        workOrderNumber = '1';
        break;
      case 2:
        dfrPath = 'mgedfr';
        DFRType = 'spirenew';
        workOrderNumber = '1';
        break;
      case 4:
        dfrPath = 'standarddfr';
        break;

      case 5:
        dfrPath = 'vectrendfr';
        DFRType = 'vectren';
        break;
      case 6:
        dfrPath = 'nipscodfr';
        DFRType = 'nipsco';
        break;
      case 7:
        dfrPath = 'dtedfr';
        DFRType = 'dte';
        break;
      case 8:
        dfrPath = 'wgldfr';
        DFRType = 'wgl';
        break;
      case 9:
        dfrPath = 'wglvablanketdfr';
        DFRType = 'wglvablanket';
        break;
      case 12:
        dfrPath = 'pngdfr';
        DFRType = 'png';
        break;
      case 13:
        dfrPath = 'spire24dfr';
        DFRType = 'spire24';
        break;
      case 14:
        dfrPath = 'pecodfr';
        DFRType = 'peco';
        break;
      case 13:
        dfrPath = 'spire24dfr';
        DFRType = 'spire24';
        break;
      case 23:
        dfrPath = 'xceldfr';
        DFRType = 'xcel';
        break;
      case 17:
        dfrPath = 'pecoflrdfr';
        DFRType = 'pecoflrunitsheetstreetlights';
        break;
      case 21:
        dfrPath = 'pecoflrdfr';
        DFRType = 'pecoflrunitsheetsuburbs';
        break;
      case 19:
        dfrPath = 'pecoflrdfr';
        DFRType = 'pecoflrunitsheetphillydigs';
        break;
      case 18:
        dfrPath = 'pecoflrdfr';
        DFRType = 'pecoflrtestreetlights';
        break;
      case 22:
        dfrPath = 'pecoflrdfr';
        DFRType = 'pecoflrtesuburbs';
        break;
      case 20:
        dfrPath = 'pecoflrdfr';
        DFRType = 'pecoflrtephillydigs';
        break;
      case 25:
        dfrPath = 'spireSewerCamdfr';
        DFRType = 'spiresewercamera';
        break;
      case 27:
        dfrPath = 'dtestandard';
        // console.log(dfrpath);
        break;
      case 28:
        dfrPath = 'blackhillsdfr';
        DFRType = 'bhdfr';
        break;
      case 29:
          dfrPath = 'tnedfr';
          break;
      case 31:
        dfrPath = 'nashvilledfr';
        DFRType = 'nashvilledfr';
          break;
      case 34:
        dfrPath = 'tecotampablanket';
        DFRType = 'tecotampablanket';
          break;
    }
    $scope.FilesToZip=[];
    // Get DFR token
    bulkDFRReportService
      .requestDfrToken(
        selectedDFRWithFileName,
        dateTimeStamp,
        param,
        DFRType,
        $scope.selectDFRTemplateModel
      )
      .then(function(response) {
        angular.element(document.getElementById("loadingGif")).hide();
           angular.forEach(response.data.dfrResponseList,function(res){
               var fileData={
                   'FileName':res.fileName,
                   'Token':res.tempToken
               }
               // console.log(fileData);
               FileLists.push(fileData);
               counter++;
               if(sendMethod == 1) {

               document.getElementById("loadingGif").style.display = 'block';
               $scope.fileCounter = 0;
               // console.log(res.fileName);
                 // console.log(res.tempToken);
              // $window.open(frameDfrUrlEachFile(res.fileName, res.tempToken), '_blank');
               var fileURL = frameDfrUrlEachFile(res.fileName, res.tempToken);

               var fileName = res.fileName;
               // console.log('loading gif');
               downloadFile(fileURL, fileName, length);
               notificationService.success($translate.instant("DownloadingisinprogressPleaseWait"));
               $scope.isDownloadDisabled = false;
               }
          });

      })
      .then(function() {
          if($scope.selectDFRTemplateModel === 27) {
              if(sendMethod == 0) {
                $scope.GetFiles(FileLists);
              }
          }
          else {
            if(counter == length && sendMethod == 0) {
                $scope.GetFiles(FileLists);
              }
          }
      });

    }
}

    function downloadFile(fileURL, fileName, length) {
        fetch(fileURL)
        //    .then(res => res.blob())
        .then(function(res) { return res.blob(); })
        // .then(blob => {
        //     $scope.fileCounter += 1;
        //     var link=document.createElement('a');
        //     link.href=window.URL.createObjectURL(blob);
        //     link.download = fileName;
        //     link.click();
        //     if($scope.fileCounter === length) {
        //         document.getElementById("loadingGif").style.display = 'none';
        //     }
        //    });
        .then(function(blob) {
            $scope.fileCounter += 1;
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            // console.log($scope.fileCounter);
            if($scope.fileCounter === length) {
                document.getElementById("loadingGif").style.display = 'none';
            }
           });
    }

  function frameDfrUrlEachFile(sourceFile, tempDfrToken) {
    // console.log(dfrPath);
    return $sce.trustAsResourceUrl(
      coreService.window.apiUrl +
        'foreman/activity/' +
        dfrPath +
        '/' +
        sourceFile +
        '?token=' +
        encodeURIComponent(tempDfrToken)
          .replace(/[!'()]/g, escape)
          .replace(/\*/g, '%2A')
    );
  }
  // To get the files from the URL and Zip it to a folder
  $scope.GetFiles = function(FileData){
    switch($scope.selectDFRTemplateModel){
        case 3:
            DFR_Type = 'Spire_Hourly';
        break;
        case 2:
            DFR_Type = 'Spire_New';
        break;
        case 4:
            DFR_Type = 'Standard_DFR';
          break;
        case 5:
            DFR_Type = 'Vectren_DFR';
          break;
        case 6:
            DFR_Type = 'Nipsco_DFR';
            break;
        case 7:
            DFR_Type = 'Dte_DFR';
            break;
        case 8:
            DFR_Type = 'Wgl_DFR';
            break;
        case 9:
            DFR_Type = 'Wglvablanket_DFR';
            break;
        case 12:
            DFR_Type = 'Png_DFR';
            break;
        case 13:
            DFR_Type = 'Spire24_DFR';
            break;
        case 14:
            DFR_Type = 'Peco_DFR';
            break;
        case 13:
            DFR_Type = 'Spire24_DFR';
            break;
        case 23:
            DFR_Type = 'Xcel_DFR';
            break;
        case 15:
            DFR_Type = 'Peco_Flr_DFR';
            break;
        case 16:
            DFR_Type = 'Peco_Flr_DFR';
            break;
        case 17:
            DFR_Type = 'Peco_Flr_DFR';
            break;
        case 18:
            DFR_Type = 'Peco_Flr_DFR';
            break;
        case 19:
            DFR_Type = 'Peco_Flr_DFR';
            break;
        case 20:
            DFR_Type = 'Peco_Flr_DFR';
            break;
        case 25:
            DFR_Type = 'Spire_Sewer_Camera_DFR';
            break;
        case 27:
            DFR_Type = 'dtestandard';
            // console.log(dfrpath);
            break;
        case 28:
            DFR_Type = 'bhdfr';
            break;
        case 29:
            DFR_Type = 'tnedfr'
            break;
        case 31:
            DFRType = 'nashvilledfr';
            break;
        case 34:
            DFRType = 'tecotampablanket';
            break;
        }
       var payload = {
        'FileList': FileData,
        'StartDate':$scope.selectedStartDate,
        'EndDate':$scope.selectedEndDate
       };

       bulkDFRReportService.SendZippedFiles( dfrPath ,payload)
       .then(function (response) {
        $scope.isDownloadDisabled = false;
        });
        notificationService.success($translate.instant("ThereportPDFwillbesentasanemailshortly"));
  }
  // To get the frameURL and add it to a list

$scope.downloadPdf = function (Files) {
        //var url=frameDfrUrl(fileName,dfrToken);
       var url= frameDfrUrl(Files);
       $scope.GetFiles(url);
        var UrlList={fileName:fileName,url:url};
        $scope.fileURL.push(UrlList);
        };
  // Frame DFR Url
  function frameDfrUrl(fileName) {
      var arrayFile=[];
      arrayFile.push(fileName);
    return $sce.trustAsResourceUrl(
      coreService.window.apiUrl +
        'reportQuery/' +
        dfrPath +
        '/' +
        arrayFile
    );
  }
    //When a user clicks on 'Resend' button
    $scope.clickedResend = function (exportReportID, companyCode, companyID, reportDate, fileName) {
        $scope.resendReport(exportReportID, companyCode, companyID, $scope.reportType, reportDate, $rootScope.userData.userID, fileName)
            .then(function (response) {
                switch (response.status) {
                    case 200: {
                        switch (response.data.status) {
                            case '0': {
                                notificationService.error($translate.instant(exportCtrlConfig.errorInExporting));
                            } break;
                            case '1': {
                                notificationService.success($translate.instant(exportCtrlConfig.exportSuccess));
                            }
                        }
                    } break;
                    default: {
                        notificationService.error($translate.instant(exportCtrlConfig.errorInExporting));
                    }
                }
            })
    }
    /*CL2IFS-20 End*/
    $scope.SearchDFRReport = function (contractId, superintendentId, selectedStartDate, selectedEndDate,dfrTemplate) {
        // console.log(superintendentId);
        if ($scope.resurfacingApplicable) {
            return bulkDFRReportService.getResurfacingDFRReport(contractId, superintendentId, selectedStartDate, selectedEndDate,dfrTemplate);
        } else {
            return bulkDFRReportService.getDFRReport(contractId, superintendentId, selectedStartDate, selectedEndDate,dfrTemplate);
        }
    }

    /*CL2IFS-20 End*/
    ////////////////////////////////////////////////////////////////////////////////////
    function handleContractChange() {
        // console.log($scope.selectedContracts);
        // return;
        bulkDFRReportService.getApprovers($scope.selectedContracts)
        .then(function(response) {
            $scope.allSuperintendentsData = [];
            // console.log(response.data);
            $scope.superintendents = response.data.superintendents;
            // $scope.allSuperintendentsData = response.data.superintendents;
            $scope.superintendents.forEach(function(superintendent) {
                $scope.allSuperintendentsData.push({id: superintendent.employeeId, label: superintendent.superintendentName})
            });
        });
        // foremanSettingsService.getSuperintendents(vm.Contract.contractId)
        //   .then(function(response) {
        //     vm.superintendents = response.data && response.data.superintendents
        //       ? response.data.superintendents
        //       : [];
        //     vm.superintendent = null;
        //   });
      }
    function retrieveNotifications() {
        vm.countNewNotifications = 0;
        // console.log(retrieveNotifications);
        return homeService.getNotifications()
          .then(function(response) {
            vm.notifications = response.data.notifications;
            vm.notifications.forEach(function(notification) {
              if (notification.isRead === false) vm.countNewNotifications ++;
            });
            homeService.activeNotifications = vm.countNewNotifications;
          });
      }
    //Initialize objects
    $scope.initializeBulkDFRReportData();
    /*Dev1 - CL2IFS-20 - 22/02*/
    //get List of Approvers
                $scope.getApproverContractList($scope.userData.userID)
                .then(function(response){
                    $scope.allDFRTemplateData=[];
                    $scope.DFRTemplates = [];
                    $scope.selectDFRTemplateModel="";
                    $scope.allContractData = [];
                $scope.selectedContracts = [];
                    if (response.status == 200) {
                        // console.log($scope.userData.userType);
                        var userId=0;
                        if($scope.userData.userType ==='Reviewer'){
                            $scope.superintendents = response.data.superintendentMapped;
                            $scope.isDropDownDisabled = false;
                            $scope.isRevenueExport = false;

                        }
                        else if($scope.userData.userType === 'EXPORT_REVENUE') {
                            $scope.superintendents = response.data.superintendentMapped;
                            $scope.isDropDownDisabled = false;
                            $scope.isRevenueExport = true;
                        }
                        else{
                            $scope.superintendents = response.data.superintendentList;
                            userId = $scope.userData.userID;
                            $scope.isDropDownDisabled = true;
                            $scope.isRevenueExport = false;
                        }
                        $scope.superintendents.forEach(function(superintendent) {
                            $scope.allSuperintendentsData.push({id: superintendent.superintendent_ID, label: superintendent.superintendent_Name})
                        });

                        $scope.contracts = response.data.contractList;
                        $scope.foreman = response.data.foremanList;
                        var index=0;
                        if($scope.userData.userType !='Reviewer'){
                            index = $scope.allSuperintendentsData.findIndex(function(record) { return record.id === userId; });
                            $scope.selectSuperintendentModel.push($scope.allSuperintendentsData[index].id);
                            if ($scope.selectSuperintendentModel != null && $scope.selectSuperintendentModel.length != 0) {
                                $scope.loadAllContracts($scope.selectSuperintendentModel);
                        }
                        }
                        // $scope.selectedCompanyModel =$scope.superintendents[0].companyCode_Selected;

                    }
                    else if (response.status == 404) {
                        $scope.superintendents = [];
                        notificationService.error($translate.instant(exportCtrlConfig.noSuperintendentsAvailable));
                    }
                    else if (response.status == 417) {
                        $scope.superintendents = [];
                        notificationService.error($translate.instant(exportCtrlConfig.errorFetchingSuperintendets));
                    }

                    if($scope.allSuperintendentsData.length!=0)
                        $scope.isEmptyUserList=false;
                });

    /*CL2IFS-20 End*/
}