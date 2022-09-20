import {  ExpirationCompleteEvent, Publisher, Subjects } from "@biletx/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    
}