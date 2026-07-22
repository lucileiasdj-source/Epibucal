import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

const IHOS_CODES: Record<number, string> = {
  0: 'Sem placa',
  1: 'Até 1/3',
  2: '1/3 a 2/3',
  3: 'Mais de 2/3',
  9: 'Não registrado',
};

const IHOS_SUBSTITUTE_HINT: Record<number, string> = {
  16: 'Verificar dente 17 antes',
  11: 'Verificar dentes 12, 21 ou 22 antes',
  26: 'Verificar dente 27 antes',
  31: 'Verificar dentes 32, 41 ou 42 antes',
  36: 'Verificar dente 37 antes',
  46: 'Verificar dente 47 antes',
};

interface DropdownPos {
  top: number;
  left: number;
  width: number;
}

interface IhosSelectProps {
  toothNumber: number;
  value: number;
  onChange: (value: number) => void;
}

export function IhosSelect({ toothNumber, value, onChange }: IhosSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  function toggle() {
    updatePos();
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function handleClose(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insideList = listRef.current?.contains(target);
      if (!insideTrigger && !insideList) {
        setOpen(false);
      }
    }
    function handleScroll() {
      updatePos();
    }
    document.addEventListener('mousedown', handleClose);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClose);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, updatePos]);

  function select(code: number) {
    onChange(code);
    setOpen(false);
  }

  const hint = IHOS_SUBSTITUTE_HINT[toothNumber];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-1 text-xs border rounded-lg px-2 py-1.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer text-left"
      >
        <span className="truncate">
          {value} - {IHOS_CODES[value] ?? 'Não registrado'}
        </span>
        <ChevronDown className={`w-3 h-3 flex-shrink-0 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <ul
          ref={listRef}
          role="listbox"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden text-xs"
        >
          {(Object.entries(IHOS_CODES) as [string, string][]).map(([codigo, descricao]) => {
            const code = Number(codigo);
            const isSelected = value === code;
            const is9 = code === 9;

            return (
              <li key={codigo} role="option" aria-selected={isSelected}>
                {is9 && <div className="border-t border-gray-200 mx-2" />}
                <div
                  onClick={() => select(code)}
                  className={`px-3 py-2 cursor-pointer transition-colors duration-100
                    ${isSelected ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-mono w-4 flex-shrink-0">{codigo}</span>
                    <span>{descricao}</span>
                  </div>
                  {is9 && hint && (
                    <div className="ml-6 mt-0.5 text-gray-400 leading-tight">
                      ↳ {hint}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>,
        document.body
      )}
    </>
  );
}
