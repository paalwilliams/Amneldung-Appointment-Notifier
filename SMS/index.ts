import { Twilio } from "twilio";

const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_FROM_NUMBER

export default class SMS {
    client: Twilio;

    constructor() {
        this.client = new twilio(accountSid, authToken);
    };

    public async send(messageBody: string): Promise<any> {
        try {
            await this.client.messages
                .create({
                    body: messageBody,
                    to: '+14133208823', // Text this number
                    from: fromNumber, // From a valid Twilio number
                })

        } catch (error) {
            console.log(error)
        }
    }
}