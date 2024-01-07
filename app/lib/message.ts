export interface Reactions {
    reactedBy: String;
    reaction: String;
    reactedAt: Date;
}

export interface Message {
    messageId: String;
    message: String;
    reactions: Reactions[];
    createdAt: Date;
    createdBy: Date;
}