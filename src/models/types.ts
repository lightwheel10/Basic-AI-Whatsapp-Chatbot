export enum ConversationState {
    WELCOME = 'welcome',
    ASKING_NAME = 'asking_name',
    ASKING_DISTRICT = 'asking_district',
    ASKING_CITY = 'asking_city',
    ASKING_STATE = 'asking_state',
    REQUESTING_AADHAR = 'requesting_aadhar',
    COMPLETED = 'completed'
}

export interface User {
    id: string;
    whatsapp_number: string;
    name: string;
    district: string;
    city: string;
    state: string;
    aadhar_document_url: string;
    conversation_state: ConversationState;
    created_at: Date;
    updated_at: Date;
} 