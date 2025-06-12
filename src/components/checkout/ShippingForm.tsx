'use client';

import { IAddress } from '@/types';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from "motion/react";

interface ShippingFormProps {
  shippingAddress: IAddress;
  setShippingAddress: (address: IAddress) => void;
  onNext: () => void;
  userAddresses: IAddress[];
  isLoadingUserAddresses: boolean;
}

// Define the initial/empty address object
const initialShippingAddress: IAddress = {
  street: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  label: 'Home',
  isDefault: false,
};

export default function ShippingForm({
  shippingAddress,
  setShippingAddress,
  onNext,
  userAddresses,
  isLoadingUserAddresses,
}: ShippingFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useSavedAddress, setUseSavedAddress] = useState<string>('');

  // Effect to set the initial `useSavedAddress` state
  useEffect(() => {
    if (!isLoadingUserAddresses && userAddresses.length > 0) {
      const defaultAddr = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
      if (defaultAddr && defaultAddr._id) {
        setUseSavedAddress(defaultAddr._id.toString());
        setShippingAddress({ ...defaultAddr });
      } else {
        setUseSavedAddress('new');
        setShippingAddress(initialShippingAddress);
      }
    } else if (!isLoadingUserAddresses && userAddresses.length === 0) {
      setUseSavedAddress('new');
      setShippingAddress(initialShippingAddress);
    }
  }, [userAddresses, isLoadingUserAddresses, setShippingAddress]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state?.trim()) newErrors.state = 'State/Province is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'Zip/Postal Code is required';
    if (!shippingAddress.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleAddressSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    setUseSavedAddress(selectedId);

    if (selectedId === 'new') {
      setShippingAddress(initialShippingAddress);
    } else {
      const selectedAddr = userAddresses.find(addr => addr._id?.toString() === selectedId);
      if (selectedAddr) {
        setShippingAddress({ ...selectedAddr });
      }
    }
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    } else {
      toast.error("Please fill in all required shipping fields correctly.");
    }
  };

  // Variants for the overall form container
  const formContainerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.08, // Stagger initial sections
      },
    },
  };

  // Variants for the "Select a Saved Address" section
  const savedAddressSectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.05, // Stagger individual saved address labels
      },
    },
  };

  // Variants for individual saved address labels
  const addressLabelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Variants for the "New Shipping Address" section (conditional rendering)
  const newAddressSectionVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' }, // For collapsing/expanding
    visible: {
      opacity: 1,
      height: 'auto', // Expands to fit content
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.08, // Stagger individual form fields
      },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.4, ease: "easeIn" } },
  };

  // Variants for individual form input fields
  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Variants for the action button group
  const buttonGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.3 } },
  };


  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {isLoadingUserAddresses ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-neutral-600"
        >
          Loading saved addresses...
        </motion.div>
      ) : (
        <AnimatePresence mode="wait"> {/* Use AnimatePresence for conditional rendering */}
          {userAddresses && userAddresses.length > 0 && (
            <motion.div
              key="saved-addresses" // Unique key for AnimatePresence
              variants={savedAddressSectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden" // Ensure it animates out if userAddresses becomes empty
              className="mb-6 border-b border-neutral-200 pb-6"
            >
              <h3 className="text-lg font-medium text-neutral-800 mb-3">Select a Saved Address</h3>
              <div className="space-y-3">
                {userAddresses.map((addr) => (
                  <motion.label
                    key={addr._id?.toString()}
                    variants={addressLabelVariants} // Apply stagger to labels
                    className={`flex items-center p-4 rounded-md border cursor-pointer transition-colors duration-200
                      ${useSavedAddress === addr._id?.toString() ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addr._id?.toString() || ''}
                      checked={useSavedAddress === addr._id?.toString()}
                      onChange={handleAddressSelectionChange}
                      className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
                    />
                    <div className="flex-grow text-sm text-neutral-700">
                      <p className="font-medium">
                        {addr.street}
                        {addr.apartment && `, ${addr.apartment}`}
                        , {addr.city}
                      </p>
                      <p>{addr.state} {addr.zipCode}, {addr.country}</p>
                      {addr.isDefault && <span className="text-xs text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full mt-1 inline-block">Default</span>}
                    </div>
                  </motion.label>
                ))}
                <motion.label
                  variants={addressLabelVariants} // Apply stagger to this label too
                  className={`flex items-center p-4 rounded-md border cursor-pointer transition-colors duration-200
                    ${useSavedAddress === 'new' ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value="new"
                    checked={useSavedAddress === 'new'}
                    onChange={handleAddressSelectionChange}
                    className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
                  />
                  <span className="font-medium text-neutral-800">Enter a New Address</span>
                </motion.label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}


      <AnimatePresence mode="wait">
        {(useSavedAddress === 'new' || userAddresses.length === 0) && (
          <motion.div
            key="new-address-form" // Unique key for AnimatePresence
            variants={newAddressSectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // Animates out when user switches to a saved address
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-neutral-800 mb-3">
              {userAddresses.length > 0 ? "New Shipping Address" : "Shipping Address"}
            </h3>
            {/* Address Line 1 */}
            <motion.div variants={fieldVariants}>
              <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">
                Street Address <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingAddress.street}
                onChange={handleManualChange}
                className={`mt-1 block w-full border ${errors.street ? 'border-secondary-500' : 'border-neutral-300'} rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500`}
                required
              />
              {errors.street && <p className="mt-1 text-sm text-secondary-500">{errors.street}</p>}
            </motion.div>

            {/* Apartment, Suite, etc. (Optional) */}
            <motion.div variants={fieldVariants}>
              <label htmlFor="apartment" className="block text-sm font-medium text-neutral-700 mb-1">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                value={shippingAddress.apartment || ''}
                onChange={handleManualChange}
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </motion.div>

            {/* City */}
            <motion.div variants={fieldVariants}>
              <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                City <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleManualChange}
                className={`mt-1 block w-full border ${errors.city ? 'border-secondary-500' : 'border-neutral-300'} rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500`}
                required
              />
              {errors.city && <p className="mt-1 text-sm text-secondary-500">{errors.city}</p>}
            </motion.div>

            {/* State / Province */}
            <motion.div variants={fieldVariants}>
              <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                State / Province <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleManualChange}
                className={`mt-1 block w-full border ${errors.state ? 'border-secondary-500' : 'border-neutral-300'} rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500`}
                required
              />
              {errors.state && <p className="mt-1 text-sm text-secondary-500">{errors.state}</p>}
            </motion.div>

            {/* Zip / Postal Code */}
            <motion.div variants={fieldVariants}>
              <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                Zip / Postal Code <span className="text-secondary-500">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleManualChange}
                className={`mt-1 block w-full border ${errors.zipCode ? 'border-secondary-500' : 'border-neutral-300'} rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500`}
                required
              />
              {errors.zipCode && <p className="mt-1 text-sm text-secondary-500">{errors.zipCode}</p>}
            </motion.div>

            {/* Country */}
            <motion.div variants={fieldVariants}>
              <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                Country <span className="text-secondary-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleManualChange}
                className={`mt-1 block w-full border ${errors.country ? 'border-secondary-500' : 'border-neutral-300'} rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500`}
                required
              >
                <option value="">Select a country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="India">India</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && <p className="mt-1 text-sm text-secondary-500">{errors.country}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.div
        variants={buttonGroupVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-end pt-4 border-t border-neutral-200"
      >
        <button
          type="submit"
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Continue to Payment
        </button>
      </motion.div>
    </motion.form>
  );
}