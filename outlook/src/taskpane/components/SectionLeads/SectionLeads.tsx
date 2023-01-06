import * as React from 'react';
import Partner from '../../../classes/Partner';

import AppContext from '../AppContext';
import api from '../../api';
import Lead from '../../../classes/Lead';
import Section from '../Section/Section';

import { _t } from '../../../utils/Translator';


type LeadSectionProps = {
    partner: Partner;
    canCreatePartner: boolean;
};

type SectionLeadsState = {
    email_leads: Lead[];
    replyto: string;
};

class SectionLeads extends React.Component<LeadSectionProps, SectionLeadsState> {
    constructor(props, context) {
        super(props, context);
        this.state = {email_leads: this.props.partner.leads, replyto: null};    
    }

    // async componentDidMount() {this.EmailFilter();}
         
    async EmailFilter() {
    Office.context.mailbox.item.getAllInternetHeadersAsync((asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          const headers = asyncResult.value;
          if (headers) {
            const replyto = headers.match(/In-Reply-To: (.*)/);
            const email_leads = this.props.partner.leads.filter(lead => lead.id === 283333);
            if (email_leads.length > 0) {
              this.setState({ email_leads: email_leads, replyto: replyto[1] });
            }
            else
            {
              this.setState({ email_leads: this.props.partner.leads, replyto: replyto[1] });
            }
          }
          else {
            this.setState({ email_leads: this.props.partner.leads, replyto: 'No Header' });
          }
        }
      });
    }


    private getLeadDescription = (lead: Lead): string => {
        const expectedRevenueString = _t(
            lead.recurringPlan
                ? '%(expected_revenue)s + %(recurring_revenue)s %(recurring_plan)s at %(probability)s%'
                : '%(expected_revenue)s at %(probability)s%',
            {
                expected_revenue: lead.expectedRevenue,
                recurring_revenue: lead.recurringRevenue,
                recurring_plan: lead.recurringPlan,
                probability: lead.probability,
            },
        );

        return expectedRevenueString;
    };

      

    render() 
    {    
        console.log(this.state.replyto);
        console.log(this.state.email_leads);
  
        if (this.state.replyto === null) {return <p>No Leads babe</p>} 
        else {

        return (
            
            <Section
                records={this.state.email_leads}
                partner={this.props.partner}
                canCreatePartner={this.props.canCreatePartner}
                model="crm.lead"
                odooEndpointCreateRecord={api.createLead}
                odooRecordIdName="lead_id"
                odooRedirectAction="crm_mail_plugin.crm_lead_action_form_edit"
                title="Opportunities"
                titleCount="Opportunities (%(count)s)"
                msgNoPartner="Save Contact to create new Opportunities."
                msgNoPartnerNoAccess="The Contact needs to exist to create Opportunity."
                msgNoRecord="No opportunities found for this contact."
                msgLogEmail="Log Email Into Lead"
                getRecordDescription={this.getLeadDescription}
            />
        );}
    }

    
      
}

SectionLeads.contextType = AppContext;

export default SectionLeads;
