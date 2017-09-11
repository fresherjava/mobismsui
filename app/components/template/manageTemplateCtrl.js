angular
    .module('altairApp')
    .controller('manageTemplateCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        'pagerService',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,pagerService) {
            
            $scope.pagination = {};
            $scope.page = 1;
            //$scope.no_of_data = 5;
            $scope.sr_no = 0;

            $scope.no_of_data = {
                options: [
                    {
                        id: 1,
                        title: "5",
                        value: "5",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "10",
                        value: "10",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "25",
                        value: "25",
                        parent_id: 1
                    },
                    {
                        id: 4,
                        title: "50",
                        value: "50",
                        parent_id: 1
                    },
                    {
                        id: 5,
                        title: "100",
                        value: "100",
                        parent_id: 1
                    }
                ]
            };

            $scope.no_of_data_config = {
                create: false,
                maxItems: 1,
                placeholder: 'No of data per page',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };

            $scope.data_per_page = $scope.no_of_data.options[0].value;
           
                                  
            $scope.template = {};
            $scope.getData = function(page){   
                //alert(page);             
                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);
                
                var getSender = "getAllTemplate/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page; 

                //console.log(getSender);               

                apiGetData.async(getSender).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userTemplateData = $scope.data.data.template_data;
                        //console.log($scope.data.data);
                        $scope.pagination = pagerService.GetPager($scope.data.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);

                        
                    }
                });
            }

            $scope.getData($scope.page);


            $scope.deleteTemplate = function(id){   
                alert(id);
                UIkit.modal.confirm('Are you sure want to delete this group?', function(){                     
                    var deleteSenderData = "deleteTemplate/"+id;

                    apiGetData.async(deleteSenderData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Deleted Successfully');
                            modal.show();
                           // getData();
                            setTimeout(function(){
                                modal.hide();
                               getData();
                               
                            },3000);
                        }
                    });
                });                
            };
            $scope.template = {};
            $scope.getTemplateDetails = function(id){  
                $scope.part1Count = 160
                var getTemplateData = "getTemplateById/"+id;
                $scope.templateData = {};
                apiGetData.async(getTemplateData).then(function(d) {                    
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.templateData = $scope.data.data;
                        $scope.template.id =  $scope.templateData[0].id;                  
                        $scope.template.name =  $scope.templateData[0].name;
                        $scope.template.description =  $scope.templateData[0].description;

                        $scope.part1Count = 160;
                        $scope.part2Count = 146;
                        $scope.part3Count = 153;
                        var chars = $scope.template.description.length;

                        if (chars <= $scope.part1Count) {
                            $scope.messagesCount = 1;
                            $scope.remainingCount = $scope.part1Count - chars;
                        } else if (chars <= ($scope.part1Count + $scope.part2Count)) { 
                            $scope.messagesCount = 2;
                            $scope.remainingCount = $scope.part1Count + $scope.part2Count - chars;
                        } else if (chars > ($scope.part1Count + $scope.part2Count)) { 
                            moreM = Math.ceil((chars - $scope.part1Count - $scope.part2Count) / $scope.part3Count) ;
                            $scope.remainingCount = $scope.part1Count + $scope.part2Count + (moreM * $scope.part3Count) - chars;
                            $scope.messagesCount = 2 + moreM;

                            if($scope.messagesCount > 10)
                            {
                                alert("Counts of message not more than 10.");
                                return false;                        
                            }
                        }
                        $scope.totalCount = chars;

                        console.log($scope.templateData);                        
                    }
                });
            };
            $scope.updateTemplate = function(template,id){
                var templateData = JSON.stringify(template);               
                var updateTemplate = "updateTemplateById/"+id;

                apiPostData.async(updateTemplate, templateData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Updated Successfully');
                            modal.show();
                           // getData();
                            setTimeout(function(){
                                modal.hide();
                                getData();
                               
                        },3000);
                        
                    }
                    else if($scope.data.code == 400)
                    {
                        UIkit.modal.alert('Somethig Going Worng........');
                    }
                });
            };
            $scope.messagesCount = 0;
            $scope.remainingCount = 0;
            $scope.totalCount = 0;

            $scope.messageCount = function(){
                $scope.part1Count = 160;
                $scope.part2Count = 146;
                $scope.part3Count = 153;
              // alert($scope.template.description);
                if($scope.template.description == undefined){

                    
                    $scope.messagesCount = 0;
                    $scope.remainingCount = 0;
                    $scope.totalCount = 0;
                    return false;
                }
                
                var chars = $scope.template.description.length;

                if (chars <= $scope.part1Count) {
                    $scope.messagesCount = 1;
                    $scope.remainingCount = $scope.part1Count - chars;
                } else if (chars <= ($scope.part1Count + $scope.part2Count)) { 
                    $scope.messagesCount = 2;
                    $scope.remainingCount = $scope.part1Count + $scope.part2Count - chars;
                } else if (chars > ($scope.part1Count + $scope.part2Count)) { 
                    moreM = Math.ceil((chars - $scope.part1Count - $scope.part2Count) / $scope.part3Count) ;
                    $scope.remainingCount = $scope.part1Count + $scope.part2Count + (moreM * $scope.part3Count) - chars;
                    $scope.messagesCount = 2 + moreM;

                    if($scope.messagesCount > 10)
                    {
                        alert("Counts of message not more than 10.");
                        return false;                        
                    }
                }
                $scope.totalCount = chars;
            }
        }
    ]);