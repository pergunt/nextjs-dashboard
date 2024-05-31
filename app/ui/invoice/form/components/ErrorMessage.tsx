import { FC } from 'react';

interface ErrorMessageProps {
  id: string;
  errors: string[] | undefined;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ id, errors }) => {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
};

export default ErrorMessage;
