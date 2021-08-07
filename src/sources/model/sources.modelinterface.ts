import { Document } from 'mongoose';

export interface Sources extends Document {
     name: String;
     ref: String;
     file: String;
     type: String;
     subType: String;
}