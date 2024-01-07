export interface Memebers {
    userId: String;
    addedOn: Date;
    isAdmin: Boolean;
}

export interface Group {
    groupName: String;
    groupId: String;
    createdBy: String;
    createdAt: String;
    members: Memebers[]   // array of userId
}