
import React, { useState } from 'react';
import { Upload, Download, Music, Loader2, CheckCircle, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
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
    const storedApiKey = apiKey || localStorage.getItem('cloudconvert_api_key');
    
    if (!storedApiKey) {
      toast({
        title: "חסר מפתח API",
        description: "אנא הזינו מפתח API של CloudConvert",
        variant: "destructive",
      });
      setShowApiKeyInput(true);
      return null;
    }

    try {
      // Create a job with upload, conversion, and export tasks
      const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedApiKey}`,
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
            'Authorization': `Bearer ${storedApiKey}`,
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

  const handleApiKeySave = () => {
    localStorage.setItem('cloudconvert_api_key', apiKey);
    setShowApiKeyInput(false);
    toast({
      title: "מפתח API נשמר",
      description: "המפתח נשמר במחשב שלכם",
    });
  };

  return (
    <div className="space-y-4">
      {/* API Key Configuration */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="text-gray-500"
        >
          <Settings className="w-4 h-4 mr-2" />
          <span dir="rtl">הגדרת API</span>
        </Button>
      </div>

      {showApiKeyInput && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <Label htmlFor="api-key" dir="rtl">מפתח API של CloudConvert</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            dir="ltr"
          />
          <div className="flex space-x-2">
            <Button onClick={handleApiKeySave} size="sm">
              <span dir="rtl">שמירה</span>
            </Button>
            <Button variant="ghost" onClick={() => setShowApiKeyInput(false)} size="sm">
              <span dir="rtl">ביטול</span>
            </Button>
          </div>
          <p className="text-xs text-gray-600" dir="rtl">
            המפתח נשמר במחשב שלכם בלבד ולא נשלח לשרת
          </p>
        </div>
      )}

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
