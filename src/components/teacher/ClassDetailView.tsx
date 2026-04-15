import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, UserPlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentProgressView from '@/components/StudentProgressView';
import AssignmentManager from '@/components/AssignmentManager';
import ModuleAnalyticsView from '@/components/ModuleAnalyticsView';

interface ClassData {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
}

interface StudentData {
  id: string;
  username: string;
  student_user_id: string;
  created_at: string;
}

interface ClassDetailViewProps {
  selectedClass: ClassData;
  students: StudentData[];
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onAddStudent: () => void;
  onBulkImport: () => void;
  onStudentDeleted: () => void;
}

const ClassDetailView: React.FC<ClassDetailViewProps> = ({
  selectedClass, students, copiedCode,
  onCopyCode, onAddStudent, onBulkImport, onStudentDeleted,
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 border border-border p-5 -mx-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Join code:</span>
              <code className="font-mono bg-background/80 px-2 py-0.5 rounded text-xs">{selectedClass.join_code}</code>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onCopyCode(selectedClass.join_code)}>
                {copiedCode === selectedClass.join_code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <h2 className="text-xl font-semibold">Students</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onBulkImport}>
              <Upload className="w-4 h-4 mr-2" /> Bulk Import
            </Button>
            <Button onClick={onAddStudent}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Modules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <StudentProgressView
            classId={selectedClass.id}
            students={students}
            onStudentDeleted={onStudentDeleted}
          />
        </TabsContent>
        <TabsContent value="assignments">
          <AssignmentManager classId={selectedClass.id} students={students} />
        </TabsContent>
        <TabsContent value="analytics">
          <ModuleAnalyticsView
            classId={selectedClass.id}
            customModules={[]}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ClassDetailView;
