
import React from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PdfViewer = () => {
  const { toast } = useToast();
  
  // This would be your actual PDF file URL - you can host it in the public folder
  // or on a service like Google Drive, Dropbox, etc.
  const instructionFileUrl = "/instructions.pdf"; // Place your PDF in the public folder
  const instructionFileName = "הוראות שימוש - ספר ברכות אודיו.pdf";

  const handleView = () => {
    window.open(instructionFileUrl, '_blank');
    toast({
      title: "פתיחת הוראות",
      description: "ההוראות נפתחות בחלון חדש",
    });
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = instructionFileUrl;
    a.download = instructionFileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "הורדה החלה",
      description: "הוראות השימוש מתחילות לרדת",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <FileText className="w-16 h-16 text-blue-500" />
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2" dir="rtl">
            הוראות שימוש מפורטות
          </h3>
          <p className="text-sm text-gray-600" dir="rtl">
            מדריך שלב אחר שלב לשימוש במתנה שלכם
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={handleView} variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            <span dir="rtl">צפייה בהוראות</span>
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            <span dir="rtl">הורדת ההוראות</span>
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800" dir="rtl">
          <strong>טיפ:</strong> הורידו את ההוראות למחשב שלכם לצפייה נוחה 
        </p>
      </div>
    </div>
  );
};

export default PdfViewer;
