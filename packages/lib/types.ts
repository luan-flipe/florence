// Contratos compartilhados entre as LPs e o pacote @florence/ui.
// Mantemos enxuto: tipamos só o que é genuinamente reutilizado (form + lead).
// O config completo de cada página continua tipado dentro do próprio app,
// já que as LPs podem divergir em seções.

export interface UtmParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}

export interface LeadInput extends UtmParams {
  name: string;
  email: string;
  phone: string;
}

/** Copy do formulário de captação — passado como prop para <Formulario>. */
export interface FormularioCopy {
  titulo: string;
  subtitulo: string;
  cta: string;
  lgpd: string;
  edital?: { label: string; url: string };
}

/** Campo extra opcional renderizado pelo <Formulario> (ex: curso de interesse). */
export interface ExtraField {
  name: string;
  label: string;
  type: "select";
  options: string[];
  required?: boolean;
  placeholder?: string;
}
