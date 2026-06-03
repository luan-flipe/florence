// Ícone da Florence — apenas o símbolo, sem o texto
// Cores originais: #00508c (navy) e #0096d2 (sky blue)
// Versão simplificada: duas metades limpas (sem o detalhe interno)

interface FlorenceIconProps {
  size?: number;
  className?: string;
}

export function FlorenceIcon({ size, className = "" }: FlorenceIconProps) {
  const sizeAttrs = size ? { width: size, height: size } : {};
  return (
    <svg
      {...sizeAttrs}
      viewBox="40 10 185 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Metade esquerda do círculo - azul claro (simplificada) */}
      <path
        fill="#0096d2"
        d="M129.87,107.56 s-2.09,-30.82 -88.9,-27.78 v122.83 s-1.3,77.26 88.9,98.09 Z"
      />
      {/* Metade direita do círculo - azul escuro (simplificada) */}
      <path
        fill="#00508c"
        d="M220.06,202.62 v-122.83 c-86.81,-3.04 -88.9,27.78 -88.9,27.78 V299.7 c90.2,-20.83 88.9,-98.09 88.9,-98.09 Z"
      />
      {/* Pétala superior - azul escuro */}
      <path
        fill="#00508c"
        fillRule="evenodd"
        d="M129.84,12.23c8.44,8.76,15.18,22.4,14.44,35.24-.99,17.04-6.52,24.57-14.09,33.65-7.56-9.08-13.49-21.51-13.49-34.37-.25-12.86,4.65-24.54,12.47-33.61"
      />
      {/* Pétala esquerda - azul claro */}
      <path
        fill="#0096d2"
        fillRule="evenodd"
        d="M115.43,47.21c-8.94-9.13-20.62-13.81-32.51-14.64l-1.11-.16c.29,12.17,5.24,26.55,14.89,35.05,12.02,10.6,20.91,12.44,31.69,13.47-8.14-10.18-12.83-22.37-12.96-33.72Z"
      />
      {/* Pétala direita - azul claro */}
      <path
        fill="#0096d2"
        fillRule="evenodd"
        d="M178.12,32.56c-11.9.83-23.59,5.52-32.54,14.67,0,.1,0,.21,0,.31-.96,16.56-5.99,24.23-13.59,33.44,11.09-1.01,20.09-2.71,32.36-13.53,9.65-8.5,14.6-22.89,14.89-35.05l-1.11.16Z"
      />
    </svg>
  );
}
