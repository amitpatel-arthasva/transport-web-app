import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faArrowLeft, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../common/ToastSystem';
import Step1PartyDetails from './steps/Step1PartyDetails';
import Step2ParcelDetails from './steps/Step2ParcelDetails';
import Step3FreightDetails from './steps/Step3FreightDetails';
import Step4DeliveryDetails from './steps/Step4DeliveryDetails';

const DeliverySlipModal = ({ isOpen, onClose, onSubmit, deliverySlip, mode }) => {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    deliverySlipNumber: '',
    date: new Date().toISOString().split('T')[0],
    partyDetails: {
      sender: {
        senderName: '',
        senderContactNumber: '',
      },
      receiver: {
        receiverName: '',
        receiverContactNumber: '',
      }
    },
    parcelDetails: {
      transporterName: '',
      transporterContactNumber: '',
      parcelFrom: '',
      lrNumber: '',
      totalArticleQuantity: '',
      materialName: ''
    },
    freightDetails: {
      charges: {
        biltyFreight: '',
        deliveryCharge: '',
        labourCharge: '',
        biltyCharge: '',
        haltingCharge: '',
        warehouseCharge: '',
        localTransportCharge: '',
        otherCharges: ''
      },
      deliveryCollection: 0,
      gstDetails: {
        applicableGST: 'NIL (On reverse charge)',
        gstAmount: 0
      },
      roundOff: false,
      totalFreight: 0
    },
    deliveryBy: {
      contactNumber: ''
    },
    status: 'Created',
    deliveryNotes: ''
  });

  // Load data for edit mode
  useEffect(() => {
    if (mode === 'edit' && deliverySlip) {
      // Format date
      const formattedDate = deliverySlip.date 
        ? new Date(deliverySlip.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        ...deliverySlip,
        date: formattedDate,
        // Ensure all required nested objects exist
        partyDetails: {
          sender: {
            senderName: deliverySlip.partyDetails?.sender?.senderName || '',
            senderContactNumber: deliverySlip.partyDetails?.sender?.senderContactNumber || '',
          },
          receiver: {
            receiverName: deliverySlip.partyDetails?.receiver?.receiverName || '',
            receiverContactNumber: deliverySlip.partyDetails?.receiver?.receiverContactNumber || '',
          }
        },
        parcelDetails: {
          transporterName: deliverySlip.parcelDetails?.transporterName || '',
          transporterContactNumber: deliverySlip.parcelDetails?.transporterContactNumber || '',
          parcelFrom: deliverySlip.parcelDetails?.parcelFrom || '',
          lrNumber: deliverySlip.parcelDetails?.lrNumber || '',
          totalArticleQuantity: deliverySlip.parcelDetails?.totalArticleQuantity || '',
          materialName: deliverySlip.parcelDetails?.materialName || ''
        },
        freightDetails: {
          charges: {
            biltyFreight: deliverySlip.freightDetails?.charges?.biltyFreight || 0,
            deliveryCharge: deliverySlip.freightDetails?.charges?.deliveryCharge || 0,
            labourCharge: deliverySlip.freightDetails?.charges?.labourCharge || 0,
            biltyCharge: deliverySlip.freightDetails?.charges?.biltyCharge || 0,
            haltingCharge: deliverySlip.freightDetails?.charges?.haltingCharge || 0,
            warehouseCharge: deliverySlip.freightDetails?.charges?.warehouseCharge || 0,
            localTransportCharge: deliverySlip.freightDetails?.charges?.localTransportCharge || 0,
            otherCharges: deliverySlip.freightDetails?.charges?.otherCharges || 0
          },
          deliveryCollection: deliverySlip.freightDetails?.deliveryCollection || 0,
          gstDetails: {
            applicableGST: deliverySlip.freightDetails?.gstDetails?.applicableGST || 'NIL (On reverse charge)',
            gstAmount: deliverySlip.freightDetails?.gstDetails?.gstAmount || 0
          },
          roundOff: deliverySlip.freightDetails?.roundOff || 0,
          totalFreight: deliverySlip.freightDetails?.totalFreight || 0
        },
        deliveryBy: {
          contactNumber: deliverySlip.deliveryBy?.contactNumber || ''
        },
        status: deliverySlip.status || 'Created',
        deliveryNotes: deliverySlip.deliveryNotes || ''
      });
    }
  }, [deliverySlip, mode]);

  const updateFormData = (newData) => {
    setFormData(newData);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate delivery slip number
      if (!formData.deliverySlipNumber || formData.deliverySlipNumber.trim() === '') {
        newErrors.deliverySlipNumber = 'Delivery slip number is required';
      }
      
      // Validate Party Details
      if (!formData.partyDetails.sender.senderName || formData.partyDetails.sender.senderName.trim() === '') {
        newErrors.partyDetails = {
          ...newErrors.partyDetails,
          sender: { ...newErrors.partyDetails?.sender, senderName: 'Sender name is required' }
        };
      }
      
      if (!formData.partyDetails.sender.senderContactNumber || formData.partyDetails.sender.senderContactNumber.trim() === '') {
        newErrors.partyDetails = {
          ...newErrors.partyDetails,
          sender: { 
            ...newErrors.partyDetails?.sender, 
            senderContactNumber: 'Sender contact number is required' 
          }
        };
      }
      
      if (!formData.partyDetails.receiver.receiverName || formData.partyDetails.receiver.receiverName.trim() === '') {
        newErrors.partyDetails = {
          ...newErrors.partyDetails,
          receiver: { 
            ...newErrors.partyDetails?.receiver, 
            receiverName: 'Receiver name is required' 
          }
        };
      }
      
      if (!formData.partyDetails.receiver.receiverContactNumber || formData.partyDetails.receiver.receiverContactNumber.trim() === '') {
        newErrors.partyDetails = {
          ...newErrors.partyDetails,
          receiver: { 
            ...newErrors.partyDetails?.receiver, 
            receiverContactNumber: 'Receiver contact number is required' 
          }
        };
      }
    } else if (step === 2) {
      // Validate Parcel Details
      if (!formData.parcelDetails.transporterName || formData.parcelDetails.transporterName.trim() === '') {
        newErrors.parcelDetails = {
          ...newErrors.parcelDetails,
          transporterName: 'Transporter name is required'
        };
      }
      
      if (!formData.parcelDetails.transporterContactNumber || formData.parcelDetails.transporterContactNumber.trim() === '') {
        newErrors.parcelDetails = {
          ...newErrors.parcelDetails,
          transporterContactNumber: 'Transporter contact number is required'
        };
      }
      
      if (!formData.parcelDetails.parcelFrom || formData.parcelDetails.parcelFrom.trim() === '') {
        newErrors.parcelDetails = {
          ...newErrors.parcelDetails,
          parcelFrom: 'Parcel origin is required'
        };
      }
      
      if (!formData.parcelDetails.lrNumber || formData.parcelDetails.lrNumber.trim() === '') {
        newErrors.parcelDetails = {
          ...newErrors.parcelDetails,
          lrNumber: 'LR number is required'
        };
      }
      
      if (!formData.parcelDetails.totalArticleQuantity || formData.parcelDetails.totalArticleQuantity.toString().trim() === '') {
        newErrors.parcelDetails = {
          ...newErrors.parcelDetails,
          totalArticleQuantity: 'Total article quantity is required'
        };
      }
      
      if (!formData.parcelDetails.materialName || formData.parcelDetails.materialName.trim() === '') {
        newErrors.parcelDetails = {
          ...newErrors.parcelDetails,
          materialName: 'Material name is required'
        };
      }
    } else if (step === 3) {
      // No specific validation for freight details as most have defaults
    } else if (step === 4) {
      // Validate Delivery Details
      if (!formData.deliveryBy.contactNumber || formData.deliveryBy.contactNumber.trim() === '') {
        newErrors.deliveryBy = {
          ...newErrors.deliveryBy,
          contactNumber: 'Contact number is required'
        };
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validate all steps
    let allValid = true;
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate deliveryCollection and totalFreight before submitting
      const charges = formData.freightDetails.charges;
      const deliveryCollection = 
        (parseFloat(charges.biltyFreight) || 0) + 
        (parseFloat(charges.deliveryCharge) || 0) + 
        (parseFloat(charges.labourCharge) || 0) + 
        (parseFloat(charges.biltyCharge) || 0) + 
        (parseFloat(charges.haltingCharge) || 0) + 
        (parseFloat(charges.warehouseCharge) || 0) + 
        (parseFloat(charges.localTransportCharge) || 0) + 
        (parseFloat(charges.otherCharges) || 0);

      let totalFreight = 
        deliveryCollection + 
        (parseFloat(formData.freightDetails.gstDetails.gstAmount) || 0);

      // Apply round off if checkbox is checked
      if (formData.freightDetails.roundOff) {
        totalFreight = Math.round(totalFreight);
      }

      const finalFormData = {
        ...formData,
        deliverySlipNumber: formData.deliverySlipNumber.trim(),
        freightDetails: {
          ...formData.freightDetails,
          deliveryCollection,
          totalFreight,
          // Convert charges to numbers, keeping empty strings as 0
          charges: {
            biltyFreight: parseFloat(charges.biltyFreight) || 0,
            deliveryCharge: parseFloat(charges.deliveryCharge) || 0,
            labourCharge: parseFloat(charges.labourCharge) || 0,
            biltyCharge: parseFloat(charges.biltyCharge) || 0,
            haltingCharge: parseFloat(charges.haltingCharge) || 0,
            warehouseCharge: parseFloat(charges.warehouseCharge) || 0,
            localTransportCharge: parseFloat(charges.localTransportCharge) || 0,
            otherCharges: parseFloat(charges.otherCharges) || 0
          }
        }
      };

      await onSubmit(finalFormData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit the form. Please check your data and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PartyDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      case 2:
        return (
          <Step2ParcelDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      case 3:
        return (
          <Step3FreightDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      case 4:
        return (
          <Step4DeliveryDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Party Details', subtitle: 'Sender and receiver details' },
    { number: 2, title: 'Parcel Details', subtitle: 'Transporter and material details' },
    { number: 3, title: 'Freight Details', subtitle: 'Charges and payment details' },
    { number: 4, title: 'Delivery Details', subtitle: 'Delivery confirmation details' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Delivery Slip' : 'Edit Delivery Slip'}
      size="4xl"
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
          {errors.form && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errors.form}
            </div>
          )}
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2 p-4 sm:p-6 border-t bg-gray-50">
          <button
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
            
            {currentStep < 4 ? (
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
                <span className="truncate">{mode === 'create' ? 'Create Delivery Slip' : 'Update Delivery Slip'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeliverySlipModal;
