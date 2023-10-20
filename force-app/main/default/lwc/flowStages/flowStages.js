import { LightningElement,api} from 'lwc';

export default class FlowStages extends LightningElement {

    @api stages;
    @api currentStage;
}