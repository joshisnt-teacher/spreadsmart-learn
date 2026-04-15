import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Copy, Check, BookOpen, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { allModules } from '@/data/module-registry';

interface ClassData {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
}

interface CustomModule {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  status: string;
  banner_url: string | null;
}

interface ClassListViewProps {
  classes: ClassData[];
  copiedCode: string | null;
  onSelectClass: (cls: ClassData) => void;
  onNewClass: () => void;
  onCopyCode: (code: string) => void;
}

const ClassListView: React.FC<ClassListViewProps> = ({
  classes, copiedCode,
  onSelectClass, onNewClass, onCopyCode,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Classes */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Classes</h2>
          <p className="text-sm text-muted-foreground">Create classes and add students</p>
        </div>
        <Button onClick={onNewClass}>
          <Plus className="w-4 h-4 mr-2" /> New Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No classes yet. Create your first class to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelectClass(cls)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{cls.name}</CardTitle>
                <CardDescription>
                  Created {new Date(cls.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Join code:</span>
                    <code className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{cls.join_code}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => { e.stopPropagation(); onCopyCode(cls.join_code); }}
                    >
                      {copiedCode === cls.join_code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Built-in Modules */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-1">Built-in Modules</h2>
        <p className="text-sm text-muted-foreground mb-4">Pre-built training modules included with the platform</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {allModules.map((mod) => (
            <Card key={mod.id} className="overflow-hidden">
              {mod.bannerUrl && (
                <div className="h-32 overflow-hidden">
                  <img src={mod.bannerUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {mod.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{mod.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate(`/module/${mod.id}`)}>
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{mod.lessons.length} lessons</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{mod.estimatedMinutes} min</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mod.lessons.map((lesson) => (
                    <Badge key={lesson.id} variant="outline" className="text-xs font-normal">
                      {lesson.title}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ClassListView;
