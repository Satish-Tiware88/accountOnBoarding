({
	createDistruitorTemplate : function(component,event,helper) {
         var self = this;
        component.find("DistributorDocumentRecordCreator").getNewRecord(
            "DistributorDocument__c", // sObject type (objectApiName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(function() {
                var rec = component.get("v.DistributorDocument");
                var error = component.get("v.DistributorDocumentError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                
                console.log("Record template initialized: " + rec.apiName);
                self.createDistributorDocument(component,event,helper);
            })
        );	
        
	},
    createDistributorDocument : function(component,event,helper){
        var DistributorDocList = component.get('v.Uploaded_DocumentList');
        console.log("DistributorDocList");
        console.log(DistributorDocList);
        var action = component.get("c.createDistributorDoc");
        action.setParams({
        "DistributorDocList" : DistributorDocList   
        });
        action.setCallback(this, function(response){
            console.log(response.getReturnValue());
           // component.set("v.CatCodeLineItemList",rowItemList);    
        }); 
    $A.enqueueAction(action);  
       /* console.log('Survey__c-->'+component.get("v.Survey_RecordId"));
        component.set("v.DistributorDocumentFields.Survey__c", component.get("v.Survey_RecordId"));
         component.set("v.DistributorDocumentFields.Distributor__c",component.get("v.AccountId"));
      //  component.set("v.DistributorDocumentFields.Survey__c", component.get("v.Survey_RecordId"));
       console.log('Survey__c field-->'+component.get("v.DistributorDocumentFields.Survey__c"));
        component.find("DistributorDocumentRecordCreator").saveRecord(function(saveResult) {
            
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                console.log(saveResult.recordId);
                component.set('v.Distributer_Document_RecordId',saveResult.recordId);
                console.log('saveResult.state-->'+saveResult.state);
                // record is saved successfully
                var resultsToast = $A.get("e.force:showToast");
                resultsToast.setParams({
                    "title": "Saved",
                    "message": "The record was saved."
                });
                resultsToast.fire();
                
            } else if (saveResult.state === "INCOMPLETE") {
                // handle the incomplete state
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                // handle the error state
                console.log('Problem saving contact, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }); */  
    },
    availableFlowActions:function(component,event,helper)
    {
        
     var availableActions = component.get('v.availableActions');
      for (var i = 0; i < availableActions.length; i++) {
         if (availableActions[i] == "PAUSE") {
            component.set("v.canPause", true);
         } else if (availableActions[i] == "BACK") {
            component.set("v.canBack", true);
         } else if (availableActions[i] == "NEXT") {
            component.set("v.canNext", true);
         } else if (availableActions[i] == "FINISH") {
            component.set("v.canFinish", true);
         }
      }
    },
    loadDistributorDocuments:function(component,event,helper)
    {
        console.log("DistributorDocList");
		var DistributorDocList = component.get('v.Uploaded_DocumentList');
        console.log("accountid=="+component.get("v.AccountId"));
        console.log('surveyId==='+component.get("v.Survey_RecordId"));
        var action = component.get("c.loadDistributorDoc");
        action.setParams({
            "SurveyId" :component.get("v.Survey_RecordId"),
            "AccountId":component.get("v.AccountId")
        });
        action.setCallback(this, function(response){
        component.set("v.Uploaded_DocumentList",response.getReturnValue());
            //alert('response.getReturnValue()=='+response.getReturnValue());
        component.set('v.Survey_RecordId',null);
        }); 
       $A.enqueueAction(action);
    },
    deleteDistributorDocument:function(component,event,helper)
    {
        console.log('deleting docs');
        var DeletedDistributorDocList = component.get('v.DeleteUploaded_DocumentList');
        console.log('deleted record--->'+DeletedDistributorDocList);
        var action = component.get("c.DeleteDistributorDocuments");
        action.setParams({
            "DeletedDocumentList":DeletedDistributorDocList
        });
        action.setCallback(this, function(response){
        console.log('record state'+response.getState());
        console.log('deleted record'+response.getReturnValue());
        if(response.getReturnValue() == true)
        {
          //  alert('deleted Successfully');
        }
        else
        {
         //   alert('error occurred');
        }
            
        }); 
       $A.enqueueAction(action);
    },
    fetchPickListVal: function(component, fieldName, elementId) {
        var action = component.get("c.getselectOptions");
        action.setParams({
            "objObject": component.get("v.objInfo"),
            "fld": fieldName
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                   opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find(elementId).set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
    InsertAttachmentInSurveyObj:function(component,event,helper)
    {
       
        var DistributorDocList = component.get('v.Uploaded_DocumentList');
        var surveyId = component.get("v.Store_Survey_RecordId");
        component.set("v.Survey_RecordId",surveyId);
         console.log("DistributorDocList surveyObj");
        console.log(DistributorDocList);
        var action = component.get("c.InsertAttachmentInSurvey");
        action.setParams({
            "DistributorDocList":DistributorDocList,
            "SurveyId" :component.get("v.Survey_RecordId"),
         });
        action.setCallback(this, function(response){
        console.log(response.getState());
        console.log(response.getReturnValue());
            
        }); 
       $A.enqueueAction(action);
    },
    
    MAX_FILE_SIZE: 4500000, //Max file size 4.5 MB 
    CHUNK_SIZE: 750000,      //Chunk Max size 750Kb 
    
    uploadHelper: function(component, event) {
        var fileInput = component.find("fileId").get("v.files");
        var file = fileInput[0];
        var self = this;
        if (file.size > self.MAX_FILE_SIZE) {
            component.set("v.fileName", 'Alert : File size cannot exceed ' + self.MAX_FILE_SIZE + ' bytes.\n' + ' Selected file size: ' + file.size);
            return;
        }
 
        // create a FileReader object 
        var objFileReader = new FileReader();
        // set onload function of FileReader object   
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
 
            fileContents = fileContents.substring(dataStart);
            // call the uploadProcess method 
            self.uploadProcess(component, file, fileContents);
        });
 
        objFileReader.readAsDataURL(file);
    },
 
    uploadProcess: function(component, file, fileContents) {
        // set a default size or startpostiton as 0 
        var startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
 
        // start with the initial chunk, and set the attachId(last parameter)is null in begin
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
 
 
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        // call the apex method 'saveChunk'
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveChunk");
        action.setParams({
            parentId: component.get('v.Survey_RecordId'),
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });
 
        // set call back 
        action.setCallback(this, function(response) {
            // store the response / Attachment Id   
            attachId = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                } else {
                    //alert(response.getReturnValue());
                    var action = component.get("c.convertAttachmentToFile");
                    action.setParams({
                        AttachmentId: response.getReturnValue()
                    });
                    action.setCallback(this, function(a) {
                        if (state === "SUCCESS") {
                            //alert('your File is uploaded successfully'+a.getReturnValue());
                            component.set("v.Spinner", false); 
                            var uploadedDocumentList = component.get('v.Uploaded_DocumentList');
                            uploadedDocumentList.push({
                                
                                "Document_Name__c":file.name,
                                "AttachmentId__c": a.getReturnValue(),
                                "Survey__c": component.get('v.Survey_RecordId'),
                                "Documents_Type__c": component.find('documentType').get("v.value"),
                                "Distributor__c": component.get('v.AccountId')
                            });
                            component.set('v.Uploaded_DocumentList',uploadedDocumentList);
                            console.log(uploadedDocumentList);
                            console.log('file Name'+uploadedFiles[0].name);
                            console.log('document Id'+ a.getReturnValue().ContentDocumentId);
                            component.find("documentType").set("v.value","");
                            component.set('v.Survey_RecordId',null);
                            
                        }
                    });
                    $A.enqueueAction(action);
                }     
            } else if (state === "INCOMPLETE") {
                console.log("From server: " + response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        // enqueue the action
        $A.enqueueAction(action);
    }
    
})