import { FC } from 'react';

export const AddressCard: FC<{ address: string }> = ({ address }) => {
  return (
    <div className="mb-4 border mt-4 rounded-lg shadow-sm 2xl:col-span-2 border-gray-700 p-6 bg-gray-800">
      <div className="text-center">
        <h1 className="text-l text-white">{address}</h1>
      </div>
    </div>
  );
};
