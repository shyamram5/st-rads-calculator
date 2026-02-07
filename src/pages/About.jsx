import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, BookOpen, Lightbulb, Linkedin, Github } from 'lucide-react';

export default function AboutPage() {
  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/687d2440273fea034ed3dfaf/5a8647901_IMG_1641.jpg";

  const bio = "Shyam Ramachandran is an M.D. candidate at the Texas A&M Health Sciences Center, College of Medicine. He holds a B.S.A. in Biology Honors with a Kinesiology Minor from The University of Texas at Austin. In addition to his academic pursuits, Shyam is a dedicated researcher and leader. He has authored or co-authored over 20 peer-reviewed publications, and his work has been presented at prominent national and international conferences, including the American Academy of Orthopaedic Surgeons (AAOS) Annual Meeting and the American Roentgen Ray Society (ARRS) Annual Meeting.";

  return (
    <div className="max-w-5xl mx-auto space-y-12">
            <header className="text-center pt-8">
                <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100">About the Creator</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <aside className="md:col-span-1 space-y-6">
                    <Card className="shadow-lg border-slate-200 dark:border-slate-800">
                        <CardContent className="p-6">
                            <img src={imageUrl} alt="Shyam Ramachandran" className="rounded-lg shadow-md w-full" />
                            <div className="text-center mt-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Shyam Ramachandran</h2>
                                <p className="text-md text-blue-600 dark:text-blue-400 font-medium">MS4, Texas A&M</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Mail className="w-5 h-5 text-slate-500" />
                                Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <a href="mailto:shyamram5@tamu.edu" className="text-blue-600 dark:text-blue-400 hover:underline break-all">shyamram5@tamu.edu
              </a>
                            <div className="flex gap-4 mt-4">
                                <a href="https://www.linkedin.com/in/shyamram5/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"><Linkedin /></a>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-2 space-y-8">
          <Card className="shadow-lg border-slate-200 dark:border-slate-800">
                            <CardContent className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed space-y-4 p-8">
                                <p>{bio}</p>
                            </CardContent>
                        </Card>
                </main>
            </div>
        </div>);

}