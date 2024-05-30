import {TrashIcon} from "@heroicons/react/24/outline";
import {invoiceActions} from 'actions'
import Button from '../../../../Button'

const DeleteButton = ({ id }: { id: string }) => {
  return (
    <form action={invoiceActions.deleteOne.bind(null, id)}>
      <Button
        type='submit'
        className="rounded-md border hover:bg-gray-100 w-[38px]"
      >
        <TrashIcon className="w-5" />
      </Button>
    </form>
  );
}

export default DeleteButton
