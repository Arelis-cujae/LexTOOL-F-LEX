/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Sources } from './model/sources.modelinterface';
import { CreatedSourcesType, EditedSource, NewSourcesType, TypeSource } from './type/sources.type';

@Injectable()
export class SourcesService {
  constructor(
    @InjectModel('Sources') private readonly sourcesModel: Model<Sources>,
  ) { }

  async findAllSources() {
    const e = await this.sourcesModel.find();
    return e;
  }

  async createSource(source: NewSourcesType): Promise<TypeSource> {
    const { file, name, ref, type, subType} = source;
    const s = new this.sourcesModel({ name, file, ref, type, subType });
    await s.save();
    return s;
  }

  async createDictionarySource(source: NewSourcesType): Promise<TypeSource> {
    const { file, name, ref, type, subType} = source;
    const s = new this.sourcesModel({ name, file, ref, type, subType});
    await s.save();
    return s;
  }

  async findByID(sourceID: String): Promise<TypeSource> {
    const entry = await this.sourcesModel.findById(sourceID);
    return entry;
  }

  async deleteSource(SourceID: String) {
    const s = await this.sourcesModel.findById(SourceID);
    if (!s) {
      throw new Error(`Fuente con id: ${SourceID} no existe`);
    }
    const deletedSource = await s.deleteOne();
    console.log(deletedSource);
    return deletedSource;
  }

  async editSource(newSource: EditedSource) {
    let oldSource = await this.sourcesModel
      .findById(newSource.id)
      .exec();
    if (oldSource) {
      oldSource.file = newSource.file;
      oldSource.ref = newSource.ref;
      oldSource.name = newSource.name;
      oldSource.type = newSource.type;
      oldSource.subType = newSource.subType;

      oldSource.save();
      console.log('oldSource:', oldSource);

      return oldSource;
    } else {
      throw new Error('No existe la Fuente');
    }
  }
}