import React, { useState, useMemo, useCallback } from 'react';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ChartWorkspace from '@/components/ChartWorkspace';
import type { ChartConfig, ChartType } from '@/types/lesson';

interface ChartBuilderProps {
  config: ChartConfig;
  cellData: any[];
  onSelectionChange: (chartType: ChartType | null, xKey: string | null, yKey: string | null) => void;
}

const CHART_TYPE_OPTIONS: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'line', label: 'Line Chart', icon: <LineChartIcon className="w-4 h-4" /> },
  { value: 'pie', label: 'Pie Chart', icon: <PieChartIcon className="w-4 h-4" /> },
  { value: 'area', label: 'Area Chart', icon: <AreaChartIcon className="w-4 h-4" /> },
];

const ChartBuilder: React.FC<ChartBuilderProps> = ({ config, cellData, onSelectionChange }) => {
  const [selectedType, setSelectedType] = useState<ChartType | null>(null);
  const [selectedX, setSelectedX] = useState<string | null>(null);
  const [selectedY, setSelectedY] = useState<string | null>(null);

  // Extract column headers from row 0
  const columnHeaders = useMemo(() => {
    return cellData
      .filter((c) => c.r === 0 && c.v?.v !== undefined)
      .sort((a, b) => a.c - b.c)
      .map((c) => String(c.v.v));
  }, [cellData]);

  const handleTypeChange = useCallback((val: string) => {
    const t = val as ChartType;
    setSelectedType(t);
    onSelectionChange(t, selectedX, selectedY);
  }, [selectedX, selectedY, onSelectionChange]);

  const handleXChange = useCallback((val: string) => {
    setSelectedX(val);
    onSelectionChange(selectedType, val, selectedY);
  }, [selectedType, selectedY, onSelectionChange]);

  const handleYChange = useCallback((val: string) => {
    setSelectedY(val);
    onSelectionChange(selectedType, selectedX, val);
  }, [selectedType, selectedX, onSelectionChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="p-4 border-b bg-muted/30 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs mb-1 block">Chart Type</Label>
            <Select value={selectedType ?? ''} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center gap-2">{opt.icon} {opt.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1 block">X-Axis (Categories)</Label>
            <Select value={selectedX ?? ''} onValueChange={handleXChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select column..." />
              </SelectTrigger>
              <SelectContent>
                {columnHeaders.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Y-Axis (Values)</Label>
            <Select value={selectedY ?? ''} onValueChange={handleYChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select column..." />
              </SelectTrigger>
              <SelectContent>
                {columnHeaders.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart preview */}
      <div className="flex-1 min-h-0">
        <ChartWorkspace
          config={config}
          cellData={cellData}
          overrideType={selectedType ?? undefined}
          overrideXKey={selectedX ?? undefined}
          overrideYKey={selectedY ?? undefined}
        />
      </div>
    </div>
  );
};

export default ChartBuilder;
