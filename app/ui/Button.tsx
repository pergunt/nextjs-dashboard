'use client'

import clsx from 'clsx';
import {useState} from 'react'
import {useFormStatus} from "react-dom";
import Spin from './spin'
import {motion} from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  kind?: 'primary' | 'default';
}

 const Button = ({ children, className, icon, kind = 'default',  ...rest }: ButtonProps) =>{
   const {pending} = useFormStatus()
   const [state, setState] = useState(0)

   const isSubmit = rest.type === 'submit'

  return (
    <button
      {...rest}
      onClick={(e) => {
        setState(state + 1)
        setTimeout(() => {
          setState(prev => prev - 1)
        }, 2000)

        if (!pending) {
          rest.onClick?.(e)
        }
      }}
      className={clsx(
        'flex items-center justify-center relative py-2 px-3 rounded-lg text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        {
          'text-white bg-blue-500 hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600': kind === 'primary',
          'hover:bg-gray-100 border': kind === 'default',
        },
        className,
      )}
    >
      {pending && isSubmit
        ? (
          <motion.div
            className={children ? 'mr-2' : undefined}
            initial={{ width: children ? 0 : 14 }}
            animate={{width: 14}}
            transition={{duration: 0.5, type: 'tween',}}
          >
            <Spin className={kind === 'primary' ? 'fill-white' : 'fill-black'} />
          </motion.div>
        )
        : icon
      } {children}
      {Array(state).fill(0).map((i, index) => (
        <motion.span
          key={index}
          className='absolute rounded-lg bg-inherit'
          transition={{duration: .4, type: "tween" }}
          animate={{
            scale: [1, 1.2, 1],
            left: [0, -1.2, 0],
            top: [0, -1.2, 0],
            right: [0, -1.2, 0],
            bottom: [0, -1.2, 0],
            opacity: [0, 0.3, 0],
          }}
        />
      ))}
    </button>
  );
 }

export default Button
