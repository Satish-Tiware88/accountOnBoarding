/**
 * @description       : This Class is used Query on Content Version Object.                                          
 * @author            : prashant.kumbhar@skinternational.com
 * @last modified on  : 10-11-2023
 * @last modified by  :  prashant.kumbhar@skinternational.com
**/

public without Sharing class ContentVersionSelector extends LibSObjectSelector{

public Schema.SObjectType getSObjectType(){
    return ContentVersion.SObjectType;
}

/**
* @description:This method is used to define all the fields of Object.
* @return List<Schema.SObjectField>
*/   
public List<Schema.SObjectField> getSObjectFieldList(){
    return new List<Schema.SObjectField> {
        ContentVersion.Id,
            ContentVersion.Title,
            ContentVersion.ContentDocumentId,
            ContentVersion.VersionData,
            ContentVersion.ContentDocument.FileType,
            ContentVersion.FileType,
            ContentVersion.Title,
            ContentVersion.FileExtension,
            ContentVersion.ContentDocument.Id,
            ContentVersion.ContentDocument.ContentSize,
            ContentVersion.CreatedDate
            };
        }

/**
* @description:This method is used to get all fields with the help of Id.
* @param  docId: get the Content Version Records based on document Id.
* @return ContentVersion
*/   
public ContentVersion selectById(id docId){
    LibQueryFactory query = newQueryFactory();
    query.setCondition('ContentDocumentId=:docId');
    System.debug('Query is'+query.toSOQL());
    return Database.query( query.toSOQL());    
}
    
    public List<ContentVersion> selectContentVersion(Set<Id> contentDocId,List<String> fields){
    LibQueryFactory query = newQueryFactory();
    query.setCondition('ContentDocumentId IN : contentDocId');
        for(String fd : fields){
            query.selectField(fd); 
        }
   
    System.debug('Query is'+query.toSOQL());
    return Database.query( query.toSOQL());    
}

}