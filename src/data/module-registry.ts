import type { Module } from '@/types/lesson';
import { excelBasicsModule } from './excel-basics-module';
import { chartsModule } from './charts-module';
import { designThinkingModule } from './design-thinking-module';
import { scientificMethodModule } from './scientific-method-module';

/** All available modules indexed by ID */
export const moduleRegistry: Record<string, Module> = {
  [excelBasicsModule.id]: excelBasicsModule,
  [chartsModule.id]: chartsModule,
  [designThinkingModule.id]: designThinkingModule,
  [scientificMethodModule.id]: scientificMethodModule,
};

/** Ordered list of all modules */
export const allModules: Module[] = [
  excelBasicsModule,
  chartsModule,
  designThinkingModule,
  scientificMethodModule,
];

export function getModuleById(id: string): Module | undefined {
  return moduleRegistry[id];
}
