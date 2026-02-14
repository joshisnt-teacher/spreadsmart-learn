import type { Module } from '@/types/lesson';
import { excelBasicsModule } from './excel-basics-module';
import { chartsModule } from './charts-module';

/** All available modules indexed by ID */
export const moduleRegistry: Record<string, Module> = {
  [excelBasicsModule.id]: excelBasicsModule,
  [chartsModule.id]: chartsModule,
};

/** Ordered list of all modules */
export const allModules: Module[] = [excelBasicsModule, chartsModule];

export function getModuleById(id: string): Module | undefined {
  return moduleRegistry[id];
}
