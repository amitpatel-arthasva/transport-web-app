import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faBuilding, 
  faMapMarkerAlt, 
  faSpinner,
  faSave,
  faUndo,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../components/common/ToastSystem';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const Profile = () => {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phonenumber: '',
    
    // Profile Details
    profileDetails: {
      transporterName: '',
      tagLine: '',
      gstNumber: '',
      panNumber: '',
      udyamRegistrationNumber: '',
      uinNumber: '',
      tanNumber: '',
      cinNumber: '',
      registrationNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
      branchName: '',
      branchCode: '',
      contactPersonNumber: '',
      website: '',
      customTerms: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      swiftCode: '',
      contactPersonName: '',
      contactPersonEmail: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        
        const profileData = {
          name: profile.name || '',
          email: profile.email || '',
          phonenumber: profile.phonenumber || '',
          profileDetails: {
            transporterName: profile.profileDetails?.transporterName || '',
            tagLine: profile.profileDetails?.tagLine || '',
            gstNumber: profile.profileDetails?.gstNumber || '',
            panNumber: profile.profileDetails?.panNumber || '',
            udyamRegistrationNumber: profile.profileDetails?.udyamRegistrationNumber || '',
            uinNumber: profile.profileDetails?.uinNumber || '',
            tanNumber: profile.profileDetails?.tanNumber || '',
            cinNumber: profile.profileDetails?.cinNumber || '',
            registrationNumber: profile.profileDetails?.registrationNumber || '',
            addressLine1: profile.profileDetails?.addressLine1 || '',
            addressLine2: profile.profileDetails?.addressLine2 || '',
            city: profile.profileDetails?.city || '',
            state: profile.profileDetails?.state || '',
            pinCode: profile.profileDetails?.pinCode || '',
            branchName: profile.profileDetails?.branchName || '',
            branchCode: profile.profileDetails?.branchCode || '',
            contactPersonNumber: profile.profileDetails?.contactPersonNumber || '',
            website: profile.profileDetails?.website || '',
            customTerms: profile.profileDetails?.customTerms || '',
            bankName: profile.profileDetails?.bankName || '',
            accountNumber: profile.profileDetails?.accountNumber || '',
            ifscCode: profile.profileDetails?.ifscCode || '',
            swiftCode: profile.profileDetails?.swiftCode || '',
            contactPersonName: profile.profileDetails?.contactPersonName || '',
            contactPersonEmail: profile.profileDetails?.contactPersonEmail || ''
          }
        };
        
        setFormData(profileData);
        setInitialFormData(profileData);
      } catch (error) {
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    toast.info('Form reset to original values');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updatedProfile = await userService.updateProfile(formData);
      setInitialFormData(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', subtitle: 'Personal and contact details' },
    { number: 2, title: 'Business Details', subtitle: 'Company and registration information' },
    { number: 3, title: 'Address & Contact', subtitle: 'Location and additional contact details' },
    { number: 4, title: 'Banking & Terms', subtitle: 'Payment and custom terms information' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-primary-400" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phonenumber}
                    onChange={(e) => handleInputChange(null, 'phonenumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transporter Name
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.transporterName}
                    onChange={(e) => handleInputChange('profileDetails', 'transporterName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter transporter name"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Line
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.tagLine}
                    onChange={(e) => handleInputChange('profileDetails', 'tagLine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter your business tagline"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            {/* Business Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                Business & Registration Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.gstNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'gstNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter GST number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.panNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'panNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter PAN number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Udyam Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.udyamRegistrationNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'udyamRegistrationNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter Udyam registration number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.uinNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'uinNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter UIN number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.tanNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'tanNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter TAN number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.cinNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'cinNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter CIN number"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.registrationNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter registration number"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            {/* Address Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary-400" />
                Address & Contact Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.addressLine1}
                    onChange={(e) => handleInputChange('profileDetails', 'addressLine1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter address line 1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.addressLine2}
                    onChange={(e) => handleInputChange('profileDetails', 'addressLine2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter address line 2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.city}
                    onChange={(e) => handleInputChange('profileDetails', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.state}
                    onChange={(e) => handleInputChange('profileDetails', 'state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.pinCode}
                    onChange={(e) => handleInputChange('profileDetails', 'pinCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter PIN code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.branchName}
                    onChange={(e) => handleInputChange('profileDetails', 'branchName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter branch name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.branchCode}
                    onChange={(e) => handleInputChange('profileDetails', 'branchCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter branch code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Number
                  </label>
                  <input
                    type="tel"
                    value={formData.profileDetails.contactPersonNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'contactPersonNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter contact person number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.contactPersonName}
                    onChange={(e) => handleInputChange('profileDetails', 'contactPersonName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter contact person name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Email
                  </label>
                  <input
                    type="email"
                    value={formData.profileDetails.contactPersonEmail}
                    onChange={(e) => handleInputChange('profileDetails', 'contactPersonEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter contact person email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.profileDetails.website}
                    onChange={(e) => handleInputChange('profileDetails', 'website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            {/* Banking Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-primary-400" />
                Banking Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.bankName}
                    onChange={(e) => handleInputChange('profileDetails', 'bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.accountNumber}
                    onChange={(e) => handleInputChange('profileDetails', 'accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter account number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.ifscCode}
                    onChange={(e) => handleInputChange('profileDetails', 'ifscCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter IFSC code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    value={formData.profileDetails.swiftCode}
                    onChange={(e) => handleInputChange('profileDetails', 'swiftCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter SWIFT code"
                  />
                </div>
              </div>
            </div>
            
            {/* Custom Terms */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Custom Terms & Conditions
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Terms
                </label>
                <textarea
                  value={formData.profileDetails.customTerms}
                  onChange={(e) => handleInputChange('profileDetails', 'customTerms', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Enter your custom terms and conditions"
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal and business information</p>
        </div>

        {/* Profile Form Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Steps Indicator */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50">
            <div className="flex justify-between overflow-x-auto pb-2 sm:pb-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex items-center min-w-0 ${index < steps.length - 1 ? 'flex-1' : ''} mr-2 sm:mr-0 cursor-pointer`}
                  onClick={() => setCurrentStep(step.number)}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary-400 text-white'
                        : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-2 min-w-0 hidden sm:block">
                    <p className={`text-xs sm:text-sm font-medium truncate transition-colors ${
                      currentStep >= step.number ? 'text-primary-400' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-2 sm:mx-4 hidden sm:block transition-colors ${
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
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2 p-4 sm:p-6 border-t bg-gray-50">
              <div className="flex gap-2 order-2 sm:order-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                  disabled={currentStep === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentStep < 4 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, 4))}
                    className="bg-primary-400 hover:bg-primary-300 text-white px-4 py-2 rounded-lg"
                  >
                    Next
                  </button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faUndo} />
                  Reset
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  <FontAwesomeIcon icon={faSave} />
                  <span className="truncate">Save Profile</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
