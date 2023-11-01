public without Sharing class ContentDocumentLinkSelector extends LibSObjectSelector{


    public Schema.SObjectType getSObjectType(){
        return ContentDocumentLink.SObjectType;
    }
    
    /**
    * @description:This method is used to define all the fields of Object
    * @return List<Schema.SObjectField>
    */
    public List<Schema.SObjectField> getSObjectFieldList(){
        return new List<Schema.SObjectField> {
            ContentDocumentLink.Id,
                ContentDocumentLink.LinkedEntityId,
                ContentDocumentLink.ContentDocumentId
                };
            }
    
    /**
    * @description:This method is used to get all the fields Based on Monitor Log Id.
    * @param  monitorId: get the Monitor Record based on Monitor Log Id.
    * @return List<Schema.SObjectField>
    */   
    public ContentDocumentLink selectById(String monitorId){
        LibQueryFactory query = newQueryFactory();
        query.setCondition('LinkedEntityId=:monitorId');
        System.debug('Query is'+query.toSOQL());
        return Database.query( query.toSOQL());    
    }   
        
    /**
    * @description : Fetching ContentVersion record using respective DistributorDocument Id.
    * @param       : distributorDocID 
    * @return      : returns ContentVersion records Details
    **/ 
        
        public List<ContentDocumentLink> getContentDetails(String distributorDocID){
        LibQueryFactory query = newQueryFactory();
        query.setCondition('LinkedEntityId=:distributorDocID');
        System.debug('Query is'+query.toSOQL());
        return Database.query( query.toSOQL());    
    }   
    }