"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Shield,
  AlertTriangle,
  Tag,
  CheckCircle,
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Info,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { predictSMS, checkHealth } from "@/lib/api";
import { PredictionResponse, LABEL_CONFIG } from "@/lib/types";

const SAMPLE_SMS = [
  { text: "Selamat! Anda memenangkan hadiah 100jt. Hubungi 08123456789 untuk klaim.", type: "fraud" },
  { text: "Selamat Pagi, jadwal kuliah Machine Learning besok jam 10 di ruang JTE-09 ya. Jangan lupa membawa laptop.", type: "normal" },
  { text: "PROMO! Beli paket data 10GB hanya 50rb. Aktifkan di *123# sekarang!", type: "promo" },
];

export default function SMSDetectorPage() {
  const [smsText, setSmsText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  // Check API health on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const health = await checkHealth();
        setApiStatus(health.model_loaded ? "online" : "offline");
      } catch {
        setApiStatus("offline");
      }
    };
    checkApi();
  }, []);

  const handleSubmit = async () => {
    if (!smsText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictSMS(smsText);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (text: string) => {
    setSmsText(text);
    setResult(null);
    setError(null);
  };

  const getResultIcon = (label: number) => {
    switch (label) {
      case 0: return <CheckCircle className="w-8 h-8" />;
      case 1: return <AlertTriangle className="w-8 h-8" />;
      case 2: return <Tag className="w-8 h-8" />;
      default: return <MessageSquare className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Machine Learning Final Project</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                SMS Spam
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Detector
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Deteksi otomatis SMS penipuan, promosi, atau pesan normal menggunakan
              <span className="font-semibold text-foreground"> Naive Bayes </span>
              dan
              <span className="font-semibold text-foreground"> TF-IDF</span>.
            </p>

            {/* API Status */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiStatus === "online" ? "bg-emerald-500 animate-pulse" :
                apiStatus === "offline" ? "bg-red-500" : "bg-yellow-500 animate-pulse"
                }`} />
              <span className="text-sm text-muted-foreground">
                {apiStatus === "online" ? "API Online" :
                  apiStatus === "offline" ? "API Offline" : "Checking..."}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Masukkan SMS
                </CardTitle>
                <CardDescription>
                  Ketik atau paste SMS yang ingin Anda deteksi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Contoh: Selamat! Anda memenangkan hadiah..."
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="min-h-[160px] resize-none text-base border-2 focus:border-primary/50 transition-all"
                    maxLength={1000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {smsText.length}/1000
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!smsText.trim() || isLoading || apiStatus === "offline"}
                  className="w-full h-12 text-base font-semibold gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Deteksi SMS
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <Separator className="my-4" />

                {/* Sample SMS */}
                <div>
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Coba contoh SMS:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SMS.map((sample, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSampleClick(sample.text)}
                              className="text-xs capitalize hover:bg-primary/10"
                            >
                              {sample.type === "fraud" && <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />}
                              {sample.type === "normal" && <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />}
                              {sample.type === "promo" && <Tag className="w-3 h-3 mr-1 text-blue-500" />}
                              {sample.type}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-xs">{sample.text}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Hasil Deteksi
                </CardTitle>
                <CardDescription>
                  Hasil analisis SMS ditampilkan di sini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Alert variant="destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 gap-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-muted-foreground">Menganalisis SMS...</p>
                    </motion.div>
                  )}

                  {result && !isLoading && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Main Result */}
                      <div className={`p-6 rounded-xl border-2 ${LABEL_CONFIG[result.label as keyof typeof LABEL_CONFIG].bgClass} ${LABEL_CONFIG[result.label as keyof typeof LABEL_CONFIG].borderClass}`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${LABEL_CONFIG[result.label as keyof typeof LABEL_CONFIG].bgClass} ${LABEL_CONFIG[result.label as keyof typeof LABEL_CONFIG].textClass}`}>
                            {getResultIcon(result.label)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-2xl font-bold ${LABEL_CONFIG[result.label as keyof typeof LABEL_CONFIG].textClass}`}>
                                {result.label_name}
                              </h3>
                              <Badge variant="secondary" className="font-mono">
                                {(result.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {LABEL_CONFIG[result.label as keyof typeof LABEL_CONFIG].description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Bars */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Probabilitas per Kategori
                        </h4>

                        <div className="space-y-3">
                          {Object.entries(result.probabilities).map(([label, prob]) => {
                            const labelKey = label === "Normal" ? 0 : label === "Fraud/Penipuan" ? 1 : 2;
                            const config = LABEL_CONFIG[labelKey as keyof typeof LABEL_CONFIG];
                            const percentage = prob * 100;

                            return (
                              <div key={label} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                  <span className={`font-medium ${config.textClass}`}>{label}</span>
                                  <span className="font-mono text-muted-foreground">{percentage.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-full rounded-full ${labelKey === 0 ? "bg-emerald-500" :
                                      labelKey === 1 ? "bg-red-500" : "bg-blue-500"
                                      }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Original Text */}
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">SMS yang dianalisis:</p>
                        <p className="text-sm">{result.text}</p>
                      </div>
                    </motion.div>
                  )}

                  {!result && !isLoading && !error && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                        <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="font-semibold text-muted-foreground mb-1">Belum ada hasil</h3>
                      <p className="text-sm text-muted-foreground/70">
                        Masukkan SMS dan klik tombol deteksi
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle, color: "emerald", title: "Normal", desc: "SMS dari kontak pribadi atau pesan biasa yang aman" },
              { icon: AlertTriangle, color: "red", title: "Fraud", desc: "SMS penipuan yang mencoba menipu dengan hadiah palsu" },
              { icon: Tag, color: "blue", title: "Promo", desc: "SMS promosi dari operator atau brand komersial" },
            ].map((item, idx) => (
              <Card key={idx} className="bg-card/50 backdrop-blur-sm border-2 hover:border-primary/30 transition-all group">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">Universitas Sam Ratulangi - Machine Learning 2025</p>
          <p>Graciano Paulus Tilaar • Kresando Seon</p>
          <p className="text-xs mt-2">Built with Next.js, FastAPI, and Naive Bayes</p>
        </div>
      </div>
    </div>
  );
}
