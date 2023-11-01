/**  
* @description       : This class used to Upload Documents against Account for Account On-boarding.
* @author            : Satish Tiware(satish.tiware@skinternational.com).
* @last modified on  : 10th Oct 2023.
* @last modified by  : Satish Tiware(satish.tiware@skinternational.com).
**/

public with sharing class DistributorOnboardingController {
    
    /** 
    * @description : Create Distributor Documents and related file using AccountId,file parameters and record parameters.
    * @param       : recName,recDescription,base64Data,fileName,recId 
    * @return      : returns Singke created Distributor Document Record.
    **/   
        @AuraEnabled
        public static String createRecWithFile(String formFile) {
    
             RecWithfileWrapperClass recWithfileWrapperClassObj = (RecWithfileWrapperClass)JSON.deserialize(formFile,RecWithfileWrapperClass.class);
            
             Distributor_Document__c.sObjectType.getDescribe().isCreateable();
             Distributor_Document__c distributorDoc = new Distributor_Document__c (Distributor__c = recWithfileWrapperClassObj.recId,
                                                                                  Name = recWithfileWrapperClassObj.recName,
                                                                                  Document_Type__c = recWithfileWrapperClassObj.recName,
                                                                                  Description__c = recWithfileWrapperClassObj.recDescription
                                                                                 );
            
            insert distributorDoc;
           
          
            ContentVersion.sObjectType.getDescribe().isCreateable();
            ContentVersion contentVersionRec = new ContentVersion();  
            contentVersionRec.Title = recWithfileWrapperClassObj.fileName.subStringBeforeLast('.');  
            contentVersionRec.PathOnClient = recWithfileWrapperClassObj.fileName;  
            contentVersionRec.VersionData = EncodingUtil.base64Decode(recWithfileWrapperClassObj.base64Data);  
            contentVersionRec.IsMajorVersion = true;  
            Insert contentVersionRec;  
            
            Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:contentVersionRec.Id].ContentDocumentId;
            
            ContentDocumentLink.sObjectType.getDescribe().isCreateable();
            ContentDocumentLink conDocLink = New ContentDocumentLink();
            conDocLink.LinkedEntityId = distributorDoc.Id; 
            conDocLink.ContentDocumentId = conDoc;  
            conDocLink.shareType = 'V';
            try {
                insert conDocLink;
            } 
            catch(DMLException e) {
                System.debug(e);
                return null;
            }
            return distributorDoc.Id;
            
        }    
    
        
        
        
    /**
    * @description : Fetching DistributorDocument records using respective Account Id.
    * @param       : accountId 
    * @return      : returns DistributorDocument records Details.
    **/   
        @AuraEnabled
        public static List<Distributor_Document__c> getRecords(String accountId) {
            
           
            List<Distributor_Document__c> docList = [SELECT Id, Name,Distributor__c,Distributor__r.Name,Description__c 
                                                     FROM Distributor_Document__c 
                                                     where Distributor__c =:accountId WITH SECURITY_ENFORCED];
            
            return docList;
        }
        
        
    /**
    * @description : Fetching ContentVersion record using respective DistributorDocument Id.
    * @param       : distributorDocID 
    * @return      : returns ContentVersion records Details
    **/   
        @AuraEnabled
        public static ContentVersion getContentDetails(String distributorDocID) {
            
            ContentDocumentLink.SObjectType.getDescribe().isAccessible();
            List<ContentDocumentLink> contentDocumentList = [SELECT ContentDocumentId, LinkedEntityId 
                                                             FROM   ContentDocumentLink 
                                                             WHERE  LinkedEntityId =: distributorDocID];
            Set<Id> contentDocumentId = new Set<Id>();
            
            for(ContentDocumentLink cdl : contentDocumentList){
                contentDocumentId.add(cdl.ContentDocumentId);
                
                
            }
            
            ContentVersion contentVersionList = [SELECT Id, VersionData, FileType, Title, FileExtension,
                                                 ContentDocument.CreatedBy.Name, ContentDocument.ContentSize,
                                                 CreatedDate, ContentDocumentId, ContentDocument.FileType
                                                 FROM   ContentVersion 
                                                 WHERE  ContentDocumentId IN : contentDocumentId WITH SECURITY_ENFORCED LIMIT 1];
            if(contentVersionList != null){
                return contentVersionList;
            }else
            {
                return null;
            }
            
        }
        
    /**
    * @description : Fetching Custom Metadata record i.e.KYC_Doc_Configuration__mdt.
    * @param       : No 
    * @return      : returns KYC_Doc_Configuration__mdt records Details
    **/   
        @AuraEnabled(Cacheable=true)
        public static List<String> mandatoryFiles(){
            
            KYC_Doc_Configuration__mdt.SObjectType.getDescribe().isAccessible();
            KYC_Doc_Configuration__mdt kycDoc = [SELECT Id, DeveloperName, Value__c 
                                                 FROM KYC_Doc_Configuration__mdt
                                                 WHERE DeveloperName ='Account_KYC' LIMIT 1];
            
            List<String> str = String.valueOf(kycDoc.Value__c).split(',');
            
            return str;
        }
    
        public class RecWithfileWrapperClass
        {
            @AuraEnabled
            public string recId{get;set;} 
    
            @AuraEnabled
            public string recName{get;set;}
    
            @AuraEnabled
            public string recDescription{get;set;}
    
            @AuraEnabled
            public string base64Data{get;set;}
    
            @AuraEnabled
            public string fileName{get;set;}
    
        }
    }