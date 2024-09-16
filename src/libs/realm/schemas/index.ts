import {createRealmContext} from '@realm/react'
import { ExerciseSchema } from './ExerciseSchema';
import { GroupSchema } from './GroupSchema';

export const {
  RealmProvider,
  useRealm,
  useObject,
  useQuery
} = createRealmContext({
  schema: [ExerciseSchema, GroupSchema],
  // schemaVersion: 2,
});