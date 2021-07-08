import { Module } from '@nestjs/common';
import { EntryResolver } from './entry.resolver';
import { EntryService } from './entry.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrySchema } from './model/entry.model';
import { SourcesModule } from 'src/sources/sources.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Entry', schema: EntrySchema }]),
    SourcesModule,
  ],
  providers: [EntryService, EntryResolver],
  exports: [EntryService, EntryResolver]
})
export class EntryModule { }
