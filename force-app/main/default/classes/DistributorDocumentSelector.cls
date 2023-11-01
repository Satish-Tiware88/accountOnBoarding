public without Sharing class  DistributorDocumentSelector extends LibSObjectSelector{
    public Schema.SObjectType getSObjectType(){
        return Distributor_Document__c.SObjectType;
    }
    
    public List<Schema.SObjectField> getSObjectFieldList(){
        return new List<Schema.SObjectField> {
            Distributor_Document__c.Id,
                Distributor_Document__c.Name,
                Distributor_Document__c.Distributor__c,
                Distributor_Document__c.Distributor__r.Name,
                Distributor_Document__c.Description__c
                };
                    }
    
    public List<Distributor_Document__c> getRecords(String accountId){
        LibQueryFactory query = newQueryFactory();
        query.setCondition('Distributor__c =:accountId');
        System.debug('Query is'+query.toSOQL());
        return Database.query( query.toSOQL());    
    }
}