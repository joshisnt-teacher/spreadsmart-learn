import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface BulkResult {
  username: string;
  success: boolean;
  error?: string;
}

interface TeacherDialogsProps {
  // Add student
  showAddStudent: boolean;
  setShowAddStudent: (v: boolean) => void;
  newUsername: string;
  setNewUsername: (v: string) => void;
  newPin: string;
  setNewPin: (v: string) => void;
  onAddStudent: () => void;
  // Bulk import
  showBulkUpload: boolean;
  setShowBulkUpload: (v: boolean) => void;
  bulkText: string;
  setBulkText: (v: string) => void;
  bulkResults: BulkResult[] | null;
  bulkLoading: boolean;
  onBulkCreate: () => void;
  parseBulkCount: number;
  // Shared
  loading: boolean;
}

const TeacherDialogs: React.FC<TeacherDialogsProps> = ({
  showAddStudent, setShowAddStudent, newUsername, setNewUsername, newPin, setNewPin, onAddStudent,
  showBulkUpload, setShowBulkUpload, bulkText, setBulkText, bulkResults, bulkLoading, onBulkCreate, parseBulkCount,
  loading,
}) => {
  return (
    <>
      {/* Add Student Dialog */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>Create a student account with a username and PIN. Share these with the student so they can sign in.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. john.smith"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">Letters, numbers, dots, hyphens, underscores only</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                placeholder="e.g. 1234"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">4–6 digit PIN for the student to sign in with</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStudent(false)}>Cancel</Button>
            <Button onClick={onAddStudent} disabled={loading || newUsername.length < 3 || newPin.length < 4}>
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Import Students</DialogTitle>
            <DialogDescription>
              Enter one student per line. Format: <code className="bg-muted px-1 rounded text-xs">username, pin</code>. If you omit the PIN, one will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          {!bulkResults ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="bulk-input">Student List</Label>
                <Textarea
                  id="bulk-input"
                  placeholder={`john.smith, 1234\njane.doe, 5678\nalex.w`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {parseBulkCount} student(s) detected · Max 50 per batch
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBulkUpload(false)}>Cancel</Button>
                <Button onClick={onBulkCreate} disabled={bulkLoading || parseBulkCount === 0}>
                  {bulkLoading ? 'Creating...' : `Import ${parseBulkCount} Students`}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bulkResults.map((r, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${r.success ? 'bg-primary/5' : 'bg-destructive/5'}`}>
                    {r.success ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                    )}
                    <span className="font-mono">{r.username}</span>
                    {!r.success && <span className="text-destructive text-xs ml-auto">{r.error}</span>}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBulkUpload(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeacherDialogs;
