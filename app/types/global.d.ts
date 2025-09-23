declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: {
        event_category?: string;
        event_label?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};
