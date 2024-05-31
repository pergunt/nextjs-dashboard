import { TrashIcon } from '@heroicons/react/24/outline';
import { invoiceActions } from 'actions';
import Button from '../../../../Button';

const DeleteButton = ({ id }: { id: string }) => {
  return (
    <form action={invoiceActions.deleteOne.bind(null, id)}>
      <Button
        type="submit"
        className="rounded-md border hover:bg-gray-100"
        icon={<TrashIcon className="w-5" />}
      />
    </form>
  );
};

export default DeleteButton;
