import Link from "next/link";
import {PencilIcon} from "@heroicons/react/24/outline";

const UpdateLink = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export default UpdateLink
