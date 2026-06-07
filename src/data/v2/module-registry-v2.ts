import type { Module } from '@/types/module-v2';
import { outlookEmailModule } from './outlook-email-module';

const v2Registry: Record<string, Module> = {
  [outlookEmailModule.id]: outlookEmailModule,
};

export function getV2ModuleById(id: string): Module | undefined {
  return v2Registry[id];
}
