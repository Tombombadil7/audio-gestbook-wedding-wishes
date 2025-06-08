
import React, { useState } from 'react';
import { Upload, Download, Eye, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PdfUploader = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "שגיאה",
        description: "אנא העלו קובץ PDF בלבד",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploadedFile(file);
      setIsUploading(false);
      toast({
        title: "הצלחה!",
        description: "קובץ ההוראות הועלה בהצלחה",
      });
    }, 1500);
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "הורדה החלה",
        description: "קובץ ההוראות מתחיל להתוריד",
      });
    }
  };

  const handleView = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      window.open(url, '_blank');
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    toast({
      title: "קובץ הוסר",
      description: "קובץ ההוראות הוסר בהצלחה",
    });
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center space-y-3"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-700" dir="rtl">
                {isUploading ? "מעלה קובץ..." : "העלו קובץ הוראות PDF"}
              </p>
              <p className="text-sm text-gray-500" dir="rtl">
                לחצו כאן או גררו קובץ PDF
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleView} variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              <span dir="rtl">צפייה</span>
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              <span dir="rtl">הורדה</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
