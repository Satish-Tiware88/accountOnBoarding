public interface ICustomerOnboardingApplication {
    
    String createRecWithFile(String formFile);
    List<Distributor_Document__c> getRecords(String accountId);
    List<ContentVersion> getContentDetails(String distributorDocID);
    List<String> mandatoryFiles();
    
}