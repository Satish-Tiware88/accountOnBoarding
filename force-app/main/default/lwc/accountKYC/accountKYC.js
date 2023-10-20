import { LightningElement,api} from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class AccountKYC extends LightningElement {

    @api recordId;

    connectedCallback(){
        //this.recordId = event.target.value;
        this.dispatchEvent(new FlowAttributeChangeEvent('recordId', this.recordId));
        console.log('In ConnectedCallBack',this.recordId);
    }

    renderedCallback(){
        this.dispatchEvent(new FlowAttributeChangeEvent('recordId', this.recordId));
        console.log('In renderedCallBack',this.recordId);
    }
}