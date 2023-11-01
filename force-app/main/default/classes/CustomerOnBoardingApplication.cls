public class CustomerOnBoardingApplication {
    
    public static final LibApplication.UnitOfWorkFactory unitOfWork =
        new LibApplication.UnitOfWorkFactory(
            new List<SObjectType> {
                Distributor_Document__c.sObjectType,
                    ContentVersion.sObjectType,
                    ContentDocumentLink.sObjectType,    
                    KYC_Doc_Configuration__mdt.SObjectType
                    
                    }
        );
    
    
    
    
    public static final LibApplication.ServiceFactory service =
        new LibApplication.ServiceFactory(
            new Map<Type, Type> {
                ICustomerOnboardingService.class =>ICustomerOnboardingApplication.class
                    
                    }
        );
    
    
    public static final LibApplication.SelectorFactory selector =
        new LibApplication.SelectorFactory(
            new Map<SObjectType, Type> {
                Distributor_Document__c.sObjectType => DistributorDocumentSelector.class,
                    ContentDocumentLink.sObjectType => ContentDocumentLinkSelector.class,
                    ContentVersion.sObjectType => ContentVersionSelector.class,
                    KYC_Doc_Configuration__mdt.sObjectType => KycDocConfigSelector.class
                    
                    
                    }
        );
    
    public static final LibApplication.DomainFactory domain =
        new LibApplication.DomainFactory(
            Application.Selector,
            new Map<SObjectType, Type> {
                
                    }
        );
    
}