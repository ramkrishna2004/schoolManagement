import React, { useRef, useEffect } from 'react';

export default function AnimatedInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  ...props
}) {
  const inputRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (labelRef.current) {
      labelRef.current.innerHTML = label
        .split('')
        .map(
          (letter, idx) =>
            `<span style="transition-delay: ${idx * 100}ms"
              class="inline-block transition-all duration-100 ease-[cubic-bezier(0.4,0,0.2,1.5)] 
              opacity-40 translate-y-0 scale-90 text-gray-500">${letter}</span>`
        )
        .join('');
    }
  }, [label]);

  const animateLabelUp = () => {
    const labelEl = labelRef.current;
    if (!labelEl) return;
    labelEl.classList.add('!-top-2', '!text-xs', '!text-indigo-600', '!bg-white', '!px-1', '!shadow-lg');
    labelEl.querySelectorAll('span').forEach((span, idx) => {
      setTimeout(() => {
        span.classList.remove('opacity-40', 'translate-y-0', 'scale-90', 'text-gray-500');
        span.classList.add('opacity-100', 'text-indigo-600', 'letter-rise');
        setTimeout(() => span.classList.remove('letter-rise'), 100);
      }, idx * 100);
    });
  };

  const animateLabelDown = () => {
    const labelEl = labelRef.current;
    if (!labelEl) return;
    if (!inputRef.current.value) {
      labelEl.classList.remove('!-top-2', '!text-xs', '!text-indigo-600', '!bg-white', '!px-1', '!shadow-lg');
      labelEl.querySelectorAll('span').forEach((span, idx) => {
        setTimeout(() => {
          span.classList.remove('opacity-100', 'text-indigo-600');
          span.classList.add('opacity-40', 'translate-y-0', 'scale-90', 'text-gray-500', 'letter-drop');
          setTimeout(() => span.classList.remove('letter-drop'), 100);
        }, idx * 100);
      });
    }
  };

  useEffect(() => {
    if (value && labelRef.current) {
      animateLabelUp();
      labelRef.current.querySelectorAll('span').forEach(span => {
        span.classList.remove('opacity-40', 'translate-y-0', 'scale-90', 'text-gray-500');
        span.classList.add('opacity-100', 'text-indigo-600');
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="relative group my-6">
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={animateLabelUp}
        onBlur={animateLabelDown}
        onInput={e => {
          if (e.target.value) animateLabelUp();
          else animateLabelDown();
        }}
        placeholder=" "
        className="w-full px-3 py-2 pt-5 bg-white border-2 border-gray-200 rounded-lg shadow-md \
          focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 \
          transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] peer\
          text-gray-800 text-sm"
        {...props}
      />
      <label
        ref={labelRef}
        htmlFor={id}
        className="absolute left-3 top-3.5 text-gray-500 flex space-x-0.5 \
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base \
          transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] \
          transform origin-left"
        id={`floating-label-${id}`}
      />
      <span className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 \
        group-focus:w-full transition-all duration-300 ease-in-out"></span>
      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(0.9); opacity: 0.4; }
          100% { transform: translateY(-12px) scale(1); opacity: 1; }
        }
        .letter-rise {
          animation: rise 0.1s cubic-bezier(0.4, 0, 0.2, 1.5) forwards;
        }
        @keyframes drop {
          0% { transform: translateY(-12px) scale(1); opacity: 1; }
          100% { transform: translateY(0) scale(0.9); opacity: 0.4; }
        }
        .letter-drop {
          animation: drop 0.1s cubic-bezier(0.4, 0, 0.2, 1.5) forwards;
        }
      `}</style>
    </div>
  );
} 