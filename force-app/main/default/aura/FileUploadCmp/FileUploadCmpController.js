({
    doInit: function (component, event,helper) {
        
        // Get the list of uploaded files
        var surveyRecordId = component.get('v.Survey_RecordId');
        console.log('surveyRecordId----'+surveyRecordId);
        component.set('v.Store_Survey_RecordId',surveyRecordId);
        if(!component.get("v.callFromVf")){
        	helper.availableFlowActions(component,event,helper);
        }
        //if(component.get("v.Survey_RecordId") != undefined){
            helper.loadDistributorDocuments(component,event,helper);  
            helper.fetchPickListVal(component, 'Documents_Type__c','documentType');
        //}
    },
    handleFilesChange: function(component, event, helper) {
        var fileName = 'No File Selected..';
        component.set("v.Spinner", true); 
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
            helper.uploadHelper(component, event);
        }
    },
    handleUploadFinished: function (component, event,helper) {
        // Get the list of uploaded files
        
        var surveyRecordId = component.get('v.Survey_RecordId');
        // component.set('v.Sample_Survey_RecordId',surveyRecordId);
        var AccountId = component.get('v.AccountId');
        //alert(AccountId);
        var uploadedFiles = event.getParam("files");
        var DocumentType = component.find('documentType').get("v.value");
        //alert(uploadedFiles[0].documentId);
        var uploadedDocumentList = component.get('v.Uploaded_DocumentList');
        uploadedDocumentList.push({
            
            "Document_Name__c":uploadedFiles[0].name,
            "AttachmentId__c":uploadedFiles[0].documentId,
            "Survey__c":surveyRecordId,
            "Documents_Type__c":DocumentType,
            "Distributor__c":AccountId
        });
        component.set('v.Uploaded_DocumentList',uploadedDocumentList);
        console.log(uploadedDocumentList);
        console.log('file Name'+uploadedFiles[0].name);
        console.log('document Id'+uploadedFiles[0].documentId);
        component.find("documentType").set("v.value","");
        component.set('v.Survey_RecordId',null);
        
    },
    removeRow:function (component, event) {
        var target = event.target;
        var RowIndex = target.getAttribute("data-selected-Index");   
        var UploadedDocumentList = component.get('v.Uploaded_DocumentList');
        console.log(UploadedDocumentList);
        // helper.deleteuploadedDocument(component,event,helper);
        
        
        var DeleteUploadedDocumentList = component.get('v.DeleteUploaded_DocumentList'); 
        UploadedDocumentList.forEach((element, index) => {
            if(index == RowIndex)
            {
            DeleteUploadedDocumentList.push(UploadedDocumentList[index]);
            console.log(DeleteUploadedDocumentList);
        }
                                     });
        
        component.set('v.DeleteUploaded_DocumentList',DeleteUploadedDocumentList);
        console.log("DeleteUploadedDocumentList");
        console.log(DeleteUploadedDocumentList);
        UploadedDocumentList.splice(RowIndex, 1);
        component.set('v.Uploaded_DocumentList',UploadedDocumentList);
        
        
    },
    onButtonPressed: function(component, event, helper) {
        if(component.get("v.callFromVf")){
        	component.set("v.Spinner", true); 
        }
        // Figure out which action was called
        var actionClicked = event.getSource().getLocalId();
        console.log('actionClicked==='+actionClicked);
        // Fire that action
        if(actionClicked == 'NEXT' || actionClicked == 'BACK')
        {
            helper.createDistributorDocument(component,event,helper);
            helper.deleteDistributorDocument(component,event,helper);
            helper.InsertAttachmentInSurveyObj(component,event,helper);
        }
        if(component.get("v.callFromVf")){
            
            var action = component.get("c.getUIThemeDescription");
                    action.setCallback(this, function(a) {
                        if(a.getReturnValue()=='Theme3' ||'Theme2'){
                            //alert("Lightning Components can be rendered in Salesforce Classic using Lightning Components for Visualforce");
                            window.location.href =  '/'+component.get("v.Store_Survey_RecordId") ;
                        }else if(a.getReturnValue()=='Theme4d' || a.getReturnValue()=='Theme4t'){
                            //alert("Lightning Components can be rendered natively within Lightning Experience or, alternatively, within a Visualforce Page or within a Lightning Application.");
                            window.location.href =  '/r/Axedasurvey__c/'+component.get("v.Store_Survey_RecordId")+'/view' ;
                        }
                    });
                    $A.enqueueAction(action);
        }else{
            var navigate = component.get('v.navigateFlow');
        	navigate(actionClicked); 
        }
    },
    checkDuplicateDocType:function(component,event,helper) {
        var uploadedDocList = component.get('v.Uploaded_DocumentList');
        var DocumentType = component.find("documentType").get("v.value");
        var surveyRecordId = component.get('v.Store_Survey_RecordId'); 
        
        if(DocumentType != '')
        {
            component.set('v.Survey_RecordId',surveyRecordId);
        }
        else
        {
            component.set('v.Survey_RecordId',null);
        }
        var count = 0;
        
        if(DocumentType != '')
        {
            uploadedDocList.forEach((element, index) => {
                console.log("none before---"+component.find("documentType").get("v.value")); 
                if(DocumentType == element.Documents_Type__c)
                {
                alert(DocumentType+' already uploaded');
                component.find("documentType").set("v.value","");
                
                count++;
            }
                else
                {
                component.set('v.Survey_RecordId',surveyRecordId);
            }
                
            });
                if(count ==1)
                {
                component.set('v.Survey_RecordId',null);
            }
            }  
            }  
                
            })