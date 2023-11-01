public class KycDocConfigSelector extends LibSObjectSelector {
    
    public Schema.SObjectType getSObjectType(){
        return KYC_Doc_Configuration__mdt.SObjectType;
    }
    
    public List<Schema.SObjectField> getSObjectFieldList(){
        return new List<Schema.SObjectField> {
            KYC_Doc_Configuration__mdt.Id,
                KYC_Doc_Configuration__mdt.DeveloperName,
                KYC_Doc_Configuration__mdt.Value__c
                };
                    }
    
    public KYC_Doc_Configuration__mdt mandatoryFiles(){
        LibQueryFactory query = newQueryFactory();
        query.setCondition('DeveloperName = Account_KYC LIMIT 1');
        System.debug('Query is'+query.toSOQL());
        return Database.query( query.toSOQL());    
    }

}