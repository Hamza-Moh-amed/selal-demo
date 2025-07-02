// Props for translation context provider
export type TranslationProviderProps = {
  children?: ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
};
