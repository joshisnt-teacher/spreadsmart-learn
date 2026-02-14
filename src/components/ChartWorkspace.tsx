import React, { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import type { ChartConfig, ChartType } from '@/types/lesson';
import { parseCellRef } from '@/lib/marking-engine';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
];

interface ChartWorkspaceProps {
  config: ChartConfig;
  cellData?: any[];
  /** Override chart type for builder mode */
  overrideType?: ChartType;
  /** Override axis keys for builder mode */
  overrideXKey?: string;
  overrideYKey?: string;
}

/**
 * Extract tabular data from sheet cellData using column headers
 */
function extractDataFromSheet(
  cellData: any[],
  xKey: string,
  yKey: string,
): { name: string; value: number }[] {
  // Find header row (row 0) to map column letters to header names
  const headers: Record<number, string> = {};
  cellData
    .filter((c) => c.r === 0 && c.v?.v !== undefined)
    .forEach((c) => {
      headers[c.c] = String(c.v.v);
    });

  // Find which column indices match xKey and yKey
  let xCol = -1;
  let yCol = -1;
  for (const [col, name] of Object.entries(headers)) {
    if (name === xKey) xCol = Number(col);
    if (name === yKey) yCol = Number(col);
  }

  if (xCol === -1 || yCol === -1) return [];

  // Collect contiguous data rows (skip header row 0), stop at first empty row
  const maxRow = Math.max(...cellData.map((c) => c.r));
  const result: { name: string; value: number }[] = [];
  for (let r = 1; r <= maxRow; r++) {
    const xCell = cellData.find((c) => c.r === r && c.c === xCol);
    const yCell = cellData.find((c) => c.r === r && c.c === yCol);
    const xVal = xCell?.v?.v;
    const yVal = yCell?.v?.v;
    if (xVal === undefined || xVal === '' || yVal === undefined || yVal === '') break;
    result.push({ name: String(xVal), value: Number(yVal) });
  }
  return result;
}

const ChartWorkspace: React.FC<ChartWorkspaceProps> = ({
  config,
  cellData,
  overrideType,
  overrideXKey,
  overrideYKey,
}) => {
  const chartType = overrideType ?? config.type;
  const xKey = overrideXKey ?? config.xKey ?? '';
  const yKey = overrideYKey ?? config.yKey ?? '';

  const data = useMemo(() => {
    if (config.dataSource === 'static' && config.staticData) {
      return config.staticData;
    }
    if (cellData && xKey && yKey) {
      return extractDataFromSheet(cellData, xKey, yKey);
    }
    return [];
  }, [config, cellData, xKey, yKey]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select chart type and axes to preview the chart
      </div>
    );
  }

  const title = config.title || `${yKey} by ${xKey}`;

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-sm font-semibold text-center mb-4 text-foreground">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={yKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name={yKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" name={yKey} stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" strokeWidth={2} />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" label>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWorkspace;
