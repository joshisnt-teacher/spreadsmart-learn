import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Filter, X } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import type { TableTaskConfig } from '@/types/lesson';

interface InteractiveTableProps {
  config: TableTaskConfig;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

type SortDir = 'asc' | 'desc' | null;

const InteractiveTable: React.FC<InteractiveTableProps> = ({ config, answer, onAnswerChange }) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null); }
      else setSortDir('asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const processedData = useMemo(() => {
    let data = [...config.data];

    // Apply filters
    Object.entries(filters).forEach(([key, val]) => {
      if (!val) return;
      const col = config.columns.find(c => c.key === key);
      if (col?.type === 'number') {
        const num = Number(val);
        if (!isNaN(num)) {
          data = data.filter(row => Number(row[key]) === num);
        }
      } else {
        data = data.filter(row =>
          String(row[key]).toLowerCase().includes(val.toLowerCase())
        );
      }
    });

    // Apply sort
    if (sortKey && sortDir) {
      const col = config.columns.find(c => c.key === sortKey);
      data.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        let cmp: number;
        if (col?.type === 'number') {
          cmp = Number(aVal) - Number(bVal);
        } else {
          cmp = String(aVal).localeCompare(String(bVal));
        }
        return sortDir === 'desc' ? -cmp : cmp;
      });
    }

    return data;
  }, [config.data, config.columns, sortKey, sortDir, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col p-6 gap-4 overflow-auto">
      <Card>
        <CardContent className="p-0">
          {/* Filter bar */}
          {config.enableFilter && (
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">{activeFilterCount} active</Badge>
              )}
              <div className="flex gap-2 ml-2">
                {config.columns.map(col => (
                  <Popover key={col.key}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={filters[col.key] ? 'secondary' : 'outline'}
                        size="sm"
                        className="h-7 text-xs"
                      >
                        {col.label}
                        {filters[col.key] && (
                          <span className="ml-1 text-muted-foreground">= {filters[col.key]}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3" align="start">
                      <div className="space-y-2">
                        <Label className="text-xs">Filter by {col.label}</Label>
                        <div className="flex gap-1">
                          <Input
                            placeholder={col.type === 'number' ? 'Enter number…' : 'Search…'}
                            value={filters[col.key] || ''}
                            onChange={e => handleFilterChange(col.key, e.target.value)}
                            className="h-8 text-sm"
                            type={col.type === 'number' ? 'number' : 'text'}
                          />
                          {filters[col.key] && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => clearFilter(col.key)}>
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map(col => (
                  <TableHead
                    key={col.key}
                    className={`${config.enableSort !== false ? 'cursor-pointer select-none hover:bg-muted/50' : ''}`}
                    onClick={() => config.enableSort !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {config.enableSort !== false && (
                        sortKey === col.key ? (
                          sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((row, idx) => (
                <TableRow key={idx}>
                  {config.columns.map(col => (
                    <TableCell key={col.key}>{row[col.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
              {processedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={config.columns.length} className="text-center text-muted-foreground py-8">
                    No rows match the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Question area */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <Label className="text-sm font-semibold mb-2 block">{config.question}</Label>
          <Input
            placeholder="Type your answer…"
            value={answer}
            onChange={e => onAnswerChange(e.target.value)}
            className="max-w-xs"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTable;
