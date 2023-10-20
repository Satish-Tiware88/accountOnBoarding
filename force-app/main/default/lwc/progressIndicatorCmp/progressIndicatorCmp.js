import { LightningElement, api} from 'lwc';

export default class ProgressIndicatorCmp extends LightningElement {

    @api stages;
    @api currentStage;
}