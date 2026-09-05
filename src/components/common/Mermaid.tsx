import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  id?: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
  themeVariables: {
    primaryColor: '#0ea5e9',
    primaryTextColor: '#fff',
    primaryBorderColor: '#0ea5e9',
    lineColor: '#cbd5e1',
    secondaryColor: '#1e293b',
    tertiaryColor: '#334155',
  }
});

const Mermaid: React.FC<MermaidProps> = ({ chart, id = 'mermaid-chart' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      try {
        ref.current.removeAttribute('data-processed');
        mermaid.contentLoaded();
      } catch (error) {
        console.error('Mermaid error:', error);
      }
    }
  }, [chart]);

  return (
    <div className="mermaid-wrapper flex justify-center bg-muted/30 p-4 rounded-xl border overflow-auto min-h-[300px]">
      <div key={chart} className="mermaid" ref={ref}>
        {chart}
      </div>
    </div>
  );
};

export default Mermaid;
