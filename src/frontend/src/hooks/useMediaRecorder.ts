import { useState, useRef, useCallback } from 'react';

export type MediaType = 'audio' | 'video';

export interface MediaRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  error: string | null;
  isSupported: boolean;
}

export interface UseMediaRecorderReturn extends MediaRecorderState {
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<File | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
}

export function useMediaRecorder(type: MediaType = 'audio'): UseMediaRecorderReturn {
  const [state, setState] = useState<MediaRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    error: null,
    isSupported: typeof MediaRecorder !== 'undefined',
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<number | null>(null);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, error: 'MediaRecorder not supported' }));
      return false;
    }

    try {
      const constraints: MediaStreamConstraints =
        type === 'audio'
          ? { audio: true }
          : { video: { facingMode: 'user' }, audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const mimeType = type === 'audio' ? 'audio/webm' : 'video/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();

      durationIntervalRef.current = window.setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        error: null,
        duration: 0,
      }));

      return true;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to start recording',
      }));
      return false;
    }
  }, [type, state.isSupported]);

  const stopRecording = useCallback(async (): Promise<File | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'audio' ? 'audio/webm' : 'video/webm',
        });
        const file = new File([blob], `recording_${Date.now()}.webm`, {
          type: blob.type,
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }

        setState((prev) => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          duration: 0,
        }));

        resolve(file);
      };

      mediaRecorder.stop();
    });
  }, [type]);

  const pauseRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      setState((prev) => ({ ...prev, isPaused: true }));
    }
  }, []);

  const resumeRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      durationIntervalRef.current = window.setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);
      setState((prev) => ({ ...prev, isPaused: false }));
    }
  }, []);

  const cancelRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    chunksRef.current = [];
    setState((prev) => ({
      ...prev,
      isRecording: false,
      isPaused: false,
      duration: 0,
    }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  };
}
