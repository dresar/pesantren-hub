import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Image as ImageIcon, Plus, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
// Assuming api is available here, or use axios directly
import { api } from '@/lib/api'; 

interface MultiImageInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  disabled?: boolean;
  maxFiles?: number;
}

export function MultiImageInput({
  values = [],
  onChange,
  label = 'Galeri Foto',
  disabled = false,
  maxFiles = 10,
}: MultiImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    // Basic URL validation
    if (!urlInput.match(/^https?:\/\/.+/)) {
        toast({ title: "URL Tidak Valid", description: "Harus diawali dengan http:// atau https://", variant: "destructive" });
        return;
    }
    
    if (values.length >= maxFiles) {
        toast({ title: "Batas Tercapai", description: `Maksimal ${maxFiles} gambar.`, variant: "destructive" });
        return;
    }

    onChange([...values, urlInput]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Filter valid files
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "Gagal", description: `${file.name} terlalu besar (max 5MB)`, variant: "destructive" });
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: "Gagal", description: `${file.name} bukan gambar`, variant: "destructive" });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    if (values.length + validFiles.length > maxFiles) {
        toast({ title: "Batas Tercapai", description: `Maksimal ${maxFiles} gambar.`, variant: "destructive" });
        return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      // Upload sequentially or parallel
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file); // Adjust field name based on backend
        
        // Mock upload or real upload
        // In real scenario: const res = await api.post('/upload', formData);
        // For now assuming api exists and works
        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        if (response.data?.url) {
            newUrls.push(response.data.url);
        }
      }

      if (newUrls.length > 0) {
        onChange([...values, ...newUrls]);
        toast({ title: "Berhasil", description: `${newUrls.length} gambar berhasil diunggah.` });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Gagal Upload", description: "Terjadi kesalahan saat mengunggah gambar.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center">
            <Label>{label} ({values.length}/{maxFiles})</Label>
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="h-6 text-xs">
                <LinkIcon className="w-3 h-3 mr-1" />
                {showUrlInput ? 'Tutup URL' : 'Tambah URL'}
            </Button>
        </div>
      )}
      
      {showUrlInput && (
        <div className="flex gap-2 mb-2">
            <Input 
                placeholder="https://..." 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="h-8 text-sm"
            />
            <Button size="sm" type="button" onClick={handleUrlSubmit} className="h-8">Tambah</Button>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {values.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
            <img 
              src={url} 
              alt={`Gallery ${index}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error';
              }}
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {/* Upload Button Placeholder */}
        {values.length < maxFiles && (
            <div
                className={cn(
                "relative flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-muted/30 hover:bg-muted/50",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={onFileChange}
                accept="image/*"
                disabled={disabled || isUploading}
                />
                {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                <>
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center px-2">
                        Klik / Drop Gambar
                    </span>
                </>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
