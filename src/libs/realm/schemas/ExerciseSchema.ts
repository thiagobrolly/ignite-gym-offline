import { Realm } from '@realm/react';

export class ExerciseSchema extends Realm.Object<ExerciseSchema> {
  demo!: string;
  group!: string;
  id!: number;  // Se o id for um número
  name!: string;
  repetitions!: number;
  series!: number;
  thumb!: string;
  updated_at!: string;

  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      demo: "string",
      group: "string",
      id: "int",  // Defina como "int" se o id for um número
      name: "string",
      repetitions: "int",  // Se for um número
      series: "int",  // Se for um número
      thumb: "string",
      updated_at: "string",
    },
  };
}
