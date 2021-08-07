/* eslint-disable prettier/prettier */
import { InputType, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class TypeSource {
    @Field(() => ID)
    id?: String;
    @Field()
    name: String;
    @Field()
    ref: String;
    @Field()
    file: String;
    @Field()
    type: String;
    @Field()
    subType: String;
}

@ObjectType({ isAbstract: true })
export class EntrySourcesType {
    @Field(() => ID)
    id?: String;
    @Field()
    name: String;
    @Field()
    ref: String;
    @Field()
    file: String;
    @Field()
    type: String;
    @Field()
    subType: String;
}

@ObjectType({ isAbstract: true })
export class CreatedSourcesType {
    @Field(() => ID)
    id?: String;
    @Field()
    name: String;
    @Field()
    ref: String;
    @Field()
    file: String;
    @Field()
    type: String;
    @Field()
    subType: String;
}

@InputType({ isAbstract: true })
export class NewSourcesType {
    @Field()
    name: String;
    @Field()
    ref: String;
    @Field()
    file: String;
    @Field()
    type: String;
    @Field()
    subType: String;
}

@InputType({ isAbstract: true })
export class EditedSource {
    @Field(() => ID)
    id?: String;
    @Field()
    name: String;
    @Field()
    ref: String;
    @Field()
    file: String;
    @Field()
    type: String;
    @Field()
    subType: String;
}
