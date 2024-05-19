import {TrashIcon} from "@heroicons/react/24/outline";
import {invoiceActions} from 'actions'

const DeleteButton = ({ id }: { id: string }) => {
  const handleDelete = invoiceActions.deleteOne.bind(null, id)

  return (
    <form action={handleDelete}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export default DeleteButton
