import { LightningElement , wire , track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DataTableWithInlineEditing_01 extends LightningElement {
    @track accounts = [];
    @track draftValues = [];

    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Industry', fieldName: 'Industry', editable: true },
        { label: 'Phone', fieldName: 'Phone', editable: true }
    ];

    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error(error);
        }
    }

    // I would capture those draft values (event.detail.draftValues) and track them in my component.
    // These draft values are then sent to Apex for bulk update.
    handleSave(event) {
        console.log("the draft values : " , event.detail.draftValues);
        const records = event.detail.draftValues.map(draft => {
            return { ...draft }; // shallow copy
        });

        updateAccounts({ accList: records })
            .then(() => {
                this.showToast('Success', 'Records updated successfully', 'success');
                this.draftValues = [];
                return refreshApex(this.wiredAccounts);
            })
            .catch(error => {
                this.showToast('Error updating records', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

}