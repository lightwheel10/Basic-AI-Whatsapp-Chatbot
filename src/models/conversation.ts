export enum ConversationState {
    WELCOME = 'welcome',
    ASKING_NAME = 'asking_name',
    ASKING_DISTRICT = 'asking_district',
    ASKING_CITY = 'asking_city',
    ASKING_STATE = 'asking_state',
    REQUESTING_AADHAR = 'requesting_aadhar',
    COMPLETED = 'completed'
}

export interface UserConversation {
    phoneNumber: string;
    state: ConversationState;
    data: {
        name?: string;
        district?: string;
        city?: string;
        state?: string;
        aadharUrl?: string;
    };
} 