import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Users, Copy, Check, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const HUB_CLASSES_URL = 'https://edufied.com.au/account/classes';

interface ClassData {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
  central_class_id?: string | null;
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
  onCopyCode: (code: string) => void;
  onArchiveClass: (classId: string) => void;
}

const ClassListView: React.FC<ClassListViewProps> = ({
  classes, copiedCode,
  onSelectClass, onCopyCode, onArchiveClass,
}) => {
  const [classToArchive, setClassToArchive] = useState<ClassData | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Classes */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Classes</h2>
          <p className="text-sm text-muted-foreground">Managed on the Edufied hub, synced here automatically</p>
        </div>
        <Button asChild variant="outline">
          <a href={HUB_CLASSES_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" /> Manage classes
          </a>
        </Button>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No classes yet. Classes are created on the Edufied hub — once you assign Circuit to
              a class there, it will appear here automatically next time you sign in.
            </p>
            <Button asChild variant="outline">
              <a href={HUB_CLASSES_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> Go to Edufied to create a class
              </a>
            </Button>
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
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                  {!cls.central_class_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                      title="Archive this class"
                      onClick={(e) => { e.stopPropagation(); setClassToArchive(cls); }}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
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

      <AlertDialog open={!!classToArchive} onOpenChange={(open) => { if (!open) setClassToArchive(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive "{classToArchive?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from your class list. Student data and progress are kept, not deleted,
              and this can be undone from the database if needed. This class isn't linked to the
              Edufied hub, so archiving it here has no effect there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (classToArchive) onArchiveClass(classToArchive.id); setClassToArchive(null); }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ClassListView;
