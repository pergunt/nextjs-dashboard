'use client'

import clsx from 'clsx';
import {useFormStatus} from "react-dom";
import Spin from './spin'
import {useAutoAnimate} from '@formkit/auto-animate/react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  kind?: 'primary' | 'default';
}

 const Button = ({ children, className, kind = 'default',  ...rest }: ButtonProps) =>{
   const {pending} = useFormStatus()
   const [parent] = useAutoAnimate()

   const isSubmit = rest.type === 'submit'
   const fill = kind === 'primary' ? 'white' : 'black'

  return (
    <button
      {...rest}
      ref={parent}
      className={clsx(
        'flex items-center justify-center p-2 w-auto min-w-[38px] h-[38px] rounded-lg text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        {
          'text-white bg-blue-500 hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600': kind === 'primary',
          'hover:bg-gray-100 border': kind === 'default'
        },
        className,
      )}
    >
      {pending && isSubmit
        ? <Spin fill={fill} animate={!!children} />
        : children
      }
    </button>
  );
}

export default Button
