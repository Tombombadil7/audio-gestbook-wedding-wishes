
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

// Set your CloudConvert API key here
const CLOUDCONVERT_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTdkYWFkNGViZWFjODdiOTU3NjVlMDljOWQ2NDQ0NjEzMTMxMjMwY2RmYjBmM2RmMGYwZTAyNTYyNTczMTlmYTkyNDA4MTg5OTAzYmRiOGQiLCJpYXQiOjE3NDk0NzI0NzUuNDM4MDc0LCJuYmYiOjE3NDk0NzI0NzUuNDM4MDc1LCJleHAiOjQ5MDUxNDYwNzUuNDMyNTExLCJzdWIiOiI3MjE1MTk3OCIsInNjb3BlcyI6WyJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIl19.DCNaHfpPa9vKYCwMi31gapeKI1j1upYoe8qnONf8h0y526G30Qcc4O4Uncp77TBnCcBHHcjt2ChZ1XI_2i0T_jfOfiOpc6ePt3cIl2n9fAGVliCH1urpVNGlJ7YYdQ05u6-peHe0rbn68jV8PEG6F5stmJhwylJ1Oanb8mc0_qFRbFOBv9peq8n8nMzQOl5OOk3SxTr_7FPe61iTZud-1CyZiSXQdWt7IQ4lsL6jQ_-guSfR4DSiwoSmsEGEQ_PTJHLO91bohimtjKOctfCp5qxMjRKFY5UrnWhEi0cYWwlq_vb0VVnf7woGhuTKt0fNubShHjO63KbCC1azvT06GbiIehn5b1Suefi6lgIBMfJ0PV0GSvWRg9iWX0jZnQ-H8oEJ-ZoZlthWIbTJs5D_VGEubuh3SSey3aZfV7JmhHZeJJMxmLt9fvWO732M-0FFM_m3Sz2fMPZFetTis5pJAgqwlujMQNCIZX0MWNxHoRrta7YbwdS5jVQuZJFktL5SLoID6IZqud2voGAmr8GANYhID0X1LtFFc5VBSrgVjbwa2dM3N6wQiGH8yO_5mctUT0S_1FVPfvy1qsFAJ0ch6OCawtoLZ1kmV6Ho6x3e2tctliT1dNmVCXvnUYuCdkv0Je2JQRzZhhnkeoaCZgpYT0SQ4DJYIF-nNVANx3UT6co';

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

  // Browser-compatible version of your CloudConvert function
  const convertAudioTo44kHzWav = async (inputFile: File, fileName: string): Promise<Blob | null> => {
    if (!CLOUDCONVERT_API_KEY || CLOUDCONVERT_API_KEY === 'YOUR_API_KEY_HERE') {
      toast({
        title: "חסר מפתח API",
        description: "אנא הגדירו מפתח API של CloudConvert בקוד",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Create a job with upload, conversion, and export tasks
      const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: {
            'import-my-file': {
              operation: 'import/upload',
            },
            'convert-my-file': {
              operation: 'convert',
              input: 'import-my-file',
              output_format: 'wav',
              audio_sample_rate: 44100,
            },
            'export-my-file': {
              operation: 'export/url',
              input: 'convert-my-file',
              filename: 'greeting.wav',
            },
          },
        }),
      });

      if (!jobResponse.ok) {
        throw new Error(`API Error: ${jobResponse.status}`);
      }

      const job = await jobResponse.json();
      setProgress(10);

      // Upload the file
      const importTask = job.data.tasks.find((t: any) => t.operation === 'import/upload');
      const formData = new FormData();
      formData.append('file', inputFile, fileName);

      const uploadResponse = await fetch(importTask.result.form.url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }
      setProgress(30);

      // Wait for the job to finish
      let finishedJob;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
          headers: {
            'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
          },
        });

        finishedJob = await statusResponse.json();
        
        if (finishedJob.data.status === 'finished') {
          break;
        } else if (finishedJob.data.status === 'error') {
          throw new Error('Conversion failed');
        }

        setProgress(30 + (attempts / maxAttempts) * 60);
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Conversion timeout');
      }

      setProgress(90);

      // Get the export URL and download the file
      const exportTask = finishedJob.data.tasks.find((t: any) => t.operation === 'export/url');
      const downloadUrl = exportTask.result.files[0].url;

      const downloadResponse = await fetch(downloadUrl);
      if (!downloadResponse.ok) throw new Error('Failed to download converted file');

      setProgress(100);
      return await downloadResponse.blob();
    } catch (error) {
      console.error('Error converting audio:', error);
      toast({
        title: "שגיאה בהמרה",
        description: `נכשלה המרת הקובץ: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`,
        variant: "destructive",
      });
      return null;
    }
  };

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

  const handleConversion = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(0);

    const convertedBlob = await convertAudioTo44kHzWav(selectedFile, selectedFile.name);
    
    if (convertedBlob) {
      const downloadUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        originalName: selectedFile.name,
        convertedBlob,
        downloadUrl
      });

      toast({
        title: "ההמירה הושלמה!",
        description: "קובץ האודיו הומר בהצלחה לפורמט WAV 44.1kHz",
      });
    }

    setIsConverting(false);
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
                onClick={handleConversion} 
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
