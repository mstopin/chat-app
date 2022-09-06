type CreateEntityDTO = Record<string, unknown>;
type UpdateEntityDTO = Record<string, unknown>;

export interface EntityRepository<T, C = CreateEntityDTO, U = UpdateEntityDTO> {
  find: () => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  create: (createEntityDTO: C) => Promise<T>;
  update: (id: string, updateEntityDTO: U) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
