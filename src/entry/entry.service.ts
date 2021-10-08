/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Entry } from './model/entry.modelinterface';
import { CreatedEntryType, NewEntryType, EntryType, EditedEntryType } from './type/entry.type';
import { SourcesService } from 'src/sources/sources.service';
import { OcurrenceRecordService } from 'src/ocurrenceRecord/ocurrenceRecord.service';
@Injectable()
export class EntryService {
  constructor(
    @InjectModel('Entry') private readonly entryModel: Model<Entry>,
    private readonly sourceService: SourcesService,
    private readonly orService: OcurrenceRecordService,
  ) { }


  async getAllEntries() {
    const e = await this.entryModel.find();
    return e;
  }

  async getAllEntriesWithDocs() {
    const e = await this.entryModel.find();
    return e;
  }

  async getAllEntriesWithSourceRef() {
    const e = await this.entryModel.find();
    const entriesWithSourceRef = [];
    if (e.length > 0) {
      for (let i = 0; i < e.length; i++) {
        const s = await this.sourceService.findByID(e[i].source);
        if (s !== null) {
          e[i].source = s.ref;
          entriesWithSourceRef.push(e[i]);
        } else {
          throw new Error(`Fuente no existe`);
        }
      }
    }
    return entriesWithSourceRef;
  }

  async getAllEntriesBySourceID(sourceID: String): Promise<EntryType[]> {
    const entries = await this.getAllEntries();

    let entriesOfTheSource = [];
    if (entries.length > 0) {
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        if (e.source === sourceID) {
          entriesOfTheSource.push(e);
        }
      }
    }
    return entriesOfTheSource;
  }

  async getAllSelectedEntries(): Promise<EntryType[]> {
    const entries = await this.getAllEntries();

    let selectedEntries = [];
    if (entries.length > 0) {
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        if (e.selected) {
          selectedEntries.push(e);
        }
      }
    }
    return selectedEntries;
  }

  async createEntry(createdEntry: NewEntryType) {
    const {
      lemma,
      letter,
      UF,
      context,
      source,
      selected,
    } = createdEntry;

    const e = new this.entryModel({
      lemma,
      letter,
      UF,
      context,
      source,
      selected,
    });
    await e.save();
    return e;
  }

  async findByID(entryID: String) {
    const entry = await this.entryModel.findById(entryID);
    return entry;
  }

  async findByIDWithDocs(entryID: String) {
    const entry = await this.entryModel.findById(entryID);
    return entry;
  }

  async deleteEntryByID(entryID: String) {
    const e = await this.entryModel.findById(entryID);
    if (!e) {
      throw new Error(`Entrada con id: ${entryID} no existe`);
    }
    const deletedEntry = await e.deleteOne();
    console.log(deletedEntry);
    return deletedEntry;
  }

  async deleteEntryDocByID(entryID: String, orID: String) {
    const e = await this.entryModel.findById(entryID);
    if (e === null) {
      throw new Error(`Entrada con id: ${entryID} no existe`);
    } else {
      let f = false;
      let d = e.documentation;
      for (let j = 0; j < d.length && f === false; j++) {
        if (orID == d[j]) {
          e.documentation.splice(j, 1);
          f = true;
        }
      }
      e.save();
      return e;
    }
  }

  async editEntry(newEntry: EditedEntryType) {
    let oldEntry = await this.entryModel
      .findById(newEntry.id)
      .exec();

    if (oldEntry) {
      oldEntry.UF = newEntry.UF;
      oldEntry.lemma = newEntry.lemma;
      oldEntry.context = newEntry.context;
      oldEntry.letter = newEntry.letter;
      oldEntry.source = newEntry.source;
      oldEntry.selected = newEntry.selected;

      oldEntry.save();
      console.log('oldEntry:', oldEntry);

      return oldEntry;
    } else {
      throw new Error('No existe la entrada');
    }
  }

  async editEntryDocumentation(newEntry: EditedEntryType) {
    let oldEntry = await this.entryModel
      .findById(newEntry.id)
      .exec();
    let d = newEntry.documentation;
    let dOld = oldEntry.documentation;
    if (oldEntry) {
      for (let index = 0; index < d.length; index++) {
        let isIncluded = dOld.includes(d[index]);
        if (!isIncluded) {
          oldEntry.documentation.push(d[index]);
        }
      }
      oldEntry.save();
      return oldEntry;
    } else {
      throw new Error('No existe la entrada');
    }
  }
}
