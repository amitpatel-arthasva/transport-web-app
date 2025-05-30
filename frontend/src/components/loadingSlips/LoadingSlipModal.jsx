import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import { useToast } from '../common/ToastSystem';
import Step1CompanyDetails from './steps/Step1CompanyDetails';
import Step2LoadingMaterial from './steps/Step2LoadingMaterial';
import Step3TruckDriver from './steps/Step3TruckDriver';
import Step4FreightDetails from './steps/Step4FreightDetails';

const LoadingSlipModal = ({ isOpen, onClose, onSubmit, loadingSlip, mode }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    slipNumber: '',
    loadingDate: new Date().toISOString().slice(0, 10),
    
    // Company Details
    companyDetails: {
      companyName: '',
      gstNumber: '',
      contactNumber: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pinCode: '',
      loadingContactNumber: ''
    },

    // Reference Details
    referenceDetails: {
      confirmThrough: 'Call',
      referenceDate: new Date().toISOString().slice(0, 10),
      referenceNumber: ''
    },
    
    // Loading Material Details
    loadingMaterial: {
      loadType: 'Full Load',
      from: '',
      to: '',
      approxLoadingWeight: {
        value: '',
        unit: 'MT'
      },
      materials: [{
        materialName: '',
        packagingType: 'Bags',
        numberOfArticles: ''
      }]
    },

    // Truck Details
    truckDetails: {
      truckNumber: '',
      vehicleType: 'Full Body Trailer',
      allocatedLRNumber: '',
      dimensions: {
        loadingLengthFt: '',
        loadingWidthFt: '',
        loadingHeightFt: ''
      },
      overload: false
    },

    // Driver Details
    driverDetails: {
      driverName: '',
      driverMobile: '',
      licenseNumber: '',
      licenseExpiryDate: ''
    },

    // Freight Details
    freightDetails: {
      basicFreight: {
        amount: '',
        type: 'FIX'
      },
      confirmedAdvance: '',
      balanceAmount: '',
      loadingChargePayBy: 'Company',
      loadingChargeByDriver: {
        amount: '',
        type: 'FULL Truck'
      }
    },

    // Remarks
    remarks: '',

    // Status
    status: 'Created'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Company Details', subtitle: 'Loading slip and company information' },
    { number: 2, title: 'Loading Material', subtitle: 'Material and location details' },
    { number: 3, title: 'Truck & Driver', subtitle: 'Vehicle and driver information' },
    { number: 4, title: 'Freight Details', subtitle: 'Pricing and payment details' }
  ];

  // Populate form data when editing
  useEffect(() => {
    if (mode === 'edit' && loadingSlip) {
      setFormData({
        ...loadingSlip,
        loadingDate: loadingSlip.loadingDate ? new Date(loadingSlip.loadingDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        referenceDetails: {
          ...loadingSlip.referenceDetails,
          referenceDate: loadingSlip.referenceDetails?.referenceDate ? new Date(loadingSlip.referenceDetails.referenceDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        },
        driverDetails: {
          ...loadingSlip.driverDetails,
          licenseExpiryDate: loadingSlip.driverDetails?.licenseExpiryDate ? new Date(loadingSlip.driverDetails.licenseExpiryDate).toISOString().slice(0, 10) : ''
        }
      });
    }
  }, [loadingSlip, mode]);

  // Calculate balance amount when basic freight or advance changes
  useEffect(() => {
    const basicFreightAmount = parseFloat(formData.freightDetails.basicFreight.amount) || 0;
    const confirmedAdvance = parseFloat(formData.freightDetails.confirmedAdvance) || 0;
    
    setFormData(prevData => ({
      ...prevData,
      freightDetails: {
        ...prevData.freightDetails,
        balanceAmount: (basicFreightAmount - confirmedAdvance).toFixed(2)
      }
    }));
  }, [formData.freightDetails.basicFreight.amount, formData.freightDetails.confirmedAdvance]);

  // Validation functions - simplified like LorryReceiptModal
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.slipNumber.trim() && 
               formData.companyDetails.companyName.trim() && 
               formData.companyDetails.contactNumber.trim() && 
               formData.companyDetails.address.trim() &&
               formData.companyDetails.city.trim() &&
               formData.companyDetails.state.trim() &&
               formData.companyDetails.pinCode.trim();
      case 2:
        return formData.loadingMaterial.from.trim() && 
               formData.loadingMaterial.to.trim() && 
               formData.loadingMaterial.materials.some(material => material.materialName.trim());
      case 3:
        return formData.truckDetails.truckNumber.trim() && 
               formData.driverDetails.driverName.trim() && 
               formData.driverDetails.driverMobile.trim() &&
               formData.driverDetails.licenseNumber.trim() &&
               formData.driverDetails.licenseExpiryDate;
      case 4:
        return formData.freightDetails.basicFreight.amount;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSectionChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, nestedSection, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [nestedSection]: {
          ...prevData[section][nestedSection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayChange = (section, nestedSection, index, field, value) => {
    setFormData(prevData => {
      const updatedArray = [...prevData[section][nestedSection]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          [nestedSection]: updatedArray
        }
      };
    });
  };

  const handleAddArrayItem = (section, nestedSection, defaultItem) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [nestedSection]: [...prevData[section][nestedSection], defaultItem]
      }
    }));
  };

  const handleRemoveArrayItem = (section, nestedSection, index) => {
    setFormData(prevData => {
      const updatedArray = [...prevData[section][nestedSection]];
      if (updatedArray.length > 1) {
        updatedArray.splice(index, 1);
      } else {
        toast.error('At least one item is required');
        return prevData;
      }
      
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          [nestedSection]: updatedArray
        }
      };
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting loading slip:', error);
      toast.error('Failed to submit loading slip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={mode === 'create' ? 'Create New Loading Slip' : 'Edit Loading Slip'}
      subtitle={steps[currentStep - 1].subtitle}
      showCloseButton={false}
    >
      {/* Steps Indicator */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50">
        <div className="flex justify-between overflow-x-auto pb-2 sm:pb-0">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex items-center min-w-0 ${index < steps.length - 1 ? 'flex-1' : ''} mr-2 sm:mr-0`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  currentStep >= step.number
                    ? 'bg-primary-400 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <div className="ml-2 min-w-0 hidden sm:block">
                <p className={`text-xs sm:text-sm font-medium truncate ${
                  currentStep >= step.number ? 'text-primary-400' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 sm:mx-4 hidden sm:block ${
                  currentStep > step.number ? 'bg-primary-400' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        {/* Mobile step titles */}
        <div className="mt-2 sm:hidden">
          <p className="text-xs font-medium text-primary-400 text-center">
            {steps[currentStep - 1].title}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <Step1CompanyDetails 
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onSectionChange={handleSectionChange}
            />
          )}
          {currentStep === 2 && (
            <Step2LoadingMaterial 
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onSectionChange={handleSectionChange}
              onNestedChange={handleNestedInputChange}
              onArrayChange={handleArrayChange}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
            />
          )}
          {currentStep === 3 && (
            <Step3TruckDriver
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onSectionChange={handleSectionChange}
              onNestedChange={handleNestedInputChange}
            />
          )}
          {currentStep === 4 && (
            <Step4FreightDetails
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onSectionChange={handleSectionChange}
              onNestedChange={handleNestedInputChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2 p-4 sm:p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-primary-400 hover:none md:hover:bg-primary-300 text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                <span className="truncate">{mode === 'create' ? 'Create Loading Slip' : 'Update Loading Slip'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingSlipModal;
