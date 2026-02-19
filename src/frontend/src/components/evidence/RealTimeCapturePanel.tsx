import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Mic, Video, AlertCircle, Check } from 'lucide-react';
import { useCamera } from '../../camera/useCamera';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';

interface RealTimeCapturePanelProps {
  onCapture: (file: File) => void;
  onCancel?: () => void;
}

export default function RealTimeCapturePanel({ onCapture, onCancel }: RealTimeCapturePanelProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'audio' | 'video'>('photo');
  
  const camera = useCamera({ facingMode: 'environment', quality: 0.9 });
  const audioRecorder = useMediaRecorder('audio');
  const videoRecorder = useMediaRecorder('video');

  const handlePhotoCapture = async () => {
    const file = await camera.capturePhoto();
    if (file) {
      onCapture(file);
    }
  };

  const handleAudioStop = async () => {
    const file = await audioRecorder.stopRecording();
    if (file) {
      onCapture(file);
    }
  };

  const handleVideoStop = async () => {
    const file = await videoRecorder.stopRecording();
    if (file) {
      onCapture(file);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Captura em Tempo Real
        </CardTitle>
        <CardDescription>Capture foto, áudio ou vídeo como evidência</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photo">
              <Camera className="h-4 w-4 mr-2" />
              Foto
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Mic className="h-4 w-4 mr-2" />
              Áudio
            </TabsTrigger>
            <TabsTrigger value="video">
              <Video className="h-4 w-4 mr-2" />
              Vídeo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photo" className="space-y-4">
            {camera.isSupported === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Câmera não suportada neste navegador</AlertDescription>
              </Alert>
            )}

            {camera.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{camera.error.message}</AlertDescription>
              </Alert>
            )}

            <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '300px', aspectRatio: '4/3' }}>
              <video
                ref={camera.videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={camera.canvasRef} className="hidden" />
            </div>

            <div className="flex gap-2">
              {!camera.isActive ? (
                <Button onClick={camera.startCamera} disabled={camera.isLoading} className="flex-1">
                  {camera.isLoading ? 'Iniciando...' : 'Iniciar Câmera'}
                </Button>
              ) : (
                <>
                  <Button onClick={handlePhotoCapture} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Capturar Foto
                  </Button>
                  <Button onClick={camera.stopCamera} variant="outline">
                    Parar
                  </Button>
                </>
              )}
              {onCancel && (
                <Button onClick={onCancel} variant="ghost">
                  Cancelar
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            {!audioRecorder.isSupported && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Gravação de áudio não suportada</AlertDescription>
              </Alert>
            )}

            {audioRecorder.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{audioRecorder.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  audioRecorder.isRecording ? 'bg-destructive animate-pulse' : 'bg-muted'
                }`}>
                  <Mic className="h-12 w-12" />
                </div>
              </div>
              
              {audioRecorder.isRecording && (
                <div className="text-2xl font-mono">{formatDuration(audioRecorder.duration)}</div>
              )}
            </div>

            <div className="flex gap-2">
              {!audioRecorder.isRecording ? (
                <Button onClick={audioRecorder.startRecording} className="flex-1">
                  <Mic className="mr-2 h-4 w-4" />
                  Iniciar Gravação
                </Button>
              ) : (
                <>
                  {!audioRecorder.isPaused ? (
                    <Button onClick={audioRecorder.pauseRecording} variant="outline" className="flex-1">
                      Pausar
                    </Button>
                  ) : (
                    <Button onClick={audioRecorder.resumeRecording} variant="outline" className="flex-1">
                      Retomar
                    </Button>
                  )}
                  <Button onClick={handleAudioStop} className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button onClick={audioRecorder.cancelRecording} variant="ghost">
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            {!videoRecorder.isSupported && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Gravação de vídeo não suportada</AlertDescription>
              </Alert>
            )}

            {videoRecorder.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{videoRecorder.error}</AlertDescription>
              </Alert>
            )}

            <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '300px', aspectRatio: '16/9' }}>
              {videoRecorder.isRecording && (
                <div className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-mono">
                  REC {formatDuration(videoRecorder.duration)}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!videoRecorder.isRecording ? (
                <Button onClick={videoRecorder.startRecording} className="flex-1">
                  <Video className="mr-2 h-4 w-4" />
                  Iniciar Gravação
                </Button>
              ) : (
                <>
                  {!videoRecorder.isPaused ? (
                    <Button onClick={videoRecorder.pauseRecording} variant="outline" className="flex-1">
                      Pausar
                    </Button>
                  ) : (
                    <Button onClick={videoRecorder.resumeRecording} variant="outline" className="flex-1">
                      Retomar
                    </Button>
                  )}
                  <Button onClick={handleVideoStop} className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button onClick={videoRecorder.cancelRecording} variant="ghost">
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
