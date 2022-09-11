export type MockType<T> = {
  [K in keyof T]?: jest.Mock;
};
