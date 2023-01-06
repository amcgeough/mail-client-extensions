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
let originalEmailID;
let email_leads;

class SectionLeads extends React.Component<LeadSectionProps, SectionLeadsState> {
    constructor(props, context) {
        super(props, context);
        email_leads = this.props.partner.leads
        this.state = {email_leads, replyto: null };
   
    }
      
    
    async componentDidMount() {
        Office.context.mailbox.item.getAllInternetHeadersAsync((asyncResult) => {
          if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            const headers = asyncResult.value;
            if (headers) {
              const replyto = headers.match(/In-Reply-To: (.*)/);
              if (replyto) {
                email_leads = this.props.partner.leads.filter(lead => lead.id === 28);
                const email_leads2 = this.props.partner.leads.filter(lead => lead.id === 28);
                this.setState({email_leads: email_leads2, replyto: replyto[1] });
              }
            }
          }
        });
      }
    

  
    async getEmailHeaders2() {
        return new Promise((resolve, reject) => {
          Office.context.mailbox.item.getAllInternetHeadersAsync(function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
              let headers = asyncResult.value;
              let replyto = headers.match(/In-Reply-To: (.*)/);
              console.log('replyto: ' + replyto);
              if (replyto) {
                // let originalEmailID = replyto[1];
                const email_leads2 = email_leads.filter(lead => lead.id === 28);
                console.log('email_leads2: ' + email_leads2);
                resolve(email_leads2);
              }
            
              else {
                reject();
              }
            } else {
              reject();
            }
          });
        });
      }
    
    async fetchReplyTo() {
        console.log('getEmailHeaders function called'); // Debugging statement
        // return new Promise((resolve, reject) => {
          Office.context.mailbox.item.getAllInternetHeadersAsync(function (asyncResult) {
            // if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            //   console.log('getAllInternetHeadersAsync succeeded'); // Debugging statement
              let headers = asyncResult.value;
              let replyto = headers.match(/In-Reply-To: (.*)/);
              if (replyto) {
                originalEmailID = replyto[1]; // Assign the value to the global variable
                console.log('originalEmailID: ' + originalEmailID);
                const email_leads2 = this.props.partner.leads.filter(lead => lead.id === 28);
                //   await this.setState({ originalEmailID: originalEmailID });
                //   this.setState({ leads: email_leads });
                        // resolve(originalEmailID); // Resolve the promise with the originalEmailID value
                return email_leads2
              } else {
                console.log('Reply To attribute not found');
                return null;
                // reject(); // Reject the promise
              }
            // } else {
            //   console.error(asyncResult.error.message);
            //   reject(); // Reject the promise
            // }
          });
        };
        

        async test() {
            return new Promise((resolve, reject) => {
                Office.context.mailbox.item.getAllInternetHeadersAsync(function (asyncResult) {
                            let headers = asyncResult.value;
                            let replyto = headers.match(/In-Reply-To: (.*)/);
                            if (replyto) {
                                originalEmailID = replyto[1]; // Assign the value to the global variable
                                console.log('originalEmailID: ' + originalEmailID);
                                email_leads = email_leads.filter(lead => lead.id === 28);
                                console.log(email_leads);
                                this.setState({ leads: email_leads });
                                // this.state = { leads: this.props.partner.leads };
                                // console.log(this.state); // state should be defined here
                                resolve(email_leads);
                                return email_leads;
                            } else {
                                console.log('Reply To attribute not found');
                                reject();
                                return null;
                            }
                        })})
        }
        
        // test().then(result => {
        //     console.log(result);
        //     email_leads = result;
        //     console.log(email_leads);
        //     this.setState({ leads: email_leads });
        //     console.log(this.state);
        //   });
        
        // console.log(this.state.leads);



        getEmailHeaders() {
            console.log('getEmailHeaders function called'); // Debugging statement
            // return new Promise((resolve, reject) => {
              Office.context.mailbox.item.getAllInternetHeadersAsync(function (asyncResult) {
                // if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                //   console.log('getAllInternetHeadersAsync succeeded'); // Debugging statement
                  let headers = asyncResult.value;
                  let replyto = headers.match(/In-Reply-To: (.*)/);
                  if (replyto) {
                    originalEmailID = replyto[1]; // Assign the value to the global variable
                    console.log('originalEmailID: ' + originalEmailID);
                    email_leads = this.state.leads.filter(lead => lead.id === 28);
                    //   await this.setState({ originalEmailID: originalEmailID });
                    //   this.setState({ leads: email_leads });
                            // resolve(originalEmailID); // Resolve the promise with the originalEmailID value
                    return email_leads
                  } else {
                    console.log('Reply To attribute not found');
                    return null;
                    // reject(); // Reject the promise
                  }
                // } else {
                //   console.error(asyncResult.error.message);
                //   reject(); // Reject the promise
                // }
              });
            };

        // async main() {

        //     try {
        //       console.log('main function called'); // Debugging statement
        //         // this.getEmailHeaders();
        //         console.log('originalEmailID: ' + originalEmailID);
        //       email_leads = this.state.leads.filter(lead => lead.id === 28);
        //     //   await this.setState({ originalEmailID: originalEmailID });
        //       this.setState({ leads: email_leads });
        //         console.log(this.state.leads);
        //       console.log('main function finished'); // Debugging statement
        //     } catch (error) {
        //       console.error(error); // Log the error to the console
        //     }

        // }

        

        

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
        // this.test().then(result => {
        //         console.log(result);
        //         // email_leads = result;
        //         // console.log(email_leads);
        //         email_leads = this.state.leads.filter(lead => lead.id === 28);
        //         // this.setState({ leads: email_leads });
        //         // console.log(this.state);
        //       });
        console.log(this.state.replyto);
        console.log(this.state.email_leads);
        console.log(email_leads);
        return (
            
            <Section
                records={email_leads}
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
        );
    }
      
}

SectionLeads.contextType = AppContext;

export default SectionLeads;
