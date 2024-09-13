import { Realm } from '@realm/react';

export class ExerciseSchema extends Realm.Object<ExerciseSchema> {
  id!: string;
  name!: string;
  groupId!: string;

  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: "string",
      name: "string",
      groupId: "string",
    },
  };
}
