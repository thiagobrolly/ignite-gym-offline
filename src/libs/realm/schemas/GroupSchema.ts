import { Realm } from '@realm/react';

export class GroupSchema extends Realm.Object<GroupSchema> {
  name!: string;

  static schema = {
    name: "Group",
    primaryKey: "name",
    properties: {
      name: "string",
    },
  };
}