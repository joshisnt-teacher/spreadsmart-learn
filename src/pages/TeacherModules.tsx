import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { allModules } from '@/data/module-registry';

const TeacherModules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <h1 className="font-bold text-lg">Modules</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
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
      </main>
    </div>
  );
};

export default TeacherModules;
