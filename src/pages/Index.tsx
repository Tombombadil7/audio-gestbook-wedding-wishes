
import React, { useState } from 'react';
import { Upload, Download, FileText, Music, Heart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PdfViewer from '@/components/PdfViewer';
import AudioConverter from '@/components/AudioConverter';

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-100 to-pink-100 py-16">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 text-rose-500">
              <Heart className="w-8 h-8 fill-current" />
              <Gift className="w-10 h-10" />
              <Heart className="w-8 h-8 fill-current" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight" dir="rtl">
            מזל טוב שחר ואפרת!
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-rose-600 mb-6" dir="rtl">
            ברוכים הבאים למתנת החתונה שלכם
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" dir="rtl">
            ספר אורחים אודיו דיגיטלי מיוחד שנוצר במיוחד עבורכם
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* PDF Instructions Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <FileText className="w-12 h-12 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-gray-800" dir="rtl">
                הוראות הרכבה
              </CardTitle>
              <CardDescription className="text-gray-600" dir="rtl">
                צפו והורידו את הוראות ההרכבה המפורטות של ספר האורחים האודיו
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PdfViewer />
            </CardContent>
          </Card>

          {/* Audio Converter Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Music className="w-12 h-12 text-purple-500" />
              </div>
              <CardTitle className="text-2xl text-gray-800" dir="rtl">
                ממיר קבצי אודיו
              </CardTitle>
              <CardDescription className="text-gray-600" dir="rtl">
                המירו קבצי אודיו לפורמט WAV 44.1kHz הנדרש לפרויקט
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioConverter />
            </CardContent>
          </Card>

        </div>

        {/* Instructions Section */}
        <Card className="mt-12 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800" dir="rtl">
              איך זה עובד?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800" dir="rtl">צפו בהוראות</h3>
                <p className="text-sm text-gray-600" dir="rtl">צפו בהוראות ההרכבה והורידו את קובץ ה-PDF</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800" dir="rtl">המירו קבצי אודיו</h3>
                <p className="text-sm text-gray-600" dir="rtl">העלו קבצי אודיו והמירו אותם לפורמט הנדרש</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-rose-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800" dir="rtl">תהנו מהמתנה</h3>
                <p className="text-sm text-gray-600" dir="rtl">הרכיבו את ספר האורחים האודיו ושמרו זכרונות</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
            <span className="text-gray-600" dir="rtl">נוצר באהבה למען שחר ואפרת</span>
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
          </div>
          <p className="text-sm text-gray-500" dir="rtl">
            ספר אורחים אודיו דיגיטלי - מתנת חתונה מיוחדת
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
