/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Lemario } from './model/lemario.modelinterface';
import { CreatedLemarioType, LemarioType, NewLemarioType } from './type/lemario.type';

import { NewEntryType } from 'src/entry/type/entry.type';
import { EntryService } from 'src/entry/entry.service';


@Injectable()
export class LemarioService {
    
    constructor(
        @InjectModel('Lemario') private readonly lemarioModel: Model<Lemario>,
        private readonly entryService: EntryService, 
    ) { }

    async getAllLemarios() {
        const e = await this.lemarioModel.find()
        .populate({
            path: 'entries',
            model: 'Entry',
          })
          .exec();
        return e;
    }
    
    async createLemario(createdLemario: NewLemarioType) {
        const lemario = new this.lemarioModel({
            name: createdLemario.name,
            dictionaryType:createdLemario.dictionaryType,
            entries: [],
        });
        await lemario.save();
        return lemario;
    }

    async createEntryByLemarioID(
        newEntry: NewEntryType,
        lemarioID: String,
      ) {
        const l = await this.lemarioModel.findById(lemarioID);
        if (!l) {
          throw new Error('Lemario dont exist');
        } else {
          const eModel = await this.entryService.createEntry(newEntry);
          l.entries.push(eModel.id);
          const updatedLemario = await this.lemarioModel.findOneAndUpdate(
            lemarioID,
            l,
          ).exec();
          console.log(updatedLemario);
          return updatedLemario.populate({
            path: 'entries',
            model: 'Entry',
          });
        }
      }
    
    async findByID(lemarioID: String) {
        const lemario = await this.lemarioModel.findById(lemarioID).populate({
          path: 'entries',
          model: 'Entry',
        });
        return lemario;
    }

    async deleteLemario(lemarioID: String) {
        const l = await this.lemarioModel.findById(lemarioID).populate({
            path: 'entries',
            model: 'Entry',
          });
          if (!l) {
            throw new Error('Lemario dont exist');
          }
          l.entries.forEach(async eID => {
            this.entryService.deleteEntry(eID);
          });
          const deletedLemario = await l.deleteOne();
          console.log(deletedLemario);
          return deletedLemario;
    }

}
