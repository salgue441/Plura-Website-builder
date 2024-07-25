/**
 * @interface PrismaTransaction
 */
export interface PrismaTransaction {
  run<T>(callback: () => Promise<T>): Promise<T>;
}
