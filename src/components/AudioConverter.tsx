
import React, { useState } from 'react';
import { Upload, Download, Music, Loader2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
}

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const acceptedFormats = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/aac',
    'audio/flac'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!acceptedFormats.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      toast({
        title: "פורמט לא נתמך",
        description: "אנא העלו קובץ אודיו בפורמט נתמך (MP3, WAV, OGG, M4A, AAC, FLAC)",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setConvertedFile(null);
  };

  const simulateConversion = async () => {
    setIsConverting(true);
    setProgress(0);

    // Simulate conversion progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(progressInterval);
    setProgress(100);

    // In a real implementation, you would call your audio conversion API here
    // For now, we'll simulate by creating a fake converted file
    if (selectedFile) {
      const convertedBlob = new Blob([selectedFile], { type: 'audio/wav' });
      const downloadUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        originalName: selectedFile.name,
        convertedBlob,
        downloadUrl
      });
    }

    setIsConverting(false);
    toast({
      title: "ההמירה הושלמה!",
      description: "קובץ האודיו הומר בהצלחה לפורמט WAV 44.1kHz",
    });
  };

  const handleDownload = () => {
    if (convertedFile) {
      const a = document.createElement('a');
      a.href = convertedFile.downloadUrl;
      a.download = convertedFile.originalName.replace(/\.[^/.]+$/, '') + '_converted_44.1kHz.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "הורדה החלה",
        description: "הקובץ המומר מתחיל להתוריד",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setConvertedFile(null);
    setProgress(0);
    if (convertedFile) {
      URL.revokeObjectURL(convertedFile.downloadUrl);
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
            onChange={handleFileSelect}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="cursor-pointer flex flex-col items-center space-y-3"
          >
            <Music className="w-12 h-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-700" dir="rtl">
                העלו קובץ אודיו
              </p>
              <p className="text-sm text-gray-500" dir="rtl">
                נתמכים: MP3, WAV, OGG, M4A, AAC, FLAC
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Music className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-500 hover:text-red-500"
                disabled={isConverting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isConverting && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600" dir="rtl">מעבד את הקובץ...</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {convertedFile ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium" dir="rtl">ההמירה הושלמה בהצלחה!</span>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  <span dir="rtl">הורידו WAV 44.1kHz</span>
                </Button>
              </div>
            ) : (
              <Button 
                onClick={simulateConversion} 
                disabled={isConverting}
                className="w-full"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span dir="rtl">מעבד...</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    <span dir="rtl">המר ל-WAV 44.1kHz</span>
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800" dir="rtl">
              <strong>הערה:</strong> הקובץ יומר לפורמט WAV עם קצב דגימה של 44.1kHz, הנדרש עבור לוח ה-Teensy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioConverter;
