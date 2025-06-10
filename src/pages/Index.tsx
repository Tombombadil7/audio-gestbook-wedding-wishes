
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
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-100 to-pink-100 py-6 sm:py-8 lg:py-16 w-full">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-4xl mx-auto px-3 sm:px-6 text-center">
          <div className="flex justify-center mb-3 sm:mb-6">
            <div className="flex items-center space-x-1 sm:space-x-2 text-rose-500">
              <Heart className="w-5 h-5 sm:w-8 sm:h-8 fill-current" />
              <Gift className="w-6 h-6 sm:w-10 sm:h-10" />
              <Heart className="w-5 h-5 sm:w-8 sm:h-8 fill-current" />
            </div>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-2 sm:mb-4 leading-tight text-center" dir="rtl">
            מזל טוב שחר ואפרת!
          </h1>
          <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-rose-600 mb-3 sm:mb-6 text-center" dir="rtl">
            ברוכים הבאים למתנת החתונה שלכם
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-1 text-center" dir="rtl">
            ספר ברכות אודיו שהאורחים שלכם יכולים להקליט בחתונה במיוחד בשבילכם
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          
          {/* PDF Instructions Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 w-full">
            <CardHeader className="text-center p-3 sm:p-6">
              <div className="flex justify-center mb-2 sm:mb-4">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
              </div>
              <CardTitle className="text-lg sm:text-2xl text-gray-800 text-center" dir="rtl">
                הוראות שימוש
              </CardTitle>
              <CardDescription className="text-xs sm:text-base text-gray-600 px-1 text-center" dir="rtl">
                צפו והורידו את הוראות השימוש המפורטות של המתנה שלכם
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <PdfViewer />
            </CardContent>
          </Card>

          {/* Audio Converter Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 w-full">
            <CardHeader className="text-center p-3 sm:p-6">
              <div className="flex justify-center mb-2 sm:mb-4">
                <Music className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500" />
              </div>
              <CardTitle className="text-lg sm:text-2xl text-gray-800 text-center" dir="rtl">
                ממיר קבצי אודיו
              </CardTitle>
              <CardDescription className="text-xs sm:text-base text-gray-600 px-1 text-center" dir="rtl">
                המירו קבצי אודיו לפורמט WAV 44.1kHz הנדרש לברכה שהאורחים ישמעו
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <AudioConverter />
            </CardContent>
          </Card>

        </div>

        {/* Instructions Section */}
        <Card className="mt-6 sm:mt-12 bg-white/80 backdrop-blur-sm shadow-lg border-0 w-full">
          <CardHeader className="text-center p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl text-gray-800 text-center" dir="rtl">
              איך זה עובד?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-center">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-base sm:text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-xs sm:text-base text-center" dir="rtl">צפו בהוראות</h3>
                <p className="text-xs text-gray-600 px-1 text-center" dir="rtl">בקובץ ההוראות יש דף הוראות לאורחים שניתן להדפיס ולהציג והוראות לכם</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-base sm:text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-xs sm:text-base text-center" dir="rtl">המירו קבצי אודיו</h3>
                <p className="text-xs text-gray-600 px-1 text-center" dir="rtl">באם תרצו לשנות את ההודעה שהאורחים שומעים בהתחלה, הקליטו בטלפון ולאחר מכן העלו לפה לקבלת הקובץ הסופי שיש להעביר ללוח</p>
              </div>
              <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-base sm:text-xl font-bold text-rose-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-xs sm:text-base text-center" dir="rtl">התחברו בכבל USB והורידו את הברכות</h3>
                <p className="text-xs text-gray-600 px-1 text-center" dir="rtl">הורידו את הברכות הקוליות למחשב או לטלפון ושמרו זכרונות</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-4 sm:py-8 text-center w-full">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex justify-center items-center space-x-2 mb-2 sm:mb-4">
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-rose-500 fill-current" />
            <span className="text-gray-600 text-xs sm:text-base text-center" dir="rtl">נוצר באהבה למען שחר ואפרת</span>
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-rose-500 fill-current" />
          </div>
          <p className="text-xs text-gray-500 px-2 text-center" dir="rtl">
            מהגיס/אח החנון האוהב שלכם, מאחל לכם הרבה שנים של אושר והרפתקאות!!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
