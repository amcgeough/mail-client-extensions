import * as React from 'react';
import Partner from '../../../classes/Partner';

import AppContext from '../AppContext';
import api from '../../api';
import Purchase from '../../../classes/Purchase';
import Section from '../Section/Section';

import { _t } from '../../../utils/Translator';


type PurchaseSectionProps = {
    partner: Partner;
    canCreatePartner: boolean;
};

type SectionPurchasesState = {
    email_purchases: Purchase[];
    replyto: string;
};

class SectionPurchases extends React.Component<PurchaseSectionProps, SectionPurchasesState> {
    constructor(props, context) {
        super(props, context);
        this.state = {email_purchases: this.props.partner.purchases, replyto: null};    
    }

    async componentDidMount() {this.EmailFilter();}
         
    async EmailFilter() {
    Office.context.mailbox.item.getAllInternetHeadersAsync((asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          const headers = asyncResult.value;
          if (headers) {
            console.log(headers);
            const replyto = headers.match(/In-Reply-To: (.*)/); // no longer needed
            const reference = headers.match(/(<.+openerp-\d+-purchase\.order.+>)/);
            if (replyto === null) {
              this.setState({ email_purchases: this.props.partner.purchases, replyto: 'No Reply ID' });
            }
            else {
              const email_purchases = this.props.partner.purchases.filter(purchase => purchase.original_email_id === reference[1]);
              if (email_purchases.length > 0) {
                this.setState({ email_purchases: email_purchases, replyto: reference[1] });
              }
              else
              {
                this.setState({ email_purchases: this.props.partner.purchases, replyto: reference[1] });
              }
            }
          }
          else {
            this.setState({ email_purchases: this.props.partner.purchases, replyto: 'No Header' });
          }
        }
      });
    }


    private getPurchaseDescription = (): string => {
        const expectedRevenueString = _t('PO');
        return expectedRevenueString;
    };

      

    render() 
    {    
        console.log(this.state.replyto);
        console.log(this.state.email_purchases);
  
        if (this.state.replyto === null) {return <p>PO hello yaasss</p>} 
        else {

        return (
            
            <Section
                records={this.state.email_purchases}
                partner={this.props.partner}
                canCreatePartner={this.props.canCreatePartner}
                model="purchase.order"
                odooEndpointCreateRecord={api.createPurchase}
                odooRecordIdName="purchase_id"
                odooRedirectAction="purchase_mail_plugin.crm_purchases_action_form_edit"
                title="Purchase Quotes"
                titleCount="Purchase Quotes (%(count)s)"
                msgNoPartner="Save Contact to create new Purchases."
                msgNoPartnerNoAccess="The Contact needs to exist to create Purchase."
                msgNoRecord="No purchases found for this contact."
                msgLogEmail="Log Email Into Purchase"
                getRecordDescription={this.getPurchaseDescription}
            />
        );}
    }

    
      
}

SectionPurchases.contextType = AppContext;

export default SectionPurchases;
