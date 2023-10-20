import { LightningElement , track, wire, api} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import createRecWithFile from '@salesforce/apex/DistributorOnboardingController.createRecWithFile';
import getContentDetails from '@salesforce/apex/DistributorOnboardingController.getContentDetails';
import mandatoryFiles from '@salesforce/apex/DistributorOnboardingController.mandatoryFiles';
import getRecords from '@salesforce/apex/DistributorOnboardingController.getRecords';
import { getPicklistValues} from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Distributor_Doc from '@salesforce/schema/Distributor_Document__c';
import Document_Type from '@salesforce/schema/Distributor_Document__c.Document_Type__c';
const MAX_FILE_SIZE = 100000000;
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {
    FlowNavigationBackEvent,
    FlowNavigationNextEvent
  } from "lightning/flowSupport";
// import kyc from '@salesforce/resourceUrl/KYC';
// import { loadStyle} from 'lightning/platformResourceLoader';
import { refreshApex } from '@salesforce/apex';



const columns = [
    {label : 'Document Type', fieldName : 'Name'},

    {label : 'Description', fieldName : 'Description__c'},

    
    { label: 'Preview', type:  'button', typeAttributes: { 
        label: 'Preview', name: 'Preview',  variant: 'brand-outline',
            iconName: 'utility:preview', iconPosition: 'center'
        } 
    },
    { label: 'Download', type:  'button', typeAttributes: { 
            label: 'Download', name: 'Download', variant: 'brand', iconName: 'action:download', 
            iconPosition: 'center' 
        } 
    },
    { label: 'Delete', type:  'button', typeAttributes: { 
            label: 'Delete',   name: 'Delete',   variant: 'destructive' ,iconName: 'standard:record_delete', 
            iconPosition: 'center' 
        } 
    }

  
];

export default class AccountOnBoarding extends NavigationMixin(LightningElement) {

 
   options = [];
   DocumentType = [];
   columns = columns;
   @track fileData;
   @track fileName;
   @track DocType;
   @track Desc;
   @track docFile;
   @api AccountName;
   @api ContentDocumentId;
   @api recordId;
   @track title;
   @track loadData;
   @track contentDoc;
   @track isLoading = false;
   @track selectedValue = '';
   filesList =[];
   @api availableActions = [];
   missingDoc=[];
   @track isMissing;

   @wire(mandatoryFiles) 
   mandatoryFiles(data, error){
    if(data){

        console.log('Data',data);
        this.DocumentType = data.data;

    }else if ( error ) {

        console.log( JSON.stringify( error ) );
   }
};

   @wire(CurrentPageReference) getStateParameters(currentPageReference) {
    if (currentPageReference) {
        this.recordId = currentPageReference.state.recordId;
        console.log(this.recordId);
    }
}


    @wire( getObjectInfo, { objectApiName: Distributor_Doc } )
    objectInfo;

