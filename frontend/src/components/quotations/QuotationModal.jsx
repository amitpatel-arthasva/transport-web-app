import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal';
import { useToast } from '../common/ToastSystem';
import Step1CompanyDetails from './steps/Step1CompanyDetails';
import Step2TripMaterialDetails from './steps/Step2TripMaterialDetails';
import Step3VehicleFreightDetails from './steps/Step3VehicleFreightDetails';
import Step4TermsValidity from './steps/Step4TermsValidity';

const QuotationModal = ({ isOpen, onClose, onSubmit, quotation, mode }) => {
  const toast = useToast();  const [formData, setFormData] = useState({
    quoteToCompany: {
      companyName: '',
      gstNumber: '',
      contactNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      inquiryVia: 'Email',
      inquiryDate: '',
      referenceDocumentId: '',
      inquiryByPerson: ''
    },
    materialDetails: [{
      materialName: '',
      packagingType: 'Bags',
      weight: { value: '', unit: 'KG' },
      numberOfArticles: '',
      dimensions: { lengthFt: '', widthFt: '', heightFt: '' }
    }],
    tripDetails: {
      fullOrPartLoad: 'Full Load',
      from: '',
      pickupPoints: [''],
      to: '',
      deliveryPoints: [''],
      loadingDate: '',
      tripType: 'One Way'
    },
    vehicleDetails: [{
      vehicleType: '',
      weightGuarantee: { value: '', unit: 'KG' },
      freightRate: { value: '', unit: 'Per KG' },
      dimensions: { lengthFt: '', widthFt: '', heightFt: '' },
      numberOfTrucks: '',
      openSides: {
        allSide: false,
        driverSide: false,
        driverOppositeSide: false,
        towardsEnd: false,
        height: false
      }
    }],
    freightBreakup: {
      rate: { value: '', type: 'Fixed' },
      tds: { value: '', type: 'Deduction' },
      extraCharges: {
        loadingCharge: '',
        unloadingCharge: '',
        doorPickupCharge: '',
        doorDeliveryCharge: '',
        packingCharge: '',
        unpackingCharge: '',
        cashOnDelivery: '',
        deliveryOnDateCharge: '',
        tollTax: '',
        odcCharge: '',
        serviceChargePercent: '',
        otherCharges: '',
        totalExtraCharges: ''
      },
      applicableGST: 'NIL (On reverse charge)',
      gstAmount: '',
      totalFreightWithGst: ''
    },
    paymentTerms: {
      payBy: 'Consignor',
      driverCashRequired: '',
      customTerms: {
        advancePaidAmount: { value: '', type: 'Fix' },
        afterLoading: { value: '', type: 'Fix' },
        afterDelivery: { value: '', type: 'Fix' },
        afterPOD: { value: '', type: 'Fix' }
      },
      paymentDate: { type: 'Days', value: '' },
      paymentRemark: ''
    },
    quotationValidity: {
      validUpTo: { type: 'Days', value: '' },
      expiryDate: ''
    },
    demurrage: {
      chargePerHour: { value: '', type: 'Per Hour' },
      applicableAfterHours: ''
    }
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { number: 1, title: 'Company Details', subtitle: 'Quote recipient information' },
    { number: 2, title: 'Trip & Material', subtitle: 'Trip and material details' },
    { number: 3, title: 'Vehicle & Freight', subtitle: 'Vehicle and pricing details' },
    { number: 4, title: 'Terms & Validity', subtitle: 'Payment terms and validity' }
  ];

  // Validation functions
  const validateStep1 = () => {
    const errors = [];
    if (!formData.quoteToCompany.companyName.trim()) {
      errors.push('Company Name is required');
    }
    return errors;
  };

  const validateStep2 = () => {
    const errors = [];
    if (!formData.tripDetails.from.trim()) {
      errors.push('From location is required');
    }
    if (!formData.tripDetails.to.trim()) {
      errors.push('To location is required');
    }
    // Check if at least one material has a name
    const hasValidMaterial = formData.materialDetails.some(material => 
      material.materialName.trim()
    );
    if (!hasValidMaterial) {
      errors.push('At least one material with a name is required');
    }
    return errors;
  };
  const validateStep3 = () => {
    const errors = [];
    // Check if at least one vehicle type is specified
    const hasValidVehicle = formData.vehicleDetails.some(vehicle => 
      vehicle.vehicleType.trim()
    );
    if (!hasValidVehicle) {
      errors.push('At least one vehicle type is required');
    }
    return errors;
  };

  const validateStep4 = () => {
    const errors = [];
    // Optional validation for Step 4 - could add payment terms validation here
    return errors;
  };  const validateCurrentStep = () => {
    let errors = [];
    switch (currentStep) {
      case 1:
        errors = validateStep1();
        break;
      case 2:
        errors = validateStep2();
        break;
      case 3:
        errors = validateStep3();
        break;
      case 4:
        errors = validateStep4();
        break;
      default:
        errors = [];
    }
    return errors;
  };

  useEffect(() => {
    if (mode === 'edit' && quotation) {
      setFormData(quotation);
    }
  }, [mode, quotation]);
  const handleInputChange = (section, field, value, subField = null, subSubField = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subSubField) {
        // Handle nested objects like customTerms.advancePaidAmount.value
        if (!newData[section][field]) newData[section][field] = {};
        if (!newData[section][field][subField]) newData[section][field][subField] = {};
        newData[section][field][subField][subSubField] = value;
      } else if (subField) {
        if (!newData[section][field]) newData[section][field] = {};
        newData[section][field][subField] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
  };
  const handleArrayInputChange = (section, index, field, value, subField = null, subSubField = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subSubField) {
        if (!newData[section][index][field]) newData[section][index][field] = {};
        if (!newData[section][index][field][subField]) newData[section][index][field][subField] = {};
        newData[section][index][field][subField][subSubField] = value;
      } else if (subField) {
        if (!newData[section][index][field]) newData[section][index][field] = {};
        newData[section][index][field][subField] = value;
      } else {
        newData[section][index][field] = value;
      }
      return newData;
    });
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materialDetails: [...prev.materialDetails, {
        materialName: '',
        packagingType: 'Bags',
        weight: { value: '', unit: 'KG' },
        numberOfArticles: '',
        dimensions: { lengthFt: '', widthFt: '', heightFt: '' }
      }]
    }));
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materialDetails: prev.materialDetails.filter((_, i) => i !== index)
    }));
  };
  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicleDetails: [...prev.vehicleDetails, {
        vehicleType: '',
        weightGuarantee: { value: '', unit: 'KG' },
        freightRate: { value: '', unit: 'Per KG' },
        dimensions: { lengthFt: '', widthFt: '', heightFt: '' },
        numberOfTrucks: '',
        openSides: {
          allSide: false,
          driverSide: false,
          driverOppositeSide: false,
          towardsEnd: false,
          height: false
        }
      }]
    }));
  };

  const removeVehicle = (index) => {
    setFormData(prev => ({
      ...prev,
      vehicleDetails: prev.vehicleDetails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting quotation:', error);
    } finally {
      setLoading(false);
    }
  };
  const nextStep = () => {
    const errors = validateCurrentStep();
    if (errors.length > 0) {
      // Show validation errors using toast
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={mode === 'create' ? 'Create New Quotation' : 'Edit Quotation'}
      subtitle={steps[currentStep - 1].subtitle}
      showCloseButton={false}
    >      {/* Steps Indicator */}
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
      </div>      {/* Form Content */}
      <div className="flex-1 overflow-hidden flex flex-col">        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <Step1CompanyDetails 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}
          {currentStep === 2 && (
            <Step2TripMaterialDetails 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleArrayInputChange={handleArrayInputChange}
              addMaterial={addMaterial}
              removeMaterial={removeMaterial}
            />
          )}
          {currentStep === 3 && (
            <Step3VehicleFreightDetails 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleArrayInputChange={handleArrayInputChange}
              addVehicle={addVehicle}
              removeVehicle={removeVehicle}
            />
          )}
          {currentStep === 4 && (
            <Step4TermsValidity 
              formData={formData} 
              handleInputChange={handleInputChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2 p-4 sm:p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={prevStep}
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
                onClick={nextStep}
                className="bg-primary-400 hover:none md:hover:bg-primary-300 text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-400 hover:bg-primary-300 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  <span className="truncate">{mode === 'create' ? 'Create Quotation' : 'Update Quotation'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuotationModal;
