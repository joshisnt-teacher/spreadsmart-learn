import React from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ModuleSettingsPanelProps {
  moduleId: string;
  moduleTitle: string;
  setModuleTitle: (v: string) => void;
  moduleDescription: string;
  setModuleDescription: (v: string) => void;
  moduleMinutes: number;
  setModuleMinutes: (v: number) => void;
  moduleBannerUrl: string | null;
  setModuleBannerUrl: (v: string | null) => void;
  onSave: (updates: Record<string, any>) => Promise<void>;
}

const ModuleSettingsPanel: React.FC<ModuleSettingsPanelProps> = ({
  moduleId, moduleTitle, setModuleTitle, moduleDescription, setModuleDescription,
  moduleMinutes, setModuleMinutes, moduleBannerUrl, setModuleBannerUrl, onSave,
}) => {
  const [bannerUploading, setBannerUploading] = React.useState(false);

  return (
    <div className="border-b border-border bg-muted/30 px-4 py-4">
      <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Module Title</Label>
          <Input
            value={moduleTitle}
            onChange={e => setModuleTitle(e.target.value)}
            onBlur={() => onSave({ title: moduleTitle })}
            placeholder="Module title"
          />
        </div>
        <div className="space-y-2">
          <Label>Estimated Minutes</Label>
          <Input
            type="number"
            value={moduleMinutes}
            onChange={e => setModuleMinutes(parseInt(e.target.value) || 15)}
            onBlur={() => onSave({ estimated_minutes: moduleMinutes })}
            min={1}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={moduleDescription}
            onChange={e => setModuleDescription(e.target.value)}
            onBlur={() => onSave({ description: moduleDescription })}
            placeholder="What will students learn?"
            rows={2}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Banner Image (optional)</Label>
          {moduleBannerUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={moduleBannerUrl} alt="Module banner" className="w-full h-32 object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={async () => {
                  setModuleBannerUrl(null);
                  await onSave({ banner_url: null });
                }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {bannerUploading ? 'Uploading...' : 'Click to upload a banner image'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={bannerUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBannerUploading(true);
                  const ext = file.name.split('.').pop();
                  const path = `${moduleId}/banner.${ext}`;
                  const { error: uploadErr } = await supabase.storage
                    .from('module-banners')
                    .upload(path, file, { upsert: true });
                  if (uploadErr) {
                    toast({ title: 'Upload failed', description: uploadErr.message, variant: 'destructive' });
                    setBannerUploading(false);
                    return;
                  }
                  const { data: urlData } = supabase.storage.from('module-banners').getPublicUrl(path);
                  const url = urlData.publicUrl;
                  setModuleBannerUrl(url);
                  await onSave({ banner_url: url });
                  setBannerUploading(false);
                  toast({ title: 'Banner uploaded!' });
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleSettingsPanel;