    @wire( getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
                                fieldApiName: Document_Type } )
    wiredData( { error, data } ) {

        console.log( 'In wiren Picklist' );


        if ( data ) {
                            
            console.log( 'Data received from Picklist Field===>' + JSON.stringify( data.values ) );
            this.options = data.values.map( objPL => {
                return {
                    label: `${objPL.label}`,
                    value: `${objPL.value}`
                };
            });
           
            console.log( 'Options are===>' + JSON.stringify( this.options ) );


        } else if ( error ) {

            console.error( JSON.stringify( error ) );

        }

    }

   validateDocument(){
    let docType =[];
    console.log('Documnet Type',this.DocumentType);
    
    this.loadData.forEach(element => {
        docType.push(element.Name);
        
    });

   this.missingDoc = this.DocumentType.filter(element => !docType.includes(element));

    console.log('missing1-->',this.missingDoc);

    console.log('doctype-->',docType);
    const result = this.DocumentType.every(element => docType.includes(element)); 
    if (result)

     { 
        console.log("All elements in array1 exist in array2");
        return true;
        
     } else { 

        
        console.log("Not all elements in array1 exist in array2"); 
        return false;

    }
    
   }

    OnDocTypeChange(event){
        console.log('In DocType Change');
         this.DocType = event.target.value;
         this.isMissing = false;
         console.log('DocType-->',this.DocType);
    }

    OnDescChange(event){
        console.log('In Desc Change');
        this.Desc = event.target.value;
        this.isMissing = false;
        console.log('DocType-->',this.Desc);
    }

    connectedCallback(){
        console.log('Files',this.mandatoryFiles);
        console.log('Account Id',this.recordId);
        console.log('Account Name',this.AccountName);
        this.title = 'KYC-' + this.AccountName; ;

        // Promise.all([
        //     loadStyle(this, kyc)
        // ]);

        getRecords({accountId: this.recordId})
        .then((result)=>
        {
           
            this.loadData = JSON.parse(JSON.stringify(result));
            console.log('@@Document Data',JSON.stringify(result));
            
            
            
        })
        .catch(error=>{
            console.log('Error occure ',error);
          });
       }

       

       getBaseUrl(){
        let baseUrl = 'https://'+location.host+'/';
        return baseUrl;
    }

    handleFileChange(event) {
        
        this.docFile = event.target.value;
        console.log('In File Change',this.docFile);
         if(event.target.files.length > 0) {
             const file = event.target.files[0]
             var reader = new FileReader()
             reader.onload = () => {
                 var base64 = reader.result.split(',')[1]
                this.fileName = file.name;
                 this.fileData = {
                    'fileName': file.name,
                     'base64': base64
                 }
                console.log(this.fileData)
             }
            reader.readAsDataURL(file)
         }
       

    }

    handlePrevious(event){

        if (this.availableActions.find((action) => action === "BACK")) {
            const navigateBackEvent = new FlowNavigationBackEvent();
            this.dispatchEvent(navigateBackEvent);
          }

    }

    handleNext(event){
        

        if(this.validateDocument()){

            this.isMissing = false;

            console.log('In Next Button');
        console.log('Action-->',JSON.stringify(this.availableActions));
        if (this.availableActions.find((action) => action === 'NEXT')) {
          console.log('In Next Butt');
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }

        }else{
            console.log('DOcument Required');
             this.isMissing = true;

             console.log('Missing Flag-->',this.isMissing);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: "Please Upload all Documents!",
                    variant: 'error'
                  })
             );
            
        }
    }

    saveRecord(){

        let formData={
            recName: this.DocType,
            recId: this.recordId,
            recDescription: this.Desc,
            base64Data: this.fileData.base64,
            fileName: this.fileData.fileName
        }

        let formFile = JSON.stringify(formData);

        console.log('Form Data-->',formFile);

        createRecWithFile({
            formFile: formFile,
            
        })
            .then(result => {
                // Handle success, e.g., show a success message or navigate to the created record
             //    this.recId = result;
                console.log('In Record Id',this.recordId);
                
                this.isLoading = false;
     
                getRecords({accountId: this.recordId})
                .then(data =>{
                          this.loadData = data;
                          console.log('##Load Data',this.loadData);
     
                   })
     
                   this.isLoading = false;
                   this.selectedValue = '';
                   this.Desc = '';
                   this.fileName = null;
                   console.log('After Click',this.DocType,this.Desc,this.fileData);
            })
            .catch(error => {
                console.log('In Error',error);
                this.isLoading = false;
            });

    }

    handleSave(event){
        console.log('In Button',this.DocType,this.Desc,this.fileData);

         let pickcmp = this.template.querySelector(".combocmp");
         let desccmp = this.template.querySelector(".desccmp");
         let filecmp = this.template.querySelector(".filecmp");
         let descvalue = desccmp.value;
         let pickvalue = pickcmp.value;
         let fileValue = desccmp.value;

        

      if (!pickvalue) {
        pickcmp.setCustomValidity("Document Type is required");
      } else {
        pickcmp.setCustomValidity("");
      }
       pickcmp.reportValidity();


      if (!descvalue) {
        desccmp.setCustomValidity("Description is required");
      } else {
        desccmp.setCustomValidity("");
      }
      desccmp.reportValidity();


      if (!fileValue) {
        filecmp.setCustomValidity("Upload Document");
      } else {
        filecmp.setCustomValidity("");
      }
      filecmp.reportValidity();

      if(pickvalue && descvalue && fileValue){
        this.saveRecord();
      }
       
   }

   handlereset(event){
    console.log('In handle reset==>');
     this.template.querySelectorAll('lightning-combobox').forEach(each=>{
           each.value = null; 
         });

     this.Desc = '';
     this.fileName = null;
   }



getBaseUrl(){
    let baseUrl = 'https://'+location.host+'/';
    return baseUrl;
}
   
 async callRowAction(event) {
    const actionName = event.detail.action.name;
    const row =event.detail.row;
    const distributorDocId =event.detail.row.Id;
    console.log('Row Id==>',distributorDocId);
    console.log('Test-->',JSON.stringify(event.detail.row));
    
    let file = await getContentDetails({distributorDocID:distributorDocId});
    file = JSON.parse(JSON.stringify(file));
    this.ContentDocumentId = file.ContentDocumentId;
   

    switch (actionName) {
        case 'Preview':
            this.previewFile(file);
            break;
        case 'Download':
            this.downloadFile(file);
            break;
        case 'Delete':
            this.handleDeleteFiles(event);
            break;
        default:
    }
}

previewFile(file){
    console.log('In Preview',file);

    try {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state: {
                selectedRecordId: file.ContentDocumentId
            }
        });
        
    } catch (error) {
        console.log('error',error);
        console.log('Error message',error.message);
    }
    
}

    downloadFile(file){
        console.log('In Download');

      let baseUrl = this.getBaseUrl();
      let downloadURL = baseUrl+'sfc/servlet.shepherd/document/download/'+file.ContentDocumentId;
     
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: downloadURL
            }
        }, false 
    );
       
    }

    handleDeleteFiles(event){
        console.log('Record Delete-->');
        this.isMissing = false;
        deleteRecord(event.detail.row.Id).then(() => {
                         this.isLoading = false;
                        getRecords({accountId: this.recordId})
                     .then((result)=>
                     {
                       
                         this.loadData = JSON.parse(JSON.stringify(result));
                  
                     })
                     .catch(error=>{
                         console.log('Error occure ',error);
            });
                         this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: "Record deleted successfully!",
                                variant: 'success'
                              })
                         );
                        
                     }).catch((error) => {
                         console.log("error, " + error);
                         this.isLoading = false;
                         this.dispatchEvent(
                             new ShowToastEvent({
                                 title: 'Error deleting record',
                                 message: error.body.message,
                                 variant: 'error'
                             })
                         );
                     })

    }


 }  

